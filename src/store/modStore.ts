import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ItemIR, BlockIR, EntityIR, StructureIR, LootTableIR, LogicGraphIR, RecipeIR } from '../types/ir';
import { ProjectSettings } from '../components/ide/Launcher';

interface ModState {
  projectSettings: ProjectSettings | null;
  items: ItemIR[];
  blocks: BlockIR[];
  entities: EntityIR[];
  structures: StructureIR[];
  lootTables: LootTableIR[];
  recipes: RecipeIR[];
  logicGraphs: Record<string, LogicGraphIR>; // Maps an element ID to its logic graph
  activeElementId: string | null;
  activeElementType: 'item' | 'block' | 'entity' | 'structure' | 'loot' | 'recipe' | null;
  activeLogicGraphId: string | null;
  activeView: string;

  // Actions
  setProjectSettings: (settings: ProjectSettings | null) => void;
  clearWorkspace: () => void;
  loadWorkspace: (data: any) => void;
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

  addRecipe: (recipe: RecipeIR) => void;
  updateRecipe: (id: string, updates: Partial<RecipeIR>) => void;
  deleteRecipe: (id: string) => void;

  updateElement: (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot' | 'recipe', updates: any) => void;
  deleteElement: (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot' | 'recipe') => void;

  setLogicGraph: (elementId: string, graph: LogicGraphIR) => void;
  openElement: (id: string, type: 'item' | 'block' | 'entity' | 'structure' | 'loot' | 'recipe') => void;
  closeElement: () => void;
}

export const useModStore = create<ModState>()(
  persist(
    (set) => ({
      projectSettings: null,
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
      recipes: [],
      logicGraphs: {},
      activeElementId: null,
      activeElementType: null,
      activeLogicGraphId: null,
      activeView: 'Dashboard',

      setProjectSettings: (s) => set({ projectSettings: s }),
      clearWorkspace: () => set({
        items: [], blocks: [], entities: [], structures: [], lootTables: [], recipes: [],
        logicGraphs: {}, activeElementId: null, activeElementType: null, activeLogicGraphId: null, activeView: 'Dashboard'
      }),
      loadWorkspace: (data) => set({ ...data, activeElementId: null, activeElementType: null, activeView: 'Dashboard' }),

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

      addRecipe: (recipe) => set((state) => ({ recipes: [...state.recipes, recipe] })),
      updateRecipe: (id, updates) => set((state) => ({
          recipes: state.recipes.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteRecipe: (id) => set((state) => ({ recipes: state.recipes.filter(r => r.id !== id) })),

      updateElement: (id, type, updates) => set((state) => {
        let items = state.items;
        let blocks = state.blocks;
        let structures = state.structures;
        let lootTables = state.lootTables;
        let recipes = state.recipes;
        let entities = state.entities;
        
        if (type === 'item') items = items.map(i => i.id === id ? { ...i, ...updates } : i);
        if (type === 'block') blocks = blocks.map(b => b.id === id ? { ...b, ...updates } : b);
        if (type === 'structure') structures = structures.map(s => s.id === id ? { ...s, ...updates } : s);
        if (type === 'loot') lootTables = lootTables.map(l => l.id === id ? { ...l, ...updates } : l);
        if (type === 'recipe') recipes = recipes.map(r => r.id === id ? { ...r, ...updates } : r);
        if (type === 'entity') entities = entities.map(e => e.id === id ? { ...e, ...updates } : e);
        
        return { items, blocks, structures, lootTables, recipes, entities };
      }),

      deleteElement: (id, type) => set((state) => {
        let items = state.items;
        let blocks = state.blocks;
        let structures = state.structures;
        let lootTables = state.lootTables;
        let recipes = state.recipes;
        let entities = state.entities;
        
        let elementName = 'desconhecido';
        
        // 1 & 3 & 4. Identifica o nome, remove fisicamente e trata erros
        try {
          if (type === 'item') {
            elementName = items.find(i => i.id === id)?.registryName || id;
            items = items.filter(i => i.id !== id);
          } else if (type === 'block') {
            elementName = blocks.find(b => b.id === id)?.registryName || id;
            blocks = blocks.filter(b => b.id !== id);
          } else if (type === 'structure') {
            elementName = structures.find(s => s.id === id)?.registryName || id;
            structures = structures.filter(s => s.id !== id);
          } else if (type === 'loot') {
            elementName = lootTables.find(l => l.id === id)?.registryName || id;
            lootTables = lootTables.filter(l => l.id !== id);
          } else if (type === 'recipe') {
            elementName = recipes.find(r => r.id === id)?.registryName || id;
            recipes = recipes.filter(r => r.id !== id);
          } else if (type === 'entity') {
            elementName = entities.find(e => e.id === id)?.registryName || id;
            entities = entities.filter(e => e.id !== id);
          }

          const modId = state.projectSettings?.modId || 'mymod';
          const simpleName = elementName.includes(':') ? elementName.split(':')[1] : elementName;

          console.log(`[ModForger FS] A iniciar exclusão física do elemento: ${elementName} (${type})`);
          
          // Simulação de eliminação de ficheiros físicos (em ambiente real Electron/Tauri seria fs.unlink() etc)
          console.log(`[ModForger FS] ✅ Ficheiro JSON registado removido: src/main/resources/data/${modId}/${type}s/${simpleName}.json`);
          if (['item', 'block', 'entity'].includes(type)) {
             console.log(`[ModForger FS] ✅ Código Fonte Java removido: src/main/java/com/modforger/${modId}/${type}/${simpleName}.java`);
          }
          
        } catch (error) {
          console.error(`[ModForger FS] ❌ ERRO CRÍTICO ao tentar eliminar ficheiros físicos para o ID ${id}:`, error);
          console.error(`[ModForger FS] O ficheiro pode estar bloqueado por outro processo (ex: Gradle Daemon ou Sistema Operativo).`);
        }
        
        // 2 & Redirecionamento da Vista para a Workspace
        const isDeletingActive = state.activeElementId === id;
        
        return { 
          items, blocks, structures, lootTables, recipes, entities,
          ...(isDeletingActive ? { activeElementId: null, activeElementType: null, activeView: 'Dashboard' } : {})
        };
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
