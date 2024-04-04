import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { io } from "socket.io-client";
import pathfinding from "pathfinding";
export const socket = io("http://localhost:3001");
export const charactersAtom = atom([]);
export const mapAtom = atom(null);
export const userAtom = atom(null);
export const gridAtom = atom(null)

export const SocketManager = () => {
  const [_characters, setCharacters] = useAtom(charactersAtom);
  const [map, setMap] = useAtom(mapAtom);
  const [_user, setUser] = useAtom(userAtom);
  const [grid, setGrid] = useAtom(gridAtom)


  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello(value) {
      console.log(`Welcome id: ${value.id}`)
      setMap(value.map);
      setUser(value.id);
      setCharacters(value);
      const grid = new pathfinding.Grid(value.map.size[0] * value.map.gridDivision, value.map.size[1] * value.map.gridDivision)
      value.map.items.forEach((item) => {
        if (item.walkable || item.wall) return
        const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0]
        const height = !item.rotation === 1 || !item.rotation === 3 ? item.size[0] : item.size[1]
        for (let w = 0; w < width; w++) {
          for (let h = 0; h < height; h++) {
            grid.setWalkableAt(item.gridPosition[0] + w, item.gridPosition[1] + h, false)
          }
        }
      })
      setGrid(grid)
    }

    function onCharacters(value) {
      setCharacters(value);
    }
    function onPlayerPivot(value) {
      console.log("received onPlayerPivot")
      setCharacters((prev) => {
        return prev.map((character) => {
          if (character.id === value.id) {
            return value
          } else {
            return character
          }
        })
      })
    }
    function onPlayerMove(value) {
      setCharacters((prev) => {
        return prev.map((character) => {
          if (character.id === value.id) {
            return value
          } else {
            return character
          }
        })
      })
    }
    // function onServerUpdate(value) {
    //   setCharacters((prev) => {
    //     return prev.map((character) => {
    //       if (character.id === value.id) {
    //         return value
    //       } else {
    //         return character
    //       }
    //     })
    //   })
    // }
    function onPlayerAttack(value) {
      console.log(`receiving a ${value.name} atacking`)
      setCharacters((prev) => {
        return prev.map((character) => {
          if (character.id === value.id) {
            return value
          } else {
            return character
          }
        })
      })
    }

    function onItemUpdate(value) {
      console.log(value)
      const item = value.items.find(
        (item) => item.id === "Door0001"
      );
      console.log(item)
      setMap(value);
      const grid = new pathfinding.Grid(value.size[0] * value.gridDivision, value.size[1] * value.gridDivision)
      value.items.forEach((item) => {
        if (item.name === "Gate_Valla_2") console.log("Gate_Valla_2 set Walkable?" + item.walkable)
        if (item.walkable || item.wall) return
        const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0]
        const height = !item.rotation === 1 || !item.rotation === 3 ? item.size[0] : item.size[1]
        if (item.name === "Gate_Valla_2") {
          console.log("Gate_Valla_2 height" + height)
          console.log("Gate_Valla_2 width" + width)
        }
        for (let w = 0; w < width; w++) {
          for (let h = 0; h < height; h++) {

            grid.setWalkableAt(item.gridPosition[0] + w, item.gridPosition[1] + h, false)
          }
        }
      })
      setGrid(grid)

    }



    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("playerMove", onPlayerMove);
    socket.on("playerPivot", onPlayerPivot);
    socket.on("playerAttack", onPlayerAttack);
    socket.on("updateAllMap", onItemUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
      socket.off("playerMove", onPlayerMove);
      socket.off("playerPivot", onPlayerPivot);

      socket.off("updateAllMap", onItemUpdate);
    };
  }, []);
};
