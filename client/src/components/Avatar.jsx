
import { Html, useAnimations, useGLTF, Text } from "@react-three/drei";
import { useFrame, useGraph } from "@react-three/fiber";
import { useAtom } from "jotai";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { SkeletonUtils } from "three-stdlib";
import { useGrid } from "../hooks/useGrid";
import { charactersAtom, userAtom } from "./SocketManager";
import { useThree } from "@react-three/fiber";



const MOVEMENT_SPEED = 2;

const WEAPONS = [
    "1H_Sword",
    "2H_Sword",
    "1H_Sword_Offhand",
    "Spike_Shield",
    "Badge_Shield",
    "Round_Shield",
    "Rectangle_Shield"
];
const ANIMATION_COMBAT = [
    "1H_Melee_Attack_Chop",
    "1H_Melee_Attack_Slice_Diagonal",
    "1H_Melee_Attack_Slice_Horizontal",
    "1H_Melee_Attack_Stab",
    "1H_Ranged_Aiming",
    "1H_Ranged_Reload",
    "1H_Ranged_Shoot",
    "1H_Ranged_Shooting",
    "2H_Melee_Attack_Chop",
    "2H_Melee_Attack_Slice",
    "2H_Melee_Attack_Spin",
    "2H_Melee_Attack_Spinning",
    "2H_Melee_Attack_Stab",
    "2H_Melee_Idle",
    "2H_Ranged_Aiming",
    "2H_Ranged_Reload",
    "2H_Ranged_Shoot",
    "2H_Ranged_Shooting",
    "Unarmed_Idle",
    "Unarmed_Melee_Attack_Kick",
    "Unarmed_Melee_Attack_Punch_A",
    "Unarmed_Melee_Attack_Punch_B",
    "Dualwield_Melee_Attack_Chop",
    "Dualwield_Melee_Attack_Slice",
    "Dualwield_Melee_Attack_Stab",
    "Hit_A",
    "Hit_B",
    "Block",
    "Block_Attack",
    "Block_Hit",
    "Blocking",
    "Dodge_Backward",
    "Dodge_Forward",
    "Dodge_Left",
    "Dodge_Right",
    "Spellcast_Long",
    "Spellcast_Raise",
    "Spellcast_Shoot",
    "Spellcasting"


]
const ANIMATION_OTHERS = [
    "Cheer",
    "Death_A",
    "Death_A_Pose",
    "Death_B",
    "Death_B_Pose",
    "Idle",
    "Interact",
    "Jump_Full_Long",
    "Jump_Full_Short",
    "Jump_Idle",
    "Jump_Land",
    "Jump_Start",
    "Lie_Down",
    "Lie_Idle",
    "Lie_Pose",
    "Lie_StandUp",
    "PickUp",
    "Running_A",
    "Running_B",
    "Running_Strafe_Left",
    "Running_Strafe_Right",
    "Sit_Chair_Down",
    "Sit_Chair_Idle",
    "Sit_Chair_Pose",
    "Sit_Chair_StandUp",
    "Sit_Floor_Down",
    "Sit_Floor_Idle",
    "Sit_Floor_Pose",
    "Sit_Floor_StandUp",
    "T-Pose",
    "Unarmed_Pose",
    "Use_Item",
    "Walking_A",
    "Walking_B",
    "Walking_Backwards",
    "Walking_C"
]

