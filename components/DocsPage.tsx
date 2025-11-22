
import React, { useState } from 'react';
import { Server, Search, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Page } from '../types';

interface DocsPageProps {
  onNavigate: (page: Page) => void;
}

const SECTIONS = [
  {
    title: 'Getting Started',
    items: [
      { id: 'intro', title: 'Introduction' },
      { id: 'install', title: 'Installation' },
      { id: 'quickstart', title: 'Quick Start Guide' }
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { id: 'projects', title: 'Projects' },
      { id: 'pipelines', title: 'Pipelines' },
      { id: 'scaling', title: 'Auto-Scaling' }
    ]
  },
  {
    title: 'API Reference',
    items: [
      { id: 'api-auth', title: 'Authentication' },
      { id: 'api-deploy', title: 'Deployments' },
      { id: 'api-metrics', title: 'Metrics' }
    ]
  }
];

const CONTENT: Record<string, string> = {
  intro: `# Introduction

Welcome to the OpsScale AI documentation. OpsScale AI is a comprehensive platform designed to automate the lifecycle of your applications, from code commit to production scaling.

## Key Features

- **Automated Pipelines**: Build and deploy Docker containers automatically.
- **AI Advisory**: Get actionable insights on how to optimize your infrastructure.
- **Cost Management**: Scale down during off-peak hours automatically.

## System Requirements

OpsScale works with any cloud provider but is optimized for:
- AWS (EC2, Lambda, Fargate)
- Google Cloud Platform (Compute Engine, Cloud Run)
- Azure (Virtual Machines, App Service)
`,
  install: `# Installation

OpsScale is a SaaS platform, so there is no server software to install. However, you may want to install our CLI tool for local development.

\`\`\`bash
npm install -g opsscale-cli
\`\`\`

Once installed, you can login via the terminal:

\`\`\`bash
opsscale login
\`\`\`
`,
  quickstart: `# Quick Start Guide

1. **Create an Account**: Sign up at [dashboard.opsscale.ai](https://dashboard.opsscale.ai).
2. **Connect GitHub**: Grant access to your repositories.
3. **Create Project**: Select a repo and a cloud region.
4. **Push Code**: Make a change to your \`main\` branch.

OpsScale will automatically detect your \`Dockerfile\` (or generate one) and start the deployment process.
`,
  scaling: `# Auto-Scaling Configuration

OpsScale uses a combination of reactive and predictive scaling.

## Thresholds

You can configure CPU and Memory thresholds in the **Settings** tab of your project.

- **Scale Up**: Default is 70% CPU utilization for 5 minutes.
- **Scale Down**: Default is 30% CPU utilization for 15 minutes.

## AI Recommendations

Our AI model analyzes traffic patterns over 7-day windows to suggest changes to your baseline instance counts.
`,
  projects: `# Projects

Projects are the top-level container in OpsScale. A project corresponds to a single application or microservice.

## Creating a Project

Navigate to the main dashboard and click **Create New Project**. You will need to provide:
- **Name**: A unique identifier.
- **Cloud Provider**: AWS, GCP, or Azure.
- **Region**: The target deployment region.
`,
  pipelines: `# Pipelines

Pipelines define the steps taken from code commit to production deployment.

## Stages
1. **Build**: Compiles code and builds Docker image.
2. **Test**: Runs unit and integration tests.
3. **Deploy**: Updates the target infrastructure (e.g., EC2, K8s).

## Rollbacks
If a deployment fails health checks, OpsScale automatically rolls back to the previous stable version.
`,
  'api-auth': `# API Authentication

All API requests must be authenticated using a Bearer token.

\`\`\`bash
curl -H "Authorization: Bearer <your_token>" https://api.opsscale.ai/v1/projects
\`\`\`
`,
  'api-deploy': `# Deployments API

Trigger a new deployment manually.

### Endpoint
\`POST /v1/deployments/trigger\`

### Parameters
- \`projectId\`: string
- \`branch\`: string (default: main)
`,
  'api-metrics': `# Metrics API

Retrieve aggregated metrics for your project.

### Endpoint
\`GET /v1/metrics\`

### Response
\`\`\`json
{
  "cpu": 45.2,
  "memory": 60.1,
  "latency": 120
}
\`\`\`
`
};

