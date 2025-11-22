
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCw, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getScalingAdvice } from '../services/geminiService';
import { ChatMessage, Project } from '../types';

interface AIAdvisorProps {
  project: Project;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ project }) => {
  const [input, setInput] = useState('');
  const [context, setContext] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: `Hello! I'm your scaling advisor for **${project.name}**. I have access to your ${project.cloudProvider} configuration in ${project.region}. How can I help optimize your deployment today?`,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when project changes
  useEffect(() => {
    setMessages([{
      role: 'model',
      text: `Hello! I'm your scaling advisor for **${project.name}**. I have access to your ${project.cloudProvider} configuration in ${project.region}. How can I help optimize your deployment today?`,
      timestamp: new Date(),
    }]);
    setContext('');
  }, [project.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Construct augmented context with project details
    const projectContext = `
      Project Details:
      - Name: ${project.name}
      - Cloud Provider: ${project.cloudProvider}
      - Region: ${project.region}
      - Repo: ${project.repoUrl}
      - Target Type: ${project.scalingConfig.targetType}
      - Current Scaling Config: Min ${project.scalingConfig.minInstances}, Max ${project.scalingConfig.maxInstances}
      - Thresholds: Scale Up at ${project.scalingConfig.scaleUpThresholdCPU}% CPU, Scale Down at ${project.scalingConfig.scaleDownThresholdCPU}% CPU
      - Cooldown: ${project.scalingConfig.scaleDownCooldown} seconds
    `;

    const fullContext = `${projectContext}\n\nUser Provided Context (Logs/Metrics):\n${context || "None provided."}`;
    
    try {
      const responseText = await getScalingAdvice(fullContext, userMessage.text);

      const modelMessage: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: 'model',
        text: "I'm having trouble connecting to the advisor service right now. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col lg:flex-row p-6 gap-6">
      {/* Context Input Area */}
      <div className="lg:w-1/3 flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-lg">
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 rounded-t-xl">
          <h3 className="text-white font-semibold flex items-center">
            <RefreshCw className="w-4 h-4 mr-2 text-blue-400" />
            Analysis Context
          </h3>
          <p className="text-slate-400 text-xs mt-1">Paste specific logs or JSON metrics here. Project config is automatically included.</p>
        </div>
        <div className="bg-slate-900/30 px-4 py-2 border-b border-slate-700/50 flex items-start space-x-2">
           <Info className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
           <p className="text-[10px] text-blue-300/70">
             Active Context: {project.cloudProvider} ({project.region}), Scale: {project.scalingConfig.minInstances}-{project.scalingConfig.maxInstances}
           </p>
        </div>
        <textarea
          className="flex-1 bg-slate-900/50 p-4 text-slate-300 font-mono text-sm focus:outline-none resize-none rounded-b-xl"
          placeholder="[2023-10-27 10:00:01] ERROR: Connection timed out..."
          value={context}
          onChange={(e) => setContext(e.target.value)}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-800 rounded-xl border border-slate-700 shadow-lg overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 ml-3' : 'bg-indigo-600 mr-3'}`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>
                <div className={`p-4 rounded-2xl overflow-hidden shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/20 text-blue-100 border border-blue-600/30 rounded-tr-none' 
                    : 'bg-slate-700/50 text-slate-200 border border-slate-600 rounded-tl-none'
                }`}>
                  <div className="prose prose-invert prose-sm max-w-none break-words">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        pre: ({node, ...props}) => (
                          <div className="not-prose my-2">
                            <pre className="bg-slate-950 p-3 rounded-lg overflow-x-auto border border-slate-800 text-sm font-mono shadow-inner" {...props} />
                          </div>
                        ),
                        code: ({node, ...props}) => {
                           return <code className="font-mono text-xs font-semibold bg-slate-800 px-1 py-0.5 rounded" {...props} />
                        }
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>
                  <span className="text-[10px] opacity-50 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
             <div className="flex justify-start">
               <div className="flex flex-row">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 mr-3">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-slate-700/50 p-4 rounded-2xl rounded-tl-none border border-slate-600 flex items-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-slate-700 bg-slate-800">
          <div className="relative flex items-center">
            <input
              type="text"
              className="w-full bg-slate-900 text-white rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-700 placeholder-slate-500 shadow-inner"
              placeholder={`Ask about ${project.name} scaling...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`absolute right-2 p-1.5 rounded-md transition-colors ${
                isLoading || !input.trim() ? 'text-slate-600' : 'text-blue-500 hover:bg-blue-500/10'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
    