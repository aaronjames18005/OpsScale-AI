import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MetricPoint } from '../types';

export const Monitoring: React.FC = () => {
  const [data, setData] = useState<MetricPoint[]>([]);

  // Simulate real-time data
  useEffect(() => {
    const generateInitialData = () => {
      const points: MetricPoint[] = [];
      const now = new Date();
      for (let i = 20; i >= 0; i--) {
        points.push({
          time: new Date(now.getTime() - i * 60000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          cpu: 40 + Math.random() * 30,
          memory: 50 + Math.random() * 20,
          latency: 30 + Math.random() * 50,
        });
      }
      return points;
    };

    setData(generateInitialData());

    const interval = setInterval(() => {
      setData(prev => {
        const newPoint = {
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          cpu: 40 + Math.random() * 40, // Simulating some spikes
          memory: 50 + Math.random() * 25,
          latency: 30 + Math.random() * 80,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">System Monitoring</h2>
        <div className="flex space-x-2">
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Resource Usage (CPU & Memory)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMem" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#f1f5f9' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" name="CPU Usage" />
                <Area type="monotone" dataKey="memory" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorMem)" name="Memory Usage" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Request Latency</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorLat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} unit="ms" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px', color: '#f1f5f9' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Area type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLat)" name="Latency (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Auto-Scaling Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="bg-slate-900 text-slate-200 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3 rounded-tl-lg">Time</th>
                <th className="px-4 py-3">Event Type</th>
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">Trigger</th>
                <th className="px-4 py-3 rounded-tr-lg">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              <tr className="hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3">Today, 14:32</td>
                <td className="px-4 py-3 text-green-400 font-medium">Scale Out</td>
                <td className="px-4 py-3">web-server-group</td>
                <td className="px-4 py-3">CPU &gt; 70% for 5m</td>
                <td className="px-4 py-3">+2 Instances</td>
              </tr>
              <tr className="hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3">Today, 09:15</td>
                <td className="px-4 py-3 text-yellow-400 font-medium">Scale In</td>
                <td className="px-4 py-3">web-server-group</td>
                <td className="px-4 py-3">CPU &lt; 30% for 15m</td>
                <td className="px-4 py-3">-1 Instance</td>
              </tr>
              <tr className="hover:bg-slate-700/50 transition-colors">
                <td className="px-4 py-3">Yesterday, 22:00</td>
                <td className="px-4 py-3 text-green-400 font-medium">Scale Out</td>
                <td className="px-4 py-3">worker-node-group</td>
                <td className="px-4 py-3">Queue Depth &gt; 1000</td>
                <td className="px-4 py-3">+4 Instances</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};