# Arquitetura do ModForger Studios

Este documento detalha o design do motor e as integrações do ModForger Studios.

## 1. Integração com Blockbench

O Blockbench é a ferramenta padrão da indústria para modelagem e animação no Minecraft. A integração com o ModForger será feita através dos seguintes métodos:

### Formatos Suportados
*   **Modelos `.json` (Minecraft Java Block/Item):** Formato padrão para blocos e itens. O ModForger fará o parse direto dos arrays de elementos, mapeamento de texturas (faces `north`, `south`, etc.) e display settings.
*   **Modelos Geckolib / Bedrock (`.json` de entidades):** Para entidades animadas.
*   **Arquivos nativos `.bbmodel`:** Como o `.bbmodel` é essencialmente um JSON estruturado, podemos extrair as texturas embutidas (Base64) e geometria diretamente no interpretador Rust sem exigir que o usuário exporte os arquivos manualmente.

### Pipeline de Importação
1.  **Upload/Drop:** O usuário arrasta o `.bbmodel` ou `.json` para a interface (React).
2.  **Processamento (Rust Core):** O motor Rust lê o arquivo, extrai as texturas, e gera os mapeamentos (UV) adequados.
3.  **Gerenciamento de Assets:** Os modelos são salvos do lado do workspace em `resources/models/` e as texturas em `resources/textures/`.
4.  **Preview D:** Utilizando `three.js` no frontend, podemos renderizar uma pré-visualização do modelo.

## 2. Arquitetura do Motor Core (Rust)

O motor do ModForger é projetado para ser leve, seguro em memória e altamente performático.

### 2.1. Leitura e Interpretação de Assets do Minecraft Base
O motor terá um sistema de **VFS (Virtual File System)** que mapeia os `.jar` do Minecraft original. Isso permitirá que o ModForger leia texturas, receitas e lógicas vanilla sem extraí-las fisicamente, referenciando os IDs nativos (ex: `minecraft:iron_ingot`).

### 2.2. Geração de Código e Modificação
Em vez de reinventar a roda, o ModForger operará como um **Transpilador/Gerador**.
*   **Representação Intermediária (IR):** Tudo que o usuário cria (seja visual ou via IA) vira um JSON unificado.
*   **Backend Forge/Fabric:** Módulos em Rust lerão o IR e gerarão código Java compatível com a API do Forge, NeoForge ou Fabric.
*   Isso significa que o mod exportado (.jar) será código Java nativo perfeitamente legível caso o usuário decida continuar programando manualmente depois.

### 2.3. Sistema de Scripting para Lógica Complexa
Para não limitar o usuário apenas aos blocos visuais, integraremos um motor de scripts:
*   **Motor Sugerido:** Lua (via módulo `mlua` do Rust) ou JavaScript/TypeScript (via `Deno core` ou `Boa`). JS/TS é preferível pela sintaxe familiar.
*   **Como Funciona:** Em eventos (ex: "Ao Quebrar Bloco"), o ModForger executará um template de script. Se o usuário quiser criar mecânicas complexas que a interface visual não cobre, ele pode escrever um script. Durante a etapa de compilação, o motor Rust converte essa árvore de lógica em classes Java Equivalentes, ou inclui um interpretador Rhino/Nashorn leve se for impossível transpilar perfeitamente.

### 2.4. Modularidade e Extensibilidade
*   **Sistema de Plugins:** A arquitetura do ModForger permite que a comunidade crie extensões (ex: "Addon de Magia" que adiciona novos nós visuais para feitiços).
*   **Integração de IA:** A IA atua na Representação Intermediária. Quando o utilizador pede: *"Quero que este minério expluda se minerado com uma picareta de madeira"*, a IA gera o payload JSON ou Script JS correspondente e injeta no motor. Como a base é modular, a IA não precisa escrever Java puro (que é propenso a falhas de contexto), ela apenas escreve as regras lógicas no formato do ModForger, e o Motor Rust garante que isso virja Java válido e seguro no final.
