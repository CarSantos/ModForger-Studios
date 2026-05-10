export interface ModIR {
  id: string;
  name: string;
  version: string;
  items: ItemIR[];
  blocks: BlockIR[];
  entities: EntityIR[];
  structures: StructureIR[];
  lootTables: LootTableIR[];
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

export interface StructureIR {
  id: string;
  registryName: string;
  displayName: string;
  spawnBiomes: string[];
  surfaceType: string;
  spawnProbability: number;
  entitySpawns: string[];
}

export interface LootTableIR {
  id: string;
  registryName: string;
  pools: LootPoolIR[];
}

export interface LootPoolIR {
  id: string;
  item: string;
  minQuantity: number;
  maxQuantity: number;
  chance: number; // 0-100
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
