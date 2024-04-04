import { Environment, Grid, OrbitControls, useCursor, useKeyboardControls, CameraControls } from "@react-three/drei";
import { Controls } from '../App'
import { useThree } from "@react-three/fiber";
import { useAtom } from "jotai";
import { useState, useEffect, useRef } from "react";

import { Item } from "./Item";
import { charactersAtom, gridAtom, mapAtom, socket, userAtom } from "./SocketManager";
import { useGrid } from '../hooks/useGrid'
import { useFrame } from "@react-three/fiber";
import { Avatar } from "./Avatar";


export const Experience = () => {

  const controls = useRef();
  const [characters] = useAtom(charactersAtom);
  const [grid] = useAtom(gridAtom)
  const [map] = useAtom(mapAtom);

  //to identify if we are in a map clickable area
  const [onFloor, setOnFloor] = useState(false);
  const { vector3ToGrid, gridToVector3 } = useGrid();
  const scene = useThree((state) => state.scene)
  const [user] = useAtom(userAtom)

  useCursor(onFloor);
  const attackPressed = useKeyboardControls((state) => state[Controls.attack]);
  const leftPressed = useKeyboardControls((state) => state[Controls.left]);
  const rightPressed = useKeyboardControls((state) => state[Controls.right]);
  const backPressed = useKeyboardControls((state) => state[Controls.back]);
  const forwardPressed = useKeyboardControls((state) => state[Controls.forward])
  const holdPressed = useKeyboardControls((state) => state[Controls.hold])


  const handldeKeyBoardMove = (forwardPressed = false, leftPressed = false, rightPressed = false, backPressed = false) => {
    let x = forwardPressed ? -1 : 0 + backPressed ? 1 : 0
    let z = leftPressed ? 1 : 0 + rightPressed ? -1 : 0
    const character = scene.getObjectByName(`character-${user}`)
    const checkPosition = vector3ToGrid(character.position, x, z)
    if (!grid.isWalkableAt(checkPosition[0], checkPosition[1])) return
    if (isBusy(vector3ToGrid(character.position, x, z))) return
    if (!character) return
    socket.emit("move",
      vector3ToGrid(character.position),
      vector3ToGrid(character.position, x, z)
    )
  }
  const onCharacterMove = (e) => {
    const character = scene.getObjectByName(`character-${user}`)
    //console.log(character)
    if (!character) return
    socket.emit(
      "move",
      vector3ToGrid(character.position),
      vector3ToGrid(e.point)
    )
  }

  const onCharacterAttack = () => {
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
      const charPosition = vector3ToGrid(scene.getObjectByName(`character-${character.id}`).position)
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
        if (character.path[0]?.length && character.position.distanceTo(gridToVector3(character.path[0])) > 0.40 || character.path[0] === undefined) {
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
      0,
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

      {map.items.map((item, idx) => (
        <Item key={`${item.name}-${idx}`} item={item} />
      ))}
      <mesh
        rotation-x={-Math.PI / 2}
        position-y={-0.002}
        onClick={onCharacterMove}
        // onPointerEnter={() => setOnFloor(true)}
        // onPointerLeave={() => setOnFloor(false)}
        position-x={map.size[0] / 2}
        position-z={map.size[1] / 2}
      >
        <planeGeometry args={map.size} />
        <meshStandardMaterial color="#f0f0aa" />
      </mesh>
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
      <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />
      {characters.map((character) => (
        <Avatar
          attack={character.attack}
          key={`char-${character.id}`}
          id={character.id}
          position={gridToVector3(character.position)}
          charname={character.name}
          path={character.path}
          avatarUrl="/models/Knight.glb"
          orientation={character.orientation}

        />
      ))}
    </>
  );
};
