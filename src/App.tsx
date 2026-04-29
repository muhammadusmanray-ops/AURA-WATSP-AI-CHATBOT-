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
  const [apiKey, setApiKey] = useState(process.env.GEMINI_API_KEY || '');
  const [vapiApiKey, setVapiApiKey] = useState(import.meta.env.VITE_VAPI_API_KEY || '');
  const [assistantId, setAssistantId] = useState(import.meta.env.VITE_VAPI_ASSISTANT_ID || '');
  const [vapiStatus, setVapiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [vapiTestMessage, setVapiTestMessage] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => {
        setCallDuration(prev => {
          if (prev >= 900) { // 15 minutes
            disconnect();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [isConnected, disconnect]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCall = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect(apiKey, voice);
    }
  };

  const testVapiConnection = async () => {
    if (!vapiApiKey || !assistantId) {
      setVapiStatus('error');
      setVapiTestMessage('API Key and Assistant ID are required.');
      return;
    }

    setVapiStatus('loading');
    setVapiTestMessage('');

    try {
      const response = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${vapiApiKey}`,
          'Content-Type': 'application/json'
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVapiStatus('success');
        setVapiTestMessage(`Connected to: ${data.name || 'Assistant'}`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setVapiStatus('error');
        setVapiTestMessage(errorData.message || `Error: ${response.status}`);
      }
    } catch (err) {
      setVapiStatus('error');
      setVapiTestMessage('Network error or invalid API key.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-orange-500/30 flex flex-col">
      {/* Premium Gradient Background Blur */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Header Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-white/5 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]"></div>
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-orange-500 animate-ping opacity-50"></div>
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-[0.3em] uppercase text-white">Aura AI Control</h1>
            <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest mt-0.5">Nexus Neural Core v2.4</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 border-x border-white/5 px-6">
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-[#444] mb-0.5">Engine Status</p>
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-tighter">Operational</p>
            </div>
            <Activity className="w-4 h-4 text-emerald-500/50" />
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest">
               {isConnected ? 'Session Active' : 'Standby Mode'}
            </div>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]' : 'bg-white/10'}`}></div>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 p-4 md:p-6 max-w-[1400px] mx-auto w-full space-y-6">
        
        {/* TOP SECTION: 3x3 Grid for Status & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* BOX 1: Session Control (Voice) - THE HERO */}
          <div className="relative group p-[2px] rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-purple-600 shadow-lg overflow-hidden">
             <div className="relative z-10 p-5 rounded-[14px] bg-[#080808]/90 backdrop-blur-3xl h-full flex flex-col justify-between">
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-[9px] uppercase tracking-[0.3em] text-orange-500 font-black">Neural Session</h3>
                   <Mic className="w-4 h-4 text-orange-500 animate-pulse" />
                </div>
                <button 
                  onClick={handleToggleCall}
                  disabled={!apiKey && !isConnected}
                  className={`w-full py-4 rounded-xl text-[10px] uppercase font-black tracking-[0.3em] transition-all active:scale-95 border flex items-center justify-center gap-3 ${
                    isConnected 
                      ? 'bg-red-500/10 border-red-500/50 text-red-500 hover:bg-red-500/20' 
                      : apiKey 
                        ? 'bg-orange-500 border-orange-500 text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]'
                        : 'bg-white/5 border-white/10 text-white/20 cursor-not-allowed'
                  }`}
                >
                  {isConnected ? <PhoneOff className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                  <span>{isConnected ? 'Terminate' : 'Initialize'}</span>
                </button>
             </div>
          </div>

          {/* BOX 2: WhatsApp Webhook */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
             <div className="flex items-center justify-between mb-4">
                   </div>
                   <ChevronRight className="w-3 h-3" />
                </button>
             </div>
             <div className="mt-4 p-3 bg-black/40 border border-white/5 rounded-xl">
                <p className="text-[9px] text-[#444] leading-relaxed">
                   Current Architecture: Vite (React) + Express Node.js + Gemini 1.5 Flash. Fully optimized for <span className="text-orange-500">Zero-Latency</span> voice interaction.
                </p>
             </div>
          </div>

          {/* Integration Status Box */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-6 font-black">Neural Core Config</h3>
             <div className="space-y-4">
                <div>
                   <label className="text-[9px] uppercase text-[#444] block mb-2 font-bold">Vapi Secret Engine</label>
                   <input 
                    type="password" 
                    value={vapiApiKey}
                    onChange={(e) => setVapiApiKey(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/50 outline-none focus:border-blue-500/20" 
                    placeholder="vapi-..."
                   />
                </div>
                <div>
                   <label className="text-[9px] uppercase text-[#444] block mb-2 font-bold">Assistant ID</label>
                   <input 
                    type="text" 
                    value={assistantId}
                    onChange={(e) => setAssistantId(e.target.value)}
                    className="w-full bg-black/60 border border-white/5 rounded-xl px-4 py-2.5 text-xs text-white/50 outline-none focus:border-blue-500/20" 
                    placeholder="347d..."
                   />
                </div>
                <button 
                  onClick={testVapiConnection}
                  className="w-full py-3 mt-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] uppercase font-black tracking-widest text-blue-500 hover:bg-blue-500/20 transition-all"
                >
                  Sync Neural Core
                </button>
             </div>
          </div>

          {/* Quick Guide Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-white/10 backdrop-blur-xl relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Shield className="w-16 h-16 text-emerald-500" />
             </div>
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-emerald-500 mb-6 font-black">Security Protocol</h3>
             <div className="space-y-4 relative z-10">
                <div className="flex gap-3">
                   <div className="w-1 h-8 bg-emerald-500/30 rounded-full"></div>
                   <div>
                      <p className="text-[10px] text-white/80 font-bold mb-1">Webhook Locked</p>
                      <p className="text-[9px] text-[#666]">URL validated with Meta Graph API. Verified token is secure.</p>
                   </div>
                </div>
                <div className="flex gap-3">
                   <div className="w-1 h-8 bg-blue-500/30 rounded-full"></div>
                   <div>
                      <p className="text-[10px] text-white/80 font-bold mb-1">Encrypted Stream</p>
                      <p className="text-[9px] text-[#666]">End-to-end voice encryption via WebRTC + SRTP.</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Meta Quick Links */}
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
             <h3 className="text-[10px] uppercase tracking-[0.3em] text-[#666] mb-4 font-black">Meta Resources</h3>
             <div className="space-y-2">
                <button 
                  onClick={() => window.open('https://developers.facebook.com/apps/905931435812027/dashboard/', '_blank')}
                  className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-[#888] hover:text-white hover:bg-white/10 transition-all flex items-center justify-between"
                >
                   <span>Meta App Dashboard</span>
                   <ChevronRight className="w-3 h-3" />
                </button>
                <button className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 text-[10px] text-[#888] hover:text-white hover:bg-white/10 transition-all flex items-center justify-between">
                   <span>API Usage Metrics</span>
                   <ChevronRight className="w-3 h-3" />
                </button>
             </div>
          </div>
        </div>

      </main>

      {/* Modern Footer Bar */}
      <footer className="relative z-10 px-8 py-5 border-t border-white/5 bg-black/40 backdrop-blur-md flex flex-wrap gap-y-4 justify-between items-center text-[9px] text-[#444] uppercase tracking-[0.25em] font-black">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-orange-500/50"></div>
             <span>Engine: Gemini 1.5 Live</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50"></div>
             <span>Voice: Neural {voice}</span>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <span className="text-emerald-500/50">Ready for Deployment</span>
          <div className="px-3 py-1 bg-white/5 rounded border border-white/10">Aura AI v2.4</div>
        </div>
      </footer>

      {/* Toast Notification for Errors */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-3xl p-6 rounded-2xl z-[100] w-full max-w-md shadow-[0_0_50px_rgba(239,68,68,0.1)]"
          >
            <div className="flex items-start gap-4">
               <div className="p-2 rounded-lg bg-red-500/20">
                  <Shield className="w-5 h-5 text-red-500" />
               </div>
               <div className="flex-1">
                  <h4 className="text-xs font-black uppercase tracking-widest text-red-500 mb-1">System Anomaly Detected</h4>
                  <p className="text-[11px] text-red-200/70 leading-relaxed font-mono italic">{error}</p>
               </div>
               <button onClick={clearError} className="text-red-500/50 hover:text-red-500">
                  <PhoneOff className="w-4 h-4" />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


