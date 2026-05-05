import { Image as ImageIcon, Paintbrush, MousePointer2, Settings2, Eraser, Download, Eye, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export const TextureEditor = () => {
  const [tool, setTool] = useState('pencil'); // pencil, eraser, fill
  const [color, setColor] = useState('#ff0000');
  const [brushSize, setBrushSize] = useState(1);
  const [textureSize, setTextureSize] = useState(16);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && canvasRef.current) {
      if (Math.random() < 0.0) return; // hack to avoid empty effect
      ctx.imageSmoothingEnabled = false;
      // initialize empty
      ctx.fillStyle = '#ffffff00';
      ctx.fillRect(0, 0, textureSize, textureSize);
    }
  }, [textureSize]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / textureSize));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / textureSize));

    if (tool === 'pencil') {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, brushSize, brushSize);
    } else if (tool === 'eraser') {
      ctx.clearRect(x, y, brushSize, brushSize);
    }
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, textureSize, textureSize);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center">
      <header className="mb-8 max-w-4xl w-full">
         <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
           <ImageIcon className="text-amber-500 w-8 h-8" />
           Criador de Texturas
         </h1>
         <p className="text-white/40 text-lg font-light">Desenhe texturas em pixel art 16x16 ou gere com IA.</p>
      </header>
      
      <div className="flex gap-8 max-w-4xl w-full">
        {/* Toolbar */}
        <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 h-fit">
           <button onClick={() => setTool('pencil')} className={`p-3 rounded-xl transition-colors ${tool === 'pencil' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-black text-white/50 border border-white/10 hover:text-white'}`}>
              <Paintbrush size={20} />
           </button>
           <button onClick={() => setTool('eraser')} className={`p-3 rounded-xl transition-colors ${tool === 'eraser' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-black text-white/50 border border-white/10 hover:text-white'}`}>
              <Eraser size={20} />
           </button>
           
           <div className="h-px bg-white/10 my-2"></div>
           
           <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-11 h-11 bg-transparent rounded cursor-pointer" />
           
           <div className="h-px bg-white/10 my-2"></div>
           
           <button onClick={clearCanvas} className="p-3 bg-black rounded-xl text-white/50 border border-white/10 hover:text-red-400 hover:border-red-400/50 transition-colors" title="Limpar">
              <Sparkles size={20} />
           </button>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE1MTUxNSIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxYTFhMWEiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiMxYTFhMWEiLz4KPC9zdmc+')] border-2 border-white/10 rounded-2xl flex items-center justify-center p-8 relative overflow-hidden" style={{ minHeight: '500px' }}>
            <canvas 
              ref={canvasRef}
              width={textureSize}
              height={textureSize}
              onMouseDown={(e) => {
                 const moveHandler = (ev: MouseEvent) => handleCanvasClick(ev as any);
                 document.addEventListener('mousemove', moveHandler);
                 document.addEventListener('mouseup', () => document.removeEventListener('mousemove', moveHandler), { once: true });
                 handleCanvasClick(e);
              }}
              className="w-[400px] h-[400px] cursor-crosshair border border-white/20 rendering-pixelated bg-transparent"
              style={{ imageRendering: 'pixelated' }}
            />
            {/* Grid overlay */}
            <div className="absolute w-[400px] h-[400px] pointer-events-none" style={{ backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: `${400 / textureSize}px ${400 / textureSize}px` }}></div>
        </div>
        
        {/* Properties / AI */}
        <div className="w-64 flex flex-col gap-4">
           <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
              <label className="block text-xs font-bold text-white/50 mb-2 uppercase">Configurações</label>
              <div className="space-y-3">
                 <div>
                    <label className="block text-[10px] text-white/40 mb-1">Resolução (Tamanho)</label>
                    <select value={textureSize} onChange={(e) => {
                       const size = Number(e.target.value);
                       setTextureSize(size);
                    }} className="w-full bg-black border border-white/10 rounded p-2 text-xs text-white outline-none cursor-pointer">
                       <option value={16}>16x16 (Minecraft Padrão)</option>
                       <option value={32}>32x32 (Pixel HD)</option>
                       <option value={64}>64x64 (Detalhado)</option>
                       <option value={128}>128x128 (Ultra HD)</option>
                    </select>
                 </div>
              </div>
           </div>
           <div className="bg-black/60 border border-white/10 rounded-2xl p-4 flex flex-col">
              <p className="text-xs font-bold text-white/50 mb-4 uppercase inline-flex items-center gap-2"><Sparkles size={12}/> Gerar com IA</p>
              <textarea placeholder="Ex: Textura para uma picareta roxa sombria" className="w-full bg-black border border-white/10 rounded p-2 text-sm text-white focus:border-amber-500 outline-none h-24 mb-3 resize-none"></textarea>
              <button className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-blue-300 hover:from-purple-500/30 hover:to-blue-500/30 border border-blue-500/30 py-2 rounded-lg text-xs font-bold transition-colors w-full">Gerar</button>
           </div>
           
           <div className="bg-black/60 border border-white/10 rounded-2xl p-4">
               <button className="bg-amber-500 hover:bg-amber-400 text-black py-2 rounded-lg font-bold transition-colors w-full flex justify-center items-center gap-2 text-sm">
                  <Download size={16} /> Salvar Textura
               </button>
           </div>
        </div>
      </div>
    </div>
  );
};
