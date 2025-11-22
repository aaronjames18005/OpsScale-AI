
import React, { useState, useEffect } from 'react';
import { GitCommit, CheckCircle, PlayCircle, RotateCcw, Terminal, Settings, Save, X, Box, AlertTriangle, AlertOctagon, HelpCircle, History, Calendar, User, Layers, FileDiff, ArrowRight, Trash2 } from 'lucide-react';
import { DeploymentStep, Project, Pipeline } from '../types';

const INITIAL_STEPS: DeploymentStep[] = [
  { id: '1', name: 'Checkout Code', status: 'pending', logs: [] },
  { id: '2', name: 'Build Docker Image', status: 'pending', logs: [] },
  { id: '3', name: 'Run Tests', status: 'pending', logs: [] },
  { id: '4', name: 'Deploy to Staging', status: 'pending', logs: [] },
  { id: '5', name: 'Integration Tests', status: 'pending', logs: [] },
  { id: '6', name: 'Promote to Prod', status: 'pending', logs: [] },
];

// Initial demo state
const DEMO_STEPS: DeploymentStep[] = [
  { id: '1', name: 'Checkout Code', status: 'success', logs: ['Cloning repository...', 'Checking out main branch...', 'HEAD is now at 4a2b1c'] },
  { id: '2', name: 'Build Docker Image', status: 'success', logs: ['Building image: latest...', 'Step 1/5: FROM node:18', 'Step 2/5: WORKDIR /app', 'Successfully built 8f9a2b'] },
  { id: '3', name: 'Run Tests', status: 'running', logs: ['Running unit tests...', 'Test suite 1: PASS', 'Test suite 2: RUNNING...'] },
  { id: '4', name: 'Deploy to Staging', status: 'pending', logs: [] },
  { id: '5', name: 'Integration Tests', status: 'pending', logs: [] },
  { id: '6', name: 'Promote to Prod', status: 'pending', logs: [] },
];

interface DeploymentHistoryItem {
  id: string;
  version: string;
  commit: string;
  author: string;
  time: string;
  status: 'success' | 'failed' | 'rollback' | 'running';
  message: string;
}

const DEMO_HISTORY: DeploymentHistoryItem[] = [
  { id: 'd-1', version: 'v2.4.2', commit: '8f9a2b', author: 'Alex Chen', time: 'Just now', status: 'running', message: 'Update dependency versions' },
  { id: 'd-2', version: 'v2.4.1', commit: '4a2b1c', author: 'Sarah Jones', time: '2h ago', status: 'success', message: 'Fix caching issue in API' },
  { id: 'd-3', version: 'v2.4.0', commit: '9f8e7d', author: 'Mike Smith', time: 'Yesterday', status: 'rollback', message: 'Feature: Payment Gateway Integration' },
  { id: 'd-4', version: 'v2.3.9', commit: '2c3d4e', author: 'Sarah Jones', time: '2 days ago', status: 'success', message: 'Hotfix: Login modal z-index' },
  { id: 'd-5', version: 'v2.3.8', commit: '5f6g7h', author: 'Alex Chen', time: '3 days ago', status: 'failed', message: 'Refactor auth middleware' },
];

const MOCK_FILE_CHANGES = [
  { path: 'src/services/api.ts', type: 'modified', additions: 24, deletions: 5 },
  { path: 'src/components/Dashboard.tsx', type: 'modified', additions: 12, deletions: 8 },
  { path: 'Dockerfile', type: 'modified', additions: 2, deletions: 1 },
  { path: 'infra/terraform/main.tf', type: 'added', additions: 45, deletions: 0 },
  { path: 'README.md', type: 'modified', additions: 5, deletions: 2 },
];

interface PipelineViewProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

