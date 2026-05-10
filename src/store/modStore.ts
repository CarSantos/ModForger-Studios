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
  activeView: string;

  // Actions
  setActiveView: (view: string) => void;
  addItem: (item: ItemIR) => void;
  updateItem: (id: string, updates: Partial<ItemIR>) => void;
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
      activeView: 'Dashboard',

      setActiveView: (view) => set({ activeView: view }),
      addItem: (item) => set((state) => ({ items: [...state.items, item] })),
      updateItem: (id, updates) => set((state) => ({
          items: state.items.map(i => i.id === id ? { ...i, ...updates } : i)
      })),
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
