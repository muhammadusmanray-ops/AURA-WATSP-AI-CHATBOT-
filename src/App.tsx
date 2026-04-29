import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Settings, 
  Shield, 
  User, 
  Clock, 
  ChevronRight,
  Activity,
  Mic,
  Volume2,
  Zap,
  Terminal,
  Cpu,
  Globe
} from 'lucide-react';
import { useAura } from './hooks/useAura';

export default function App() {
  const { isConnected, transcriptions, error, micVolume, connect, disconnect, clearError } = useAura();
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [botEnabled, setBotEnabled] = useState(true);
  const [voice, setVoice] = useState('Kore');
  const [callDuration, setCallDuration] = useState(0);
  const [logs, setLogs] = useState([
    { id: 1, type: 'system', text: 'Neural Core Initialized...', time: '10:00:01' },
    { id: 2, type: 'whatsapp', text: 'WhatsApp Gateway Connected ✅', time: '10:00:05' },
    { id: 3, type: 'ai', text: 'Aura AI Protocol Active', time: '10:00:10' },
  ]);

  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleToggleCall = () => {
    if (isConnected) disconnect();
    else connect(apiKey, voice);
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Outfit'] selection:bg-cyan-500/30 overflow-hidden relative">
      {/* ROBOTIC BACKGROUND EFFECTS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute inset-0 border-[20px] border-white/[0.02] pointer-events-none"></div>
        <div className="scanline"></div>
      </div>

      <main className="relative z-10 p-6 max-w-[1400px] mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group">
              <Shield className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter uppercase italic">
                Aura <span className="text-cyan-400">Neural Core</span>
              </h1>
              <div className="flex items-center gap-2 text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                System v4.0.2 Stable
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-[#555] font-black">Link Speed</span>
              <span className="text-xs font-mono text-cyan-400">12ms</span>
            </div>
            <button className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
              <Settings className="w-5 h-5 text-[#888]" />
            </button>
          </div>
        </header>

        {/* 3x3 GRID DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 mb-6 overflow-hidden">
          
          {/* BOX 1: Session Control */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-2xl flex flex-col justify-between group hover:border-cyan-500/30 transition-all">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-black italic">Voice Uplink</h3>
                <Zap className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="mb-8">
                <div className="text-4xl font-mono font-black tracking-tighter mb-1">
                  {isConnected ? formatDuration(callDuration) : "0:00"}
                </div>
                <div className="text-[10px] text-[#444] font-bold uppercase tracking-widest">Neural Stream Active</div>
              </div>
            </div>
            <button 
              onClick={handleToggleCall}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-black uppercase tracking-widest transition-all ${
                isConnected 
                ? 'bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20' 
                : 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-xl shadow-cyan-500/20'
              }`}
            >
              {isConnected ? <PhoneOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
              {isConnected ? 'Kill Uplink' : 'Initiate Core'}
            </button>
          </div>

          {/* BOX 2: Bot Control */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-2xl group hover:border-orange-500/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-black italic">WhatsApp Logic</h3>
                <div className={`w-2 h-2 rounded-full ${botEnabled ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-red-500'}`}></div>
              </div>
              <div className="space-y-4 font-mono text-[10px]">
                <div className="flex items-center justify-between p-3 rounded bg-white/5">
                  <span className="text-[#555] uppercase">Mode</span>
                  <span className="text-orange-400 uppercase font-black">{botEnabled ? 'Auto-Pilot' : 'Standby'}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded bg-white/5">
                  <span className="text-[#555] uppercase">Engine</span>
                  <span className="text-cyan-400 uppercase font-black italic">Gemini 1.5-F</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setBotEnabled(!botEnabled)}
              className={`w-full py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                botEnabled ? 'bg-orange-500/10 border-orange-500/30 text-orange-500' : 'bg-white/5 border-white/10 text-[#888]'
              }`}
            >
              {botEnabled ? 'Disable Bot' : 'Enable Bot'}
            </button>
          </div>

          {/* BOX 3: Neural Performance */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-black italic mb-6">Neural Health</h3>
            <div className="space-y-6">
              {[
                { label: 'CPU STABILITY', value: 28, color: 'bg-cyan-500' },
                { label: 'SYNAPTIC DELAY', value: 12, color: 'bg-orange-500' },
                { label: 'THOUGHT BUFFER', value: 84, color: 'bg-blue-500' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-[#555]">
                    <span>{stat.label}</span>
                    <span className="text-white font-mono">{stat.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      className={`h-full ${stat.color} shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOX 4: Intelligence Feed (Full Height span 2x2) */}
          <div className="md:col-span-2 md:row-span-2 p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex flex-col overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
              <h3 className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-black italic">Intelligence Feed</h3>
              <div className="flex gap-2">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span className="text-[8px] font-black text-cyan-400/50 uppercase tracking-widest">Data Stream Active</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11px] pr-2 custom-scrollbar">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                  <span className="text-[#333] shrink-0 font-black">[{log.time}]</span>
                  <span className={`uppercase font-black shrink-0 w-20 tracking-tighter ${
                    log.type === 'ai' ? 'text-cyan-400' : log.type === 'whatsapp' ? 'text-orange-500' : 'text-[#666]'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-[#888] group-hover:text-white transition-colors leading-relaxed">{log.text}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>

            <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
              <Cpu className="w-4 h-4 text-[#333]" />
              <input 
                type="text" 
                placeholder="ROOT@AURA_CORE:~$ _" 
                className="bg-transparent border-none outline-none text-[10px] font-bold text-[#666] flex-1 placeholder:text-[#333] tracking-[0.2em]"
              />
            </div>
          </div>

          {/* BOX 5: Personality Select */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-2xl group hover:border-indigo-500/30 transition-all">
            <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] font-black italic mb-6">Persona Uplink</h3>
            <div className="space-y-4">
              <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg p-3 text-xs font-black uppercase tracking-widest text-cyan-400 outline-none focus:border-cyan-500/50 appearance-none"
              >
                <option value="Kore">Kore_Synthesis</option>
                <option value="Zephyr">Zephyr_Elite</option>
                <option value="Charon">Charon_Legacy</option>
              </select>
              <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-[9px] text-indigo-400 font-bold leading-relaxed italic">
                AI identity optimized for "Receptionist Mode". Multi-modal Urdu/English blend enabled.
              </div>
            </div>
          </div>

          {/* BOX 6: Network Node */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-2xl group hover:border-green-500/30 transition-all flex flex-col items-center justify-center">
            <div className="relative mb-4">
              <Globe className="w-16 h-16 text-white/5 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-ping opacity-30"></div>
                <div className="absolute w-2 h-2 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,1)]"></div>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">Node v4.2 Active</span>
            <span className="text-[8px] text-[#333] mt-1 font-mono">Location: Karachi/Global</span>
          </div>

        </div>

        {/* FOOTER LIVE STREAM (VOICE) */}
        <div className="h-28 p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-3xl flex items-center gap-8 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-cyan-500/30"></div>
          <div className="flex flex-col items-center shrink-0">
            <Activity className="w-8 h-8 text-cyan-500 mb-2" />
            <span className="text-[8px] font-black text-[#444] uppercase tracking-widest">Brain</span>
          </div>
          <div className="flex-1 flex flex-col justify-center overflow-hidden">
             <div className="flex gap-3 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-2">
                <span className="animate-pulse">Live Neural Stream</span>
                <span className="text-[#333]">|</span>
                <span className="text-[#555] font-mono tracking-tighter">{isConnected ? 'Uplink Established' : 'Awaiting Input...'}</span>
             </div>
             <div className="text-sm font-black text-[#888] truncate italic tracking-tight">
                {transcriptions.length > 0 
                  ? transcriptions[transcriptions.length - 1].text 
                  : "Aura initialized. Standing by for neural transmission via Voice or WhatsApp."
                }
             </div>
          </div>
          {isConnected && (
            <div className="flex items-center gap-3 h-10 pr-4">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, micVolume * 60 + 4, 4] }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.03 }}
                  className="w-1.5 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;400;900&display=swap');
        
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(255, 255, 255, 0.02) 50%);
          background-size: 100% 4px;
          z-index: 5;
          pointer-events: none;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
        
        input::placeholder {
          color: #222;
          font-weight: 900;
        }
      `}</style>
    </div>
  );
}