const CopyableCodeBlock = ({ children, className, ...props }: any) => {
  const [copied, setCopied] = useState(false);
  const text = children ? String(children).replace(/\n$/, '') : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group mb-4 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
         <button 
           onClick={handleCopy}
           className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-slate-400 hover:text-white transition-all shadow-lg"
           title="Copy to clipboard"
         >
           {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
         </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <code className={`block text-sm font-mono text-blue-300 ${className || ''}`} {...props}>
          {children}
        </code>
      </div>
    </div>
  );
};

const CodeRenderer = ({ node, className, children, ...props }: any) => {
  const match = /language-(\w+)/.exec(className || '');
  // Detect block code by class or if content has newlines
  const isBlock = match || (typeof children === 'string' && children.includes('\n'));

  if (isBlock) {
    return <CopyableCodeBlock className={className} {...props}>{children}</CopyableCodeBlock>;
  }

  return <code className="bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono text-blue-300" {...props}>{children}</code>;
};

const PreRenderer = ({ children }: any) => {
  // We unwrap the default <pre> because CopyableCodeBlock (rendered by CodeRenderer) 
  // handles its own container and styling.
  return <>{children}</>;
};

export const DocsPage: React.FC<DocsPageProps> = ({ onNavigate }) => {
  const [activeId, setActiveId] = useState('intro');
  const [search, setSearch] = useState('');

  const activeContent = CONTENT[activeId] || `# ${activeId}\n\nContent coming soon...`;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
       {/* Navbar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Server className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">OpsScale Docs</span>
            </div>
            <div className="hidden md:flex space-x-6 text-sm">
              <button onClick={() => onNavigate(Page.FEATURES)} className="text-slate-400 hover:text-white">Features</button>
              <button onClick={() => onNavigate(Page.APP)} className="text-blue-400 hover:text-blue-300 font-medium">Go to Dashboard</button>
            </div>
        </div>
      </nav>

      <div className="flex-1 container mx-auto px-6 flex flex-col md:flex-row">
         {/* Sidebar */}
         <aside className="w-full md:w-64 py-8 md:border-r border-slate-800 flex-shrink-0">
            <div className="mb-6 relative">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
               <input 
                 type="text" 
                 placeholder="Search docs..." 
                 value={search}
                 onChange={e => setSearch(e.target.value)}
                 className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none"
               />
            </div>
            <div className="space-y-8">
               {SECTIONS.map((section, idx) => (
                 <div key={idx}>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">{section.title}</h5>
                    <ul className="space-y-1">
                       {section.items.map(item => (
                         <li key={item.id}>
                            <button 
                               onClick={() => setActiveId(item.id)}
                               className={`w-full text-left px-2 py-1.5 rounded-lg text-sm transition-colors ${
                                 activeId === item.id 
                                   ? 'bg-blue-600/10 text-blue-400 font-medium' 
                                   : 'text-slate-400 hover:text-white hover:bg-slate-800'
                               }`}
                            >
                               {item.title}
                            </button>
                         </li>
                       ))}
                    </ul>
                 </div>
               ))}
            </div>
         </aside>

         {/* Main Content */}
         <main className="flex-1 py-8 md:px-12 overflow-y-auto">
            <article className="prose prose-invert prose-slate max-w-3xl mx-auto">
               <ReactMarkdown
                  components={{
                     h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-white mb-6" {...props} />,
                     h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-white mt-8 mb-4 border-b border-slate-800 pb-2" {...props} />,
                     p: ({node, ...props}) => <p className="text-slate-300 leading-relaxed mb-4" {...props} />,
                     ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 text-slate-300 mb-4" {...props} />,
                     li: ({node, ...props}) => <li className="mb-1" {...props} />,
                     // Override code to use our custom renderer
                     code: CodeRenderer,
                     // Override pre to unwrap, avoiding <pre><div>...</div></pre> issues
                     pre: PreRenderer,
                     a: ({node, ...props}) => <a className="text-blue-400 hover:underline" {...props} />
                  }}
               >
                  {activeContent}
               </ReactMarkdown>
            </article>

            <div className="mt-16 pt-8 border-t border-slate-800 max-w-3xl mx-auto flex justify-between">
               <button className="text-slate-500 hover:text-white text-sm flex items-center">
                 Was this helpful?
               </button>
               <div className="text-slate-600 text-xs">
                  Last updated: October 24, 2023
               </div>
            </div>
         </main>
      </div>
    </div>
  );
};
