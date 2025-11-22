
import React from 'react';
import { Server, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Lightbulb, DollarSign, Zap, Check } from 'lucide-react';
import { Project } from '../types';

interface DashboardProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ project, onUpdateProject }) => {
  
  const handleApplyAll = () => {
    if (!project.recommendations) return;
    const updatedRecs = project.recommendations.map(rec => 
      rec.status === 'Pending' ? { ...rec, status: 'Applied' as const } : rec
    );
    onUpdateProject({ ...project, recommendations: updatedRecs });
  };

  const handleApply = (id: string) => {
    if (!project.recommendations) return;
    const updatedRecs = project.recommendations.map(rec => 
      rec.id === id ? { ...rec, status: 'Applied' as const } : rec
    );
    onUpdateProject({ ...project, recommendations: updatedRecs });
  };

  const pendingCount = project.recommendations?.filter(r => r.status === 'Pending').length || 0;

  return (
    <div className="p-8 space-y-8 overflow-y-auto h-full">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">{project.name} Dashboard</h2>
          <p className="text-slate-400 mt-1">
            {project.cloudProvider} ({project.region}) • {project.repoUrl ? project.repoUrl.split('/').pop() : 'No Repo'}
          </p>
        </div>
        <div className="flex space-x-2">
           <span className="text-sm text-slate-500 self-center mr-2">Last updated: Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Active Instances" 
          value={Math.floor(project.scalingConfig.minInstances + Math.random() * 2).toString()} 
          change="+1" 
          trend="up" 
          icon={Server} 
          color="blue"
        />
        <StatCard 
          title="Avg Latency" 
          value="45ms" 
          change="-12ms" 
          trend="down" 
          icon={ActivityIcon} 
          color="green"
        />
        <StatCard 
          title="Error Rate" 
          value="0.02%" 
          change="+0.01%" 
          trend="up" 
          icon={AlertTriangle} 
          color="yellow"
        />
        <StatCard 
          title="Deployments" 
          value="156" 
          change="Today" 
          trend="neutral" 
          icon={CheckCircle} 
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recommendations Panel */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-white flex items-center">
               <Lightbulb className="w-5 h-5 text-yellow-400 mr-2" />
               AI Recommendations
             </h3>
             <div className="flex items-center space-x-3">
                <span className={`text-xs px-2 py-1 rounded-full ${pendingCount > 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}`}>
                  {pendingCount} Pending
                </span>
                {pendingCount > 0 && (
                  <button 
                    onClick={handleApplyAll}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition-colors shadow-lg shadow-blue-900/20 font-medium"
                  >
                    Apply All
                  </button>
                )}
             </div>
          </div>
          
          <div className="space-y-4 flex-1">
            {project.recommendations && project.recommendations.length > 0 ? (
              project.recommendations.map((rec) => (
                <div key={rec.id} className={`p-4 rounded-lg border transition-colors ${rec.status === 'Applied' ? 'bg-slate-900/30 border-slate-800 opacity-70' : 'bg-slate-900/50 border-slate-700/50 hover:border-blue-500/30'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex items-start space-x-3">
                       <div className={`p-2 rounded-md ${rec.type === 'Cost' ? 'bg-green-500/10 text-green-400' : 'bg-purple-500/10 text-purple-400'}`}>
                          {rec.type === 'Cost' ? <DollarSign className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                       </div>
                       <div>
                          <div className="flex items-center space-x-2">
                            <h4 className={`text-sm font-bold ${rec.status === 'Applied' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{rec.title}</h4>
                            {rec.status === 'Applied' && <span className="text-xs text-green-500 flex items-center"><Check className="w-3 h-3 mr-0.5" /> Applied</span>}
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{rec.description}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <span className={`block text-xs font-bold mb-2 ${rec.status === 'Applied' ? 'text-slate-600' : 'text-green-400'}`}>{rec.impact}</span>
                       <button 
                          onClick={() => handleApply(rec.id)}
                          disabled={rec.status === 'Applied'}
                          className={`text-xs px-2 py-1 rounded transition-colors ${
                            rec.status === 'Applied' 
                            ? 'bg-transparent text-slate-600 cursor-not-allowed' 
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                          }`}
                       >
                          {rec.status === 'Applied' ? 'Done' : 'Apply'}
                       </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 text-sm">
                 No new recommendations. Your system is optimized!
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
          <h3 className="text-lg font-semibold text-white mb-4">Deployment Status</h3>
          <div className="space-y-6">
            <DeploymentStatusRow service="Auth Service" version="v2.4.1" status="stable" time="2h ago" />
            <DeploymentStatusRow service="Payment Gateway" version="v1.2.0" status="deploying" time="Now" />
            <DeploymentStatusRow service="User API" version="v3.0.1" status="stable" time="1d ago" />
            <DeploymentStatusRow service="Frontend App" version="v2.3.4" status="rollback" time="3h ago" />
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const StatCard: React.FC<{
  title: string; 
  value: string; 
  change: string; 
  trend: 'up' | 'down' | 'neutral'; 
  icon: any;
  color: string;
}> = ({ title, value, change, trend, icon: Icon, color }) => {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-500/10 text-blue-500',
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    purple: 'bg-purple-500/10 text-purple-500',
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg hover:shadow-slate-900/20">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <h4 className="text-2xl font-bold text-white mt-2">{value}</h4>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        {trend === 'up' && <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />}
        {trend === 'down' && <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />}
        <span className={trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}>
          {change}
        </span>
        {trend !== 'neutral' && <span className="text-slate-500 ml-1">vs last hour</span>}
      </div>
    </div>
  );
};

const DeploymentStatusRow: React.FC<{ service: string; version: string; status: string; time: string }> = ({ service, version, status, time }) => {
  const statusColors: Record<string, string> = {
    stable: 'bg-green-500',
    deploying: 'bg-blue-500 animate-pulse',
    rollback: 'bg-red-500',
    failed: 'bg-red-500',
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="text-white font-medium text-sm">{service}</h4>
        <p className="text-slate-400 text-xs">{version}</p>
      </div>
      <div className="flex items-center space-x-3">
        <span className="text-xs text-slate-500">{time}</span>
        <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1 ${status === 'stable' ? 'bg-green-500/20 text-green-400' : status === 'deploying' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`}></div>
          <span>{status}</span>
        </div>
      </div>
    </div>
  );
};
