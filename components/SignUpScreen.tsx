
import React, { useState } from 'react';
import { Server, ArrowRight, Github } from 'lucide-react';
import { User, Page } from '../types';
import { authService } from '../services/mockBackend';

interface SignUpScreenProps {
  onLogin: (user: User) => void;
  onNavigate: (page: Page) => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onLogin, onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { user } = await authService.signup(name, email, password);
      onLogin(user);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 cursor-pointer" onClick={() => onNavigate(Page.LANDING)}>
          <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/30">
            <Server className="w-8 h-8 text-white" />
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
            <p className="text-slate-400">Start automating your deployments today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Create a strong password"
                required
              />
            </div>

            <div className="flex items-center">
              <input id="terms" type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500" required />
              <label htmlFor="terms" className="ml-2 text-sm text-slate-400">
                I agree to the <a href="#" className="text-blue-400 hover:underline">Terms</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Get Started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-slate-800"></div>
            <span className="px-4 text-xs text-slate-500 uppercase tracking-wider">Or</span>
            <div className="flex-1 border-t border-slate-800"></div>
          </div>

          <button type="button" className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center space-x-2">
            <Github className="w-5 h-5" />
            <span>Sign up with GitHub</span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account? <button onClick={() => onNavigate(Page.LOGIN)} className="text-blue-400 hover:text-blue-300 font-medium">Log in</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
