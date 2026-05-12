import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItemIR, BlockIR, EntityIR, StructureIR, LootTableIR, LogicGraphIR } from '../types/ir';

interface ModState {
  items: ItemIR[];
  blocks: BlockIR[];
  entities: EntityIR[];
  structures: StructureIR[];
  lootTables: LootTableIR[];
  logicGraphs: Record<string, LogicGraphIR>; // Maps an element ID to its logic graph
  activeElementId: string | null;
  activeElementType: 'item' | 'block' | 'entity' | 'structure' | 'loot' | null;
  activeLogicGraphId: string | null;
  activeView: string;

  // Actions
  setActiveView: (view: string) => void;
  openLogicGraph: (graphId: string) => void;
  addItem: (item: ItemIR) => void;
  updateItem: (id: string, updates: Partial<ItemIR>) => void;
  deleteItem: (id: string) => void;
  
  addBlock: (block: BlockIR) => void;
  updateBlock: (id: string, updates: Partial<BlockIR>) => void;
  deleteBlock: (id: string) => void;
  
  addStructure: (structure: StructureIR) => void;
  updateStructure: (id: string, updates: Partial<StructureIR>) => void;
  deleteStructure: (id: string) => void;
  
  addLootTable: (lootTable: LootTableIR) => void;
  updateLootTable: (id: string, updates: Partial<LootTableIR>) => void;
  updateLoot: (id: string, updates: Partial<LootTableIR>) => void;
  deleteLootTable: (id: string) => void;

  updateElement: (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot', updates: any) => void;
  deleteElement: (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot') => void;

  setLogicGraph: (elementId: string, graph: LogicGraphIR) => void;
  openElement: (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot') => void;
  closeElement: () => void;
}

export const useModStore = create<ModState>()(
  persist(
    (set) => ({
      items: [
        // Mock data logic defaults to store
        {
           id: 'mock-item-1',
           registryName: 'modforger:ice_sword',
           displayName: 'Espada de Gelo',
           type: 'sword',
           maxStackSize: 1
        }
      ],
      blocks: [],
      entities: [],
      structures: [],
      lootTables: [],
      logicGraphs: {},
      activeElementId: null,
      activeElementType: null,
      activeLogicGraphId: null,
      activeView: 'Dashboard',

      setActiveView: (view) => set({ activeView: view }),
      openLogicGraph: (graphId) => set({ activeLogicGraphId: graphId, activeView: 'Lógica (Nodos)' }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) => set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, ...updates } : i)
      })),
      deleteItem: (id) => set((state) => ({ items: state.items.filter(i => i.id !== id) })),
      addBlock: (block) => set((state) => ({ blocks: [...state.blocks, block] })),
      updateBlock: (id, updates) => set((state) => ({
          blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBlock: (id) => set((state) => ({ blocks: state.blocks.filter(b => b.id !== id) })),
      
      addStructure: (structure) => set((state) => ({ structures: [...state.structures, structure] })),
      updateStructure: (id, updates) => set((state) => ({
          structures: state.structures.map(s => s.id === id ? { ...s, ...updates } : s)
      })),
      deleteStructure: (id) => set((state) => ({ structures: state.structures.filter(s => s.id !== id) })),
      
      addLootTable: (lootTable) => set((state) => ({ lootTables: [...state.lootTables, lootTable] })),
      updateLootTable: (id, updates) => set((state) => ({
          lootTables: state.lootTables.map(lt => lt.id === id ? { ...lt, ...updates } : lt)
      })),
      updateLoot: (id, updates) => set((state) => ({
          lootTables: state.lootTables.map(lt => lt.id === id ? { ...lt, ...updates } : lt)
      })),
      deleteLootTable: (id) => set((state) => ({ lootTables: state.lootTables.filter(lt => lt.id !== id) })),

      updateElement: (id, type, updates) => set((state) => {
        let items = state.items;
        let blocks = state.blocks;
        let structures = state.structures;
        let lootTables = state.lootTables;
        
        if (type === 'item') items = items.map(i => i.id === id ? { ...i, ...updates } : i);
        if (type === 'block') blocks = blocks.map(b => b.id === id ? { ...b, ...updates } : b);
        if (type === 'structure') structures = structures.map(s => s.id === id ? { ...s, ...updates } : s);
        if (type === 'loot') lootTables = lootTables.map(l => l.id === id ? { ...l, ...updates } : l);
        
        return { items, blocks, structures, lootTables };
      }),

      deleteElement: (id, type) => set((state) => {
        let items = state.items;
        let blocks = state.blocks;
        let structures = state.structures;
        let lootTables = state.lootTables;
        
        if (type === 'item') items = items.filter(i => i.id !== id);
        if (type === 'block') blocks = blocks.filter(b => b.id !== id);
        if (type === 'structure') structures = structures.filter(s => s.id !== id);
        if (type === 'loot') lootTables = lootTables.filter(l => l.id !== id);
        
        return { items, blocks, structures, lootTables };
      }),

      setLogicGraph: (elementId, graph) => set((state) => ({
        logicGraphs: {
          ...state.logicGraphs,
          [elementId]: graph
        }
      })),
      
      openElement: (id, type) => set({ activeElementId: id, activeElementType: type }),
      closeElement: () => set({ activeElementId: null, activeElementType: null })
    }),
    {
      name: 'modforger-storage',
    }
  )
);
