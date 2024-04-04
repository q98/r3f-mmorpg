import { Server } from "socket.io";
import pathfinding from "pathfinding";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

io.listen(3001);
const dynamicItems = []
const characters = [];
const items = {
  vela_5: {
    name: "Vela_5",
    size: [1, 1],
    walkable: true
  }, vela_6: {
    name: "Vela_6",
    size: [1, 1],
    walkable: true
  },
  vela_4: {
    name: "Vela_4",
    size: [1, 1],
    walkable: true
  },
  vela_3: {
    name: "Vela_3",
    size: [1, 1],
    walkable: true
  },
  vela_2: {
    name: "Vela_2",
    size: [1, 1],
    walkable: true
  },
  vela_1: {
    name: "Vela_1",
    size: [1, 1],
    walkable: true
  },
  bone_3: {
    name: "Bone_3",
    size: [1, 1],
    walkable: true
  },
  bone_2: {
    name: "Bone_2",
    size: [1, 1],
    walkable: true
  },
  bone_1: {
    name: "Bone_1",
    size: [1, 1],
    walkable: true
  },
  lantern: {
    name: "Lantern",
    size: [1, 1]
  },
  base_Priedra_1x1: {
    name: "Base_Priedra_1x1",
    size: [1, 1]
  },
  base_Priedra_2x2: {
    name: "Base_Priedra_2x2",
    size: [2, 2]
  },
  bench: {
    name: "Bench",
    size: [2, 1]
  },
  bench_Decorated: {
    name: "Bench_Decorated",
    size: [2, 1]
  },
  columna_Velas_2x2: {
    name: "Columna_Velas_2x2",
    size: [2, 2]
  },
  three_Yellow_3: {
    name: "Three_Yellow_3",
    size: [1, 1]
  },
  three_Yellow_2: {
    name: "Three_Yellow_2",
    size: [1, 1]
  },
  three_Yellow_1: {
    name: "Three_Yellow_1",
    size: [1, 1]
  },
  three_Orange_3: {
    name: "Three_Orange_3",
    size: [1, 1]
  },
  three_Orange_2: {
    name: "Three_Orange_2",
    size: [1, 1]
  },
  three_Orange_1: {
    name: "Three_Orange_1",
    size: [1, 1]
  },
  gate_Valla: {
    name: "Gate_Valla",
    size: [1, 4]
  },
  gate_Valla_2: {
    name: "Gate_Valla_2",
    size: [4, 1],
    walkable: true
  },
  gate_Empty: {
    name: "Gate_Empty",
    size: [4, 1],
    walkable: true
  },
  post_Skull: {
    name: "Post_Skull",
    size: [1, 1]
  },
  post_Lantern: {
    name: "Post_Lantern",
    size: [1, 1]
  },
  post_Wood: {
    name: "Post_Wood",
    size: [1, 1]
  },
  lapida_1: {
    name: "Lapida_1",
    size: [2, 1]
  },
  lapida_2: {
    name: "Lapida_2",
    size: [2, 1]
  },
  lapida_3: {
    name: "Lapida_3",
    size: [2, 1]
  },
  lapida_4: {
    name: "Lapida_4",
    size: [2, 1]
  },
  three_Death_3: {
    name: "Three_Death_3",
    size: [1, 1],
  },
  three_Death_2: {
    name: "Three_Death_2",
    size: [1, 1],
  },
  three_Death_1: {
    name: "Three_Death_1",
    size: [1, 1],
  },
  floor_Stones_1: {
    name: "Floor_Stones_1",
    size: [2, 2],
    walkable: true
  },
  floor_Stones_2: {
    name: "Floor_Stones_2",
    size: [2, 2],
    walkable: true
  },
  floor_Stones_3: {
    name: "Floor_Stones_3",
    size: [2, 2],
    walkable: true
  },
  floor_Stones_4: {
    name: "Floor_Stones_4",
    size: [2, 2],
    walkable: true
  },
  valla_Rota: {
    name: "Valla_Rota",
    size: [4, 1]
  },
  valla: {
    name: "Valla",
    size: [4, 1]
  },
  valla_Piedra_Rota: {
    name: "Valla_Piedra_Rota",
    size: [4, 1]
  },
  valla_Piedra: {
    name: "Valla_Piedra",
    size: [4, 1]
  },
  crypt: {
    name: "Crypt",
    size: [6, 8]
  },
  crypt2: {
    name: "Crypt2",
    size: [6, 8]
  },
}

