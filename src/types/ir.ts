export interface ModIR {
  id: string;
  name: string;
  version: string;
  items: ItemIR[];
  blocks: BlockIR[];
  entities: EntityIR[];
  logicNodes: LogicGraphIR[];
}

export interface ItemIR {
  id: string;
  registryName: string;
  displayName: string;
  type: 'sword' | 'pickaxe' | 'food' | 'material' | 'ranged';
  maxStackSize: number;
  logicGraphId?: string; // Reference to a logic graph to execute on use
}

export interface BlockIR {
  id: string;
  registryName: string;
  displayName: string;
  material: string;
  hardness: number;
}

export interface EntityIR {
  id: string;
  registryName: string;
  type: 'hostile' | 'passive';
  health: number;
  damage: number;
}

export interface LogicGraphIR {
  id: string;
  nodes: NodeIR[];
  edges: EdgeIR[];
}

export interface NodeIR {
  id: string;
  type: string; // custom, ai, etc.
  category: 'event' | 'action' | 'condition' | 'data_math' | 'variable' | 'api';
  label: string;
  position: { x: number; y: number };
  data?: Record<string, any>;
}

export interface EdgeIR {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}
