
import React, { useState } from 'react';
import { Server, GitBranch, Activity, ShieldCheck, ArrowRight, Github, CheckCircle, Loader2 } from 'lucide-react';
import { Page } from '../types';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
  onViewDemo: () => Promise<void>;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onViewDemo }) => {
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoClick = async () => {
    setIsDemoLoading(true);
    await onViewDemo();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden font-sans">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-900/30">
            <Server className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">OpsScale AI</span>
        </div>
        
        <div className="hidden md:flex space-x-8">
          <button onClick={() => onNavigate(Page.FEATURES)} className="text-slate-400 hover:text-white transition-colors">Features</button>
          <button onClick={() => onNavigate(Page.HOW_IT_WORKS)} className="text-slate-400 hover:text-white transition-colors">How it Works</button>
          <button onClick={() => onNavigate(Page.DOCS)} className="text-slate-400 hover:text-white transition-colors">Docs</button>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => onNavigate(Page.LOGIN)}
            className="text-slate-300 hover:text-white font-medium"
          >
            Login
          </button>
          <button 
            onClick={() => onNavigate(Page.SIGNUP)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg font-medium transition-all hover:shadow-lg hover:shadow-blue-900/30"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 py-20 lg:py-32 flex flex-col lg:flex-row items-center gap-16">
        <div className="lg:w-1/2 space-y-8">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            Automate Deployments. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Get Smart Scaling.
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Connect your repo & cloud provider. We handle Docker builds, CI/CD pipelines, and provide AI-driven scaling recommendations to optimize cost and performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onNavigate(Page.SIGNUP)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center transition-all shadow-xl shadow-blue-900/20"
            >
              Get Started
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button 
              onClick={handleDemoClick}
              disabled={isDemoLoading}
              className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all border border-slate-700 flex items-center justify-center"
            >
              {isDemoLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Loading Demo...
                </>
              ) : (
                'View Demo'
              )}
            </button>
          </div>
          <div className="flex items-center space-x-4 text-sm text-slate-500">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-950"></div>
              <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-950"></div>
            </div>
            <span>Trusted by 500+ DevOps Engineers</span>
          </div>
        </div>

        {/* Hero Image / Mockup */}
        <div className="lg:w-1/2 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-30"></div>
          <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
             {/* Mock Browser Header */}
             <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center space-x-2">
               <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
               <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
               <div className="ml-4 bg-slate-900 rounded px-3 py-1 text-xs text-slate-500 font-mono w-64">dashboard.opsscale.ai</div>
             </div>
             {/* Mock Content */}
             <div className="p-6 space-y-6 bg-slate-900/95">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                    <div className="h-3 w-48 bg-slate-800 rounded"></div>
                  </div>
                  <div className="h-8 w-24 bg-blue-600/20 rounded"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 bg-slate-800 rounded-lg border border-slate-700"></div>
                  <div className="h-24 bg-slate-800 rounded-lg border border-slate-700"></div>
                  <div className="h-24 bg-slate-800 rounded-lg border border-slate-700"></div>
                </div>
                <div className="h-40 bg-slate-800 rounded-lg border border-slate-700 flex items-center justify-center">
                  <Activity className="w-12 h-12 text-blue-500/50" />
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Features Teaser */}
      <section className="py-24 bg-slate-900/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to scale confidently</h2>
            <p className="text-slate-400">Stop guessing your infrastructure needs. Let AI guide your scaling decisions while we automate the heavy lifting.</p>
            <button onClick={() => onNavigate(Page.FEATURES)} className="mt-4 text-blue-400 font-semibold hover:text-blue-300 flex items-center justify-center mx-auto">
              See all features <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={GitBranch} 
              title="Automated CI/CD" 
              description="Seamlessly integrate with GitHub Actions to build, test, and deploy automatically on every push." 
            />
            <FeatureCard 
              icon={Activity} 
              title="Scaling Advisor" 
              description="AI-powered recommendations for EC2 & Lambda resource allocation based on real-time traffic patterns." 
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="Monitoring & Alerts" 
              description="Set up critical alerts and visualize health metrics instantly without complex configuration." 
            />
            <FeatureCard 
              icon={Server} 
              title="Safe Rollbacks" 
              description="Deploy with confidence. One-click rollbacks ensure your service uptime stays at 99.99%." 
            />
          </div>
        </div>
      </section>

      {/* How it Works Teaser */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">From Repo to Production in Minutes</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-900 via-blue-600 to-blue-900 z-0"></div>

            <StepCard 
              number="1" 
              title="Connect" 
              description="Link your GitHub repository and cloud provider credentials securely." 
            />
            <StepCard 
              number="2" 
              title="Define Pipeline" 
              description="Configure your build steps and auto-scaling rules via our intuitive UI." 
            />
            <StepCard 
              number="3" 
              title="Scale" 
              description="Let OpsScale optimize your resources while you focus on writing code." 
            />
          </div>
          <div className="text-center mt-16">
            <button 
              onClick={() => onNavigate(Page.HOW_IT_WORKS)}
              className="inline-flex items-center justify-center px-8 py-3 border border-slate-700 text-base font-medium rounded-md text-white bg-slate-800 hover:bg-slate-700 md:py-4 md:text-lg md:px-10 transition-all"
            >
               Learn More about the Process
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
              <Server className="w-5 h-5 text-blue-500" />
              <span className="font-bold text-lg">OpsScale AI</span>
            </div>
            <div className="flex space-x-6 text-slate-500 text-sm">
              <button onClick={() => onNavigate(Page.FEATURES)} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => onNavigate(Page.HOW_IT_WORKS)} className="hover:text-white transition-colors">How it Works</button>
              <a href="#" className="hover:text-white transition-colors flex items-center"><Github className="w-4 h-4 mr-1" /> GitHub</a>
              <button onClick={() => onNavigate(Page.DOCS)} className="hover:text-white transition-colors">Docs</button>
            </div>
            <p className="text-slate-600 text-sm mt-4 md:mt-0">&copy; 2025 OpsScale AI Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: any; title: string; description: string }> = ({ icon: Icon, title, description }) => (
  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all hover:-translate-y-1 group">
    <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
      <Icon className="w-6 h-6 text-blue-500 group-hover:text-white" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div className="relative z-10 flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center text-2xl font-bold text-blue-500 mb-6 shadow-xl">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{description}</p>
  </div>
);
