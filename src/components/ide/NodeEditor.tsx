import React, { useState, useCallback, useRef, DragEvent } from 'react';
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
  { type: 'condition', label: 'É de dia?', color: 'text-purple-400', icon: '☀️' },
  { type: 'condition', label: 'Está a andar?', color: 'text-purple-400', icon: '🚶' },
  { type: 'condition', label: 'Comparar Valores', color: 'text-purple-400', icon: '⚖️' },
  { type: 'action', label: 'Explodir', color: 'text-green-400', icon: '💥' },
  { type: 'action', label: 'Dar Item', color: 'text-green-400', icon: '🎁' },
  { type: 'action', label: 'Curar Vida', color: 'text-green-400', icon: '💖' },
  { type: 'control', label: 'Loop (Repetir)', color: 'text-red-400', icon: '🔁' },
  { type: 'control', label: 'Delay (Esperar)', color: 'text-red-400', icon: '⏳' },
  { type: 'data_math', label: 'Somar (+)', color: 'text-blue-400', icon: '➕' },
  { type: 'data_math', label: 'Número Aleatório', color: 'text-blue-400', icon: '🎲' },
  { type: 'variable', label: 'Vida atual', color: 'text-orange-400', icon: '❤️' },
  { type: 'variable', label: 'Nome do jogador', color: 'text-orange-400', icon: '👤' },
  { type: 'variable', label: 'Get/Set Var', color: 'text-orange-400', icon: '💾' },
  { type: 'ai', label: 'Gerar Lógica (IA Text)', color: 'text-pink-400', icon: '✨' },
  { type: 'api', label: 'Se Mod X Ativo', color: 'text-cyan-400', icon: '🧩' },
];

function DnDFlow() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  
  const [compiledCode, setCompiledCode] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [currentContext, setCurrentContext] = useState<string>('all');

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

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleAIGenerate = useCallback(async (nodeId: string, prompt: string) => {
    // Generate some nodes based on the text prompt
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    await delay(800); // Simulate AI generation delay

    setNodes((nds) => {
      const node = nds.find(n => n.id === nodeId);
      if (!node) return nds;

      const conditionId = getId();
      const action1Id = getId();
      const action2Id = getId();

      const conditionNode: Node = {
        id: conditionId,
        type: 'custom',
        position: { x: node.position.x + 300, y: node.position.y },
        data: { label: 'Comparar Valores', category: 'condition' }
      };

      const action1Node: Node = {
        id: action1Id,
        type: 'custom',
        position: { x: conditionNode.position.x + 200, y: conditionNode.position.y },
        data: { label: 'Explodir', category: 'action' }
      };

      const action2Node: Node = {
        id: action2Id,
        type: 'custom',
        position: { x: conditionNode.position.x + 200, y: conditionNode.position.y + 100 },
        data: { label: 'Curar Vida', category: 'action' }
      };

      const edge1: Edge = {
        id: `e${nodeId}-${conditionId}`,
        source: nodeId,
        target: conditionId,
        animated: true,
        style: { stroke: '#EC4899', strokeWidth: 2 }
      };

      const edge2: Edge = {
        id: `e${conditionId}-${action1Id}`,
        source: conditionId,
        sourceHandle: 'true',
        target: action1Id,
        animated: true,
        style: { stroke: '#10B981', strokeWidth: 2 }
      };

      const edge3: Edge = {
        id: `e${conditionId}-${action2Id}`,
        source: conditionId,
        sourceHandle: 'false',
        target: action2Id,
        animated: true,
        style: { stroke: '#EF4444', strokeWidth: 2 }
      };

      setEdges(eds => eds.concat(edge1, edge2, edge3));
      return nds.concat(conditionNode, action1Node, action2Node);
    });
  }, [setNodes, setEdges]);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow/type');
      const label = event.dataTransfer.getData('application/reactflow/label');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode: Node = {
        id: getId(),
        type: 'custom',
        position,
        data: { 
           label, 
           category: type,
           ...(type === 'ai' ? { onGenerate: handleAIGenerate } : {})
        },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        compileCode(newNodes, edges);
        return newNodes;
      });
    },
    [screenToFlowPosition, setNodes, edges, handleAIGenerate],
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
          if (ev.data.label === 'Ao interagir') eventName = "onPlayerInteract";
          if (ev.data.label === 'Ao atacar') eventName = "onEntityAttack";
          if (ev.data.label.includes('Login')) eventName = "onPlayerLogin";
          if (ev.data.label.includes('Break')) eventName = "onBlockBreak";
          
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

          {/* Categorias */}
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
          <div className="p-4 border-t border-white/5 bg-purple-500/5">
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
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onConnectEnd={onConnectEnd}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          className="bg-[#0A0A0C]"
          colorMode="dark"
        >
          <Background color="#fff" gap={16} opacity={0.05} />
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
          <Panel position="top-center" className="bg-[#1C1C21]/80 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/60 font-mono shadow-xl">
             ModForger Omni-Graph Engine
          </Panel>
        </ReactFlow>
        
        {/* IA Assistant Overlay */}
        <div className="absolute top-4 right-4 bg-purple-500/10 border border-purple-500/30 text-purple-200 px-4 py-2 rounded-xl text-sm flex items-center gap-2 shadow-lg backdrop-blur-sm">
           <Sparkles size={16} className="text-purple-400" />
           A IA está a analisar o teu fluxo em tempo real.
        </div>

        {/* Real-time Code Compilation Panel */}
        <div className="absolute bottom-4 right-4 w-96 bg-[#0D0D11] border border-white/10 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[40%]">
          <div className="bg-[#1C1C21] p-2 px-3 border-b border-white/5 flex items-center gap-2">
            <Code size={14} className="text-amber-500" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-widest">Compilação Java (Preview)</span>
          </div>
          <div className="p-3 overflow-y-auto flex-1 bg-black/50">
            <pre className="text-xs font-mono text-emerald-400/80 whitespace-pre-wrap">
              {compiledCode || "// Adicione nós e conexões\n// para gerar código."}
            </pre>
          </div>
        </div>
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
