
import React from 'react';
import { Server, Github, PlayCircle, BarChart, Layers } from 'lucide-react';
import { Page } from '../types';

interface HowItWorksPageProps {
  onNavigate: (page: Page) => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-50">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/30">
            <Server className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">OpsScale AI</span>
        </div>
        <div className="hidden md:flex space-x-8">
          <button onClick={() => onNavigate(Page.FEATURES)} className="text-slate-400 hover:text-white transition-colors">Features</button>
          <button onClick={() => onNavigate(Page.HOW_IT_WORKS)} className="text-white font-medium">How it Works</button>
          <button onClick={() => onNavigate(Page.DOCS)} className="text-slate-400 hover:text-white transition-colors">Docs</button>
        </div>
        <div className="flex items-center space-x-4">
           <button onClick={() => onNavigate(Page.LOGIN)} className="text-slate-300 hover:text-white font-medium">Login</button>
           <button onClick={() => onNavigate(Page.SIGNUP)} className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-900/20">Sign Up</button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
         <div className="text-center max-w-3xl mx-auto mb-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            From Git Push to Production
          </h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            See how OpsScale AI transforms a simple code change into a scalable, deployed application without the operational headache.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
           {/* Vertical Line */}
           <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 transform -translate-x-1/2">
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 opacity-30"></div>
           </div>

           {/* Step 1 */}
           <div className="relative flex flex-col md:flex-row items-center mb-24 group">
              {/* Card */}
              <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-16 flex md:justify-end order-1">
                 <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative overflow-hidden group-hover:border-blue-500/50 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Github className="w-24 h-24" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white flex items-center"><Github className="w-5 h-5 mr-2 text-blue-500" /> Connect Repository</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Link your GitHub, GitLab, or Bitbucket account. Select the repository you want to deploy and we handle the authentication.</p>
                 </div>
              </div>
              
              {/* Number */}
              <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-blue-600 flex items-center justify-center z-10 transform -translate-x-1/2 shadow-lg shadow-blue-900/50">
                 <span className="font-bold text-white">1</span>
              </div>

              {/* Description */}
              <div className="w-full md:w-1/2 pl-20 md:pl-16 order-2 mt-6 md:mt-0">
                 <h4 className="text-lg font-semibold text-blue-400 mb-2 md:hidden">Detection & Analysis</h4>
                 <p className="text-slate-400 leading-relaxed">
                    We automatically detect your language (Node.js, Python, Go) and suggest a Dockerfile configuration optimized for production environments.
                 </p>
              </div>
           </div>

           {/* Step 2 */}
           <div className="relative flex flex-col md:flex-row items-center mb-24 group">
              {/* Description (Left on Desktop) */}
              <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-16 md:text-right order-2 md:order-1 mt-6 md:mt-0">
                 <h4 className="text-lg font-semibold text-indigo-400 mb-2 md:hidden">Smart Recommendations</h4>
                 <p className="text-slate-400 leading-relaxed">
                    Our AI Advisor suggests optimal instance types and scaling limits based on your expected load profile and budget constraints.
                 </p>
              </div>

              {/* Number */}
              <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-indigo-600 flex items-center justify-center z-10 transform -translate-x-1/2 shadow-lg shadow-indigo-900/50">
                 <span className="font-bold text-white">2</span>
              </div>

              {/* Card (Right on Desktop) */}
              <div className="w-full md:w-1/2 pl-20 md:pl-16 flex md:justify-start order-1 md:order-2">
                 <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative overflow-hidden group-hover:border-indigo-500/50 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Layers className="w-24 h-24" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white flex items-center"><Layers className="w-5 h-5 mr-2 text-indigo-500" /> Configure & Optimize</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Define environment variables, regions, and scaling rules. OpsScale validates your config against best practices.</p>
                 </div>
              </div>
           </div>

