import { useGLTF, useCursor } from "@react-three/drei";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { mapAtom } from "./SocketManager";
import { useGrid } from '../hooks/useGrid'
import { Door } from './Door'

export const Item = ({ item, onClick, isDragging, ...props }) => {
  const { name, gridPosition, size, rotation } = item;
  const [map] = useAtom(mapAtom);
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const [isDoor, setIsDoor] = useState(false)
  const [onObject, setOnObject] = useState(false);
  const { gridToVector3 } = useGrid();
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
  useCursor(onObject);

  useEffect(() => {
    if (name === "Gate_Valla_2") setIsDoor(true)
  },
    [])

  return (<>

    {isDoor &&
      <Door
        objectID={"Door0001"}
        key={props.key}
        object={clone}
        open={item.open}
        position={gridToVector3(gridPosition, width, height)}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    }{!isDoor &&
      <primitive
        key={`door-${name}`}
        object={clone}
        onClick={() => { return (console.log(name)) }}
        position={gridToVector3(gridPosition, width, height)}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    }
  </>


  );
};
