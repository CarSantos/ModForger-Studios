import React, { useState, useCallback, useRef, DragEvent, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
  useReactFlow,
  useOnSelectionChange,
  MiniMap,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomNode } from './nodes/CustomNode';
import { Code, Sparkles, Box, Search, ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { ForgeInput } from './ForgeInput';
import { useModStore } from '../../store/modStore';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    data: { label: 'Ao interagir', category: 'event' },
    position: { x: 100, y: 150 },
  },
];

const nodeTypes = {
  custom: CustomNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const NODE_PALETTE = [
  { type: 'event', label: 'Ao interagir', color: 'text-yellow-400', icon: '⚡' },
  { type: 'event', label: 'Ao atacar', color: 'text-yellow-400', icon: '⚔️' },
  { type: 'event', label: 'On Player Login', color: 'text-yellow-400', icon: '👤' },
  { type: 'event', label: 'On Block Break', color: 'text-yellow-400', icon: '⛏️' },
  { type: 'event', label: 'On Entity Spawn', color: 'text-yellow-400', icon: '🥚' },
  { type: 'event', label: 'On World Tick', color: 'text-yellow-400', icon: '🌍' },
  { type: 'event', label: 'On System Value Change', color: 'text-yellow-400', icon: '⚡' },
  { type: 'event', label: 'On Crop Grow / Tick', color: 'text-yellow-400', icon: '🌱' },
  { type: 'condition', label: 'É de dia?', color: 'text-purple-400', icon: '☀️' },
  { type: 'condition', label: 'Está a chover?', color: 'text-purple-400', icon: '🌧️' },
  { type: 'condition', label: 'Comparar Valores (==, !=, <, >)', color: 'text-purple-400', icon: '⚖️' },
  { type: 'condition', label: 'Porta Lógica (AND / OR)', color: 'text-purple-400', icon: '🔌' },
  { type: 'condition', label: 'Tem Item no Inventário?', color: 'text-purple-400', icon: '🎒' },
  { type: 'action', label: 'Explodir', color: 'text-green-400', icon: '💥' },
  { type: 'action', label: 'Dar Item', color: 'text-green-400', icon: '🎁' },
  { type: 'action', label: 'Curar Vida', color: 'text-green-400', icon: '💖' },
  { type: 'action', label: 'Aplicar Efeito de Poção', color: 'text-green-400', icon: '🧪' },
  { type: 'action', label: 'Dar Dano (Custom)', color: 'text-green-400', icon: '🩸' },
  { type: 'action', label: 'Tocar Som', color: 'text-green-400', icon: '🎵' },
  { type: 'action', label: 'Spawn Entidade', color: 'text-green-400', icon: '🐎' },
  { type: 'action', label: 'Enviar Mensagem Chat', color: 'text-green-400', icon: '💬' },
  { type: 'action', label: 'Spawn Partícula', color: 'text-green-400', icon: '✨' },
  { type: 'action', label: 'Set/Change Bloco', color: 'text-green-400', icon: '🧱' },
  { type: 'action', label: 'Alterar Valor Custom (P/ Sistemas)', color: 'text-green-400', icon: '📈' },
  { type: 'control', label: 'Loop (Repetir N vezes)', color: 'text-red-400', icon: '🔁' },
  { type: 'control', label: 'Para Cada (Entidade no Raio)', color: 'text-red-400', icon: '🎯' },
  { type: 'control', label: 'Delay (Esperar)', color: 'text-red-400', icon: '⏳' },
  { type: 'control', label: 'Cancelar Evento Original', color: 'text-red-400', icon: '❌' },
  { type: 'data_math', label: 'Somar (+)', color: 'text-blue-400', icon: '➕' },
  { type: 'data_math', label: 'Subtrair (-)', color: 'text-blue-400', icon: '➖' },
  { type: 'data_math', label: 'Multiplicar (*)', color: 'text-blue-400', icon: '✖️' },
  { type: 'data_math', label: 'Dividir (/)', color: 'text-blue-400', icon: '➗' },
  { type: 'data_math', label: 'Número Aleatório', color: 'text-blue-400', icon: '🎲' },
  { type: 'data_math', label: 'Número Específico', color: 'text-blue-400', icon: '🔢' },
  { type: 'data_math', label: 'Bool: True/False', color: 'text-blue-400', icon: '🔘' },
  { type: 'variable', label: 'Vida atual do Alvo', color: 'text-orange-400', icon: '❤️' },
  { type: 'variable', label: 'Nome do Jogador', color: 'text-orange-400', icon: '👤' },
  { type: 'variable', label: 'Coordenadas (Acesso XYZ)', color: 'text-orange-400', icon: '📍' },
  { type: 'variable', label: 'Get/Set Var Global', color: 'text-orange-400', icon: '💾' },
  { type: 'ai', label: 'Gerar Lógica (IA Text)', color: 'text-pink-400', icon: '✨' },
  { type: 'api', label: 'Se Mod X Ativo', color: 'text-cyan-400', icon: '🧩' },
  { type: 'api', label: 'Run Curios/Baubles Event', color: 'text-cyan-400', icon: '💍' },
];

function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const logicGraphs = useModStore(state => state.logicGraphs);
  const activeId = useModStore(state => state.activeElementId) || 'global';
  const setLogicGraph = useModStore(state => state.setLogicGraph);
  const savedGraph = logicGraphs[activeId];

  const [nodes, setNodes, onNodesChange] = useNodesState(savedGraph ? savedGraph.nodes as any[] : initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedGraph ? savedGraph.edges as any[] : []);
  const { screenToFlowPosition } = useReactFlow();
  
  // Save graph when changed safely
  useEffect(() => {
     if (activeId !== 'global') {
        setLogicGraph(activeId, {
           id: activeId,
           nodes: nodes as any[],
           edges: edges as any[]
        });
     }
  }, [nodes, edges, activeId, setLogicGraph]);

  // Load graph when activeId changes
  useEffect(() => {
     const graph = logicGraphs[activeId];
     if (graph) {
        setNodes(graph.nodes as any[]);
        setEdges(graph.edges as any[]);
     } else {
        setNodes(initialNodes);
        setEdges([]);
     }
  }, [activeId]);

  const [compiledCode, setCompiledCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentContext, setCurrentContext] = useState<string>('all');

  const [ejectedToScript, setEjectedToScript] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [aiCustomNodes, setAiCustomNodes] = useState<any[]>([]);

  const handleEject = () => {
    setManualCode(compiledCode || "// Adicione nós e conexões\n// para gerar código.");
    setEjectedToScript(true);
  };

  useOnSelectionChange({
    onChange: ({ nodes }) => {
      setSelectedNode(nodes.length === 1 ? nodes[0] : null);
    },
  });

  const toggleCategory = (cat: string) => {
    setCollapsedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#F59E0B', strokeWidth: 2 } } as Edge, eds));
      compileCode([...nodes], [...edges, params as Edge]);
    },
    [nodes, edges, setEdges],
  );

  const onNodesDelete = useCallback(() => {
    // This is fired when pressing Backspace or Delete
    compileCode([...nodes], [...edges]);
  }, [nodes, edges]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleAIGenerated = useCallback((newNodes: any[], newEdges: any[], prompt: string) => {
      setNodes((nds) => {
        setAiCustomNodes(prev => [...prev, {
           type: 'ai',
           label: prompt.slice(0, 20) + (prompt.length > 20 ? '...' : ''),
           color: 'text-pink-400',
           icon: '🧠',
           nodes: newNodes,
           edges: newEdges
        }]);

        return nds.concat(newNodes.map(irn => ({
          id: irn.id,
          type: irn.type,
          position: irn.position,
          data: { label: irn.label, category: irn.category, ...irn.data }
        })));
      });

      setEdges(eds => eds.concat(newEdges.map(ire => ({
        id: ire.id,
        source: ire.source,
        target: ire.target,
        sourceHandle: ire.sourceHandle,
        targetHandle: ire.targetHandle,
        animated: true,
        style: { stroke: '#EC4899', strokeWidth: 2 }
      }))));
  }, [setNodes, setEdges]);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const parsedData = event.dataTransfer.getData('application/reactflow/data');
      let compoundNodes = [];
      let compoundEdges = [];
      if (parsedData) {
        try {
          const parsed = JSON.parse(parsedData);
          if (parsed.nodes && parsed.edges) {
            compoundNodes = parsed.nodes;
            compoundEdges = parsed.edges;
          }
        } catch (e) {}
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      if (compoundNodes.length > 0) {
        // Simple logic to add all nodes with offset from their original positions
        const offsetX = position.x - compoundNodes[0].position.x;
        const offsetY = position.y - compoundNodes[0].position.y;
        
        const newNodes = compoundNodes.map((n: any) => ({
          ...n,
          id: getId(),
          position: {
            x: n.position.x + offsetX,
            y: n.position.y + offsetY
          }
        }));

        setNodes(nds => nds.concat(newNodes));
        // We'd also need to remap edges, skipping for brevity in this simple implementation
        return;
      }

      const newNode: Node = {
        id: getId(),
        type: 'custom',
        position,
        data: { 
           label, 
           category: type
        },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        compileCode(newNodes, edges);
        return newNodes;
      });
    },
    [screenToFlowPosition, setNodes, edges],
  );
  
  // AI Suggestion simulation feature
  const onConnectEnd = useCallback(
    (event: any, connectionState: any) => {
      if (!connectionState.isValid && connectionState.fromNode) {
        // Find the node we dragged from
        const fromNode = nodes.find(n => n.id === connectionState.fromNode?.id);
        if (fromNode && fromNode.data.category === 'condition') {
          // AI Suggestion!
          const suggestAction = window.confirm("💡 IA Sugestão: Ligaste uma condição a nada. Queres adicionar uma ação 'Explodir' ou 'Dar Item'?");
          if (suggestAction) {
             const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
             });
             const newNode: Node = {
                id: getId(),
                type: 'custom',
                position,
                data: { label: 'Explodir', category: 'action' },
             };
             
             const newEdge: Edge = {
                 id: `e${fromNode.id}-${newNode.id}`,
                 source: fromNode.id,
                 target: newNode.id,
                 animated: true,
                 style: { stroke: '#10B981', strokeWidth: 2 }
             };
             
             setNodes(nds => nds.concat(newNode));
             setEdges(eds => eds.concat(newEdge));
          }
        }
      }
    },
    [nodes, screenToFlowPosition, setNodes, setEdges]
  );
  
  const compileCode = (currentNodes: Node[], currentEdges: Edge[]) => {
      const events = currentNodes.filter(n => n.data.category === 'event');
      let javaCode = `package com.modforger.logic;\n\npublic class CustomLogic {\n`;
      
      const processNode = (nodeId: string, indentation: string): string => {
          let code = '';
          let currentNode = currentNodes.find(n => n.id === nodeId);
          if (!currentNode) return code;

          const edgesOut = currentEdges.filter(e => e.source === nodeId);
          const label = String(currentNode.data.label || '');

          if (currentNode.data.category === 'condition') {
              const trueEdge = edgesOut.find(e => e.sourceHandle === 'true');
              const falseEdge = edgesOut.find(e => e.sourceHandle === 'false');
              
              code += `${indentation}if (${label.replace('?', '()')}) {\n`;
              if (trueEdge) code += processNode(trueEdge.target, indentation + "    ");
              code += `${indentation}}`;
              
              if (falseEdge) {
                  code += ` else {\n`;
                  code += processNode(falseEdge.target, indentation + "    ");
                  code += `${indentation}}\n`;
              } else {
                  code += `\n`;
              }
              // Normal next step after if/else if any (not supported well in this simple tree traverse, assuming conditions are branches)
          } else if (currentNode.data.category === 'action') {
              code += `${indentation}executeAction("${label}");\n`;
              const nextEdge = edgesOut.find(e => e.sourceHandle === 'a' || !e.sourceHandle);
              if (nextEdge) code += processNode(nextEdge.target, indentation);
          } else if (currentNode.data.category === 'control') {
              if (label.includes('Loop')) {
                  code += `${indentation}while (true) { // TODO: Loop condition\n`;
                  const nextEdge = edgesOut[0];
                  if (nextEdge) code += processNode(nextEdge.target, indentation + "    ");
                  code += `${indentation}}\n`;
              } else if (label.includes('Delay')) {
                  code += `${indentation}// Schedule task delayed\n`;
                  code += `${indentation}server.schedule(() -> {\n`;
                  const nextEdge = edgesOut[0];
                  if (nextEdge) code += processNode(nextEdge.target, indentation + "    ");
                  code += `${indentation}}, 20L);\n`;
              }
          } else if (currentNode.data.category === 'api') {
              code += `${indentation}// Integrando API: ${label}\n`;
              code += `${indentation}if (ModCompat.isLoaded("external_mod")) {\n`;
              const nextEdge = edgesOut[0];
              if (nextEdge) code += processNode(nextEdge.target, indentation + "    ");
              code += `${indentation}}\n`;
          } else if (currentNode.data.category === 'ai') {
              code += `${indentation}// [IA GERADA] ${label}\n`;
              code += `${indentation}AILogicEngine.execute("${label}", event);\n`;
              const nextEdge = edgesOut[0];
              if (nextEdge) code += processNode(nextEdge.target, indentation);
          } else {
              // Default fallback
              code += `${indentation}// Desconhecido: ${label}\n`;
              const nextEdge = edgesOut[0];
              if (nextEdge) code += processNode(nextEdge.target, indentation);
          }

          return code;
      };

      events.forEach(ev => {
          let eventName = "onEvent";
          const label = String(ev.data.label || '');
          if (label === 'Ao interagir') eventName = "onPlayerInteract";
          if (label === 'Ao atacar') eventName = "onEntityAttack";
          if (label.includes('Login')) eventName = "onPlayerLogin";
          if (label.includes('Break')) eventName = "onBlockBreak";
          
          javaCode += `    public void ${eventName}(Event event) {\n`;
          
          const edgeOut = currentEdges.find(e => e.source === ev.id);
          if (edgeOut) {
              javaCode += processNode(edgeOut.target, "        ");
          }
          
          javaCode += `    }\n\n`;
      });
      
      javaCode += `}\n`;
      setCompiledCode(javaCode);
  };

  return (
    <div className="flex w-full h-full bg-[#0A0A0C]">
      {/* Toolbox Sidebar */}
      <div className="w-64 bg-[#0D0D11] border-r border-white/5 flex flex-col z-10">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-white font-bold flex items-center gap-2 mb-3">
            <Box size={18} className="text-amber-500" />
            Nodos (Flow)
          </h3>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-white/40 pointer-events-none" />
            <input 
              type="text"
              placeholder="Pesquisar nós..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none placeholder:text-white/30"
            />
          </div>
        </div>
        
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Context Selector */}
          <div className="mb-4">
             <label className="text-[10px] uppercase font-bold text-white/40 block mb-1">Contexto Inteligente</label>
             <select 
               value={currentContext} 
               onChange={e => setCurrentContext(e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-xs text-white/80 focus:border-purple-500 focus:outline-none"
             >
                <option value="all">Global (Todos os Nodos)</option>
                <option value="item">Criação de Item</option>
                <option value="block">Criação de Bloco</option>
                <option value="dimension">Geração de Dimensão</option>
             </select>
          </div>

          {/* AI Generated Nodes Category (if any) */}
          {aiCustomNodes.length > 0 && (
            <div className="mb-4">
              <button 
                onClick={() => toggleCategory('ai_generated')}
                className={`flex items-center gap-2 w-full text-left text-xs font-bold uppercase tracking-wider mb-2 hover:opacity-80 transition-opacity text-pink-400`}
              >
                {collapsedCategories['ai_generated'] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                Gerados por IA (Salvos)
              </button>
              {!collapsedCategories['ai_generated'] && (
                <div className="space-y-2">
                  {aiCustomNodes.map((node, idx) => (
                    <div 
                       key={`ai-${idx}`}
                       className={`p-2 rounded border border-pink-500/30 bg-pink-500/10 text-sm text-pink-200 cursor-grab hover:bg-pink-500/20 transition-colors flex items-center gap-2`}
                       onDragStart={(e) => {
                         e.dataTransfer.setData('application/reactflow/type', node.type);
                         e.dataTransfer.setData('application/reactflow/label', node.label);
                         e.dataTransfer.setData('application/reactflow/data', JSON.stringify({ nodes: node.nodes, edges: node.edges }));
                         e.dataTransfer.effectAllowed = 'move';
                       }}
                       draggable
                    >
                      <span>{node.icon}</span>
                      {node.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Categorias Regulares */}
          {[
            { cat: 'event', label: 'Eventos', color: 'text-yellow-400' },
            { cat: 'condition', label: 'Condições', color: 'text-purple-400' },
            { cat: 'action', label: 'Ações', color: 'text-green-400' },
            { cat: 'control', label: 'Loops e Controlo', color: 'text-red-400' },
            { cat: 'data_math', label: 'Dados e Matemática', color: 'text-blue-400' },
            { cat: 'variable', label: 'Variáveis', color: 'text-orange-400' },
            { cat: 'api', label: 'API & Integrações', color: 'text-cyan-400' },
            { cat: 'ai', label: 'IA Generativa', color: 'text-pink-400' },
          ].map(category => {
            const filteredNodes = NODE_PALETTE.filter(n => 
              n.type === category.cat && 
              n.label.toLowerCase().includes(searchQuery.toLowerCase())
            );

            if (filteredNodes.length === 0) return null;

            const isCollapsed = collapsedCategories[category.cat];

            return (
             <div key={category.cat}>
                <button 
                  onClick={() => toggleCategory(category.cat)}
                  className={`flex items-center gap-2 w-full text-left text-xs font-bold uppercase tracking-wider mb-2 hover:opacity-80 transition-opacity ${category.color}`}
                >
                  {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  {category.label}
                </button>
                {!isCollapsed && (
                  <div className="space-y-2">
                    {filteredNodes.map(node => (
                      <div 
                         key={node.label}
                         className={`p-2 rounded border border-white/10 bg-white/5 text-sm text-white cursor-grab hover:bg-white/10 transition-colors flex items-center gap-2`}
                         onDragStart={(e) => {
                           e.dataTransfer.setData('application/reactflow/type', node.type);
                           e.dataTransfer.setData('application/reactflow/label', node.label);
                           e.dataTransfer.effectAllowed = 'move';
                         }}
                         draggable
                      >
                        <span>{node.icon}</span>
                        {node.label}
                      </div>
                    ))}
                  </div>
                )}
             </div>
            );
          })}
        </div>
        
        {/* Context-aware suggestions */}
        {selectedNode && (
          <div className="p-4 border-t border-white/5 bg-purple-500/5 relative">
            <button 
              onClick={() => {
                setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                setSelectedNode(null);
              }}
              className="absolute top-2 right-2 text-white/30 hover:text-red-500 transition-colors"
              title="Delete Node (Backspace/Delete)"
            >
              ⨯
            </button>
            <h4 className="text-xs font-bold text-purple-400 flex items-center gap-2 mb-3">
              <Sparkles size={14} />
              Sugestões Rápidas
            </h4>
            <div className="space-y-2">
              {NODE_PALETTE.filter(n => {
                const cat = selectedNode.data.category;
                if (cat === 'event') return n.type === 'condition' || n.type === 'action';
                if (cat === 'condition') return n.type === 'action';
                if (cat === 'variable') return n.type === 'condition';
                return false;
              }).slice(0, 3).map((node, idx) => (
                 <div 
                   key={`sugg-${idx}`}
                   className="p-2 rounded border border-purple-500/30 bg-black/40 text-xs text-white/90 flex items-center justify-between cursor-grab hover:bg-purple-500/10 transition-colors"
                   draggable
                   onDragStart={(e) => {
                     e.dataTransfer.setData('application/reactflow/type', node.type);
                     e.dataTransfer.setData('application/reactflow/label', node.label);
                     e.dataTransfer.effectAllowed = 'move';
                   }}
                 >
                   <div className="flex items-center gap-2">
                     <span>{node.icon}</span>
                     {node.label}
                   </div>
                   <Plus size={12} className="text-purple-400" />
                 </div>
              ))}
            </div>
            <p className="text-[10px] text-white/40 mt-2 text-center">Arraste para ligar ao nó.</p>
          </div>
        )}
      </div>

      {/* Editor Canvas Area */}
      <div className="flex-1 flex flex-col h-full relative" ref={reactFlowWrapper}>
        {ejectedToScript ? (
          <div className="w-full h-full bg-[#1e1e1e] flex flex-col">
            <div className="bg-[#2d2d2d] p-3 border-b border-black/50 flex justify-between items-center">
              <span className="text-white/80 font-mono text-sm">ModForgerScript.ts</span>
              <button onClick={() => setEjectedToScript(false)} className="text-xs bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-3 py-1.5 rounded transition-colors">
                Voltar a Nodos Visuais (Pode perder alterações)
              </button>
            </div>
            <textarea
              className="w-full h-full bg-transparent text-emerald-400 font-mono p-4 outline-none resize-none text-sm"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              spellCheck={false}
            />
          </div>
        ) : (
          <>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodesDelete={onNodesDelete}
              onConnect={onConnect}
              onConnectEnd={onConnectEnd}
              onDrop={onDrop}
              onDragOver={onDragOver}
              nodeTypes={nodeTypes}
              fitView
              className="bg-[#0A0A0C]"
              colorMode="dark"
            >
              <Background color="#fff" gap={16} />
              <Controls className="bg-[#1C1C21] border-white/10 fill-white" />
              <MiniMap 
                 nodeColor={(node) => {
                   switch(node.data?.category) {
                     case 'event': return '#F59E0B';
                     case 'condition': return '#A855F7';
                     case 'action': return '#10B981';
                     case 'control': return '#EF4444';
                     case 'data_math': return '#3B82F6';
                     case 'variable': return '#F97316';
                     case 'api': return '#06B6D4';
                     case 'ai': return '#EC4899';
                     default: return '#eee';
                   }
                 }}
                 className="bg-[#1C1C21] border border-white/10 rounded-lg !w-40 !h-30" 
                 maskColor="rgba(0,0,0,0.4)"
              />
              <Panel position="top-center" className="bg-[#1C1C21]/80 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 font-mono shadow-xl relative top-2">
                 ModForger Omni-Graph Engine
              </Panel>
            </ReactFlow>
            
            {/* IA Input Panel (Bottom Center) */}
            <ForgeInput onGenerated={handleAIGenerated} />

            {/* Top Right Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button onClick={handleEject} className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg backdrop-blur">
                <Code size={14} className="inline-block mr-2" /> Ejetar para Script
              </button>
            </div>

            {/* Selected Node Options Panel */}
            {selectedNode && (
              <div className="absolute right-4 top-16 w-64 bg-[#1C1C21]/95 backdrop-blur border border-purple-500/30 rounded-xl overflow-hidden shadow-2xl z-20">
                <div className="bg-purple-500/10 p-3 border-b border-purple-500/20">
                  <h4 className="text-white font-bold text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    Ferramentas de Nodo
                  </h4>
                  <p className="text-[10px] text-white/50 mt-1 truncate">{(selectedNode.data?.label as string) || 'Nodo selecionado'}</p>
                </div>
                <div className="p-2 space-y-1">
                   <button 
                     onClick={() => alert("As ligações conectadas seriam removidas e mantinham o nodo.")}
                     className="w-full text-left px-3 py-2 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white rounded transition-colors flex items-center gap-2"
                   >
                     <span>🔗</span> Apagar Ligação
                   </button>
                   <button 
                     onClick={() => {
                        setNodes(nds => nds.filter(n => n.id !== selectedNode.id));
                        setSelectedNode(null);
                     }}
                     className="w-full text-left px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/10 hover:text-red-300 rounded transition-colors flex items-center gap-2"
                   >
                     <span>🗑️</span> Apagar Nodo
                   </button>
                   <button 
                     onClick={() => alert("Janela de propriedades do nodo.")}
                     className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-400/10 hover:text-amber-300 rounded transition-colors flex items-center gap-2"
                   >
                     <span>⚙️</span> Modificar Nodo
                   </button>
                   <button 
                     onClick={() => alert("Abrindo paleta flutuante para Gerar Qualquer Nodo livremente.")}
                     className="w-full text-left px-3 py-2 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 rounded transition-colors flex items-center gap-2"
                   >
                     <span>➕</span> Gerar Qualquer Nodo
                   </button>
                   <div className="pt-2 mt-2 border-t border-white/10">
                     <button 
                       onClick={() => {
                         alert("Alterações aplicadas dentro da estrutura (Ex: Atribuidas diretamente à Espada de Gelo). O fluxo não é salvo como item independente.");
                       }}
                       className="w-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-center px-3 py-2 text-xs font-bold rounded transition-colors"
                     >
                       💾 Salvar Alterações na Entidade
                     </button>
                   </div>
                </div>
              </div>
            )}

            {/* Real-time Code Compilation Panel */}
            <div className="absolute bottom-4 right-4 w-96 bg-[#0D0D11] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[40%] z-10 pointer-events-none opacity-50 hover:opacity-100 hover:pointer-events-auto transition-opacity">
              <div className="bg-[#1C1C21] p-2 px-3 border-b border-white/5 flex items-center gap-2">
                <Code size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Compilação (Preview)</span>
              </div>
              <div className="p-3 overflow-y-auto flex-1 bg-black/50">
                <pre className="text-[10px] font-mono text-emerald-400/80 whitespace-pre-wrap">
                  {compiledCode || "// Adicione nós e conexões\n// para gerar código."}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function NodeEditor() {
  return (
    <ReactFlowProvider>
      <DnDFlow />
    </ReactFlowProvider>
  );
}