export function Avatar({
    weapon = "1H_Sword",
    id,
    charname,
    avatarUrl = "/models/Knight.glb",
    mapId,
    mapInitPosition,
    ...props
}) {
    //console.log("Avatar at the: " + mapId)
    const group = useRef();
    //!!!clarify
    const position = useMemo(() => props.position, []);
    const [characters] = useAtom(charactersAtom);
    const mainScene = useThree((state) => state.scene)
    const [path, setPath] = useState();
    const [teleport, setTeleport] = useState(false)
    const { vector3ToGrid, grid3DToVector3 } = useGrid();
    const { scene, materials, animations } = useGLTF(avatarUrl);
    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    // useGraph creates two flat object collections for nodes and materials
    const { nodes } = useGraph(clone);
    const { actions } = useAnimations(animations, group);
    const [animation, setAnimation] = useState("Idle");
    const [user] = useAtom(userAtom);


    //Set the model preferences
    useEffect(() => {
        // HIDING NON-SELECTED WEAPONS
        WEAPONS.forEach((wp) => {
            const isCurrentWeapon = wp === weapon;
            nodes[wp].visible = isCurrentWeapon;
            nodes["Knight_Cape"].visible = false;
            nodes["Knight_Helmet"].visible = false;
        })
    }, [nodes, clone]);

    //This is just a conversion from grid to Vector
    useEffect(() => {
        const vectorPath = [];
        props.path?.forEach((gridPosition) => {
            vectorPath.push(grid3DToVector3(gridPosition, mapId));
        });
        setPath(vectorPath);
        //console.log("Path Changes - showing mapId: " + mapId)
    }, [props.path]);

    useEffect(() => {
        setTeleport(props.teleport);
    }, [props.teleport]);

    //Animation in action fadein fadeOut
    useEffect(() => {
        actions[animation].reset().fadeIn(0.32).play();
        return () => actions[animation]?.fadeOut(0.32);
    }, [animation]);

    const isBusy = (targetPositionVector) => {
        //console.log("isBusy - showing mapId: " + mapId)
        const targetPositionGrid = vector3ToGrid(targetPositionVector)
        return characters.find((character) => {
            const charPosition = vector3ToGrid(mainScene.getObjectByName(`character-${character.id}`).position)
            return charPosition[0] === targetPositionGrid[0] && charPosition[1] === targetPositionGrid[1]
        })
    }
    //this is used to do the Avatar lookAt(vector, orientation)
    //orientation is a code from 1 to 10 that identified the oritentation we want
    const getOrientationPosition = (position, orientation, mapId) => {
        let x = 0
        let z = 0


        //forward = 1
        //forward+left = 3
        //forward+right= 5
        //left=2
        //right=4
        //back=6
        //back+left=8
        //back+right=10
        //console.log(mapInitPosition[1])
        if (orientation === 1 || orientation === 3 || orientation === 5) {
            x -= 10
        }
        if (orientation === 3 || orientation === 2 || orientation === 8) {
            z += 10
        }
        if (orientation === 4 || orientation === 5 || orientation === 10) {
            z -= 10
        }
        if (orientation === 6 || orientation === 8 || orientation === 10) {
            x += 10
        }
        x -= mapInitPosition[0] * 2
        z -= mapInitPosition[2] * 2
        return [position[0] + x, position[1] + z, mapInitPosition[1]]
    }

    //place the animation in case props.attack changes and it's not null
    useEffect(() => {
        if (props.attack != null) {
            setAnimation("1H_Melee_Attack_Slice_Horizontal")
        }
        //console.log(mapId)
    }, [props.attack]);

    // useEffect(() => {
    //     if (path?.length) {
    //         console.log(mapInitPosition)
    //         group.current.position.z = path[0].z
    //         group.current.position.x = path[0].x
    //         group.current.position.y = mapInitPosition[1]
    //         console.log(props.orientation)
    //         //group.current.lookAt(grid3DToVector3(getOrientationPosition(vector3ToGrid(group.current.position), props.orientation), mapId));
    //         path.shift();
    //         console.log(path)
    //     }

    // }, [props.teleport]);
    //
    useEffect(() => {
        //console.log("Orientation Change - showing mapId: " + mapId)
        //console.log(grid3DToVector3(getOrientationPosition(vector3ToGrid(group.current.position), props.orientation), mapId))
        group.current.lookAt(grid3DToVector3(getOrientationPosition(vector3ToGrid(group.current.position), props.orientation), mapId));
    }, [props.orientation]);

    useFrame((state, delta) => {
        // if (props.teleport && path?.length) {
        if (teleport && path?.length) {
            console.log(mapInitPosition)
            group.current.position.z = path[0].z
            group.current.position.x = path[0].x
            group.current.position.y = mapInitPosition[1]
            console.log(props.orientation)
            group.current.lookAt(grid3DToVector3(getOrientationPosition(vector3ToGrid(group.current.position), props.orientation), mapId));
            path.shift();
            console.log("isteleport!!")
            console.log(path)
            setTeleport(false)
        }
        if (props.attack?.length && props.attack != null) {
            setTimeout(function () {
                props.attack.shift();
            }, 1000);

        }
        //0.1 is to prepare next movement before reaching the position and avoid a loop movement
        if (path?.length && group.current.position.distanceTo(path[0]) > 0.1) {
            const direction = group.current.position
                .clone()
                .sub(path[0])
                .normalize()
                .multiplyScalar(MOVEMENT_SPEED * delta);
            group.current.position.sub(direction);
            group.current.lookAt(path[0]);
            setAnimation("Walking_A");

        } else if (path?.length && path.length > 1) {
            if (isBusy(path[1])) {
                path.length = 0;
                props.path.length = 0
            } else {
                group.current.position.z = path[0].z
                group.current.position.x = path[0].x
                group.current.position.y = path[0].y
                //group.current.lookAt(grid3DToVector3(getOrientationPosition(vector3ToGrid(group.current.position), props.orientation), mapId));

                path.shift();
            }
        } else {
            setAnimation("Idle");
        }
    });

    return (
        <group
            ref={group}
            {...props}
            position={position}
            // dispose={null}
            name={`character-${id}`}
            mapId={mapId}
            scale={[0.5, 0.5, 0.5]}

        >
            <Html position-y={2.5}>
                <div className="w-60 max-w-full">
                    <p className="absolute font-bold max-w-full text-center break-words -translate-y-full p-2 px-4 -translate-x-1/2 rounded-lg text-gray-500 whitespace-pre-line dark:text-gray-400">
                        {charname}
                    </p>
                </div>
            </Html>
            <group name="Scene">
                <group name="Rig">
                    <primitive object={nodes.root} />
                    <skinnedMesh name="Knight_ArmLeft" geometry={nodes.Knight_ArmLeft.geometry} material={materials.knight_texture} skeleton={nodes.Knight_ArmLeft.skeleton} />
                    <skinnedMesh name="Knight_ArmRight" geometry={nodes.Knight_ArmRight.geometry} material={materials.knight_texture} skeleton={nodes.Knight_ArmRight.skeleton} />
                    <skinnedMesh name="Knight_Body" geometry={nodes.Knight_Body.geometry} material={materials.knight_texture} skeleton={nodes.Knight_Body.skeleton} />
                    <skinnedMesh name="Knight_Head" geometry={nodes.Knight_Head.geometry} material={materials.knight_texture} skeleton={nodes.Knight_Head.skeleton} />
                    <skinnedMesh name="Knight_LegLeft" geometry={nodes.Knight_LegLeft.geometry} material={materials.knight_texture} skeleton={nodes.Knight_LegLeft.skeleton} />
                    <skinnedMesh name="Knight_LegRight" geometry={nodes.Knight_LegRight.geometry} material={materials.knight_texture} skeleton={nodes.Knight_LegRight.skeleton} />
                </group>
            </group>
        </group >
    );
}

useGLTF.preload('/models/Knight.glb')