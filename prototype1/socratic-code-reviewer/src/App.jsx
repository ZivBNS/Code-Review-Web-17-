import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginContainer from './components/Login/LoginContainer';
import ProjectUploadContainer from './components/ProjectUpload/ProjectUploadContainer';
import WorkspaceContainer from './components/Workspace/WorkspaceContainer';
import LecturerDashboardContainer from './components/LecturerDashboard/LecturerDashboardContainer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border p-4 flex justify-between items-center bg-card">
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            Reviewly - Socratic Code Review
          </h1>
        </header>
        <main className="flex-1 flex overflow-hidden">
          <Routes>
            <Route path="/" element={<LoginContainer />} />
            <Route path="/upload" element={<ProjectUploadContainer />} />
            <Route path="/workspace" element={<WorkspaceContainer />} />
            <Route path="/dashboard" element={<LecturerDashboardContainer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
