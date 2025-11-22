
import React, { useState } from 'react';
import { Plus, Server, Github, Cloud, Activity, LogOut, Loader2 } from 'lucide-react';
import { Project, User } from '../types';
import { projectService } from '../services/mockBackend';

interface ProjectSelectionProps {
  user: User;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onLogout: () => void;
  refreshProjects: () => void; // Trigger parent re-fetch
}

export const ProjectSelection: React.FC<ProjectSelectionProps> = ({ user, projects, onSelectProject, onLogout, refreshProjects }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newRepoUrl, setNewRepoUrl] = useState('');
  const [newCloudProvider, setNewCloudProvider] = useState<'AWS' | 'GCP' | 'Azure'>('AWS');
  const [newRegion, setNewRegion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName) return;

    setIsSubmitting(true);
    await projectService.create(user.id, {
      name: newProjectName,
      description: newDescription || 'New project initialized via dashboard',
      repoUrl: newRepoUrl,
      cloudProvider: newCloudProvider,
      region: newRegion || 'us-east-1'
    });
    
    await refreshProjects(); // Refresh the list from 'backend'
    setIsSubmitting(false);
    setIsCreating(false);
    setNewProjectName('');
    setNewDescription('');
    setNewRepoUrl('');
    setNewCloudProvider('AWS');
    setNewRegion('');
  };

  if (isCreating) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 flex items-center justify-center">
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 max-w-md w-full shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6">Create New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-6">
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project Name</label>
                <input 
                   autoFocus
                   type="text"
                   value={newProjectName}
                   onChange={e => setNewProjectName(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="My Awesome App"
                   required
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                   value={newDescription}
                   onChange={e => setNewDescription(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
                   placeholder="Brief description of your project..."
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub Repository URL</label>
                <input 
                   type="text"
                   value={newRepoUrl}
                   onChange={e => setNewRepoUrl(e.target.value)}
                   className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                   placeholder="github.com/username/repo"
                />
                <p className="text-xs text-slate-500 mt-1">Example: github.com/facebook/react</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cloud Provider</label>
                    <select 
                       value={newCloudProvider}
                       onChange={e => setNewCloudProvider(e.target.value as any)}
                       className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                       <option value="AWS">AWS</option>
                       <option value="GCP">GCP</option>
                       <option value="Azure">Azure</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Region</label>
                    <input 
                       type="text"
                       value={newRegion}
                       onChange={e => setNewRegion(e.target.value)}
                       className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                       placeholder="us-east-1"
                    />
                 </div>
             </div>
             <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors flex justify-center"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Project'}
                </button>
             </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Server className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">OpsScale AI</h1>
              <p className="text-slate-400 text-sm">Deployment & Scaling Advisor</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 px-4 py-2 bg-slate-900 rounded-full border border-slate-800">
              <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full" />
              <span className="text-slate-200 font-medium">{user.name}</span>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Your Projects</h2>
          <p className="text-slate-400">Manage your connected applications and scaling configurations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Project Card */}
          <button 
            onClick={() => setIsCreating(true)}
            className="group flex flex-col items-center justify-center h-64 bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl hover:border-blue-500 hover:bg-slate-900 transition-all duration-300"
          >
            <div className="p-4 bg-slate-800 rounded-full mb-4 group-hover:bg-blue-600 group-hover:scale-110 transition-all duration-300">
              <Plus className="w-8 h-8 text-slate-400 group-hover:text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 group-hover:text-white">Create New Project</h3>
            <p className="text-sm text-slate-500 mt-2">Connect a repo & provider</p>
          </button>

          {/* Existing Project Cards */}
          {projects.length === 0 && !isCreating ? (
            <div className="col-span-2 flex items-center justify-center text-slate-500 h-64">
              No projects found. Create your first one!
            </div>
          ) : (
             projects.map((project) => (
              <div 
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full -mr-4 -mt-4"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-slate-800 rounded-xl border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                    <Server className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                    project.status === 'healthy' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    project.status === 'warning' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {project.status}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 truncate">{project.name}</h3>
                <p className="text-slate-400 text-sm mb-6 h-10 overflow-hidden">{project.description || 'No description provided'}</p>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-slate-400">
                    <Github className="w-4 h-4 mr-2" />
                    <span className="truncate">{project.repoUrl ? project.repoUrl.split('/').slice(-2).join('/') : 'No Repo'}</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Cloud className="w-4 h-4 mr-2" />
                    <span>{project.cloudProvider} ({project.region})</span>
                  </div>
                  <div className="flex items-center text-sm text-slate-400">
                    <Activity className="w-4 h-4 mr-2" />
                    <span>Max {project.scalingConfig.maxInstances} instances</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Deployed: {project.lastDeployment}</span>
                  <span className="text-blue-400 text-sm font-medium group-hover:underline">Dashboard &rarr;</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
