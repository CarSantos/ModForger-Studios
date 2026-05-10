import { LogicGraphIR, NodeIR, EdgeIR, ItemIR } from '../types/ir';

// Na versão final, isto fará um pedido real à API usando @google/genai
export const generateModFromPrompt = async (prompt: string): Promise<{ items?: ItemIR[], logic?: LogicGraphIR }> => {
  // Simulando o tempo de processamento da IA
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerPrompt = prompt.toLowerCase();
  
  const nodes: NodeIR[] = [];
  const edges: EdgeIR[] = [];
  
  const generateId = () => Math.random().toString(36).substr(2, 9);
  
  if (lowerPrompt.includes('espada') || lowerPrompt.includes('sword') || lowerPrompt.includes('arma')) {
    const isIce = lowerPrompt.includes('gelo') || lowerPrompt.includes('ice') || lowerPrompt.includes('congela');
    const isFire = lowerPrompt.includes('fogo') || lowerPrompt.includes('fire') || lowerPrompt.includes('queima');
    
    // Gerar um Item IR (Espada)
    const item: ItemIR = {
      id: generateId(),
      registryName: isIce ? 'minecraft:ice_sword' : isFire ? 'minecraft:fire_sword' : 'minecraft:custom_sword',
      displayName: isIce ? 'Espada de Gelo' : isFire ? 'Espada de Fogo' : 'Espada Customizada',
      type: 'sword',
      maxStackSize: 1,
    };

    // Gerar a Lógica IR para a Espada
    const itemNodeId = generateId();
    nodes.push({
      id: itemNodeId,
      type: 'custom',
      category: 'item',
      label: item.displayName,
      position: { x: 100, y: 50 },
      data: {
        itemData: item
      }
    });

    const eventNodeId = generateId();
    nodes.push({
      id: eventNodeId,
      type: 'custom',
      category: 'event',
      label: 'Ao Atacar Entidade',
      position: { x: 100, y: 150 }
    });

    const conditionNodeId = generateId();
    nodes.push({
      id: conditionNodeId,
      type: 'custom',
      category: 'condition',
      label: 'É Inimigo?',
      position: { x: 400, y: 150 }
    });

    const action1NodeId = generateId();
    nodes.push({
      id: action1NodeId,
      type: 'custom',
      category: 'action',
      label: isIce ? 'Aplicar Slowness VI (10s)' : isFire ? 'Aplicar Fogo (10s)' : 'Tocar Som (Dano)',
      position: { x: 700, y: 100 }
    });

    const action2NodeId = generateId();
    nodes.push({
      id: action2NodeId,
      type: 'custom',
      category: 'action',
      label: isIce ? 'Spawn Partículas (Gelo)' : isFire ? 'Spawn Partículas (Fogo)' : 'Efeito de Partículas',
      position: { x: 700, y: 250 }
    });

    edges.push({ id: `e_${itemNodeId}_${eventNodeId}`, source: itemNodeId, target: eventNodeId });
    edges.push({ id: `e_${eventNodeId}_${conditionNodeId}`, source: eventNodeId, target: conditionNodeId });
    edges.push({ id: `e_${conditionNodeId}_${action1NodeId}`, source: conditionNodeId, target: action1NodeId, sourceHandle: 'true' });
    edges.push({ id: `e_${action1NodeId}_${action2NodeId}`, source: action1NodeId, target: action2NodeId });

    return {
      items: [item],
      logic: { id: generateId(), nodes, edges }
    };
  }
  
  // Default fallback
  const eventNodeId = generateId();
  const actionNodeId = generateId();
  
  nodes.push({
    id: eventNodeId,
    type: 'custom',
    category: 'event',
    label: 'Evento Customizado',
    position: { x: 100, y: 150 }
  });
  nodes.push({
    id: actionNodeId,
    type: 'custom',
    category: 'action',
    label: 'Log no Servidor',
    position: { x: 400, y: 150 }
  });
  edges.push({ id: `e_${eventNodeId}_${actionNodeId}`, source: eventNodeId, target: actionNodeId });

  return {
    logic: { id: generateId(), nodes, edges }
  };
};
