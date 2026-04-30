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
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || '');
  const [botEnabled, setBotEnabled] = useState(true);
  const [voice, setVoice] = useState('Kore');
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [activeChat, setActiveChat] = useState<any>(null);
  const [whatsappMessages, setWhatsappMessages] = useState([
    { id: 1, role: 'user', text: 'Hello, is the doctor available?', time: '10:05 PM', from: '+923001234567' },
    { id: 2, role: 'ai', text: 'Aura here! Dr. Ali is available from 5 PM. Should I book a slot?', time: '10:05 PM' },
    { id: 3, role: 'user', text: 'Yes, please book for 6 PM.', time: '10:06 PM', from: '+923001234567' },
  ]);
  const [chatList, setChatList] = useState([
    { id: 1, name: 'Rana Rashid', lastMsg: 'Okay', time: '6:29 PM', unread: 1, phone: '+923001234567' },
    { id: 2, name: '//Hammid', lastMsg: 'Voice call', time: '6:26 PM', unread: 0, phone: '+923123456789' },
    { id: 3, name: 'Abbas', lastMsg: 'Oi', time: '6:26 PM', unread: 0, phone: '+923214567890' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [recipientNumber, setRecipientNumber] = useState('');
  const [isSending, setIsSending] = useState(false);

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

  const handleSendWhatsApp = async () => {
    if (!chatInput || !recipientNumber) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: recipientNumber, text: chatInput })
      });
      if (res.ok) {
        setWhatsappMessages(prev => [...prev, { 
          id: Date.now(), 
          role: 'ai', 
          text: chatInput, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }]);
        setChatInput('');
      }
    } catch (err) {
      console.error("Failed to send message", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020202] text-[#e0e0e0] font-sans selection:bg-orange-500/30 flex relative overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-20 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center py-8 z-50">
        <div className="w-10 h-10 rounded bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,1)] rotate-45 mb-12 flex items-center justify-center">
          <div className="rotate-[-45deg] font-black text-black text-xl">A</div>
        </div>
        
        <div className="flex-1 flex flex-col gap-8">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-orange-500 text-black shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'text-[#444] hover:text-orange-500/60'}`}
          >
            <Cpu className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'history' ? 'bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'text-[#444] hover:text-cyan-500/60'}`}
          >
            <MessageSquare className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white/10 text-white' : 'text-[#444] hover:text-white/60'}`}
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-[#666]" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Robotic Background Elements */}
        <div className="fixed inset-0 circuit-pattern pointer-events-none"></div>
        <div className="scanline pointer-events-none"></div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 max-w-[1600px] mx-auto w-full space-y-8"
              >
                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                  <div>
                    <h1 className="text-xl font-black tracking-[0.5em] uppercase text-white">NEURAL CORE DASHBOARD</h1>
                    <p className="text-[10px] text-[#555] font-mono uppercase tracking-widest mt-1">Status: Operational // Link: Secure</p>
                  </div>
                  <div className="px-4 py-2 rounded bg-orange-500/5 border border-orange-500/20 text-[10px] text-orange-500 font-black uppercase tracking-widest animate-pulse">
                    Core Live
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* BOX 1: Session Control */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl min-h-[200px] flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <h3 className="text-[10px] uppercase font-black text-orange-500 tracking-widest italic">Core Protocol</h3>
                      <Zap className="w-4 h-4 text-orange-500" />
                    </div>
                    <button 
                      onClick={handleToggleCall}
                      className={`w-full py-5 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${
                        isConnected ? 'bg-red-500/10 border border-red-500/50 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-orange-500 text-black shadow-lg shadow-orange-500/20'
                      }`}
                    >
                      {isConnected ? 'Kill Session' : 'Boot Aura'}
                    </button>
                  </div>

                  {/* Intelligence Feed */}
                  <div className="md:col-span-2 p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl h-[200px] flex flex-col overflow-hidden">
                    <h3 className="text-[10px] uppercase font-black text-[#666] tracking-widest mb-4 italic">Neural Logs</h3>
                    <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] text-[#888] custom-scrollbar">
                      {logs.map(log => (
                        <div key={log.id} className="flex gap-4">
                          <span className="opacity-30">[{log.time}]</span>
                          <span className={`font-black uppercase ${log.type === 'ai' ? 'text-orange-500' : 'text-[#444]'}`}>{log.type}</span>
                          <span>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Voice Synthesis */}
                  <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-xl min-h-[200px]">
                    <h3 className="text-[10px] uppercase font-black text-[#666] tracking-widest mb-4">Synthesis</h3>
                    <select 
                      value={voice} 
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded px-3 py-3 text-[10px] text-orange-500/80 outline-none font-mono uppercase tracking-widest cursor-pointer"
                    >
                      <option value="Kore">Kore_Synthesis</option>
                      <option value="Zephyr">Zephyr_Modern</option>
                      <option value="Charon">Charon_V3</option>
                    </select>
                  </div>
                </div>

                {/* Big Live Intelligence Stream */}
                <div className="rounded-2xl bg-black/60 border border-white/10 backdrop-blur-3xl overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col">
                  <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white italic">Live Intelligence Stream</h2>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-orange-500 animate-ping' : 'bg-[#333]'}`}></div>
                      <span className="text-[9px] uppercase font-black text-[#666]">Neural Connection Status</span>
                    </div>
                  </div>
                  <div className="flex-1 p-10 overflow-y-auto space-y-8 custom-scrollbar">
                    {transcriptions.length === 0 && !isConnected && (
                      <div className="h-full flex flex-col items-center justify-center opacity-10 py-20 italic text-center">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-orange-500/50 animate-spin-slow mb-6 mx-auto"></div>
                        <p className="text-xs tracking-[0.5em] uppercase font-black text-orange-500">Awaiting Connection</p>
                      </div>
                    )}
                    {transcriptions.map((t, i) => (
                      <div key={i} className={`flex flex-col ${t.role === 'model' ? 'items-start' : 'items-end'}`}>
                        <div className={`max-w-[75%] p-6 rounded-2xl font-mono text-xs ${
                          t.role === 'model' ? 'bg-orange-500/5 border-l-4 border-orange-500 text-orange-50 shadow-2xl' : 'bg-white/5 border-r-4 border-white/20 text-[#ccc]'
                        }`}>
                          {t.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'history' && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex h-full bg-[#0b141a]"
              >
                {/* WhatsApp UI Sidebar */}
                <div className="w-[400px] border-r border-white/5 bg-[#111b21] flex flex-col shadow-2xl">
                   <div className="p-6 bg-[#202c33] flex items-center justify-between">
                      <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#e9edef]">Neural Archive</h2>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#8696a0]" />
                      </div>
                   </div>
                   <div className="p-4">
                      <input type="text" placeholder="Search Encrypted History" className="w-full bg-[#202c33] rounded-xl px-4 py-3 text-xs text-[#d1d7db] outline-none border border-white/5" />
                   </div>
                   <div className="flex-1 overflow-y-auto custom-scrollbar">
                      {chatList.map(chat => (
                        <div 
                          key={chat.id} 
                          onClick={() => {
                            setActiveChat(chat);
                            setRecipientNumber(chat.phone);
                          }}
                          className={`p-6 flex gap-4 cursor-pointer hover:bg-[#2a3942] transition-all border-b border-white/5 ${activeChat?.id === chat.id ? 'bg-[#2a3942]' : ''}`}
                        >
                           <div className="w-14 h-14 rounded-full bg-[#333] flex items-center justify-center font-bold text-white text-xl uppercase shadow-lg border-2 border-white/5">{chat.name[0]}</div>
                           <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                 <p className="text-sm font-bold text-[#e9edef] truncate">{chat.name}</p>
                                 <span className="text-[10px] text-[#8696a0] font-mono">{chat.time}</span>
                              </div>
                              <p className="text-xs text-[#8696a0] truncate italic opacity-60">{chat.lastMsg}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Main Chat Window */}
                <div className="flex-1 flex flex-col bg-[#0b141a] relative">
                  {activeChat ? (
                    <>
                      <div className="p-5 bg-[#202c33] flex items-center gap-4 border-l border-white/5 shadow-md z-10">
                         <div className="w-12 h-12 rounded-full bg-[#333] flex items-center justify-center font-bold text-white uppercase border-2 border-white/5 shadow-inner">{activeChat.name[0]}</div>
                         <div>
                            <h3 className="text-sm font-bold text-[#e9edef]">{activeChat.name}</h3>
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                               <p className="text-[9px] text-emerald-500/80 uppercase tracking-widest font-black">AI Auto-Pilot Active</p>
                            </div>
                         </div>
                      </div>
                      <div className="flex-1 p-10 overflow-y-auto space-y-6 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-80 custom-scrollbar">
                         {whatsappMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                               <div className={`max-w-[65%] p-5 rounded-2xl shadow-2xl relative ${msg.role === 'user' ? 'bg-[#202c33] text-[#e9edef] rounded-tl-none border-l-2 border-white/10' : 'bg-[#005c4b] text-[#e9edef] rounded-tr-none border-r-2 border-emerald-400/30'}`}>
                                  <p className="text-sm leading-relaxed">{msg.text}</p>
                                  <div className="flex justify-end items-center gap-2 mt-3 opacity-40">
                                     <span className="text-[9px] font-mono uppercase">{msg.time}</span>
                                     {msg.role !== 'user' && <Zap className="w-2 h-2 text-cyan-400" />}
                                  </div>
                               </div>
                            </div>
                         ))}
                      </div>
                      <div className="p-6 bg-[#202c33] flex gap-4 items-center border-t border-white/5">
                         <input 
                           type="text" 
                           placeholder="Enter Neural Override command..." 
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleSendWhatsApp()}
                           className="flex-1 bg-[#2a3942] rounded-2xl px-8 py-5 text-sm text-[#d1d7db] outline-none border border-white/5 focus:border-cyan-500/30 transition-all" 
                         />
                         <button onClick={handleSendWhatsApp} className="p-5 bg-[#00a884] rounded-full text-black hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20">
                            <Zap className="w-6 h-6 fill-current" />
                         </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-10 grayscale p-20 text-center">
                       <div className="w-32 h-32 rounded-full border-4 border-dashed border-white/20 animate-spin-slow mb-12"></div>
                       <h3 className="text-xl font-black uppercase tracking-[1em] text-white">Neural Archive</h3>
                       <p className="text-xs uppercase tracking-[0.5em] mt-4">Select an established link to view historical data</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-20 max-w-4xl mx-auto w-full space-y-12"
              >
                <div className="flex items-center gap-6 mb-10">
                   <div className="w-12 h-12 rounded bg-white/5 flex items-center justify-center">
                      <Settings className="w-6 h-6 text-[#444]" />
                   </div>
                   <h1 className="text-3xl font-black uppercase tracking-[0.4em] text-white">Core Configuration</h1>
                </div>

                <div className="space-y-10">
                   <div className="bg-white/[0.02] p-10 rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl">
                      <p className="text-[10px] text-orange-500 font-black uppercase tracking-[0.5em] mb-6 italic">Neural API Encryption</p>
                      <input 
                        type="password" 
                        value={apiKey} 
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded-2xl px-8 py-6 text-sm text-white/50 outline-none font-mono focus:border-orange-500/50 transition-all" 
                        placeholder="ENCRYPTED_KEY_STREAM" 
                      />
                      <div className="mt-8 flex items-center gap-4 text-[9px] text-[#555] font-bold uppercase tracking-widest">
                         <Shield className="w-4 h-4 text-emerald-500" />
                         Encryption Mode: AES-256-GCM Secure
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                         <p className="text-[10px] text-[#444] font-black uppercase tracking-widest mb-4">Storage Node</p>
                         <p className="text-xs font-mono text-emerald-500">NEON_DB_PROD_01</p>
                      </div>
                      <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                         <p className="text-[10px] text-[#444] font-black uppercase tracking-widest mb-4">Voice Engine</p>
                         <p className="text-xs font-mono text-cyan-500">GEMINI_LIVE_SYNTH</p>
                      </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(249, 115, 22, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(249, 115, 22, 0.3);
        }
      `}</style>
    </div>
  );
}
