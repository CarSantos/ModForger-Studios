import { Handle, Position, NodeProps, useReactFlow } from '@xyflow/react';
import { Play, HelpCircle, Zap, Database, Repeat, Calculator, Bot, Globe } from 'lucide-react';
import { useState } from 'react';

export function CustomNode({ id, data, isConnectable }: NodeProps) {
  const { label, category, prompt, onGenerate } = data as { label: string, category: 'event' | 'condition' | 'action' | 'variable' | 'control' | 'data_math' | 'ai' | 'api', prompt?: string, onGenerate?: (id: string, p: string) => void };
  const [localPrompt, setLocalPrompt] = useState(prompt || '');
  const { setNodes } = useReactFlow();
  
  let bgClass = "bg-gray-800 border-gray-600";
  let icon = <HelpCircle size={16} />;
  
  switch (category) {
    case 'event':
      bgClass = "bg-yellow-500/20 border-yellow-500 text-yellow-100";
      icon = <Play size={16} className="text-yellow-400" />;
      break;
    case 'condition':
      bgClass = "bg-purple-500/20 border-purple-500 text-purple-100";
      icon = <HelpCircle size={16} className="text-purple-400" />;
      break;
    case 'action':
      bgClass = "bg-green-500/20 border-green-500 text-green-100";
      icon = <Zap size={16} className="text-green-400" />;
      break;
    case 'variable':
      bgClass = "bg-orange-500/20 border-orange-500 text-orange-100";
      icon = <Database size={16} className="text-orange-400" />;
      break;
    case 'control':
      bgClass = "bg-red-500/20 border-red-500 text-red-100";
      icon = <Repeat size={16} className="text-red-400" />;
      break;
    case 'data_math':
      bgClass = "bg-blue-500/20 border-blue-500 text-blue-100";
      icon = <Calculator size={16} className="text-blue-400" />;
      break;
    case 'ai':
      bgClass = "bg-pink-500/20 border-pink-500 text-pink-100 shadow-[0_0_15px_rgba(236,72,153,0.5)]";
      icon = <Bot size={16} className="text-pink-400" />;
      break;
    case 'api':
      bgClass = "bg-cyan-500/20 border-cyan-500 text-cyan-100";
      icon = <Globe size={16} className="text-cyan-400" />;
      break;
  }

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-opacity-80 border-2 backdrop-blur-sm ${category === 'ai' ? 'min-w-[250px]' : 'min-w-[150px]'} ${bgClass}`}>
      {/* Target handle (Input) */}
      {(category !== 'event') && (
         <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="!w-3 !h-3 !bg-white/80" />
      )}
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {icon}
          <div className="font-bold text-sm max-w-[150px] break-words">{category === 'ai' ? 'Lógica Gerativa (IA)' : label}</div>
        </div>

        {category === 'ai' && (
          <div className="flex flex-col gap-2 mt-2">
             <textarea 
                className="w-full bg-black/40 border border-pink-500/50 rounded p-1.5 text-xs text-white placeholder-pink-200/50 resize-none h-16 nodrag focus:border-pink-400 focus:outline-none"
                placeholder="Ex: Se a vida for < 5, explode e cura o jogador..."
                value={localPrompt}
                onChange={(e) => setLocalPrompt(e.target.value)}
                onBlur={() => {
                   setNodes((nds) => nds.map(n => n.id === id ? { ...n, data: { ...n.data, prompt: localPrompt } } : n));
                }}
             />
             <button 
                className="bg-pink-600 hover:bg-pink-500 text-white text-[10px] uppercase font-bold py-1.5 px-2 rounded w-full transition-colors tracking-widest border border-pink-400/50 hover:border-pink-300"
                onClick={() => {
                   if (onGenerate) onGenerate(id, localPrompt);
                }}
             >
                ✨ Gerar Nodos
             </button>
          </div>
        )}
      </div>

      {/* Source handles (Output) */}
      {category === 'condition' ? (
        <div className="flex flex-col gap-1 mt-2">
           <div className="relative">
             <span className="text-[10px] absolute -right-2 top-0">True</span>
             <Handle type="source" position={Position.Right} id="true" isConnectable={isConnectable} className="!w-3 !h-3 !bg-green-400 !top-2" />
           </div>
           <div className="relative mt-4">
             <span className="text-[10px] absolute -right-2 top-0">False</span>
             <Handle type="source" position={Position.Right} id="false" isConnectable={isConnectable} className="!w-3 !h-3 !bg-red-400 !top-2" />
           </div>
        </div>
      ) : (category === 'ai' ? (
        <Handle type="source" position={Position.Right} id="a" isConnectable={isConnectable} className="!w-3 !h-3 !bg-pink-400" />
      ) : (
        <Handle type="source" position={Position.Right} id="a" isConnectable={isConnectable} className="!w-3 !h-3 !bg-white/80" />
      ))}
    </div>
  );
}
