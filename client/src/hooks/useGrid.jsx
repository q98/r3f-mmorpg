
import { useAtom } from "jotai";
import { charactersAtom, mapAtom, mapsAtom } from "../components/SocketManager";
import * as THREE from "three";

const getMapIndex = (mapId) => {
    for (let i = 0; i < maps.length; i++) {
        if (maps[i].mapId === mapId) {
            //console.log(`${mapId} index: ${i}`)
            return i
        }
    }
    return null
}

export const useGrid = () => {
    const [maps] = useAtom(mapsAtom);


    const getMapIndex = (mapId) => {
        for (let i = 0; i < maps.length; i++) {
            if (maps[i].mapId === mapId) {
                //console.log(`${mapId} index: ${i}`)
                return i
            }
        }
        return null
    }
    const vector3ToGrid = (vector3, x = 0, z = 0) => {
        return [
            (Math.floor(vector3.x * maps[0].gridDivision) + x),
            (Math.floor(vector3.z * maps[0].gridDivision) + z),
        ];
    };
    const vector3ToGrid3D = (vector3, mapId, x = 0, z = 0,) => {
        const mapIndex = getMapIndex(mapId)
        //console.log("InitiPosition[0]: " + maps[mapIndex].initPosition[0] + " InitPosition[2]: " + maps[mapIndex].initPosition[2])

        return [
            (Math.floor(vector3.x * maps[0].gridDivision) + x) - maps[mapIndex].initPosition[0] * maps[mapIndex].gridDivision,
            (Math.floor(vector3.z * maps[0].gridDivision) + z) - maps[mapIndex].initPosition[2] * maps[mapIndex].gridDivision,
        ];
    };
    const gridToVector3 = (gridPosition, width = 1, height = 1, mapId) => {

        if (mapId === "roof") {

            return new THREE.Vector3(
                maps[1].initPosition[0] + width / maps[1].gridDivision / 2 + (gridPosition[0]) / maps[1].gridDivision,
                maps[1].initPosition[1],
                maps[1].initPosition[2] + height / maps[1].gridDivision / 2 + (gridPosition[1]) / maps[1].gridDivision,
            )
        }
        else {
            return new THREE.Vector3(
                width / maps[0].gridDivision / 2 + gridPosition[0] / maps[0].gridDivision,
                0,
                height / maps[0].gridDivision / 2 + gridPosition[1] / maps[0].gridDivision,
            )
        }
    }
    const grid3DToVector3 = (gridPosition, mapId, width = 1, height = 1) => {
        //console.log("Grid3DToVector on mapId: " + mapId + " on index:" + getMapIndex(mapId))
        const index = getMapIndex(mapId) || 0

        return new THREE.Vector3(
            maps[index].initPosition[0] + width / maps[index].gridDivision / 2 + (gridPosition[0]) / maps[index].gridDivision,
            maps[index].initPosition[1],
            maps[index].initPosition[2] + height / maps[index].gridDivision / 2 + (gridPosition[1]) / maps[index].gridDivision,
        )

    }
    return {
        vector3ToGrid3D,
        vector3ToGrid,
        gridToVector3,
        grid3DToVector3
    }
}
