import { useState } from 'react';
import { Beaker, Plus, Settings, Variable, Database, Code2, Droplet, Zap, Maximize, Activity } from 'lucide-react';

export const CustomSystemsEditor = () => {
  const [systemName, setSystemName] = useState('Mana');
  const [systemType, setSystemType] = useState('Float');
  const [maxValue, setMaxValue] = useState(100);
  const [initialValue, setInitialValue] = useState(100);
  
  const [showInHud, setShowInHud] = useState(true);
  const [barColor, setBarColor] = useState('#3B82F6');
  const [hudPosition, setHudPosition] = useState('bottom_right');

  const [rules, setRules] = useState([
    { id: 1, trigger: 'minecraft:potion', action: 'add', amount: 20 },
    { id: 2, trigger: 'modforger:magic_wand', action: 'consume', amount: 10 }
  ]);

  const addRule = () => {
    setRules([...rules, { id: Date.now(), trigger: '', action: 'consume', amount: 5 }]);
  };

  const generateCapabilityCode = () => {
    const varClass = systemName.replace(/\s+/g, '');
    const varLower = varClass.toLowerCase();

    return `package com.modforger.systems;

import net.minecraftforge.common.capabilities.Capability;
import net.minecraftforge.common.capabilities.CapabilityManager;
import net.minecraftforge.common.capabilities.CapabilityToken;
import net.minecraftforge.common.capabilities.RegisterCapabilitiesEvent;
import net.minecraftforge.eventbus.api.SubscribeEvent;

// Example Forge/NeoForge Capability Implementation
public class ${varClass}Capability {
    public static final Capability<I${varClass}> ${varClass.toUpperCase()}_CAP = CapabilityManager.get(new CapabilityToken<>() {});

    public interface I${varClass} {
        ${systemType.toLowerCase()} get();
        void set(${systemType.toLowerCase()} value);
        void add(${systemType.toLowerCase()} value);
        void consume(${systemType.toLowerCase()} value);
    }

    public static class Default${varClass} implements I${varClass} {
        private ${systemType.toLowerCase()} value = ${initialValue}${systemType === 'Float' ? 'f' : ''};
        private final ${systemType.toLowerCase()} max = ${maxValue}${systemType === 'Float' ? 'f' : ''};

        @Override
        public ${systemType.toLowerCase()} get() { return this.value; }

        @Override
        public void set(${systemType.toLowerCase()} value) { 
            this.value = Math.max(0, Math.min(value, this.max)); 
        }

        @Override
        public void add(${systemType.toLowerCase()} amount) { set(this.value + amount); }

        @Override
        public void consume(${systemType.toLowerCase()} amount) { set(this.value - amount); }
    }
}
`;
  };

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top_right,_#1a1510_0%,_#0A0A0C_60%)] flex flex-col relative overflow-hidden">
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 flex items-center gap-3 italic">
              <Beaker className="text-amber-500 w-8 h-8" />
              Sistemas Custom (Beyond Minecraft)
            </h1>
            <p className="text-white/40 text-lg max-w-2xl font-light italic">
              Crie sistemas globais de variáveis (Mana, Energia, Stamina) e injete-os nos jogadores via Capabilities / Data Components.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Variable Definition */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                <Database size={16} className="text-amber-500" />
                Definição da Variável
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Nome do Sistema</label>
                    <input type="text" value={systemName} onChange={(e) => setSystemName(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Tipo de Dado</label>
                    <select value={systemType} onChange={(e) => setSystemType(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none">
                      <option value="Float">Float (Fração)</option>
                      <option value="Integer">Integer (Inteiro)</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Valor Máximo</label>
                    <input type="number" value={maxValue} onChange={(e) => setMaxValue(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/60 mb-1">Valor Inicial</label>
                    <input type="number" value={initialValue} onChange={(e) => setInitialValue(Number(e.target.value))} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* HUD / Interface */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
              <h3 className="text-white font-bold mb-4 border-b border-white/5 pb-2 flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                Interface Visual (HUD)
              </h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer mb-2">
                  <input type="checkbox" checked={showInHud} onChange={(e) => setShowInHud(e.target.checked)} className="accent-amber-500 w-4 h-4 rounded" />
                  Renderizar barra no ecrã (Overlay)
                </label>

                {showInHud && (
                  <>
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-white/60">Cor da Barra</label>
                      <div className="flex items-center gap-2">
                        <input type="color" value={barColor} onChange={(e) => setBarColor(e.target.value)} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0 p-0" />
                        <span className="text-sm font-mono text-white/50">{barColor.toUpperCase()}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-white/60 mb-1">Posição</label>
                      <select value={hudPosition} onChange={(e) => setHudPosition(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none">
                        <option value="above_actionbar">Acima da Hotbar</option>
                        <option value="top_left">Canto Superior Esquerdo</option>
                        <option value="top_right">Canto Superior Direito</option>
                        <option value="bottom_left">Canto Inferior Esquerdo</option>
                        <option value="bottom_right">Canto Inferior Direito</option>
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Logic / Rules */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 backdrop-blur-sm lg:col-span-2">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" />
                  Lógica de Consumo / Ganho
                </h3>
                <button onClick={addRule} className="text-xs bg-white/5 hover:bg-white/10 text-white font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                  <Plus size={14} /> Adicionar Regra
                </button>
              </div>

              <div className="space-y-3">
                {rules.map((rule, idx) => (
                  <div key={rule.id} className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-black/30 p-3 border border-white/5 rounded-xl">
                    <span className="text-white/40 text-xs font-mono w-6">#{idx + 1}</span>
                    <div className="flex flex-col flex-1">
                      <label className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Gatilho (Item Usado / Ação)</label>
                      <input 
                        type="text" 
                        value={rule.trigger}
                        onChange={(e) => {
                          const newRules = [...rules];
                          newRules[idx].trigger = e.target.value;
                          setRules(newRules);
                        }}
                        className="bg-black/60 border border-white/10 rounded p-1.5 text-sm text-amber-200 outline-none focus:border-amber-500 w-full"
                        placeholder="Ex: minecraft:ender_pearl, jump"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                      <select 
                        value={rule.action}
                        onChange={(e) => {
                          const newRules = [...rules];
                          newRules[idx].action = e.target.value;
                          setRules(newRules);
                        }}
                        className="bg-black/60 border border-white/10 rounded p-1.5 text-sm text-white outline-none focus:border-amber-500"
                      >
                        <option value="consume">Consome</option>
                        <option value="add">Restaura</option>
                      </select>
                      <input 
                        type="number" 
                        value={rule.amount}
                        onChange={(e) => {
                          const newRules = [...rules];
                          newRules[idx].amount = Number(e.target.value);
                          setRules(newRules);
                        }}
                        className="bg-black/60 border border-white/10 rounded p-1.5 text-sm text-white outline-none focus:border-amber-500 w-16"
                      />
                      <span className="text-white/40 text-sm font-medium">{systemName}</span>
                    </div>
                  </div>
                ))}
                {rules.length === 0 && (
                  <p className="text-center text-white/30 text-sm py-4">Sem regras definidas. O valor não mudará por ações diretas.</p>
                )}
              </div>
            </div>

            {/* Code Generator Preview */}
            <div className="bg-black/60 border border-white/10 rounded-2xl overflow-hidden flex flex-col lg:col-span-2">
              <div className="bg-[#0F0F13] px-6 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-white/50 uppercase tracking-widest">
                  <Code2 size={14} className="text-blue-400" />
                  Gerador de Java (Capabilities/Data Components)
                </div>
              </div>
              <div className="p-4 overflow-y-auto max-h-[400px]">
                <pre className="text-[11px] font-mono text-white/70 leading-relaxed">
                  <code dangerouslySetInnerHTML={{ __html: generateCapabilityCode()
                    .replace(/class/g, '<span class="text-pink-400">class</span>')
                    .replace(/public/g, '<span class="text-pink-400">public</span>')
                    .replace(/import/g, '<span class="text-pink-400">import</span>')
                    .replace(/static/g, '<span class="text-pink-400">static</span>')
                    .replace(/final/g, '<span class="text-pink-400">final</span>')
                    .replace(/private/g, '<span class="text-pink-400">private</span>')
                    .replace(/interface/g, '<span class="text-pink-400">interface</span>')
                    .replace(/Override/g, '<span class="text-emerald-400">Override</span>')
                    .replace(/return/g, '<span class="text-pink-400">return</span>')
                    .replace(/void/g, '<span class="text-blue-300">void</span>')
                    .replace(/Math\.max/g, '<span class="text-blue-300">Math.max</span>')
                    .replace(/Math\.min/g, '<span class="text-blue-300">Math.min</span>')
                  }} />
                </pre>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