const map = {
  size: [21, 14],
  gridDivision: 2,
  items: [
    {
      ...items.three_Death_3,
      gridPosition: [4, 10],
    },
    {
      ...items.three_Death_2,
      gridPosition: [1, 5],
    },
    {
      ...items.three_Death_1,
      gridPosition: [2, 5],
    },
    {
      ...items.bench,
      gridPosition: [35, 19],
    }, {
      ...items.bench,
      gridPosition: [32, 19],
    }, {
      ...items.floor_Stones_1,
      gridPosition: [8, 11],
      rotation: 1
    }
    , {
      ...items.floor_Stones_1,
      gridPosition: [8, 13],
      rotation: 1
    },
    {
      ...items.floor_Stones_1,
      gridPosition: [8, 15],
      rotation: 1
    },
    {
      ...items.floor_Stones_1,
      gridPosition: [8, 17],
      rotation: 1
    },
    {
      ...items.floor_Stones_4,
      gridPosition: [10, 15],
      rotation: 1
    },
    {
      ...items.floor_Stones_4,
      gridPosition: [6, 13],
      rotation: 1
    },
    {
      ...items.floor_Stones_1,
      gridPosition: [10, 17],
      rotation: 1
    },
    {
      ...items.floor_Stones_1,
      gridPosition: [12, 17],
      rotation: 1
    },
    {
      ...items.floor_Stones_1,
      gridPosition: [12, 19],
      rotation: 1
    },
    {
      ...items.floor_Stones_1,
      gridPosition: [12, 21],
      rotation: 1
    },
    {
      ...items.floor_Stones_2,
      gridPosition: [12, 23],
      rotation: 1
    },
    {
      ...items.floor_Stones_3,
      gridPosition: [12, 25],
      rotation: 1
    },
    {
      ...items.floor_Stones_4,
      gridPosition: [12, 27],
      rotation: 1
    },
    {
      ...items.three_Yellow_3,
      gridPosition: [0, 11]
    },
    {
      ...items.three_Yellow_2,
      gridPosition: [0, 17]
    },
    {
      ...items.three_Yellow_1,
      gridPosition: [0, 13]
    },
    {
      ...items.three_Orange_3,
      gridPosition: [2, 11]
    },
    {
      ...items.three_Orange_2,
      gridPosition: [0, 12]
    },
    {
      ...items.three_Orange_1,
      gridPosition: [1, 15]
    },
    {
      ...items.valla_Piedra,
      gridPosition: [3, 6],
      rotation: 1
    },
    {
      ...items.valla_Piedra,
      gridPosition: [3, 10],
      rotation: 1
    },
    {
      ...items.valla_Piedra,
      gridPosition: [3, 14],
      rotation: 1
    },
    {
      ...items.valla_Piedra_Rota,
      gridPosition: [3, 18],
      rotation: 1
    },
    {
      ...items.post_Lantern,
      gridPosition: [9, 20]
    },
    {
      ...items.valla_Piedra_Rota,
      gridPosition: [3, 21],
      rotation: 2
    },
    {
      ...items.valla_Piedra,
      gridPosition: [7, 21],
      rotation: 2
    }, {
      ...items.gate_Empty,
      gridPosition: [11, 21],
    }, {
      ...items.valla_Piedra,
      gridPosition: [15, 21],
      rotation: 2
    }
    , {
      ...items.post_Wood,
      gridPosition: [15, 20],
    }, {
      ...items.valla_Piedra,
      gridPosition: [19, 21],
      rotation: 2
    }, {
      ...items.gate_Valla_2,
      id: "Door0001",
      open: true,
      walkable: true,
      gridPosition: [27, 21],
      rotation: 2
    }, {
      ...items.valla_Piedra,
      gridPosition: [23, 21],
      rotation: 2
    }, {
      ...items.valla_Piedra,
      gridPosition: [31, 21],
      rotation: 2
    }, {
      ...items.valla_Piedra,
      gridPosition: [35, 21],
      rotation: 2
    }, {
      ...items.valla_Piedra,
      gridPosition: [38, 18],
      rotation: 1
    }
    , {
      ...items.valla_Piedra,
      gridPosition: [38, 14],
      rotation: 1
    }, {
      ...items.valla_Piedra,
      gridPosition: [38, 10],
      rotation: 1
    }, {
      ...items.valla_Piedra,
      gridPosition: [38, 6],
      rotation: 1
    },
    {
      ...items.three_Yellow_3,
      gridPosition: [39, 11]
    }
    ,
    {
      ...items.three_Yellow_1,
      gridPosition: [39, 13]
    },
    {
      ...items.three_Orange_3,
      gridPosition: [39, 5]
    },
    {
      ...items.three_Orange_2,
      gridPosition: [39, 12]
    },
    {
      ...items.three_Orange_1,
      gridPosition: [39, 15]
    }
    ,
    {
      ...items.lapida_1,
      gridPosition: [36, 8]
    },
    {
      ...items.lapida_2,
      gridPosition: [33, 8]
    },
    {
      ...items.lapida_2,
      gridPosition: [30, 8]
    },
    {
      ...items.lapida_3,
      gridPosition: [36, 11]
    },
    {
      ...items.lapida_4,
      gridPosition: [33, 11]
    },
    {
      ...items.lapida_1,
      gridPosition: [30, 11]
    },
    {
      ...items.lapida_2,
      gridPosition: [36, 14]
    },
    {
      ...items.lapida_1,
      gridPosition: [33, 14]
    }, {
      ...items.lapida_1,
      gridPosition: [30, 14]
    }, {
      ...items.vela_5,
      gridPosition: [11, 11]
    }, {
      ...items.vela_6,
      gridPosition: [10, 12]
    }, {
      ...items.vela_6,
      gridPosition: [7, 12]
    }, {
      ...items.post_Lantern,
      gridPosition: [31, 20]
    }, {
      ...items.post_Wood,
      gridPosition: [26, 20]
    }
    , {
      ...items.post_Skull,
      gridPosition: [19, 20],
      rotation: 2
    }, {
      ...items.post_Skull,
      gridPosition: [23, 20],
      rotation: 2
    },
    {
      ...items.valla_Piedra,
      gridPosition: [15, 6],

    },
    {
      ...items.valla_Rota,
      gridPosition: [18, 9],
      rotation: 1
    },
    {
      ...items.valla_Piedra_Rota,
      gridPosition: [15, 3],
      rotation: 1
    },
    {
      ...items.valla_Piedra,
      gridPosition: [12, 3],
    }, {
      ...items.valla_Piedra,
      gridPosition: [8, 3],
    }, {
      ...items.valla_Piedra,
      gridPosition: [4, 3],
    }, {
      ...items.valla,
      gridPosition: [18, 12],
      rotation: 1
    },
    {
      ...items.valla,
      gridPosition: [18, 17],
      rotation: 1
    },

    {
      ...items.valla_Rota,
      gridPosition: [24, 10],
      rotation: 1
    },
    {
      ...items.valla,
      gridPosition: [24, 13],
      rotation: 1
    },
    {
      ...items.valla,
      gridPosition: [24, 17],
      rotation: 1
    },

    {
      ...items.valla_Piedra,
      gridPosition: [35, 6],
    },
    {
      ...items.valla_Piedra,
      gridPosition: [31, 6],
    },
    {
      ...items.valla_Piedra,
      gridPosition: [27, 6],
    },
    {
      ...items.valla_Piedra,
      gridPosition: [23, 6],
    },
    {
      ...items.gate_Empty,
      gridPosition: [19, 6],
    },
    {
      ...items.valla_Piedra,
      gridPosition: [3, 3],
      rotation: 1
    },
    {
      ...items.crypt2,
      gridPosition: [6, 5],

    },
    {
      ...items.bench_Decorated,
      gridPosition: [11, 8],
      rotation: 1

    },
    {
      ...items.three_Orange_1,
      gridPosition: [3, 0],
    },

    {
      ...items.three_Orange_2,
      gridPosition: [5, 1],
    },
    {
      ...items.three_Orange_1,
      gridPosition: [10, 1],
    },
    {
      ...items.three_Orange_2,
      gridPosition: [30, 0],
    },
    {
      ...items.three_Orange_3,
      gridPosition: [39, 1],
    },
    {
      ...items.three_Yellow_1,
      gridPosition: [4, 2],
    },

    {
      ...items.three_Yellow_1,
      gridPosition: [11, 2],
    },
    {
      ...items.three_Yellow_2,
      gridPosition: [14, 1],
    },
    {
      ...items.three_Yellow_2,
      gridPosition: [33, 2],
    },
    {
      ...items.three_Yellow_3,
      gridPosition: [37, 2],
    },
    {
      ...items.three_Yellow_1,
      gridPosition: [41, 0],
    },
    {
      ...items.three_Yellow_2,
      gridPosition: [40, 5],
    },
    {
      ...items.three_Yellow_3,
      gridPosition: [41, 2],
    }

  ]
}



