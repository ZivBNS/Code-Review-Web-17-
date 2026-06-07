const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const connectDB = require('./db');
const Project = require('./models/Project');
const Message = require('./models/Message');

// Connect to MongoDB
connectDB();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

function parseGithubUrl(url) {
  try {
    const parsed = new URL(url);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1].replace('.git', '') };
    }
  } catch (e) {
    return null;
  }
  return null;
}

const app = express();
app.use(cors());
app.use(express.json());

// Set up Multer for file uploads
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// API Endpoint to handle project upload
app.post('/api/projects/upload', upload.single('requirementsDoc'), async (req, res) => {
  try {
    const { githubUrl } = req.body;
    const file = req.file;

    if (!githubUrl || !file) {
      return res.status(400).json({ error: 'GitHub URL and Requirements Document are required.' });
    }

    const newProject = new Project({
      githubUrl,
      requirementsFileName: file.originalname,
      requirementsFilePath: file.path,
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: 'Project uploaded successfully',
      projectId: savedProject._id,
    });
  } catch (error) {
    console.error('Error uploading project:', error);
    res.status(500).json({ error: 'Failed to upload project' });
  }
});

// API Endpoint to get chat messages
app.get('/api/projects/:projectId/messages', async (req, res) => {
  try {
    const messages = await Message.find({ projectId: req.params.projectId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// API Endpoint for generating AI response and saving chat
app.post('/api/projects/:projectId/chat', async (req, res) => {
  try {
    const { text, contextLine, activeFile } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required.' });
    }

    // 1. Save User Message
    const userMessage = new Message({
      projectId: req.params.projectId,
      role: 'user',
      content: text,
      contextLine: contextLine || null,
    });
    await userMessage.save();

    // 2. Fetch Chat History for context
    const history = await Message.find({ projectId: req.params.projectId }).sort({ timestamp: 1 });
    
    // Map history to Gemini format (user or model)
    const geminiHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.contextLine ? `[Line ${msg.contextLine}] ${msg.content}` : msg.content }]
    }));
    // Remove the very last message (the one we just saved) as it will be passed to sendMessage
    geminiHistory.pop();

    // Gemini strictly requires the first message in history to be from the 'user'.
    // Since our DB saves the bot's "Welcome" message first, we prepend a dummy user message.
    if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory.unshift({
        role: 'user',
        parts: [{ text: "Hello, I am ready to start my code review session." }]
      });
    }

    // 3. Initialize Gemini Chat Session
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: "You are a Socratic Code Review tutor. Never give direct answers. Ask guiding questions to help the student find bugs and improve code quality.",
    });

    const chat = model.startChat({
      history: geminiHistory,
    });

    // 4. Inject Active File Context & Send Message to Gemini
    let fileContentStr = "";
    if (activeFile) {
      try {
        const project = await Project.findById(req.params.projectId);
        const repoInfo = parseGithubUrl(project.githubUrl);
        const repoRes = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
        const repoData = await repoRes.json();
        const branch = repoData.default_branch || 'main';
        const fileRes = await fetch(`https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/${activeFile}`);
        if (fileRes.ok) {
          const rawCode = await fileRes.text();
          fileContentStr = `[System Context: The user is currently viewing the file '${activeFile}'. Here is the code:]\n\`\`\`\n${rawCode}\n\`\`\`\n\n`;
        }
      } catch (err) {
        console.error("Failed to fetch active file context:", err);
      }
    }

    const promptText = fileContentStr + (contextLine ? `[User Message for Line ${contextLine}]: ${text}` : `[User Message]: ${text}`);
    const result = await chat.sendMessage(promptText);
    const botResponseText = result.response.text();

    // 5. Save Bot Message
    const botMessage = new Message({
      projectId: req.params.projectId,
      role: 'assistant',
      content: botResponseText,
      contextLine: contextLine || null,
    });
    await botMessage.save();

    res.status(201).json({ userMessage, botMessage });
  } catch (error) {
    console.error('Error generating chat response:', error);
    res.status(500).json({ error: 'Failed to generate chat response' });
  }
});

// GitHub API Proxy: Get Repository Tree
app.get('/api/projects/:projectId/github/tree', async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const repoInfo = parseGithubUrl(project.githubUrl);
    if (!repoInfo) return res.status(400).json({ error: 'Invalid GitHub URL' });

    const repoRes = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
    if (!repoRes.ok) return res.status(repoRes.status).json({ error: 'Failed to fetch repo info' });
    const repoData = await repoRes.json();
    const branch = repoData.default_branch || 'main';

    const treeRes = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}/git/trees/${branch}?recursive=1`);
    if (!treeRes.ok) return res.status(treeRes.status).json({ error: 'Failed to fetch repo tree' });
    const treeData = await treeRes.json();

    const root = [];
    const map = {};

    treeData.tree.forEach(item => {
      const parts = item.path.split('/');
      const name = parts.pop();
      const isFolder = item.type === 'tree';
      
      const node = { name, type: isFolder ? 'folder' : 'file', path: item.path };
      if (isFolder) node.children = [];

      map[item.path] = node;

      if (parts.length === 0) {
        root.push(node);
      } else {
        const parentPath = parts.join('/');
        if (map[parentPath]) {
          map[parentPath].children.push(node);
        }
      }
    });

    res.json(root);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub tree' });
  }
});

// GitHub API Proxy: Get File Content
app.get('/api/projects/:projectId/github/file', async (req, res) => {
  try {
    const { path } = req.query;
    if (!path) return res.status(400).json({ error: 'File path required' });

    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const repoInfo = parseGithubUrl(project.githubUrl);
    if (!repoInfo) return res.status(400).json({ error: 'Invalid GitHub URL' });

    const repoRes = await fetch(`https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`);
    const repoData = await repoRes.json();
    const branch = repoData.default_branch || 'main';

    const fileRes = await fetch(`https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.repo}/${branch}/${path}`);
    if (!fileRes.ok) return res.status(fileRes.status).json({ error: 'Failed to fetch file content' });
    
    const content = await fileRes.text();
    res.send(content);
  } catch (error) {
    console.error('GitHub API error:', error);
    res.status(500).json({ error: 'Failed to fetch GitHub file' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
