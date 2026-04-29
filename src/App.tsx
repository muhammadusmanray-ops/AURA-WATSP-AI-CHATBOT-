import { useState, useEffect } from 'react';
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
  Volume2
} from 'lucide-react';
import { useAura } from './hooks/useAura';

export default function App() {
  const { isConnected, transcriptions, error, micVolume, connect, disconnect, clearError } = useAura();
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [vapiApiKey, setVapiApiKey] = useState(import.meta.env.VITE_VAPI_API_KEY || '');
  const [assistantId, setAssistantId] = useState(import.meta.env.VITE_VAPI_ASSISTANT_ID || '');
  const [voice, setVoice] = useState('Kore');
  const [callDuration, setCallDuration] = useState(0);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCall = () => {
    if (isConnected) disconnect();
    else connect(apiKey, voice);
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-orange-500/30 flex flex-col relative overflow-hidden">
      {/* Robotic Background Elements */}
      <div className="fixed inset-0 circuit-pattern pointer-events-none"></div>
      <div className="scanline pointer-events-none"></div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[150px]"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-3 h-3 rounded bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,1)] rotate-45"></div>
            <div className="absolute inset-0 w-3 h-3 rounded bg-orange-500 animate-ping opacity-40 rotate-45"></div>
          </div>
          <div>
            <h1 className="text-sm font-black tracking-[0.5em] uppercase text-white">AURA NEURAL CORE</h1>
            <p className="text-[9px] text-[#555] font-mono uppercase tracking-widest mt-1">Autonomous Robotic Interface v2.4</p>
          </div>
        </div>
        <div className="flex gap-6 items-center">
            <div className="text-[9px] font-mono text-orange-500/60 uppercase tracking-[0.3em] flex items-center gap-2">
               <Shield className="w-3 h-3" />
               SECURE NEURAL LINK
            </div>
            <div className={`w-1.5 h-6 ${isConnected ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'bg-white/10'} transition-all`}></div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 p-4 md:p-6 max-w-[1400px] mx-auto w-full space-y-6">
        
        {/* TOP SECTION: 3x3 Robotic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* BOX 1: Session Control (Voice Hero) */}
          <div className="relative group p-[1px] rounded-xl bg-gradient-to-br from-orange-500 via-orange-900 to-black shadow-2xl overflow-hidden">
             <div className="relative z-10 p-5 rounded-[10px] bg-[#050505]/95 backdrop-blur-3xl h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4 border-b border-orange-500/10 pb-4">
                   <h3 className="text-[9px] uppercase tracking-[0.4em] text-orange-500 font-black italic">Initialize Core</h3>
                   <Activity className="w-4 h-4 text-orange-500" />
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

          {/* BOX 2: WhatsApp Neural Stream */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-5">
                <MessageSquare className="w-20 h-20" />
             </div>
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] font-black">Meta Stream</h3>
                <div className="w-2 h-2 rounded bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
             </div>
             <p className="text-[10px] text-[#444] mb-4 font-mono leading-relaxed">Incoming packets: 1.2MB/s. Webhook active on Vercel Node Engine.</p>
             <div className="flex justify-between items-center text-[8px] font-black tracking-widest text-emerald-500/50 uppercase italic">
                <span>Status: Stabilized</span>
                <span>v21.0</span>
             </div>
          </div>

          {/* BOX 3: Neural Performance */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] font-black">Diagnostic</h3>
               <Clock className="w-4 h-4 text-orange-500/50" />
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                  <p className="text-[8px] uppercase text-[#333] font-bold tracking-tighter">Uptime</p>
                  <p className="text-sm font-mono text-white/90 italic">{formatTime(callDuration)}</p>
               </div>
               <div className="flex justify-between items-center pt-2 border-t border-white/5">
                  <p className="text-[8px] uppercase text-[#333] font-bold tracking-tighter">Latency</p>
                  <p className="text-sm font-mono text-cyan-500">124.8ms</p>
               </div>
            </div>
          </div>

          {/* BOX 4: Neural Voice Profile */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
             <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] mb-4 font-black">Voice Profile</h3>
             <select 
                value={voice} 
                onChange={(e) => setVoice(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-3 text-[10px] text-orange-500/80 outline-none font-mono uppercase tracking-widest cursor-pointer"
              >
                <option value="Kore">Kore_Synthesis</option>
                <option value="Zephyr">Zephyr_Modern</option>
                <option value="Charon">Charon_V3</option>
              </select>
          </div>

          {/* BOX 5: System Files */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
             <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] mb-4 font-black">Memory Banks</h3>
             <div className="flex flex-col gap-2">
                <button onClick={() => window.open('https://github.com', '_blank')} className="w-full p-2.5 rounded bg-white/5 border border-white/5 text-[9px] text-[#888] hover:text-white flex items-center justify-between transition-all group font-mono uppercase">
                   <span>System_Core.ts</span>
                   <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button onClick={() => window.open('https://github.com', '_blank')} className="w-full p-2.5 rounded bg-white/5 border border-white/5 text-[9px] text-[#888] hover:text-white flex items-center justify-between transition-all group font-mono uppercase">
                   <span>Neural_API.json</span>
                   <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
             </div>
          </div>

          {/* BOX 6: Core Encryption */}
          <div className="p-5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
             <h3 className="text-[9px] uppercase tracking-[0.3em] text-[#666] mb-4 font-black">Neural Key</h3>
             <div className="flex gap-2">
                <input type="password" value={vapiApiKey} onChange={(e) => setVapiApiKey(e.target.value)} className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-[9px] text-white/40 outline-none font-mono" placeholder="ENCRYPTED_KEY" />
                <div className="p-2 rounded bg-orange-500/10 border border-orange-500/20 text-orange-500">
                  <Shield className="w-3 h-3" />
                </div>
             </div>
             <p className="text-[7px] text-[#333] mt-3 uppercase tracking-widest font-black">RSA-4096 Secure Socket Layer Active</p>
          </div>

        </div>

        {/* BOTTOM SECTION: Full-Width Robotic Live Transcript */}
        <div className="flex-1 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl flex flex-col overflow-hidden min-h-[450px] shadow-2xl relative">
           <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500/20 via-orange-500/50 to-orange-500/20"></div>
           
           <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-4">
                 <div className="relative">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
                    <div className="absolute inset-0 bg-orange-500 blur-md opacity-30"></div>
                 </div>
                 <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white">Live Neural Transcription Output</h2>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-[10px] font-mono text-[#444] uppercase tracking-widest">Buffer: 4096kb</div>
                 <div className="px-3 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-[8px] uppercase tracking-[0.2em] font-black text-orange-500">Live Feed</div>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar max-h-[500px]">
              {transcriptions.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 italic">
                   <div className="w-20 h-20 rounded-full border-4 border-dashed border-orange-500/50 animate-spin-slow mb-6"></div>
                   <p className="text-xs tracking-[0.5em] uppercase font-black text-orange-500">Awaiting Neural Connection</p>
                </div>
              )}
              <AnimatePresence initial={false}>
                {transcriptions.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex flex-col ${t.role === 'model' ? 'items-start' : 'items-end'}`}>
                    <div className={`max-w-[70%] p-5 rounded-xl font-mono text-[11px] ${t.role === 'model' ? 'bg-orange-500/5 border-l-2 border-orange-500 text-orange-50 shadow-xl' : 'bg-white/5 border-r-2 border-white/20 text-[#ccc]'}`}>
                       <p className="leading-relaxed whitespace-pre-wrap">{t.text}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#444] italic">{t.role === 'model' ? 'Aura_Unit_01' : 'External_Host'}</span>
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
            <span className="text-cyan-500/50">Engine: Vapi_Neural_Link</span>
         </div>
         <div className="flex items-center gap-4">
            <div className="w-2 h-2 rounded bg-orange-500/20"></div>
            <span>Status: Operational</span>
         </div>
      </footer>

      {/* Error Toast */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl z-[100]">
            <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