const grid = new pathfinding.Grid(map.size[0] * map.gridDivision, map.size[1] * map.gridDivision)

const finder = new pathfinding.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true
})

const findPath = (start, end) => {
  const gridClone = grid.clone()
  const path = finder.findPath(start[0], start[1], end[0], end[1], gridClone)
  return path
}

const updateGrid = () => {
  map.items.forEach((item) => {
    if (item.walkable || item.wall) return

    // const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0]
    // const height = !item.rotation === 1 || !item.rotation === 3 ? item.size[0] : item.size[1]
    const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0];
    const height = item.rotation === 1 || item.rotation === 3 ? item.size[0] : item.size[1];
    for (let w = 0; w < width; w++) {
      for (let h = 0; h < height; h++) {
        grid.setWalkableAt(
          item.gridPosition[0] + w,
          item.gridPosition[1] + h,
          false
        )

      }
    }
    // if (item.name === "Gate_Valla_2") console.log("Gate_Valla_2 set Walkable?" + item.walkable)
  })
}

updateGrid()
//console.log(findPath([1, 0], [1, 5]))
const isInsideMap = (gridPosition) => {
  return gridPosition[0] / map.gridDivision >= 0 && gridPosition[0] / map.gridDivision <= map.size[0] - 0.5 && gridPosition[1] / map.gridDivision >= 0 && gridPosition[1] / map.gridDivision <= map.size[1] - 0.5
}
const generateRandomPosition = () => {
  return [30, 27];
  // for (let i = 0; i < 100; i++) {
  //   const x = Math.floor(Math.random() * map.size[0] * map.gridDivision)
  //   const y = Math.floor(Math.random() * map.size[1] * map.gridDivision)
  //   if (grid.isWalkableAt(x, y)) {
  //     return [x, y];
  //   }
  // }
};

