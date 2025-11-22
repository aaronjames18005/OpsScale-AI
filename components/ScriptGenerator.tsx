import React, { useState } from 'react';
import { FileCode, Copy, Check, Layers, Settings, Server } from 'lucide-react';
import { generateInfrastructureScript } from '../services/geminiService';
import { ScriptType } from '../types';

export const ScriptGenerator: React.FC = () => {
  const [scriptType, setScriptType] = useState<ScriptType>(ScriptType.DOCKERFILE);
  const [requirements, setRequirements] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!requirements.trim()) return;
    
    setIsGenerating(true);
    setGeneratedCode(''); // Clear previous
    const code = await generateInfrastructureScript(scriptType, requirements);
    setGeneratedCode(code);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 h-full flex flex-col lg:flex-row gap-8">
      {/* Configuration Panel */}
      <div className="lg:w-1/3 flex flex-col space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Script Generator</h2>
          <p className="text-slate-400 text-sm">Use Gemini 3 Pro to generate production-ready Infrastructure as Code.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-6">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Script Type</label>
            <div className="grid grid-cols-1 gap-2">
              {Object.values(ScriptType).map((type) => (
                <button
                  key={type}
                  onClick={() => setScriptType(type)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm transition-all ${
                    scriptType === type
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {type === ScriptType.DOCKERFILE && <Layers className="w-4 h-4 mr-3" />}
                  {type === ScriptType.GITHUB_ACTION && <Settings className="w-4 h-4 mr-3" />}
                  {type === ScriptType.TERRAFORM && <Server className="w-4 h-4 mr-3" />}
                  {type === ScriptType.KUBERNETES && <FileCode className="w-4 h-4 mr-3" />}
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Requirements</label>
            <textarea
              className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-slate-600"
              placeholder={`Describe your needs...\n\nExample: Node.js app with multi-stage build, optimized for production, using Alpine Linux base.`}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !requirements}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center transition-all ${
              isGenerating || !requirements
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-900/30'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <FileCode className="w-5 h-5 mr-2" />
                Generate Script
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Panel */}
      <div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 flex flex-col overflow-hidden relative group">
        <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
          <span className="font-mono text-sm text-slate-300">{scriptType} Preview</span>
          {generatedCode && (
            <button 
              onClick={handleCopy}
              className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-auto p-6">
          {generatedCode ? (
            <pre className="font-mono text-sm text-blue-100 leading-relaxed whitespace-pre-wrap">
              <code>{generatedCode}</code>
            </pre>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600">
              <FileCode className="w-16 h-16 mb-4 opacity-20" />
              <p>Enter requirements and click Generate to see the code here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};