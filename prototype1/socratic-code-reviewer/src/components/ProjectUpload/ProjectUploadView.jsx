import React from 'react';
import { Upload, Code as Github, FileText, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProjectUploadView({
  githubUrl, requirementsDoc, isLoading,
  handleUrlChange, handleFileChange, handleSubmit
}) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-background">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-purple-500" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">Upload Project</h2>
          <p className="text-muted-foreground mt-2">Enter the target repository and requirements to begin the review</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">GitHub Repository URL</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Github className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="url"
                value={githubUrl}
                onChange={handleUrlChange}
                placeholder="https://github.com/username/repo"
                required
                className="block w-full pl-10 pr-3 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Requirements Document</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-border border-dashed rounded-lg hover:border-purple-500/50 transition-colors bg-background/50">
              <div className="space-y-1 text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="flex text-sm text-foreground justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-purple-500 hover:text-purple-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} required accept=".pdf,.doc,.docx,.txt,.md" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {requirementsDoc ? requirementsDoc.name : "PDF, DOCX, TXT up to 10MB"}
                </p>
              </div>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !githubUrl || !requirementsDoc}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg disabled:hover:translate-y-0 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Initializing Workspace...
              </>
            ) : (
              <>
                Start Review Session
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
