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
  Cpu
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
    { id: 2, type: 'whatsapp', text: 'WhatsApp Gateway Online ✅', time: '10:00:05' },
    { id: 3, type: 'ai', text: 'Aura Protocol v4.5 Active', time: '10:00:10' },
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-orange-500/30 flex flex-col relative">
      {/* Robotic Background Elements */}
      <div className="fixed inset-0 circuit-pattern pointer-events-none"></div>
      <div className="scanline pointer-events-none"></div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 rounded bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,1)] rotate-45"></div>
            <div className="absolute inset-0 w-3 h-3 rounded bg-orange-500 animate-ping opacity-40 rotate-45"></div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.5em] uppercase text-white">AURA NEURAL CORE</h1>
            <p className="text-[9px] text-[#555] font-mono uppercase tracking-widest mt-1">Autonomous Robotic Interface v4.5</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
            <div className="text-[9px] font-mono text-orange-500/60 uppercase tracking-[0.3em] flex items-center gap-2 text-right">
               <Shield className="w-3 h-3 ml-auto" />
               SECURE NEURAL LINK ACTIVE
            </div>
        </div>
      </nav>

      <main className="relative z-10 p-4 md:p-6 max-w-[1600px] mx-auto w-full space-y-6">
        
        {/* 3x3 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          
          {/* BOX 1: Session Control */}
          <div className="relative group p-[1px] rounded-xl bg-gradient-to-br from-orange-500 via-orange-900 to-black shadow-2xl overflow-hidden">
             <div className="relative z-10 p-5 rounded-[10px] bg-[#050505]/95 backdrop-blur-3xl h-full flex flex-col justify-between min-h-[180px]">
                <div className="flex items-center justify-between mb-4 border-b border-orange-500/10 pb-4">
                   <h3 className="text-[9px] uppercase tracking-[0.4em] text-orange-500 font-black italic">Initialize Core</h3>
                   <Zap className="w-4 h-4 text-orange-500" />
                </div>
                <button 
                  onClick={handleToggleCall}
                  className={`w-full py-5 rounded-lg text-[11px] uppercase font-black tracking-[0.4em] transition-all active:scale-95 border flex items-center justify-center gap-4 ${
                    isConnected 
                      ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
                      : 'bg-orange-500 border-orange-500 text-black hover:shadow-[0_0_30px_rgba(249,115,22,0.6)]'
                  }`}
                >
                  {isConnected ? <PhoneOff className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                  <span>{isConnected ? 'Kill Task' : 'Boot Aura'}</span>
                </button>
             </div>
          </div>

          {/* BOX 2: Intelligence Feed (Middle Large Box) */}
          <div className="md:col-span-2 p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl h-[180px] flex flex-col">
             <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-orange-500 font-black italic">Intelligence Feed</h3>
                <Terminal className="w-3 h-3 text-orange-500/50" />
             </div>
             <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] custom-scrollbar">
                {logs.map((log) => (
                  <div key={log.id} className="flex gap-4">
                    <span className="text-[#333]">[{log.time}]</span>
                    <span className={`uppercase font-black ${log.type === 'ai' ? 'text-orange-500' : 'text-[#666]'}`}>{log.type}</span>
                    <span className="text-[#888]">{log.text}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
             </div>
          </div>

          {/* BOX 3: Voice Profile (The ones you wanted back) */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl min-h-[180px]">
             <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] mb-4 font-black">Voice Synthesis</h3>
             <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-orange-500/80 outline-none font-mono uppercase tracking-widest cursor-pointer mb-4"
              >
                <option value="Kore">Kore_Synthesis</option>
                <option value="Zephyr">Zephyr_Modern</option>
                <option value="Charon">Charon_V3</option>
              </select>
              <div className="p-2 rounded bg-orange-500/5 border border-orange-500/10 text-[8px] text-orange-400 font-bold uppercase tracking-widest text-center">
                 Neural Engine Active
              </div>
          </div>

          {/* BOX 4: WhatsApp Bot Control */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col justify-between min-h-[160px]">
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] font-black">Meta Automata</h3>
                <div className={`w-2 h-2 rounded ${botEnabled ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`}></div>
             </div>
             <p className="text-[10px] text-[#444] font-mono leading-relaxed">Auto-Pilot Status: <span className={botEnabled ? 'text-emerald-500' : 'text-red-500'}>{botEnabled ? 'ENABLED' : 'STALLED'}</span></p>
             <button 
               onClick={() => setBotEnabled(!botEnabled)}
               className="w-full py-2.5 rounded bg-white/5 border border-white/10 text-[9px] uppercase font-black tracking-widest hover:bg-white/10 transition-all"
             >
               Toggle Logic
             </button>
          </div>

          {/* BOX 5: Diagnostic & Performance */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl min-h-[160px]">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] font-black">Diagnostic</h3>
               <Activity className="w-4 h-4 text-orange-500/50" />
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-[8px] uppercase text-[#333] font-bold tracking-tighter">Core Uptime</p>
                  <p className="text-xs font-mono text-white/90 italic">{formatTime(callDuration)}</p>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <p className="text-[8px] uppercase text-[#333] font-bold tracking-tighter">Sync Latency</p>
                  <p className="text-xs font-mono text-cyan-500">24.2ms</p>
               </div>
            </div>
          </div>

          {/* BOX 6: Memory Banks (The ones you wanted back) */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl min-h-[160px]">
             <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] mb-4 font-black">Memory Banks</h3>
             <div className="flex flex-col gap-2">
                <div className="w-full p-2.5 rounded bg-white/5 border border-white/5 text-[9px] text-[#888] flex items-center justify-between font-mono uppercase">
                   <span>System_Core.ts</span>
                   <Shield className="w-3 h-3 opacity-20" />
                </div>
                <div className="w-full p-2.5 rounded bg-white/5 border border-white/5 text-[9px] text-[#888] flex items-center justify-between font-mono uppercase">
                   <span>Neural_API.json</span>
                   <Shield className="w-3 h-3 opacity-20" />
                </div>
             </div>
          </div>

          {/* BOX 7: Encryption Key */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl flex flex-col justify-between min-h-[160px]">
             <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] font-black mb-4">Neural Key</h3>
             <input 
               type="password" 
               value={apiKey} 
               onChange={(e) => setApiKey(e.target.value)}
               className="w-full bg-black/60 border border-white/10 rounded px-3 py-3 text-[10px] text-white/40 outline-none font-mono" 
               placeholder="ENCRYPTED_KEY" 
             />
             <p className="text-[7px] text-[#333] mt-3 uppercase tracking-widest font-black">RSA-4096 Secure Link Active</p>
          </div>

        </div>

        {/* Bottom Section: Live Neural Output (Bari window) */}
        <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl flex flex-col overflow-hidden min-h-[400px] shadow-2xl relative">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/20 via-orange-500/50 to-orange-500/20"></div>
           
           <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    <div className="absolute inset-0 bg-orange-500 blur-md opacity-30"></div>
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white">Live Neural Output (Voice & Text)</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[8px] uppercase tracking-[0.2em] font-black text-orange-500">Live Transmission</div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar min-h-[300px]">
              {transcriptions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 italic text-center">
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-orange-500/50 animate-spin-slow mb-6 mx-auto"></div>
                   <p className="text-xs tracking-[0.5em] uppercase font-black text-orange-500">Awaiting Connection</p>
                </div>
              )}
              <AnimatePresence initial={false}>
                {transcriptions.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${t.role === 'model' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[70%] p-5 rounded-xl font-mono text-[11px] ${t.role === 'model' ? 'bg-orange-500/5 border-l-2 border-orange-500 text-orange-50 shadow-xl' : 'bg-white/5 border-r-2 border-white/20 text-[#ccc]'}`}>
                       <p className="leading-relaxed whitespace-pre-wrap">{t.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#444] italic">{t.role === 'model' ? 'Aura_Core' : 'User_Node'}</span>
                       <div className={`w-1 h-1 rounded-full ${t.role === 'model' ? 'bg-orange-500' : 'bg-[#666]'}`}></div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </div>

      </main>

      {/* Footer Bar */}
      <footer className="px-10 py-5 border-t border-white/5 bg-black/60 flex justify-between items-center text-[9px] text-[#333] uppercase tracking-[0.5em] font-black">
         <div className="flex items-center gap-6">
            <span className="text-orange-500/50">Core: Gemini_1.5_Flash</span>
            <span className="text-cyan-500/50 italic tracking-widest">Protocol v4.5 Finalized</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded bg-orange-500/20"></div>
            <span>Status: Operational</span>
         </div>
      </footer>

      <style>{`
        .circuit-pattern {
          background-image: radial-gradient(rgba(249, 115, 22, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to bottom, transparent 50%, rgba(249, 115, 22, 0.02) 50%);
          background-size: 100% 4px;
          z-index: 5;
          pointer-events: none;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
