import { useGLTF, useCursor } from "@react-three/drei";
import { useAtom } from "jotai";
import { useEffect, useMemo, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { mapsAtom } from "./SocketManager";
import { userAtom } from "./SocketManager";
import { useGrid } from '../hooks/useGrid'
import { Door } from './Door'

import { socket } from './SocketManager'

export const Item = ({ mapId, mapInitPosition, item, onClick, isDragging, ...props }) => {
  const [user] = useAtom(userAtom)
  const { name, gridPosition, size, rotation } = item;
  const { scene } = useGLTF(`/models/items/${name}.glb`);
  const [isDoor, setIsDoor] = useState(false)
  const [onObject, setOnObject] = useState(false);
  const { grid3DToVector3 } = useGrid();
  // Skinned meshes cannot be re-used in threejs without cloning them
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const width = rotation === 1 || rotation === 3 ? size[1] : size[0];
  const height = rotation === 1 || rotation === 3 ? size[0] : size[1];
  useCursor(onObject);

  const handleClick = (e) => {
    console.log(item)
    socket.emit(
      "teleport",
      item
    )
  }

  const handleTeleport = (event, item) => {
    //event.stopPropagation();
    //event.cancelBubble = true;
    // if (event.stopPropagation) {
    //   event.stopPropagation();   // W3C model
    // } else {
    //   event.cancelBubble = true; // IE model
    // }
    if (item.type === "teleport") {
      socket.emit(
        "teleport",
        item
      )
    }
  }

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
        position={grid3DToVector3(gridPosition, mapId, width, height,)}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    }{!isDoor && (item.type != "teleport") &&
      <primitive
        key={`door-${name}`}
        object={clone}
        //onClick={() => { actionType(item) }}
        onClick={() => { console.log(name) }}
        position={grid3DToVector3(gridPosition, mapId, width, height)}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    }{(item.type === "teleport") &&
      <primitive
        objectID={item.teleportId}
        key={props.key}
        object={clone}
        open={item.open}
        onClick={handleClick}
        //onClick={(event) => { handleTeleport(event, item) }}
        position={grid3DToVector3(gridPosition, mapId, width, height,)}
        rotation-y={((rotation || 0) * Math.PI) / 2}
      />
    }
  </>
  );
};
