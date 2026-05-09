import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

const MockModel = ({ animation }: { animation: string }) => {
  const groupRef = useRef<any>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Simulate animations
    if (animation === 'Walk') {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 8) * 0.2;
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 4) * 0.2;
    } else if (animation === 'Attack') {
      groupRef.current.position.z = Math.sin(state.clock.elapsedTime * 15) * 0.5;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 15) * 0.3;
    } else {
      // Idle
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05;
      groupRef.current.position.z = 0;
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y = 0;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.25, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.75, 1.25, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
      <mesh position={[0.75, 1.25, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#fcd34d" />
      </mesh>
    </group>
  );
};

export const ThreeDViewer = () => {
  const [anim, setAnim] = useState('Idle');

  return (
    <div className="w-full h-full flex flex-col bg-black/40 rounded-xl overflow-hidden border border-white/10 relative">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        {['Idle', 'Walk', 'Attack'].map(a => (
          <button 
            key={a}
            onClick={() => setAnim(a)}
            className={`px-3 py-1.5 text-xs font-bold rounded ${anim === a ? 'bg-amber-500 text-black' : 'bg-black/80 text-white/70 hover:bg-white/10'}`}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="absolute bottom-2 right-2 z-10">
        <span className="text-[10px] text-white/30 bg-black/50 px-2 py-1 rounded">Three.js / Blockbench Preview</span>
      </div>
      
      <div className="flex-1 w-full h-[300px]">
        <Canvas camera={{ position: [3, 3, 5], fov: 50 }}>
          <color attach="background" args={['#0D0D11']} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Stage environment="city" intensity={0.5}>
             <MockModel animation={anim} />
          </Stage>
          <OrbitControls 
            makeDefault 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 1.5} 
            autoRotate={anim === 'Idle'} 
            autoRotateSpeed={1} 
          />
          <gridHelper args={[20, 20, '#ffffff', '#ffffff']} material-opacity={0.1} material-transparent />
        </Canvas>
      </div>
    </div>
  );
};
