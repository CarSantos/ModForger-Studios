/**
 * ModForger-Studios Universal AI Generator Service
 * Serviço central que atua como o Gerador Universal de Mods.
 */

export type ElementType = 
  | 'block_code'
  | 'block_json'
  | 'item_code'
  | 'item_json'
  | 'recipe_json'
  | 'loot_table_json'
  | 'mob_entity_code'
  | 'biome_json'
  | 'logic_nodes_json';

const fallbackTemplates: Record<ElementType, string> = {
  block_code: `package net.minecraft.world.level.block;

import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.material.Material;

public class CustomBlock extends Block {
    public CustomBlock() {
        super(BlockBehaviour.Properties.of(Material.STONE).strength(2.0f, 3.0f));
    }
}`,
  block_json: `{
  "parent": "block/cube_all",
  "textures": {
    "all": "mymod:block/custom_block"
  }
}`,
  item_code: `package net.minecraft.world.item;

import net.minecraft.world.item.Item;
import net.minecraft.world.item.CreativeModeTab;

public class CustomItem extends Item {
    public CustomItem() {
        super(new Item.Properties().tab(CreativeModeTab.TAB_MISC));
    }
}`,
  item_json: `{
  "parent": "item/generated",
  "textures": {
    "layer0": "mymod:item/custom_item"
  }
}`,
  recipe_json: `{
  "type": "minecraft:crafting_shaped",
  "pattern": [
    "###",
    "###",
    "###"
  ],
  "key": {
    "#": {
      "item": "minecraft:dirt"
    }
  },
  "result": {
    "item": "minecraft:cobblestone",
    "count": 1
  }
}`,
  loot_table_json: `{
  "type": "minecraft:block",
  "pools": [
    {
      "rolls": 1,
      "entries": [
        {
          "type": "minecraft:item",
          "name": "minecraft:dirt"
        }
      ]
    }
  ]
}`,
  mob_entity_code: `package net.minecraft.world.entity.monster;

import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.monster.Monster;
import net.minecraft.world.level.Level;

public class CustomMob extends Monster {
    public CustomMob(EntityType<? extends Monster> type, Level level) {
        super(type, level);
    }
}`,
  biome_json: `{
  "temperature": 0.5,
  "downfall": 0.5,
  "effects": {
    "sky_color": 8103167,
    "fog_color": 12638463,
    "water_color": 4159204,
    "water_fog_color": 329011
  }
}`,
  logic_nodes_json: `{
  "nodes": [],
  "edges": []
}`
};

export const sanitizeAIResponse = (rawText: string, expectedType: 'json' | 'java'): string => {
  let cleaned = rawText.trim();
  
  if (expectedType === 'java') {
    // Limpar aspas triplas de Markdown para código Java
    cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
    // Remover artefactos comuns da IA no final do código
    cleaned = cleaned.replace(/Aqui est[áa] o c[óo]digo.*/gi, '').trim();
  } else if (expectedType === 'json') {
    // Forçar a extração de JSON, mesmo se a IA usar formatação Markdown ou texto extra
    const start = cleaned.indexOf('{');
    const startArr = cleaned.indexOf('[');
    const startIndex = (start !== -1 && startArr !== -1) ? Math.min(start, startArr) : Math.max(start, startArr);
    
    const end = cleaned.lastIndexOf('}');
    const endArr = cleaned.lastIndexOf(']');
    const endIndex = Math.max(end, endArr);
    
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        cleaned = cleaned.substring(startIndex, endIndex + 1);
    } else {
        // Fallback: remover aspas triplas apenas se não foi capturado pelas chaves
        cleaned = cleaned.replace(/^```[a-zA-Z]*\n?/, '').replace(/\n?```$/, '').trim();
    }
  }

  return cleaned;
};

/**
 * Função Universal para gerar conteúdo AI (Java ou JSON) com Fallback Integrado.
 */
export const ModGeneratorService = async (
  promptUtilizador: string,
  tipoElemento: ElementType
): Promise<string> => {
  const isJson = tipoElemento.endsWith('_json');
  const outputType = isJson ? 'json' : 'java';

  const systemInstruction = `
    You are a Senior Software Engineer and the Lead Architect AI for ModForger Studios.
    Your task is to generate EXACT, PERFECT, and PRODUCTION-READY ${isJson ? 'JSON format' : 'Java code (Forge/Fabric)'} for Minecraft Modding.
    
    Element type requested: ${tipoElemento}
    
    STRICT RULES:
    1. If the requested type is JSON (e.g. recipe_json, block_json), return ONLY well-formed JSON. No introductory text, no explanations, no markdown wrappers like \`\`\`json.
    2. If the requested type is Java code (e.g. block_code, mob_entity_code), return ONLY valid Java code. Assume modern standard imports. No text before or after the code block. No \`\`\`java wrappers.
  `;

  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptUtilizador,
        systemInstruction: systemInstruction,
        type: outputType
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.text) {
      console.warn("[ModForger AI] Resposta inválida ou falha no serviço principal. Utilizando Fallback Seguro.");
      return fallbackTemplates[tipoElemento];
    }

    return sanitizeAIResponse(data.text, outputType);
    
  } catch (err: any) {
    console.error("[ModForger AI] Falha crítica de conexão. A carregar o template de fallback. Erro interno:", err);
    return fallbackTemplates[tipoElemento];
  }
};

/**
 * Legacy compatibility wrapper for UI components heavily using "generateModNodes"
 */
export const generateModNodes = async (prompt: string) => {
  const enhancedPrompt = `
    Gera um sistema de nós baseados no pedido do utilizador: "${prompt}"
    The nodes and edges MUST be compatible with @xyflow/react.
    Categories for nodes can be: "event", "action", "condition", "data_math", "variable", "api", "item".
    Each node must have an id, type (set to "custom"), position (x, y), and data.
    The data object must contain "label" and "category".
    Ids must be short random alphanumeric strings.
    Return a root JSON object with "nodes" and "edges" arrays.
  `;

  try {
    const rawJson = await ModGeneratorService(enhancedPrompt, 'logic_nodes_json');
    return JSON.parse(rawJson);
  } catch (error: any) {
    console.error("[ModForger AI] JSON parse error on logic nodes:", error);
    // Return empty nodes as safety fallback, ensuring the app never crashes
    return { nodes: [], edges: [] };
  }
};

