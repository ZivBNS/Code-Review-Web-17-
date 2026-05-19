import fs from 'fs';
import path from 'path';

const files = [
  'src/components/Login/LoginView.jsx',
  'src/components/Workspace/WorkspaceView.jsx',
  'src/components/LecturerDashboard/LecturerDashboardView.jsx',
  'src/components/Workspace/useWorkspace.js',
  'src/components/Workspace/AIChat.jsx',
  'src/components/Workspace/CodeViewer.jsx',
  'src/components/Workspace/FileExplorer.jsx',
  'src/components/Workspace/Checklist.jsx',
  'src/services/mockAI.js'
];

files.forEach(f => {
  const p = path.join(process.cwd(), f);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    content = content.replace(/\\\$\\{/g, '${');
    content = content.replace(/\\`/g, '\`');
    content = content.replace(/\\'/g, "'");
    fs.writeFileSync(p, content, 'utf-8');
  }
});
