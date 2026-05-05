import JSZip from 'jszip';

export interface ModForgerElement {
  id: string;
  type: string;
  name: string;
  properties: Record<string, any>;
}

export interface ModForgerProject {
  settings: {
    name: string;
    version: string;
    loader: string;
    dependencies: string[];
  };
  elements: ModForgerElement[];
  textures: string[];
  models: string[];
}

/**
 * Mapeia os Data Types do MCreator para o formato ModForger
 */
function parseMCreatorElement(mcreatorJson: any): ModForgerElement {
  const typeMap: Record<string, string> = {
    'block': 'block',
    'item': 'item',
    'livingentity': 'entity',
    'recipe': 'recipe',
    'procedure': 'logic_node_graph', // Procedimentos são convertidos para o nosso Grafo
  };

  return {
    id: mcreatorJson.registry_name || mcreatorJson.name?.toLowerCase().replace(/\s+/g, '_') || Math.random().toString(),
    type: typeMap[mcreatorJson.type] || 'unknown',
    name: mcreatorJson.name || 'Unnamed Element',
    properties: {
      ...mcreatorJson,
      // Aqui podemos extrair e limpar propriedades específicas (ex: boundingBoxes, block_sounds)
    }
  };
}

/**
 * Lê um ficheiro .zip (formato exportado pelo MCreator) e converte-o 
 * no estado interno (ModForgerProject) para o ModForger Studios.
 */
export async function parseMCreatorProject(file: File): Promise<ModForgerProject> {
  const zip = new JSZip();
  const loadedZip = await zip.loadAsync(file, { createFolders: true });

  const project: ModForgerProject = {
    settings: {
      name: 'Imported Project',
      version: '1.20.1',
      loader: 'forge',
      dependencies: []
    },
    elements: [],
    textures: [],
    models: []
  };

  // 1. Procurar .mcreator para as configurações do projeto
  for (const relativePath in loadedZip.files) {
    if (relativePath.endsWith('.mcreator')) {
      const content = await loadedZip.files[relativePath].async('string');
      try {
        const mcreatorData = JSON.parse(content);
        project.settings.name = mcreatorData.workspaceSettings?.modName || project.settings.name;
        project.settings.version = mcreatorData.workspaceSettings?.version || project.settings.version;
        // Mapear loaders
        const mcLoader = (mcreatorData.workspaceSettings?.modLoader || '').toLowerCase();
        if (mcLoader.includes('fabric')) project.settings.loader = 'fabric';
        if (mcLoader.includes('neo')) project.settings.loader = 'neoforge';
      } catch (e) {
        console.warn('Falha ao analisar .mcreator', e);
      }
      break; // Assumimos que só há um
    }
  }

  // 2. Procurar Elementos (.json na pasta elements)
  for (const relativePath in loadedZip.files) {
    const zipEntry = loadedZip.files[relativePath];
    if (zipEntry.dir) continue;

    if (relativePath.startsWith('elements/') && relativePath.endsWith('.json')) {
      const content = await zipEntry.async('string');
      try {
        const elementData = JSON.parse(content);
        project.elements.push(parseMCreatorElement(elementData));
      } catch (e) {
        console.warn(`Erro ao importar elemento: ${relativePath}`, e);
      }
    }

    if (relativePath.includes('textures/') && (relativePath.endsWith('.png') || relativePath.endsWith('.mcmeta'))) {
      project.textures.push(relativePath);
    }

    if (relativePath.includes('models/') && (relativePath.endsWith('.json') || relativePath.endsWith('.java'))) {
      project.models.push(relativePath);
    }
  }

  return project;
}

/**
 * Converte um procedimento Blockly do MCreator (simplificado) para a estrutura React Flow do ModForger
 */
export function convertBlocklyToNodeGraph(blocklyXml: string) {
  // Num cenário real, usaríamos um parcer XML (como DOMParser numa app web) 
  // para converter a árvore de <block> -> <next> ou <statement>
  // em { nodes: [], edges: [] }
  console.log('TODO: Implementar conversor XML do Blockly para ReactFlow');
  return { nodes: [], edges: [] };
}
