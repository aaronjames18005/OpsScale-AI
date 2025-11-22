
import React from 'react';
import { LayoutDashboard, Activity, GitMerge, Bot, FileCode, Server, Settings, LogOut, ChevronLeft } from 'lucide-react';
import { AppView, Project } from '../types';

interface SidebarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  project: Project;
  onSwitchProject: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, project, onSwitchProject, onLogout }) => {
  const navItems = [
    { view: AppView.DASHBOARD, icon: LayoutDashboard, label: 'Overview' },
    { view: AppView.MONITORING, icon: Activity, label: 'Monitoring' },
    { view: AppView.PIPELINE, icon: GitMerge, label: 'CI/CD Pipeline' },
    { view: AppView.ADVISOR, icon: Bot, label: 'AI Advisor' },
    { view: AppView.GENERATOR, icon: FileCode, label: 'Script Gen' },
    { view: AppView.SETTINGS, icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col h-screen sticky top-0 shadow-2xl">
      {/* App Logo / Title */}
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/30">
          <Server className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">OpsScale AI</span>
      </div>

      {/* Project Context Switcher */}
      <div className="px-4 mb-2">
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Current Project</p>
              <h3 className="text-sm font-bold text-white mt-1 truncate w-32">{project.name}</h3>
              <div className="flex items-center mt-1 space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  project.status === 'healthy' ? 'bg-green-500' : 
                  project.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="text-xs text-slate-400">{project.region}</span>
              </div>
            </div>
            <button 
              onClick={onSwitchProject}
              className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
              title="Switch Project"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentView === item.view
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 translate-x-1'
                : 'text-slate-400 hover:bg-slate-900 hover:text-white hover:translate-x-1'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.view ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-800/50">
           <p className="text-xs text-slate-500 mb-2">Cloud Status</p>
           <div className="flex items-center justify-between">
              <span className="text-sm text-slate-300 font-medium">{project.cloudProvider}</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full">Connected</span>
           </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/5 rounded-lg transition-colors text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
