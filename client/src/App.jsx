import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { SocketManager } from "./components/SocketManager";
import { KeyboardControls } from "@react-three/drei";
import { useMemo } from "react";
import { Suspense } from "react";


export const Controls = {
  forward: "forward",
  back: "back",
  left: "left",
  right: "right",
  attack: "attack",
  hold: "hold",
  o: "o"
}

function App() {

  const keyMap = useMemo(() => [
    { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
    { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.hold, keys: ["KeyH", "KeyH"] },
    { name: Controls.attack, keys: ["Space"] },
  ], [])


  return (
    <>
      <SocketManager />
      <KeyboardControls map={keyMap}>
        <Canvas shadows camera={{ position: [10, 10, 10], fov: 30 }}>
          <color attach="background" args={["#ececec"]} />
          <Suspense fallback={null}>
            <Experience />

          </Suspense>
        </Canvas>
      </KeyboardControls>
    </>
  );
}

export default App;
