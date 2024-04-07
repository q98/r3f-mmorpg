import { Environment, Grid, OrbitControls, useCursor, useKeyboardControls, CameraControls } from "@react-three/drei";
import { Controls } from '../App'
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useState, useEffect, useRef } from "react";

import { Item } from "./Item";
import { charactersAtom, gridAtom, gridsAtom, mapAtom, mapsAtom, socket, userAtom } from "./SocketManager";
import { useGrid } from '../hooks/useGrid'
import { useFrame } from "@react-three/fiber";
import { Avatar } from "./Avatar";

const getPlayerMapId = (playerId) => {
  characters.find((character) => {
    if (character.id === playerId) {
      return character.mapId
    }
  })
}



export const Experience = () => {

  const controls = useRef();
  const [characters] = useAtom(charactersAtom);
  const [grids] = useAtom(gridsAtom)
  const [grid] = useAtom(gridAtom)
  const [map] = useAtom(mapAtom);
  const [maps] = useAtom(mapsAtom);

  //to identify if we are in a map clickable area
  const [onFloor, setOnFloor] = useState(false);
  const { vector3ToGrid, grid3DToVector3, vector3ToGrid3D } = useGrid();
  const scene = useThree((state) => state.scene)
  const [user] = useAtom(userAtom)

  useCursor(onFloor);
  const attackPressed = useKeyboardControls((state) => state[Controls.attack]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls((state) => state[Controls.forward])
  const holdPressed = useKeyboardControls((state) => state[Controls.hold])

  const getMapIndex = (mapId) => {
    for (let i = 0; i < maps.length; i++) {
      if (maps[i].mapId === mapId) {
        //console.log(`${mapId} index: ${i}`)
        return i
      }
    }
    return null
  }
  const handldeKeyBoardMove = (forwardPressed = false, leftPressed = false, rightPressed = false, backPressed = false) => {
    let x = forwardPressed ? -1 : 0 + backPressed ? 1 : 0
    let z = leftPressed ? 1 : 0 + rightPressed ? -1 : 0
    const characterScene = scene.getObjectByName(`character-${user}`)
    const character = characters.find((character) => {
      return (character.id === user)
    })
    //console.log("mapID -->" + getMapIndex(character.mapId))
    //console.log(character.mapId)
    //console.log("handldeKeyBoardMove - showing mapId: " + character.mapId)

    const checkPosition = vector3ToGrid(characterScene.position, x, z)
    //console.log(checkPosition)
    if (!grids[getMapIndex(character.mapId)].isWalkableAt(checkPosition[0], checkPosition[1])) return
    if (isBusy(vector3ToGrid(characterScene.position, x, z))) return
    if (!characterScene) return

    socket.emit("move",
      vector3ToGrid3D(characterScene.position, characterScene.mapId),
      vector3ToGrid3D(characterScene.position, characterScene.mapId, x, z)
      //vector3ToGrid(characterScene.position),
      //vector3ToGrid(characterScene.position, x, z)
    )
  }
  const onCharacterMove = (e) => {

    if (holdPressed) return
    const characterScene = scene.getObjectByName(`character-${user}`)
    //console.log(character)
    if (!characterScene) return
    if (characterScene.mapId)

      if (e.object.mapId != characterScene.mapId) return
    //console.log(user)
    //console.log(characterScene)
    //console.log("ClickMove - showing mapId: " + characterScene.mapId)
    //console.log("From vector3ToGrid: " + characterScene.mapId + " -> " + vector3ToGrid3D(characterScene.position, characterScene.mapId))
    //console.log("To vector3ToGrid: " + characterScene.mapId + " -> " + vector3ToGrid3D(e.point, characterScene.mapId))
    console.log(e)
    //console.log(vector3ToGrid3D(e.point, characterScene.mapId))
    socket.emit(
      "move",
      vector3ToGrid3D(characterScene.position, characterScene.mapId),
      vector3ToGrid3D(e.point, characterScene.mapId)
      //vector3ToGrid(characterScene.position),
      //vector3ToGrid(e.point)
    )
  }

  const onCharacterAttack = (event) => {
    if (event.stopPropagation) {
      event.stopPropagation();   // W3C model
    } else {
      event.cancelBubble = true; // IE model
    }
    const character = scene.getObjectByName(`character-${user}`)
    character.attack = "attack"
    if (!character) return
    socket.emit(
      "attack",
      character.side
    )
  }

  //this function is used at the Avatar during the PathFinder and here because of KeyBoardMoves
  const isBusy = (targetPositionGrid) => {
    return characters.find((character) => {
      const charPosition = vector3ToGrid3D(scene.getObjectByName(`character-${character.id}`).position, character.mapId)
      //const charPosition = vector3ToGrid(scene.getObjectByName(`character-${character.id}`).position)
      return (charPosition[0] === targetPositionGrid[0] && charPosition[1] === targetPositionGrid[1])
    })
  }

  const getOrientation = (forwardPressed = false, leftPressed = false, rightPressed = false, backPressed = false) => {
    let orientation = 0
    if (forwardPressed) orientation += 1
    if (leftPressed) orientation += 2
    if (rightPressed) orientation += 4
    if (backPressed) orientation += 6
    //forward = 1
    //forward+left = 3
    //forward+right= 5
    //left=2
    //right=4
    //back=6
    //back+left=8
    //back+right=10
    return orientation
  }
  //Not moving just chanting characters orientation
  const handlePivot = (orientation) => {
    const character = scene.getObjectByName(`character-${user}`)
    if (!character) return
    if (character.orientation !== orientation) {
      character.orientation = orientation
      socket.emit("playerPivot", orientation)
    }

  }

  useFrame((_state, delta) => {

    if (attackPressed && !(forwardPressed || leftPressed || rightPressed || backPressed)) {
      const character = scene.getObjectByName(`character-${user}`)
      if (!character.attack?.length) {
        onCharacterAttack()
      }
    } else if (forwardPressed || leftPressed || rightPressed || backPressed) {

      if (holdPressed && (forwardPressed || leftPressed || rightPressed || backPressed)) {
        handlePivot(getOrientation(forwardPressed, leftPressed, rightPressed, backPressed))
      } else {
        const character = scene.getObjectByName(`character-${user}`)
        //console.log("grid3DToVector: ")
        //console.log(grid3DToVector3(character.path[0], character.mapId))
        // console.log(grid3DToVector3(character.path[0], character.mapId))
        //if (character.path[0]?.length && character.position.distanceTo(grid3DToVector3(character.path[0], character.mapId)) > 0.40 || character.path[0] === undefined) {

        if (character.path[0]?.length && character.position.distanceTo(grid3DToVector3(character.path[0], character.mapId)) > 0.40 || character.path[0] === undefined) {
          handldeKeyBoardMove(forwardPressed, leftPressed, rightPressed, backPressed)
        }
      }
    }
  });
  //this is just to change camera position following the user's character
  useFrame(({ scene }) => {
    if (!user) {
      return;
    }
    const character = scene.getObjectByName(`character-${user}`);
    if (!character) {
      return;
    }
    controls.current.setTarget(
      character.position.x,
      maps[getMapIndex(character.mapId)].initPosition[1],
      character.position.z,
      true
    );
    controls.current.setPosition(
      character.position.x + 8,
      character.position.y + 8,
      character.position.z + 8,
      true
    );
  });

  useEffect(() => {
    // INITIAL CAMERA POSITION
    controls.current.setPosition(0, 8, 2);
    controls.current.setTarget(0, 8, 0);


  }, []);

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.3} />
      <OrbitControls />

      <mesh
        mapId="roof"
        rotation-x={-Math.PI / 2}
        position-y={maps[1].initPosition[1]}
        //onClick={(e) => console.log('click')}
        onClick={(e) => onCharacterMove(e)}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
        position-x={maps[1].initPosition[0] + maps[1].size[0] / 2}
        position-z={maps[1].initPosition[2] + maps[1].size[1] / 2}
      >
        <planeGeometry args={maps[1].size} />
        <meshStandardMaterial color="#bc6b4f" />
      </mesh>
      {maps[1].items.map((item, idx) => (
        <Item mapId={maps[1].mapId} mapInitPosition={maps[1].initPosition} key={`${item.name}-${idx}`} item={item} />
      ))}


      <mesh
        mapId="level-0"
        rotation-x={-Math.PI / 2}
        position-y={maps[0].initPosition[1]}
        onClick={(e) => onCharacterMove(e)}
        // onPointerEnter={() => setOnFloor(true)}
        // onPointerLeave={() => setOnFloor(false)}
        position-x={maps[0].initPosition[0] + maps[0].size[0] / 2}
        position-z={maps[0].initPosition[2] + maps[0].size[1] / 2}
      >
        <planeGeometry args={maps[0].size} />
        <meshStandardMaterial color="#f0f0aa" />
      </mesh>
      {map.items.map((item, idx) => (
        <Item mapId={maps[0].mapId} mapInitPosition={maps[0].initPosition} key={`${item.name}-${idx}`} item={item} />
      ))}

      <CameraControls
        ref={controls}
        // disable all mouse buttons
        mouseButtons={{
          left: 0,
          middle: 0,
          right: 0,
          wheel: 0,
        }}
        // disable all touch gestures
        touches={{
          one: 0,
          two: 0,
          three: 0,
        }}
      />
      {/* <Grid infiniteGrid fadeDistance={50} fadeStrength={5} /> */}
      {characters.map((character) => (
        <Avatar
          teleport={character.teleport}
          onClick={() => { console.log(`${character.name} level ${character.level}`) }}
          attack={character.attack}
          key={`char-${character.id}`}
          id={character.id}
          position={grid3DToVector3(character.position, character.mapId)}
          charname={character.name}
          path={character.path}
          avatarUrl="/models/Knight.glb"
          orientation={character.orientation}
          mapId={character.mapId}
          mapInitPosition={maps[getMapIndex(character.mapId)].initPosition}

        />
      ))}
    </>
  );
};
