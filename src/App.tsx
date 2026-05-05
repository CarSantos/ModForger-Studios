import { useState } from 'react';
import { Sidebar } from './components/ide/Sidebar';
import { TopBar } from './components/ide/TopBar';
import { EditorArea } from './components/ide/EditorArea';
import { EntityEditor } from './components/ide/EntityEditor';
import { WorldEditor } from './components/ide/WorldEditor';
import { CustomSystemsEditor } from './components/ide/CustomSystemsEditor';
import { NodeEditor } from './components/ide/NodeEditor';
import { Launcher, ProjectSettings } from './components/ide/Launcher';

export default function App() {
  const [projectSettings, setProjectSettings] = useState<ProjectSettings | null>(null);
  const [activeView, setActiveView] = useState('Lógica (Nodos)');

  if (!projectSettings) {
    return <Launcher onStartProject={setProjectSettings} />;
  }

  return (
    <div className="flex h-screen w-full bg-[#0A0A0C] text-[#E2E2E9] font-sans overflow-hidden">
      <Sidebar projectSettings={projectSettings} activeView={activeView} setActiveView={setActiveView} />
      <div className="flex flex-col flex-1">
        <TopBar projectSettings={projectSettings} />
        {activeView === 'Entidades' ? <EntityEditor /> : 
         activeView === 'Mundo' ? <WorldEditor /> : 
         activeView === 'Lógica (Nodos)' ? <NodeEditor /> :
         activeView === 'Sistemas Custom' ? <CustomSystemsEditor /> : <EditorArea />}
      </div>
    </div>
  );
}
