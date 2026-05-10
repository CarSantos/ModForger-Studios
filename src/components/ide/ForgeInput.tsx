import React, { useState } from 'react';
import { Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { generateModNodes } from '../../services/aiService';

interface ForgeInputProps {
  onGenerated: (nodes: any[], edges: any[], prompt: string) => void;
}

export const ForgeInput: React.FC<ForgeInputProps> = ({ onGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleForge = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateModNodes(prompt);
      
      if (result && result.nodes && result.edges) {
        onGenerated(result.nodes, result.edges, prompt);
        setPrompt('');
      } else {
        throw new Error("A IA não retornou um formato JSON válido.");
      }
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao comunicar com a Forja da IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[600px] flex gap-2 z-20 shadow-2xl">
        <div className="flex-1 relative flex flex-col">
            <input 
                type="text" 
                placeholder="Descreve a lógica à IA... (ex: 'Espada de gelo que congela inimigos')" 
                className="w-full bg-[#1C1C21]/95 backdrop-blur border border-purple-500/40 rounded-xl px-4 py-3 text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-purple-500/80 shadow-[0_0_15px_rgba(168,85,247,0.15)] focus:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all font-medium"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isLoading) {
                        handleForge();
                    }
                }}
                disabled={isLoading}
            />
            {error && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-red-500/10 border border-red-500/30 text-red-200 px-3 py-2 rounded-lg text-xs flex items-center gap-2 backdrop-blur shadow-lg backdrop-blur">
                    <AlertCircle size={14} className="text-red-400 shrink-0" />
                    <span className="truncate">{error}</span>
                </div>
            )}
        </div>
        <button 
            onClick={handleForge}
            disabled={isLoading || !prompt.trim()}
            className="bg-purple-600 disabled:bg-purple-600/50 hover:bg-purple-500 text-white px-6 w-32 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] flex items-center justify-center transition-all disabled:cursor-not-allowed group"
        >
            {isLoading ? (
                <Loader2 size={18} className="animate-spin text-white flex-shrink-0" />
            ) : (
                <>
                    <Sparkles size={16} className="mr-2 group-hover:scale-110 transition-transform" /> 
                    <span className="font-bold tracking-wider text-xs">FORJAR</span>
                </>
            )}
        </button>
    </div>
  );
};
