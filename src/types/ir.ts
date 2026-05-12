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
  type: 'sword' | 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'shield' | 'armor' | 'food' | 'material' | 'ranged' | 'bow';
  maxStackSize: number;
  logicGraphId?: string; // Reference to a logic graph to execute on use
}

export interface BlockIR {
  id: string;
  registryName: string;
  displayName: string;
  material: string;
  hardness: number;
  blastResistance?: number;
  enchantability?: number;
  stackSize?: number;
  drops?: { item: string, min: number, max: number, chance: number, condition: string }[];
  effectTrigger?: string;
  effectRadius?: number;
  effectType?: string;
}

export interface EntityIR {
  id: string;
  registryName: string;
  type: 'hostile' | 'passive';
  health: number;
  damage: number;
}

export interface RecipeIR {
  id: string;
  registryName: string;
  displayName: string;
  type: 'crafting_shaped' | 'crafting_shapeless' | 'smelting' | 'blasting';
  resultItem: string;
  resultCount: number;
  // Shaped: 3x3 array of item IDs, Shapeless: array of item IDs, Smelting/Blasting: single item ID
  ingredients: (string | null)[]; 
  experience?: number;
  cookingTime?: number;
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
