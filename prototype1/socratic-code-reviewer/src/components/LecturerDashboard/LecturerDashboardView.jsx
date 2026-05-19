import React from 'react';
import { Activity, Users, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LecturerDashboardView({ sessions }) {
  return (
    <div className="flex-1 flex flex-col p-8 bg-background overflow-y-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Lecturer Dashboard</h2>
          <p className="text-muted-foreground mt-1">Monitor active code review sessions</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500"><Activity className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Active Sessions</p>
              <p className="text-2xl font-bold text-foreground">{sessions.filter(s => s.active).length}</p>
            </div>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-4 shadow-sm">
            <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle className="w-6 h-6" /></div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold text-foreground">{sessions.filter(s => !s.active).length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {sessions.map((session, idx) => (
          <motion.div 
            key={session.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-card border border-border rounded-xl p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden"
          >
            {session.progress === 100 && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 flex items-center justify-center rounded-bl-full">
                <CheckCircle className="w-6 h-6 text-emerald-500 mb-4 ml-4" />
              </div>
            )}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">{session.groupName}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Users className="w-4 h-4" /> Reviewed by {session.reviewer}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium \${session.active ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                {session.active ? 'In Progress' : 'Completed'}
              </span>
            </div>
            
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Review Progress</span>
                <span className="font-medium text-foreground">{session.progress}%</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full \${session.progress === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                  style={{ width: `\${session.progress}%` }}
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border flex justify-between items-center">
              <button className="text-sm text-blue-500 font-medium hover:text-blue-400 transition-colors">
                View Audit Report
              </button>
              <button className="text-sm text-purple-500 font-medium hover:text-purple-400 transition-colors">
                Join Session
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
