// 参考サイト //
// https://uxmilk.jp/11586
// https://tcd-theme.com/2021/11/javascript-json.html
// https://qiita.com/forever---searcher/items/622121e16a1d7adebc1c
// https://qiita.com/mtanabe/items/c324a2d4a8de8d1595e4
// 競技プログラミングの鉄則 ~アルゴリズム力と思考力を高める77の技術~

const TILE_SIZE = 50;
var mapdata = null;
var merchandise = null;
var merchandise_list = [];
var arrow = [];
var load = false;
var load_json = false;
var user = {
  x : 0,
  y : 0,
  d : 2     // 0123->NESW
};
var destinationData = {
  name : "none",
  x : -1,
  y : -1,
  d : -1,
}

document.getElementById('update_button').addEventListener("click", e => {
  const x = document.getElementById("update_x").value;
  const y = document.getElementById("update_y").value;
  const d = document.getElementById("update_d").value;
  
  if (!(isNaN(x)) && !(isNaN(y)) && !(x == "") && !(y == "")) {
    if (x >= 0 && x < mapdata[0].length && y >= 0 && y < mapdata.length) {
      user.x = Number(x);
      user.y = Number(y);
      user.d = Number(d);
      update_now_status();
    }
  }
});

document.getElementById('next_button').addEventListener("click", e => {
  if (!(destinationData.name == "none")) {

  }
});

document.getElementById('search_button').addEventListener("click", e => {
  const select = document.getElementById("select_merchandise").value;
  // console.log("検索:" + merchandise_list[select]);

  let merchandisePos = [];
  let merchandisePosSet = function(j, i, d) { merchandisePos.push([j, i, d]); }
  // console.log(merchandisePos);
  let destination = [];
  for(let i = 0; i < mapdata.length; i++) {
    for(let j = 0; j < mapdata[i].length; j++) {
      if (isNaN(mapdata[i][j])) {
        merchandise.forEach(e => {
          if (e[0] == mapdata[i][j]) {
            e[1].n.forEach(f => { if (f == merchandise_list[select]) { merchandisePosSet(j, i, 0);destination.push([j, i-1]); } });
            e[1].e.forEach(f => { if (f == merchandise_list[select]) { merchandisePosSet(j, i, 1);destination.push([j+1, i]); } });
            e[1].s.forEach(f => { if (f == merchandise_list[select]) { merchandisePosSet(j, i, 2);destination.push([j, i+1]); } });
            e[1].w.forEach(f => { if (f == merchandise_list[select]) { merchandisePosSet(j, i, 3);destination.push([j-1, i]); } });
          }
        });
      }
      else if (select == 92 && mapdata[i][j] == 2) {
        merchandisePosSet(j, i, 2);
        destination.push([j, i+1]);
      }
    }
  }
  // console.log(destination);

  let min_route = null;
  let min_distance = 9999;
  let counter = 0;
  let confirm_num = 0;
  // 幅優先探索っぽいアルゴリズム
  destination.forEach(e => {
    let goal = { x : e[0], y : e[1] };
    let route = [mapdata.length];
    for (let i = 0; i < mapdata.length; i++) {
      route[i] = [mapdata[i].length]
      for (let j = 0; j < mapdata[i].length; j++) { route[i][j] = -1; }
    }
    let queue = [];
    queue.push({ x : user.x, y : user.y });
    route[user.y][user.x] = 0;
    // console.log("mapdata:" + mapdata[0].length)
    while (route[goal.y][goal.x] == -1) { // && queue.length > 0
      tx = queue[0].x;
      ty = queue[0].y;
      if (ty - 1 >= 0) { if (route[ty-1][tx] == -1 && !(isNaN(mapdata[ty-1][tx]))) { route[ty-1][tx] = route[ty][tx]+1; queue.push({ x : tx, y : ty-1 }); }}
      if (ty + 1 < mapdata.length) { if (route[ty+1][tx] == -1 && !(isNaN(mapdata[ty+1][tx]))) { route[ty+1][tx] = route[ty][tx]+1; queue.push({ x : tx, y : ty+1 }); }}
      if (tx - 1 >= 0) { if (route[ty][tx-1] == -1 && !(isNaN(mapdata[ty][tx-1]))) { route[ty][tx-1] = route[ty][tx]+1; queue.push({ x : tx-1, y : ty }); }}
      if (tx + 1 < mapdata[0].length) { if (route[ty][tx+1] == -1 && !(isNaN(mapdata[ty][tx+1]))) { route[ty][tx+1] = route[ty][tx]+1; queue.push({ x : tx+1, y : ty }); }}
      queue.shift();
    }
    // console.log(route);
    if (route[goal.y][goal.x] < min_distance) {
      min_route = route;
      min_distance = route[goal.y][goal.x];
      confirm_num = counter;
    }

    counter++;
  });

  arrow = ((r, sx, sy, gx, gy, gd) => {
    a = arrowReset();
    let tx = gx;
    let ty = gy;
    let ta = "-";
    let setArrow = ((c) => {
      if (c == "↓") { a[ty-1][tx] = ta;ty--; }
      if (c == "↑") { a[ty+1][tx] = ta;ty++; }
      if (c == "→") { a[ty][tx-1] = ta;tx--; }
      if (c == "←") { a[ty][tx+1] = ta;tx++; }
    });
    a[ty][tx] = "○";
    if (gd == "0") { ta = "↓" }
    if (gd == "1") { ta = "←" }
    if (gd == "2") { ta = "↑" }
    if (gd == "3") { ta = "→" }
    setArrow(ta)

    while (!(tx == sx && ty == sy)) {
      let min = 999;
      
      if (ty - 1 >= 0) { if (r[ty-1][tx] < min && r[ty-1][tx] >= 0) { min = r[ty-1][tx];ta = "↓"; } }
      if (ty + 1 < mapdata.length) { if (r[ty+1][tx] < min && r[ty+1][tx] >= 0) { min = r[ty+1][tx];ta = "↑"; } }
      if (tx - 1 >= 0) { if (r[ty][tx-1] < min && r[ty][tx-1] >= 0) { min = r[ty][tx-1];ta = "→"; } }
      if (tx + 1 < mapdata[0].length) { if (r[ty][tx+1] < min && r[ty][tx+1] >= 0) { min = r[ty][tx+1];ta = "←"; } }
  
      setArrow(ta);
    }

    return a;
  })(min_route, user.x, user.y, merchandisePos[confirm_num][0], merchandisePos[confirm_num][1], merchandisePos[confirm_num][2]);

  destinationData.name = merchandise_list[select];
  destinationData.x = merchandisePos[confirm_num][0];
  destinationData.y = merchandisePos[confirm_num][1];
  destinationData.d = merchandisePos[confirm_num][2];
  console.log(min_route)
  console.log(arrow)
});

