
import { useAtom } from "jotai";
import { mapAtom } from "../components/SocketManager";
import * as THREE from "three";

export const useGrid = () => {
    const [map] = useAtom(mapAtom);
    const vector3ToGrid = (vector3, x = 0, z = 0) => {
        return [
            (Math.floor(vector3.x * map.gridDivision) + x),
            (Math.floor(vector3.z * map.gridDivision) + z),
        ];
    };
    const gridToVector3 = (gridPosition, width = 1, height = 1) => {
        return new THREE.Vector3(
            width / map.gridDivision / 2 + gridPosition[0] / map.gridDivision,
            0,
            height / map.gridDivision / 2 + gridPosition[1] / map.gridDivision,
        )
    }
    return {
        vector3ToGrid,
        gridToVector3
    }
}
