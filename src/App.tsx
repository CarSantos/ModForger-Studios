import { useState } from 'react';
import { Sidebar } from './components/ide/Sidebar';
import { TopBar } from './components/ide/TopBar';
import { BlockEditor } from './components/ide/BlockEditor';
import { ItemEditor } from './components/ide/ItemEditor';
import { EntityEditor } from './components/ide/EntityEditor';
import { LootEditor } from './components/ide/LootEditor';
import { WorldEditor } from './components/ide/WorldEditor';
import { RecipeEditor } from './components/ide/RecipeEditor';
import { CustomSystemsEditor } from './components/ide/CustomSystemsEditor';
import { NodeEditor } from './components/ide/NodeEditor';
import { ModelEditor } from './components/ide/ModelEditor';
import { SettingsEditor } from './components/ide/SettingsEditor';
import { DashboardView } from './components/ide/DashboardView';
import { TextureEditor } from './components/ide/TextureEditor';
import { ProjectileEditor } from './components/ide/ProjectileEditor';
import { EnchantmentEditor } from './components/ide/EnchantmentEditor';
import { EffectEditor } from './components/ide/EffectEditor';
import { Launcher, ProjectSettings } from './components/ide/Launcher';
import { useModStore } from './store/modStore';

export default function App() {
  const [projectSettings, setProjectSettings] = useState<ProjectSettings | null>(null);
  const activeView = useModStore(state => state.activeView);
  const setActiveView = useModStore(state => state.setActiveView);

  if (!projectSettings) {
    return <Launcher onStartProject={setProjectSettings} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#0A0A0C] text-[#E2E2E9] font-sans overflow-hidden">
      <Sidebar projectSettings={projectSettings} activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1 h-screen overflow-hidden min-w-0 min-h-0">
        <TopBar projectSettings={projectSettings} />
        {activeView === 'Dashboard' && <DashboardView projectSettings={projectSettings} setProjectSettings={setProjectSettings} setActiveView={setActiveView} />}
        {activeView === 'Blocos' && <BlockEditor setActiveView={setActiveView} />}
        {activeView === 'Itens' && <ItemEditor />}
        {activeView === 'Projéteis' && <ProjectileEditor />}
        {activeView === 'Entidades' && <EntityEditor setActiveView={setActiveView} />}
        {activeView === 'Loots' && <LootEditor />}
        {activeView === 'Mundo' && <WorldEditor />}
        {activeView === 'Encantamentos' && <EnchantmentEditor setActiveView={setActiveView} />}
        {activeView === 'Efeitos' && <EffectEditor setActiveView={setActiveView} />}
        {activeView === 'Modelos' && <ModelEditor />}
        {activeView === 'Texturas' && <TextureEditor />}
        {activeView === 'Receitas' && <RecipeEditor setActiveView={setActiveView} />}
        {activeView === 'Lógica (Nodos)' && <NodeEditor />}
        {activeView === 'Sistemas Custom' && <CustomSystemsEditor setActiveView={setActiveView} />}
        {activeView === 'Configurações do Projeto' && <SettingsEditor projectSettings={projectSettings} setProjectSettings={setProjectSettings} />}
      </div>
    </div>
  );
}