function directionEncrypt(c) {
  if (c == "北") return 0;
  else if (c == "東") return 1;
  else if (c == "南") return 2;
  else if (c == "西") return 3;
}

function directionComposition(n) {
  if (n == 0) return "北";
  else if (n == 1) return "東";
  else if (n == 2) return "南";
  else if (n == 3) return "西";
}

function arrowReset() {
  a = [];
  for (let i = 0; i < mapdata.length; i++) {
    a.push([]);
    for (let j = 0; j < mapdata[i].length; j++) {
      a[i].push(isNaN(mapdata[i][j]) ? "x" : "-");
    }
  }
  return a;
}

function update_now_status() {
  let nst = document.getElementById("now_status");
  nst.innerText = "現在のステータス X座標:" + user.x + ", Y座標:" + user.y + ", 進行方向:" + directionComposition(user.d);
}

function create_selectBox(arr) {
  let data = [];

  for (let i = 0; i < arr.length; i++) {
    data.push({id: i, text: arr[i]});
  }
  data.push({id: arr.length, text: "レジへ行く"});
  
  $(document).ready(function() {
    $('.select2').select2({
      data: data
    });
  });
}

function user_enter() {
  for(let i = 0; i < mapdata.length; i++) {
    for(let j = 0; j < mapdata[i].length; j++) {
      if (mapdata[i][j] == 1) {
        user.x = j;
        user.y = i;
      }
    }
  }
  update_now_status();
}

