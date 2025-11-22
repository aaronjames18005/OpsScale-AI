
import React from 'react';
import { Server, GitBranch, Activity, ShieldCheck, Bot, Zap, Cloud, Lock, ArrowRight, Github } from 'lucide-react';
import { Page } from '../types';

interface FeaturesPageProps {
  onNavigate: (page: Page) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-900">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/30">
            <Server className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">OpsScale AI</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <button onClick={() => onNavigate(Page.FEATURES)} className="text-white font-medium">Features</button>
          <button onClick={() => onNavigate(Page.HOW_IT_WORKS)} className="text-slate-400 hover:text-white transition-colors">How it Works</button>
          <button onClick={() => onNavigate(Page.DOCS)} className="text-slate-400 hover:text-white transition-colors">Docs</button>
        </div>
        <div className="flex items-center space-x-4">
           <button onClick={() => onNavigate(Page.LOGIN)} className="text-slate-300 hover:text-white font-medium">Login</button>
           <button onClick={() => onNavigate(Page.SIGNUP)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all">Sign Up</button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Intelligent Infrastructure
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            OpsScale AI combines traditional DevOps automation with generative AI to create a self-healing, self-optimizing deployment platform.
          </p>
        </div>

        <div className="grid gap-12">
          {/* Feature Block 1 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                   <Bot className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">AI Scaling Advisor</h2>
                <p className="text-slate-400 text-lg">
                  Stop over-provisioning. Our Gemini-powered advisor analyzes your CPU, memory, and request latency trends to recommend the perfect instance types and auto-scaling thresholds.
                </p>
                <ul className="space-y-3 text-slate-300">
                   <li className="flex items-center"><Zap className="w-4 h-4 mr-3 text-yellow-400" /> Real-time cost-benefit analysis</li>
                   <li className="flex items-center"><Zap className="w-4 h-4 mr-3 text-yellow-400" /> Predictive scaling based on historical usage</li>
                   <li className="flex items-center"><Zap className="w-4 h-4 mr-3 text-yellow-400" /> Automated implementation of recommendations</li>
                </ul>
             </div>
             <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 w-full shadow-2xl">
                 <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                    <span className="text-sm text-slate-500 font-mono">advisor_log.json</span>
                    <div className="flex space-x-1">
                       <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                       <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                 </div>
                 <div className="space-y-2 font-mono text-xs">
                    <div className="text-slate-400">Analyzing traffic patterns (Last 24h)...</div>
                    <div className="text-blue-400">Found pattern: High latency spike @ 14:00 UTC</div>
                    <div className="text-green-400">Recommendation: Scale up to m5.large during peak hours.</div>
                    <div className="text-slate-500 mt-2">// Estimated savings: $45/mo</div>
                 </div>
             </div>
          </div>

          {/* Feature Block 2 */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row-reverse items-center gap-12">
             <div className="flex-1 space-y-6">
                <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-400 mb-4">
                   <GitBranch className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-white">Zero-Config CI/CD</h2>
                <p className="text-slate-400 text-lg">
                   Connect a GitHub repository and we instantly generate a multi-stage Docker build pipeline. No YAML wrangling required unless you want to.
                </p>
                 <ul className="space-y-3 text-slate-300">
                   <li className="flex items-center"><Zap className="w-4 h-4 mr-3 text-purple-400" /> Auto-detection of Node, Python, Go, and more</li>
                   <li className="flex items-center"><Zap className="w-4 h-4 mr-3 text-purple-400" /> Integrated unit and integration testing</li>
                   <li className="flex items-center"><Zap className="w-4 h-4 mr-3 text-purple-400" /> Blue/Green deployment support</li>
                </ul>
             </div>
             <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 w-full shadow-2xl flex flex-col justify-center items-center space-y-4">
                 <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="font-medium text-sm">Build</span>
                    </div>
                    <span className="text-xs text-green-400">Success (2m 14s)</span>
                 </div>
                 <div className="w-0.5 h-4 bg-slate-700"></div>
                 <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       <span className="font-medium text-sm">Test</span>
                    </div>
                     <span className="text-xs text-green-400">Passed (45s)</span>
                 </div>
                 <div className="w-0.5 h-4 bg-slate-700"></div>
                 <div className="w-full flex items-center justify-between px-4 py-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
                    <div className="flex items-center space-x-3">
                       <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                       <span className="font-medium text-sm text-blue-100">Deploy</span>
                    </div>
                     <span className="text-xs text-blue-300">In Progress...</span>
                 </div>
             </div>
          </div>

          {/* Grid of smaller features */}
          <div className="grid md:grid-cols-3 gap-8 mt-8">
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <Cloud className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Multi-Cloud Support</h3>
                <p className="text-slate-400 text-sm">Deploy to AWS, Google Cloud, or Azure with a unified interface. Switch providers without rewriting pipelines.</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <Lock className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Built-in Security</h3>
                <p className="text-slate-400 text-sm">Automatic vulnerability scanning for dependencies and Docker images before every deployment.</p>
             </div>
             <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                <Activity className="w-8 h-8 text-red-500 mb-4" />
                <h3 className="text-lg font-bold mb-2">Instant Rollbacks</h3>
                <p className="text-slate-400 text-sm">If a deployment fails health checks, we automatically revert traffic to the last stable version in seconds.</p>
             </div>
          </div>
        </div>

        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to upgrade your workflow?</h2>
          <button onClick={() => onNavigate(Page.SIGNUP)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">
             Start Your Free Trial
          </button>
        </div>
      </div>
      
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-12">
        <div className="container mx-auto px-6 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-500 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
               <Server className="w-5 h-5" />
               <span className="font-bold">OpsScale AI</span>
            </div>
            <p className="text-slate-600 text-sm">&copy; 2025 OpsScale AI Inc.</p>
        </div>
      </footer>
    </div>
  );
};
