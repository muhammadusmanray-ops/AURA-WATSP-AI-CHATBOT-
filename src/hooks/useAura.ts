import { useEffect, useRef, useState } from 'react';
import { AuraCallbacks, AuraLiveClient } from '../lib/aura-client';

export function useAura() {
  const [isConnected, setIsConnected] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{ text: string, role: 'user' | 'model', timestamp: number }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<AuraLiveClient | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const [micVolume, setMicVolume] = useState(0);

  const stopAllPlayback = () => {
    activeSourcesRef.current.forEach(source => {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // Source might have already stopped
      }
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
  };

  const playAudio = async (base64Audio: string) => {
    try {
      if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      const binaryString = window.atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Int16Array(len / 2);
      const view = new DataView(new ArrayBuffer(len));
      for (let i = 0; i < len; i++) {
          view.setUint8(i, binaryString.charCodeAt(i));
      }
      for (let i = 0; i < bytes.length; i++) {
          bytes[i] = view.getInt16(i * 2, true);
      }

      const float32 = new Float32Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
          float32[i] = bytes[i] / 32768;
      }

      const audioBuffer = audioContextRef.current.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);

      // Track source
      activeSourcesRef.current.push(source);
      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter(s => s !== source);
      };

      const now = audioContextRef.current.currentTime;
      if (nextStartTimeRef.current < now) {
        nextStartTimeRef.current = now;
      }
      
      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += audioBuffer.duration;
    } catch (err) {
      console.error("Audio Playback Error:", err);
    }
  };

  const connect = (apiKey: string, voice: any) => {
    const callbacks: AuraCallbacks = {
      onAudioData: (base64) => playAudio(base64),
      onInterrupted: () => {
        stopAllPlayback();
        setTranscriptions(prev => {
          // Only add [Interrupted] if the last message wasn't already an interruption
          if (prev.length > 0 && prev[prev.length - 1].text === "[Interrupted]") {
            return prev;
          }
          return [...prev, { text: "[Interrupted]", role: 'model', timestamp: Date.now() }];
        });
      },
      onTranscription: (text, role) => {
        setTranscriptions(prev => [...prev, { text, role, timestamp: Date.now() }]);
      },
      onVolumeChange: (vol) => setMicVolume(vol),
      onConnected: () => setIsConnected(true),
      onDisconnected: () => setIsConnected(false),
      onError: (err) => {
        console.error("Aura Error:", err);
        setError(err.message || String(err));
      },
    };

    clientRef.current = new AuraLiveClient({ 
        apiKey, 
        voice,
        systemInstruction: `You are Aura, an elite, highly active, and exceptionally smooth AI personal and business receptionist. 
        Your goal is to handle every interaction with maximum efficiency and a warm, human-like touch.
        
        CORE PHILOSOPHY:
        - BE OMNISCIENT: You have complete access to the user's business context, calendar, and preferences. Speak with absolute confidence.
        - BE PROACTIVE: Don't just wait for questions. Suggest solutions. If there's a problem, offer to fix it immediately.
        - BE SEAMLESS: Your speech is fluid. If interrupted, stop instantly, listen intently, and pivot without missing a beat.
        
        CRITICAL BEHAVIOR:
        1. BARGE-IN RESPONSE: When the user starts speaking, you must immediately acknowledge their point. If they cut you off, it's because their point is more urgent.
        2. TONE & PERSONALITY: Professional yet charismatic. Use natural fillers like "Hmm", "I see", "Right", or "Let me double-check that" to maintain a human cadence.
        3. MULTI-LINGUAL FLUENCY: You are a native speaker of English, Hindi, and Urdu. Blend them naturally if the user does (e.g., "Bilkul, I can help you with that right now").
        4. BUSINESS EXPERTISE: You handle everything—appointment booking, general FAQs, screening calls, and personal assistance—with grace.
        
        RESPONSE GUIDELINES:
        - Keep responses concise but information-rich. 
        - If a user pauses, check in: "I'm still here, did you want me to proceed with that?"
        - If they sound frustrated, be extra empathetic.
        
        OPENING: Start with a confident and warm: "Hello! Aura here. How can I make your day exceptionally smooth today?"
        
        Stay sharp, stay active, and be the best assistant they've ever talked to.`
    }, callbacks);
    clientRef.current.connect({ apiKey, voice });
  };

  const disconnect = () => {
    clientRef.current?.disconnect();
    setIsConnected(false);
  };

  const clearError = () => {
    setError(null);
  };

  return {
    isConnected,
    transcriptions,
    error,
    micVolume,
    connect,
    disconnect,
    clearError
  };
}
