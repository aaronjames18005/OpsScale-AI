
import React, { useState } from 'react';
import { Save, Github, Cloud, Sliders, AlertTriangle, Trash2 } from 'lucide-react';
import { Project } from '../types';

interface SettingsProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ project, onUpdateProject, onDeleteProject }) => {
  const [config, setConfig] = useState(project);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProject(config);
      setIsSaving(false);
    }, 1000);
  };

  const handleDelete = () => {
      onDeleteProject(project.id);
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Project Settings</h2>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="space-y-8 max-w-4xl">
        {/* Source Control Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex items-center">
            <Github className="w-5 h-5 text-slate-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Source Control</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Repository URL</label>
                <input
                  type="text"
                  value={config.repoUrl}
                  onChange={(e) => setConfig({...config, repoUrl: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              {/* Branch removed from top-level project type for simplicity in this view, usually part of pipeline */}
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Project Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => setConfig({...config, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Provider Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex items-center">
            <Cloud className="w-5 h-5 text-slate-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Cloud Provider</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Provider</label>
                <select
                  value={config.cloudProvider}
                  onChange={(e) => setConfig({...config, cloudProvider: e.target.value as any})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="AWS">Amazon Web Services (AWS)</option>
                  <option value="GCP">Google Cloud Platform (GCP)</option>
                  <option value="Azure">Microsoft Azure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Region</label>
                <input
                  type="text"
                  value={config.region}
                  onChange={(e) => setConfig({...config, region: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Auto-Scaling Rules Section */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 bg-slate-800/50 flex items-center">
            <Sliders className="w-5 h-5 text-slate-400 mr-3" />
            <h3 className="text-lg font-semibold text-white">Auto-Scaling Rules</h3>
          </div>
          <div className="p-6 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Instance Counts */}
              <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Instance Limits ({config.scalingConfig.targetType})</h4>
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Min Instances</label>
                      <span className="text-sm text-white font-mono">{config.scalingConfig.minInstances}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="10" 
                      value={config.scalingConfig.minInstances}
                      onChange={(e) => setConfig({
                        ...config, 
                        scalingConfig: { ...config.scalingConfig, minInstances: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Max Instances</label>
                      <span className="text-sm text-white font-mono">{config.scalingConfig.maxInstances}</span>
                    </div>
                    <input 
                      type="range" 
                      min="1" 
                      max="50" 
                      value={config.scalingConfig.maxInstances}
                      onChange={(e) => setConfig({
                        ...config, 
                        scalingConfig: { ...config.scalingConfig, maxInstances: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                 </div>
              </div>

              {/* Thresholds */}
              <div className="space-y-4">
                 <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Scaling Triggers</h4>
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Scale Up Trigger (CPU)</label>
                      <span className="text-sm text-white font-mono">{config.scalingConfig.scaleUpThresholdCPU}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="95" 
                      value={config.scalingConfig.scaleUpThresholdCPU}
                      onChange={(e) => setConfig({
                        ...config, 
                        scalingConfig: { ...config.scalingConfig, scaleUpThresholdCPU: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                    />
                 </div>
                 <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-slate-400">Scale Down Trigger (CPU)</label>
                      <span className="text-sm text-white font-mono">{config.scalingConfig.scaleDownThresholdCPU}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="5" 
                      max="50" 
                      value={config.scalingConfig.scaleDownThresholdCPU}
                      onChange={(e) => setConfig({
                        ...config, 
                        scalingConfig: { ...config.scalingConfig, scaleDownThresholdCPU: parseInt(e.target.value) }
                      })}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                 </div>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4 flex items-start">
               <AlertTriangle className="w-5 h-5 text-blue-400 mr-3 mt-0.5" />
               <div>
                 <h4 className="text-sm font-medium text-blue-300">AI Advisor Note</h4>
                 <p className="text-sm text-blue-200/70 mt-1">
                   Based on historical data, setting Scale Up Threshold to 65% instead of {config.scalingConfig.scaleUpThresholdCPU}% could save approx. $120/mo while maintaining SLAs.
                 </p>
               </div>
            </div>

          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/10 flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            </div>
            <div className="p-6">
                <p className="text-slate-400 text-sm mb-4">Deleting this project will permanently remove all configuration, pipelines, and historical metrics. This action cannot be undone.</p>
                <button 
                  onClick={handleDelete}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Project</span>
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