function createMerchandise_list() {  
  merchandise.forEach(e => {
    e[1].n.forEach(f => {merchandise_list.push(f);});
    e[1].e.forEach(f => {merchandise_list.push(f);});
    e[1].s.forEach(f => {merchandise_list.push(f);});
    e[1].w.forEach(f => {merchandise_list.push(f);});
  });
  merchandise_list = Array.from(new Set(merchandise_list));
  create_selectBox(merchandise_list);
  // console.log(merchandise_list);
}

function csv_data(dataPath) {
	const request = new XMLHttpRequest();
	request.addEventListener('load', (event) => {
		const response = event.target.responseText;
    // console.log(response);
    mapdata = ((r) => {
      var result = [];
      var tmp = r.split('\n');
      for (let i = 0; i < tmp.length; i++) {
        result[i] = tmp[i].split(',');
      }
      return result;
    })(response);
    load = true;
    // console.log(mapdata);

    arrow = arrowReset();
    
    let result = document.getElementById('canvas_pos');
    let canvas = createCanvas(mapdata[0].length * TILE_SIZE, mapdata.length * TILE_SIZE);
    canvas.parent(result);
    user_enter();
	});
	request.open('GET', dataPath, true);
	request.send();
}

function json_data(dataPath) {
	const request = new XMLHttpRequest();
	request.addEventListener('load', (event) => {
		const response = event.target.responseText;
    merchandise = JSON.parse(response)
    // merchandise = JSON.stringify(response)
    load_json = true;
    merchandise = Object.entries(merchandise);
    createMerchandise_list();
	});
	request.open('GET', dataPath, true);
	request.send();
}

function map_disp() {
  stroke(0);
  for(let i = 0; i < mapdata.length; i++){
    for(let j = 0; j < mapdata[i].length; j++){
      if (mapdata[i][j] == 0) {
        if (!(arrow[i][j] == "x" || arrow[i][j] == "-" || arrow[i][j] == "○")) fill(255, 200, 200);
        else fill(255, 255, 255);
      }
      else if (mapdata[i][j] == 1) fill(200, 200, 255);
      else if (mapdata[i][j] == 2) fill(200, 255, 200);
      else if (isNaN(mapdata[i][j])) {
        if (j == destinationData.x && i == destinationData.y) fill(255, 255, 200);
        else fill(200, 200, 200);
      }
      rect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      if (j == destinationData.x && i == destinationData.y) {
        push();
        translate(j * TILE_SIZE, i * TILE_SIZE, 0);
        noStroke();
        fill(255, 0, 0);
        if (destinationData.d == 0) rect(0, 0, TILE_SIZE, TILE_SIZE*0.2);
        else if (destinationData.d == 1) rect(TILE_SIZE*0.8, 0, TILE_SIZE*0.2, TILE_SIZE);
        else if (destinationData.d == 2) rect(0, TILE_SIZE*0.8, TILE_SIZE, TILE_SIZE*0.2);
        else if (destinationData.d == 3) rect(0, 0, TILE_SIZE*0.2, TILE_SIZE);
        pop();
      }

      if (isNaN(mapdata[i][j])) {
        push();
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(24);
        text(mapdata[i][j].toUpperCase(), j * TILE_SIZE + TILE_SIZE/2, i * TILE_SIZE + TILE_SIZE/2);
        pop();
      }

      if (user.x == j && user.y == i) {
        push();
        fill(0, 255, 255);
        translate(j * TILE_SIZE + TILE_SIZE/2, i * TILE_SIZE + TILE_SIZE/2, 0);
        if (user.d == 0) rotate(PI);
        else if (user.d == 1) rotate(-PI/2);
        else if (user.d == 2) rotate(0);
        else if (user.d == 3) rotate(PI/2);
        translate(-TILE_SIZE/2, -TILE_SIZE/2, 0);
        triangle((TILE_SIZE*0.3), (TILE_SIZE*0.3), (TILE_SIZE*0.7), (TILE_SIZE*0.3), TILE_SIZE / 2, (TILE_SIZE*0.7));
        pop();
      }
    }
  }
}

function setup() {
  csv_data("map.csv");
  json_data("merchandise.json");
}

function draw() {
  if (load && load_json) {
    background(155, 255, 255);
    map_disp();
  }
}