           {/* Step 3 */}
           <div className="relative flex flex-col md:flex-row items-center mb-24 group">
              {/* Card */}
              <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-16 flex md:justify-end order-1">
                 <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative overflow-hidden group-hover:border-green-500/50 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><PlayCircle className="w-24 h-24" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white flex items-center"><PlayCircle className="w-5 h-5 mr-2 text-green-500" /> Automated Pipeline</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">Every commit triggers a pipeline: Lint → Test → Build → Deploy. Watch logs stream in real-time.</p>
                 </div>
              </div>
              
              {/* Number */}
              <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-green-600 flex items-center justify-center z-10 transform -translate-x-1/2 shadow-lg shadow-green-900/50">
                 <span className="font-bold text-white">3</span>
              </div>

              {/* Description */}
              <div className="w-full md:w-1/2 pl-20 md:pl-16 order-2 mt-6 md:mt-0">
                 <h4 className="text-lg font-semibold text-green-400 mb-2 md:hidden">Zero Downtime</h4>
                 <p className="text-slate-400 leading-relaxed">
                    Deploy with confidence using automated blue/green strategies. If a health check fails, we rollback instantly.
                 </p>
              </div>
           </div>

           {/* Step 4 */}
           <div className="relative flex flex-col md:flex-row items-center mb-24 group">
              {/* Description */}
              <div className="w-full md:w-1/2 pl-20 md:pl-0 md:pr-16 md:text-right order-2 md:order-1 mt-6 md:mt-0">
                 <h4 className="text-lg font-semibold text-purple-400 mb-2 md:hidden">Self-Healing</h4>
                 <p className="text-slate-400 leading-relaxed">
                    Dashboards update instantly. Receive Slack/Email alerts if error rates spike or latency degrades.
                 </p>
              </div>

              {/* Number */}
              <div className="absolute left-8 md:left-1/2 w-12 h-12 rounded-full bg-slate-900 border-4 border-purple-600 flex items-center justify-center z-10 transform -translate-x-1/2 shadow-lg shadow-purple-900/50">
                 <span className="font-bold text-white">4</span>
              </div>

              {/* Card */}
              <div className="w-full md:w-1/2 pl-20 md:pl-16 flex md:justify-start order-1 md:order-2">
                 <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 w-full max-w-md shadow-2xl relative overflow-hidden group-hover:border-purple-500/50 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><BarChart className="w-24 h-24" /></div>
                    <h3 className="text-xl font-bold mb-3 text-white flex items-center"><BarChart className="w-5 h-5 mr-2 text-purple-500" /> Monitor & Auto-Scale</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">We monitor infrastructure health 24/7. When traffic spikes, we add instances. When it drops, we remove them.</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-3xl p-12 mt-12 text-center max-w-4xl mx-auto shadow-2xl">
           <h3 className="text-3xl font-bold text-white mb-4">Ready to see it in action?</h3>
           <p className="text-slate-400 mb-8 text-lg">You can deploy your first application in less than 5 minutes.</p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button onClick={() => onNavigate(Page.SIGNUP)} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20">Get Started Free</button>
              <button onClick={() => onNavigate(Page.DOCS)} className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all border border-slate-600 hover:border-slate-500">Read Documentation</button>
           </div>
        </div>
      </div>
      
      <footer className="bg-slate-950 border-t border-slate-900 py-12 mt-20">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-slate-500 cursor-pointer mb-4 md:mb-0" onClick={() => onNavigate(Page.LANDING)}>
               <Server className="w-5 h-5" />
               <span className="font-bold">OpsScale AI</span>
            </div>
            <div className="flex space-x-8 text-sm text-slate-500">
               <a href="#" className="hover:text-white transition-colors">Privacy</a>
               <a href="#" className="hover:text-white transition-colors">Terms</a>
               <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-slate-600 text-sm mt-4 md:mt-0">&copy; 2025 OpsScale AI Inc.</p>
        </div>
      </footer>
    </div>
  );
};