const distanceBetween2Points = (from, to) => {
  //2D and 3D points
  if (from.length === 2 && to.length) {
    return dist3D(from[0], 0, from[1], to[0], 0, to[1])
  } else if (from.length === 3 && to.length) {
    return dist3D(from[0], 0, from[1], to[0], 0, to[1])
  } else {
    return null
  }
}
const distanceToAnItem = (from, item) => {
  let distance = 10000
  let aux = 0
  //console.log(item)
  const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0]
  const height = !item.rotation === 1 || !item.rotation === 3 ? item.size[0] : item.size[1]
  for (let w = 0; w < width; w++) {
    for (let h = 0; h < height; h++) {
      aux = distanceBetween2Points(from, [item.gridPosition[0] + w, item.gridPosition[1] + h])
      if (aux < distance) {
        distance = aux
      }
    }
  }

  return distance
}
function dist3D(x0, y0, z0, x1, y1, z1) {
  const deltaX = x1 - x0;
  const deltaY = y1 - y0;
  const deltaZ = z1 - z0;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
  return distance;
}

io.on("connection", (socket) => {
  console.log("user connected");

  characters.push({
    health: 100,
    name: socket.id.substring(0, 5),
    id: socket.id,
    orientation: 8,
    position: generateRandomPosition(),
  });
  console.log(characters)

  socket.emit("hello", {
    map,
    characters,
    id: socket.id,
    items,
  });

  io.emit("characters", characters);

  socket.on("actionDoor", (objectId, openStatus) => {

    const item = map.items.find(
      (item) => item.id === objectId
    );
    const character = characters.find(
      (character) => character.id === socket.id
    );

    if (distanceToAnItem(character.position, item) <= 1) {
      item.open = openStatus
      item.walkable = openStatus
      const width = item.rotation === 1 || item.rotation === 3 ? item.size[1] : item.size[0]
      const height = !item.rotation === 1 || !item.rotation === 3 ? item.size[0] : item.size[1]
      for (let w = 0; w < width; w++) {
        for (let h = 0; h < height; h++) {
          grid.setWalkableAt(item.gridPosition[0] + w, item.gridPosition[1] + h, openStatus)
        }
      }
      io.emit("updateAllMap", map);

    }




  });
  //Moving a player from A to B
  socket.on("move", (from, to) => {
    // console.log("ask for movement")
    const character = characters.find(
      (character) => character.id === socket.id
    );
    if (!isInsideMap(to)) return
    if (!grid.isWalkableAt(to[0], to[1])) return

    const path = findPath(from, to);
    if (!path) {
      return;
    }
    character.position = from;
    character.attack = null
    character.path = path;
    //console.log(path)

    //io.emit("characters", characters);
    io.emit("playerMove", character);
    character.path = []
    character.position = to

  });


  socket.on("attack", (orientation) => {

    const character = characters.find(
      (character) => character.id === socket.id
    );
    //console.log(`${character.name} is atacking to ${orientation}`)
    character.attack = ["attack"]
    character.path = []
    //io.emit("characters", characters);
    io.emit("playerAttack", character);
    character.attack = null

  });



  socket.on("playerPivot", (orientation) => {
    //console.log("playerPivoting " + orientation)
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.orientation = orientation;

    io.emit("playerPivot", character);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });

  // socket.on("serverUpdate", (position) => {
  //   // console.log("ask for movement")
  //   const character = characters.find(
  //     (character) => character.id === socket.id
  //   );
  //   //console.log("serverUpdate" + character.id)

  //   character.path = []
  //   character.position = position
  //   //console.log("At" + character.position)

  // });

});


