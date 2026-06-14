import React from 'react';
import { LogIn, BookOpen, User, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginView({ role, handleRoleChange, handleLogin }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-500"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Sign in to your Socratic Review session</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 \${role === 'student' ? 'border-blue-500 bg-blue-500/10 text-blue-500 ring-2 ring-blue-500/20 shadow-md shadow-blue-500/20' : 'border-border text-muted-foreground hover:border-blue-400/50 hover:bg-blue-500/5 hover:text-blue-400'}`}
            >
              <Users className="w-6 h-6 mb-2" />
              <span className="font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('lecturer')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 \${role === 'lecturer' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-2 ring-emerald-500/20 shadow-md shadow-emerald-500/20' : 'border-border text-muted-foreground hover:border-emerald-400/50 hover:bg-emerald-500/5 hover:text-emerald-400'}`}
            >
              <User className="w-6 h-6 mb-2" />
              <span className="font-medium">Lecturer</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1 active:translate-y-0 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            Continue as {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