export const PipelineView: React.FC<PipelineViewProps> = ({ project, onUpdateProject, onDeleteProject }) => {
  const [isConfiguring, setIsConfiguring] = useState(!project.pipeline);
  const [steps, setSteps] = useState<DeploymentStep[]>(DEMO_STEPS);
  const [selectedStep, setSelectedStep] = useState<DeploymentStep>(DEMO_STEPS[2]);
  const [shouldFail, setShouldFail] = useState(false);
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'structure'>('current');
  
  const [currentDeployment, setCurrentDeployment] = useState({
    commit: '4a2b1c',
    message: 'Fix caching issue',
    author: 'Alex Chen'
  });

  // Form State
  const [formData, setFormData] = useState<Partial<Pipeline>>(project.pipeline || {
    ciProvider: 'GitHub Actions',
    branch: 'main',
    dockerfilePath: './Dockerfile',
    deployTarget: 'EC2',
    autoRollbackEnabled: true,
    healthCheckEndpoint: '/health',
    healthCheckMethod: 'GET',
    healthCheckStatus: 200,
    postDeployCommand: 'npm run test:smoke',
    status: 'Active'
  });

  const triggerDeployment = (simulateFailure: boolean = false) => {
    setShouldFail(simulateFailure);
    
    // Update deployment info for the new run
    setCurrentDeployment({
        commit: Math.random().toString(16).substring(2, 8),
        message: simulateFailure ? 'Refactor auth middleware' : 'Update API endpoints',
        author: 'Demo User'
    });

    const newSteps = INITIAL_STEPS.map((s, i) => ({
      ...s,
      status: i === 0 ? 'running' : 'pending',
      logs: i === 0 ? ['Starting pipeline workflow...', 'Initializing agent...'] : []
    })) as DeploymentStep[];
    
    setSteps(newSteps);
    setSelectedStep(newSteps[0]);
    setActiveTab('current'); // Switch to current view on deploy
  };

  // Simulate pipeline progress
  useEffect(() => {
    // Only run simulation if we are not configuring
    if (isConfiguring) return;

    const interval = setInterval(() => {
      setSteps(prev => {
        const newSteps = [...prev];
        const runningIndex = newSteps.findIndex(s => s.status === 'running');
        
        if (runningIndex === -1) return prev;

        const currentStep = newSteps[runningIndex];
        
        // FAILURE LOGIC
        // Simulate failure at Step 4 (Deploy to Staging) if requested
        if (shouldFail && currentStep.id === '4') {
           // Only add logs if we haven't failed yet
           if (currentStep.status !== 'failed') {
             const endpoint = project.pipeline?.healthCheckEndpoint || '/health';
             const method = project.pipeline?.healthCheckMethod || 'GET';
             const expectedStatus = project.pipeline?.healthCheckStatus || 200;
             const command = project.pipeline?.postDeployCommand;
             
             const failureLogs = [
               ...currentStep.logs,
               'Deploying artifacts to staging environment...',
             ];
             
             if (command) {
                 failureLogs.push(`Running post-deploy command: ${command}`);
                 failureLogs.push('Command exited successfully.');
             }

             failureLogs.push(`Verifying health checks: ${method} ${endpoint}...`);
             failureLogs.push(`ERROR: Health check failed. Expected ${expectedStatus}, got 503 Service Unavailable.`);
             failureLogs.push('Deployment Failed.');

             if (project.pipeline?.autoRollbackEnabled) {
               failureLogs.push('--------------------------------');
               failureLogs.push('⚠ Auto-Rollback Triggered');
               failureLogs.push('Reverting to last stable release (v2.3.4)...');
               failureLogs.push('Restoring database snapshot...');
               failureLogs.push('Traffic routed back to stable instances.');
               failureLogs.push('Rollback Complete.');
             } else {
               failureLogs.push('--------------------------------');
               failureLogs.push('⚠ Auto-Rollback Disabled');
               failureLogs.push('Manual intervention required.');
             }

             newSteps[runningIndex] = {
               ...currentStep,
               status: 'failed',
               logs: failureLogs
             };

             // Update selected step view if user is watching this step
             if (selectedStep.id === currentStep.id) {
                setSelectedStep(newSteps[runningIndex]);
             }
             return newSteps;
           }
           return prev;
        }

        // NORMAL PROGRESSION LOGIC
        // If it's running, we just complete it and move next (simplified simulation)
        let successLogs = [...currentStep.logs];
        
        // Enrich logs for Deployment steps
        if (currentStep.id === '4' || currentStep.id === '6') {
             const endpoint = project.pipeline?.healthCheckEndpoint || '/health';
             const method = project.pipeline?.healthCheckMethod || 'GET';
             const expectedStatus = project.pipeline?.healthCheckStatus || 200;
             const command = project.pipeline?.postDeployCommand;
             
             successLogs.push('Deploying package...');
             
             if (command) {
                 successLogs.push(`Running post-deploy command: ${command}`);
                 successLogs.push('Command executed successfully (Exit Code 0).');
             }
             
             if (endpoint) {
                 successLogs.push(`Checking health: ${method} ${endpoint}...`);
                 successLogs.push(`Health check passed (${expectedStatus} OK).`);
             }
        }

        successLogs.push('Process completed successfully.', '✓ Done');

        newSteps[runningIndex] = { 
          ...currentStep, 
          status: 'success', 
          logs: successLogs
        };

        // Start next step if available
        if (runningIndex < newSteps.length - 1) {
          const nextStep = newSteps[runningIndex + 1];
          newSteps[runningIndex + 1] = { 
            ...nextStep, 
            status: 'running',
            logs: [`Starting ${nextStep.name}...`, 'Initializing environment...']
          };
          
          if (selectedStep.id === nextStep.id) {
             setSelectedStep(newSteps[runningIndex + 1]);
          }
        }
        
        // Sync selected step if it was the one that just finished
        if (selectedStep.id === currentStep.id) {
           setSelectedStep(newSteps[runningIndex]);
        }
        
        return newSteps;
      });
    }, 2000); // Fast interval for demo purposes
    return () => clearInterval(interval);
  }, [selectedStep.id, isConfiguring, shouldFail, project.pipeline?.autoRollbackEnabled, project.pipeline?.healthCheckEndpoint, project.pipeline?.postDeployCommand, project.pipeline?.healthCheckMethod, project.pipeline?.healthCheckStatus]);

  const handleStepClick = (step: DeploymentStep) => {
    // Find the latest version of the step from state to ensure logs are fresh
    const freshStep = steps.find(s => s.id === step.id) || step;
    setSelectedStep(freshStep);
  };

  const handleSaveConfig = () => {
    const newPipeline: Pipeline = {
      id: project.pipeline?.id || `pl_${Date.now()}`,
      projectId: project.id,
      ...formData as Pipeline
    };
    onUpdateProject({ ...project, pipeline: newPipeline });
    setIsConfiguring(false);
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {isConfiguring ? 'Configure Pipeline' : `CI/CD Pipeline: ${project.pipeline?.branch || 'Unknown'}`}
          </h2>
          {!isConfiguring && (
            <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-400">
              <div className="flex items-center">
                <GitCommit className="w-4 h-4 mr-1.5 text-blue-500" />
                <span className="font-mono text-blue-400 mr-2">{currentDeployment.commit}</span>
                <span className="text-slate-300">"{currentDeployment.message}"</span>
              </div>
              <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-600"></div>
              <div className="flex items-center">
                <User className="w-3.5 h-3.5 mr-1.5" />
                <span>by <span className="text-slate-300">{currentDeployment.author}</span></span>
              </div>
            </div>
          )}
        </div>
        <div className="flex space-x-3">
          {!isConfiguring ? (
             <>
                <button 
                  onClick={() => setIsConfiguring(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
                >
                  <Settings className="w-4 h-4" />
                  <span>Configure</span>
                </button>
                <button 
                  onClick={() => triggerDeployment(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/20 transition"
                  title="Simulate a failed deployment to test rollback"
                >
                  <AlertOctagon className="w-4 h-4" />
                  <span>Simulate Failure</span>
                </button>
                <button 
                  onClick={() => triggerDeployment(false)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-900/20"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>Trigger Deploy</span>
                </button>
             </>
          ) : (
             <button 
                onClick={() => setIsConfiguring(false)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:bg-slate-700 transition"
             >
               <X className="w-4 h-4" />
               <span>Cancel</span>
             </button>
          )}
        </div>
      </div>

      {isConfiguring ? (
        <div className="max-w-3xl mx-auto w-full bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-xl">
           <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
             <Box className="w-5 h-5 mr-2 text-blue-500" />
             Pipeline Configuration
           </h3>
           
           <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                       CI Provider
                       <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="Select the Continuous Integration service that handles your build and test workflows.">
                         <HelpCircle className="w-4 h-4" />
                       </div>
                    </label>
                    <select 
                       value={formData.ciProvider}
                       onChange={e => setFormData({...formData, ciProvider: e.target.value as any})}
                       className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                       <option>GitHub Actions</option>
                       <option>GitLab CI</option>
                       <option>Jenkins</option>
                    </select>
                 </div>
                 <div>
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                       Target Branch
                       <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="The specific branch (e.g., 'main') that triggers a deployment when code is pushed.">
                         <HelpCircle className="w-4 h-4" />
                       </div>
                    </label>
                    <input 
                       type="text"
                       value={formData.branch}
                       onChange={e => setFormData({...formData, branch: e.target.value})}
                       className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                       placeholder="main"
                    />
                 </div>
              </div>

              <div>
                 <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    Dockerfile Path
                    <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="Location of the Dockerfile relative to the repository root (e.g., './Dockerfile').">
                       <HelpCircle className="w-4 h-4" />
                    </div>
                 </label>
                 <input 
                    type="text"
                    value={formData.dockerfilePath}
                    onChange={e => setFormData({...formData, dockerfilePath: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    placeholder="./Dockerfile"
                 />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                       Deployment Target
                       <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="The compute service where your application will be hosted.">
                          <HelpCircle className="w-4 h-4" />
                       </div>
                    </label>
                    <select 
                       value={formData.deployTarget}
                       onChange={e => setFormData({...formData, deployTarget: e.target.value as any})}
                       className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                       <option>EC2</option>
                       <option>Lambda</option>
                       <option>S3+CloudFront</option>
                    </select>
                 </div>
                 
                 <div>
                     <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                       Health Check Config
                       <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="Configure the HTTP method, endpoint, and expected status code to verify deployment success.">
                          <HelpCircle className="w-4 h-4" />
                       </div>
                     </label>
                     <div className="flex space-x-2">
                         <div className="w-1/4">
                             <select 
                                value={formData.healthCheckMethod || 'GET'}
                                onChange={e => setFormData({...formData, healthCheckMethod: e.target.value as any})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-center"
                                title="HTTP Method (e.g. GET) used to ping the endpoint"
                             >
                                <option>GET</option>
                                <option>POST</option>
                                <option>HEAD</option>
                             </select>
                         </div>
                         <div className="flex-1">
                             <input 
                                type="text"
                                value={formData.healthCheckEndpoint || ''}
                                onChange={e => setFormData({...formData, healthCheckEndpoint: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                                placeholder="/health"
                                title="The relative path (e.g. /health) to check for service availability"
                             />
                         </div>
                         <div className="w-1/4">
                             <input 
                                type="number"
                                value={formData.healthCheckStatus || 200}
                                onChange={e => setFormData({...formData, healthCheckStatus: parseInt(e.target.value)})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-center"
                                placeholder="200"
                                title="Expected HTTP status code (e.g. 200) for a successful check"
                             />
                         </div>
                     </div>
                     <div className="flex justify-between px-1 mt-1 text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                        <span>Method</span>
                        <span className="pl-4">Endpoint Path</span>
                        <span>Exp. Code</span>
                     </div>
                 </div>
              </div>

              <div>
                 <label className="flex items-center text-sm font-medium text-slate-300 mb-2">
                    Post-Deployment Command
                    <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="A command to execute after the app starts, often used for smoke tests or database migrations.">
                       <HelpCircle className="w-4 h-4" />
                    </div>
                 </label>
                 <input 
                    type="text"
                    value={formData.postDeployCommand || ''}
                    onChange={e => setFormData({...formData, postDeployCommand: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                    placeholder="npm run test:smoke"
                 />
                 <p className="text-xs text-slate-500 mt-1">Command to execute after successful deployment to verify service integrity.</p>
              </div>
              
              <div className="pt-4">
                   <label className="flex items-center cursor-pointer">
                      <input 
                         type="checkbox"
                         checked={formData.autoRollbackEnabled}
                         onChange={e => setFormData({...formData, autoRollbackEnabled: e.target.checked})}
                         className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm font-medium text-slate-300">Enable Auto-Rollback on Failure</span>
                      <div className="ml-2 text-slate-500 hover:text-slate-300 cursor-help" title="Automatically reverts deployment if health checks fail within the first 5 minutes.">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                   </label>
                   <p className="text-xs text-slate-500 mt-1 ml-8">
                     Automatically revert to the last stable version if health checks or post-deployment commands fail. Critical for minimizing downtime.
                   </p>
              </div>
           </div>

           <div className="mt-10 flex justify-between items-center">
              <button 
                 onClick={() => onDeleteProject(project.id)}
                 className="flex items-center space-x-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition-all"
              >
                 <Trash2 className="w-5 h-5" />
                 <span>Delete Project</span>
              </button>

              <button 
                 onClick={handleSaveConfig}
                 className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition font-medium shadow-lg shadow-blue-900/20"
              >
                 <Save className="w-5 h-5" />
                 <span>Save Configuration</span>
              </button>
           </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          {/* Header Tabs */}
          <div className="flex border-b border-slate-700 bg-slate-800 rounded-t-xl mx-1">
            <button 
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors first:rounded-tl-xl ${activeTab === 'current' ? 'bg-slate-700/50 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <PlayCircle className="w-4 h-4" />
              <span>Current Run</span>
            </button>
            <button 
              onClick={() => setActiveTab('structure')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${activeTab === 'structure' ? 'bg-slate-700/50 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <Layers className="w-4 h-4" />
              <span>Structure & Changes</span>
            </button>
            <button 
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 text-sm font-medium flex items-center justify-center space-x-2 transition-colors last:rounded-tr-xl ${activeTab === 'history' ? 'bg-slate-700/50 text-white border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
            >
              <History className="w-4 h-4" />
              <span>History</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-slate-800 border-x border-b border-slate-700 rounded-b-xl overflow-hidden">
            
            {/* Current Run View */}
            {activeTab === 'current' && (
              <div className="h-full grid grid-cols-12 gap-6 p-6">
                 {/* Steps List */}
                 <div className="col-span-4 overflow-y-auto pr-2">
                    <div className="space-y-0">
                      {steps.map((step, index) => (
                        <div key={step.id} className="relative pl-8 pb-8 last:pb-0">
                          {/* Connector Line */}
                          {index !== steps.length - 1 && (
                            <div className={`absolute left-[15px] top-8 w-0.5 h-[calc(100%-16px)] ${
                              step.status === 'success' ? 'bg-green-500' : 
                              step.status === 'failed' ? 'bg-red-500' :
                              'bg-slate-700'
                            }`}></div>
                          )}
                          
                          {/* Status Icon */}
                          <div className={`absolute left-0 top-1 w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-slate-800 transition-colors duration-300 ${
                            step.status === 'success' ? 'border-green-500 text-green-500' :
                            step.status === 'running' ? 'border-blue-500 text-blue-500 animate-pulse' :
                            step.status === 'failed' ? 'border-red-500 text-red-500' :
                            'border-slate-600 text-slate-600'
                          }`}>
                            {step.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                            step.status === 'running' ? <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" /> :
                            step.status === 'failed' ? <AlertTriangle className="w-4 h-4" /> :
                            <div className="w-2 h-2 bg-slate-600 rounded-full" />}
                          </div>

                          {/* Step Card */}
                          <div 
                            onClick={() => handleStepClick(step)}
                            className={`p-4 rounded-lg cursor-pointer border transition-all duration-200 ${
                              selectedStep.id === step.id 
                                ? 'bg-slate-700/50 border-blue-500/50 shadow-lg' 
                                : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <h4 className={`font-medium ${selectedStep.id === step.id ? 'text-white' : 'text-slate-300'}`}>{step.name}</h4>
                              <span className={`text-xs uppercase font-semibold ${
                                  step.status === 'failed' ? 'text-red-400' : 
                                  step.status === 'running' ? 'text-blue-400' : 
                                  step.status === 'success' ? 'text-green-400' : 'text-slate-500'
                              }`}>
                                  {step.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Logs View */}
                 <div className="col-span-8 bg-slate-900 rounded-xl border border-slate-800 p-0 flex flex-col overflow-hidden shadow-inner">
                    <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Terminal className="w-4 h-4 text-slate-400" />
                        <span className="font-mono text-sm text-slate-300">Logs: {selectedStep.name}</span>
                      </div>
                      <div className="flex space-x-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20"></div>
                      </div>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm overflow-y-auto text-slate-400 space-y-1 bg-slate-950">
                      {selectedStep.logs.length > 0 ? (
                        selectedStep.logs.map((log, i) => (
                          <div key={i} className="flex space-x-2">
                            <span className="text-slate-700 select-none w-6 text-right">{(i + 1)}</span>
                            <span className={`${
                                log.includes('ERROR') || log.includes('Failed') ? 'text-red-400' : 
                                log.includes('Rollback') ? 'text-yellow-400' : 
                                log.includes('Success') || log.includes('Complete') || log.includes('passed') || log.includes('OK') ? 'text-green-400' : 
                                'text-slate-300'
                            }`}>
                                {log}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-600 italic">Waiting for process to start...</div>
                      )}
                      {selectedStep.status === 'running' && (
                        <div className="animate-pulse text-blue-500 pl-8">_</div>
                      )}
                    </div>
                 </div>
              </div>
            )}

            {/* Structure & Changes View */}
            {activeTab === 'structure' && (
               <div className="h-full p-6 overflow-y-auto space-y-8">
                  
                  {/* Pipeline Structure Graph */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Box className="w-5 h-5 mr-2 text-blue-500" />
                      Pipeline Existing Structure
                    </h3>
                    <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-700 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-800/50">
                       <div className="flex items-center min-w-max space-x-4">
                          <div className="flex items-center justify-center px-4 py-2 bg-slate-800 rounded border border-slate-700 text-xs text-slate-400 font-mono">START</div>
                          <ArrowRight className="w-4 h-4 text-slate-600" />
                          
                          {steps.map((step, index) => (
                             <React.Fragment key={step.id}>
                               <div className={`w-48 p-4 rounded-lg border flex flex-col items-center text-center transition-all hover:scale-105 ${
                                  step.status === 'success' ? 'bg-green-500/5 border-green-500/30' :
                                  step.status === 'running' ? 'bg-blue-500/5 border-blue-500/30 shadow-lg shadow-blue-500/10' :
                                  step.status === 'failed' ? 'bg-red-500/5 border-red-500/30' :
                                  'bg-slate-800 border-slate-700'
                               }`}>
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                     step.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                     step.status === 'running' ? 'bg-blue-500/20 text-blue-400' :
                                     step.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                     'bg-slate-700 text-slate-400'
                                  }`}>
                                    {step.status === 'success' ? <CheckCircle className="w-4 h-4" /> :
                                     step.status === 'failed' ? <AlertTriangle className="w-4 h-4" /> :
                                     <div className="font-bold text-xs">{index + 1}</div>}
                                  </div>
                                  <h4 className="text-sm font-semibold text-white mb-1">{step.name}</h4>
                                  <span className="text-[10px] uppercase tracking-wider text-slate-500">{step.status}</span>
                               </div>
                               {index < steps.length - 1 && (
                                  <ArrowRight className={`w-5 h-5 ${step.status === 'success' ? 'text-green-500/50' : 'text-slate-600'}`} />
                               )}
                             </React.Fragment>
                          ))}
                          
                          <ArrowRight className={`w-4 h-4 ${steps[steps.length -1].status === 'success' ? 'text-green-500/50' : 'text-slate-600'}`} />
                          <div className={`flex items-center justify-center px-4 py-2 rounded border text-xs font-mono font-bold ${
                             steps.some(s => s.status === 'failed') ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                             steps.every(s => s.status === 'success') ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                             'bg-slate-800 border-slate-700 text-slate-400'
                          }`}>
                             {steps.some(s => s.status === 'failed') ? 'FAILURE' : 
                              steps.every(s => s.status === 'success') ? 'DEPLOYED' : 'PENDING'}
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Structural Changes */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <FileDiff className="w-5 h-5 mr-2 text-purple-500" />
                      Structural Changes
                      <span className="ml-3 text-sm font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                         Commit {currentDeployment.commit}
                      </span>
                    </h3>
                    <div className="bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden">
                       <table className="w-full text-left text-sm">
                          <thead className="bg-slate-800 text-slate-300 uppercase font-semibold text-xs">
                             <tr>
                                <th className="px-6 py-3">File Path</th>
                                <th className="px-6 py-3">Change Type</th>
                                <th className="px-6 py-3 text-right">Additions</th>
                                <th className="px-6 py-3 text-right">Deletions</th>
                                <th className="px-6 py-3"></th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800">
                             {MOCK_FILE_CHANGES.map((file, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors group">
                                   <td className="px-6 py-4 font-mono text-slate-300 group-hover:text-white">
                                      {file.path}
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                                         file.type === 'added' ? 'bg-green-500/10 text-green-400' :
                                         file.type === 'modified' ? 'bg-blue-500/10 text-blue-400' :
                                         'bg-red-500/10 text-red-400'
                                      }`}>
                                         {file.type}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4 text-right text-green-400 font-mono">+{file.additions}</td>
                                   <td className="px-6 py-4 text-right text-red-400 font-mono">-{file.deletions}</td>
                                   <td className="px-6 py-4 text-right">
                                      <button className="text-slate-500 hover:text-blue-400 transition-colors text-xs underline">View Diff</button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                  </div>
               </div>
            )}

            {/* History View */}
            {activeTab === 'history' && (
               <div className="h-full p-6 overflow-y-auto">
                  <div className="space-y-4 max-w-4xl mx-auto">
                    {DEMO_HISTORY.map(item => (
                      <div key={item.id} className="p-5 rounded-lg bg-slate-900/50 border border-slate-700 hover:border-slate-600 transition-all hover:shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                  item.status === 'success' ? 'bg-green-500' : 
                                  item.status === 'failed' ? 'bg-red-500' : 
                                  item.status === 'rollback' ? 'bg-orange-500' : 
                                  'bg-blue-500 animate-pulse'
                              }`} />
                              <span className="font-bold text-white text-lg">{item.version}</span>
                              <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                item.status === 'success' ? 'bg-green-500/10 text-green-400' : 
                                item.status === 'failed' ? 'bg-red-500/10 text-red-400' : 
                                item.status === 'rollback' ? 'bg-orange-500/10 text-orange-400' :
                                'bg-blue-500/10 text-blue-400'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                            <p className="text-slate-300 mb-2 font-medium">{item.message}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center font-mono text-blue-400 bg-blue-500/5 px-1.5 py-0.5 rounded"><GitCommit className="w-3 h-3 mr-1" /> {item.commit}</span>
                                <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {item.author}</span>
                                <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {item.time}</span>
                            </div>
                        </div>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg border border-slate-700 transition-colors">
                           View Logs
                        </button>
                      </div>
                    ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
