function rastgele(max) {
  return Math.floor(Math.random() * max);
}

function karistir(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function parlakligiDegistir(factor, sprite) {
  var sanalCanvas = document.createElement("canvas");
  sanalCanvas.width = 500;
  sanalCanvas.height = 500;
  var icerik = sanalCanvas.getContext("2d");
  icerik.drawImage(sprite, 0, 0, 500, 500);

  var imgData = icerik.getImageData(0, 0, 500, 500);

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] = imgData.data[i] * factor;
    imgData.data[i + 1] = imgData.data[i + 1] * factor;
    imgData.data[i + 2] = imgData.data[i + 2] * factor;
  }
  icerik.putImageData(imgData, 0, 0);

  var spriteOutput = new Image();
  spriteOutput.src = sanalCanvas.toDataURL();
  sanalCanvas.remove();
  return spriteOutput;
}

function hamleSayisi(hamle) {
  document.getElementById("hamle").innerHTML = "Toplamda " + hamle + " hamle yaptınız.";
  gecisGorunurlugu("Mesaj-Kutusu");  
}

function gecisGorunurlugu(id) {
  if (document.getElementById(id).style.visibility == "visible") {
    document.getElementById(id).style.visibility = "hidden";
  } else {
    document.getElementById(id).style.visibility = "visible";
  }
}

function Labirent(Width, Height) {
  var labirentHaritasi;
  var width = Width;
  var height = Height;
  var baslamaKord, bitisKoord;
  var dirs = ["n", "s", "e", "w"];
  var modDir = {
    n: {
      y: -1,
      x: 0,
      o: "s"
    },
    s: {
      y: 1,
      x: 0,
      o: "n"
    },
    e: {
      y: 0,
      x: 1,
      o: "w"
    },
    w: {
      y: 0,
      x: -1,
      o: "e"
    }
  };

  this.harita = function() {
    return labirentHaritasi;
  };
  this.baslamaKord = function() {
    return baslamaKord;
  };
  this.bitisKoord = function() {
    return bitisKoord;
  };

  function genMap() {
    labirentHaritasi = new Array(height);
    for (y = 0; y < height; y++) {
      labirentHaritasi[y] = new Array(width);
      for (x = 0; x < width; ++x) {
        labirentHaritasi[y][x] = {
          n: false,
          s: false,
          e: false,
          w: false,
          visited: false,
          priorPos: null
        };
      }
    }
  }

  function labirentBelirleme() {
    var isComp = false;
    var move = false;
    var cellsVisited = 1;
    var numLoops = 0;
    var maxLoops = 0;
    var pos = {
      x: 0,
      y: 0
    };
    var numCells = width * height;
    while (!isComp) {
      move = false;
      labirentHaritasi[pos.x][pos.y].visited = true;

      if (numLoops >= maxLoops) {
        karistir(dirs);
        maxLoops = Math.round(rastgele(height / 8));
        numLoops = 0;
      }
      numLoops++;
      for (index = 0; index < dirs.length; index++) {
        var direction = dirs[index];
        var nx = pos.x + modDir[direction].x;
        var ny = pos.y + modDir[direction].y;

        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          
          if (!labirentHaritasi[nx][ny].visited) {
            
            labirentHaritasi[pos.x][pos.y][direction] = true;
            labirentHaritasi[nx][ny][modDir[direction].o] = true;

            
            labirentHaritasi[nx][ny].priorPos = pos;
            
            pos = {
              x: nx,
              y: ny
            };
            cellsVisited++;
            
            move = true;
            break;
          }
        }
      }

      if (!move) {
       
        pos = labirentHaritasi[pos.x][pos.y].priorPos;
      }
      if (numCells == cellsVisited) {
        isComp = true;
      }
    }
  }

  function baslaBitirBelirle() {
    switch (rastgele(4)) {
      case 0:
        baslamaKord = {
          x: 0,
          y: 0
        };
        bitisKoord = {
          x: height - 1,
          y: width - 1
        };
        break;
      case 1:
        baslamaKord = {
          x: 0,
          y: width - 1
        };
        bitisKoord = {
          x: height - 1,
          y: 0
        };
        break;
      case 2:
        baslamaKord = {
          x: height - 1,
          y: 0
        };
        bitisKoord = {
          x: 0,
          y: width - 1
        };
        break;
      case 3:
        baslamaKord = {
          x: height - 1,
          y: width - 1
        };
        bitisKoord = {
          x: 0,
          y: 0
        };
        break;
    }
  }

  genMap();
  baslaBitirBelirle();
  labirentBelirleme();
}

function labirentCizme(Labirent, ctx, hucreboyutu, endSprite = null) {
  var harita = Labirent.harita();
  var hucreBoyutu = hucreboyutu;
  var drawEndMethod;
  ctx.lineWidth = hucreBoyutu / 40;

  this.redrawMaze = function(size) {
    hucreBoyutu = size;
    ctx.lineWidth = hucreBoyutu / 50;
    haritaCizme();
    drawEndMethod();
  };

  function hucreCizme(xCord, yCord, hucre) {
    var x = xCord * hucreBoyutu;
    var y = yCord * hucreBoyutu;

    if (hucre.n == false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + hucreBoyutu, y);
      ctx.stroke();
    }
    if (hucre.s === false) {
      ctx.beginPath();
      ctx.moveTo(x, y + hucreBoyutu);
      ctx.lineTo(x + hucreBoyutu, y + hucreBoyutu);
      ctx.stroke();
    }
    if (hucre.e === false) {
      ctx.beginPath();
      ctx.moveTo(x + hucreBoyutu, y);
      ctx.lineTo(x + hucreBoyutu, y + hucreBoyutu);
      ctx.stroke();
    }
    if (hucre.w === false) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + hucreBoyutu);
      ctx.stroke();
    }
  }

  function haritaCizme() {
    for (x = 0; x < harita.length; x++) {
      for (y = 0; y < harita[x].length; y++) {
        hucreCizme(x, y, harita[x][y]);
      }
    }
  }

  function bitisCizme() {
    var coord = Labirent.bitisKoord();
    var gridSize = 4;
    var fraction = hucreBoyutu / gridSize - 2;
    var renkDegisimi = true;
    for (let y = 0; y < gridSize; y++) {
      if (gridSize % 2 == 0) {
        renkDegisimi = !renkDegisimi;
      }
      for (let x = 0; x < gridSize; x++) {
        ctx.beginPath();
        ctx.rect(
          coord.x * hucreBoyutu + x * fraction + 4.5,
          coord.y * hucreBoyutu + y * fraction + 4.5,
          fraction,
          fraction
        );
        if (renkDegisimi) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        }
        ctx.fill();
        renkDegisimi = !renkDegisimi;
      }
    }
  }

  function drawEndSprite() {
    var offsetLeft = hucreBoyutu / 50;
    var offsetRight = hucreBoyutu / 25;
    var coord = Labirent.bitisKoord();
    ctx.drawImage(
      endSprite,
      2,
      2,
      endSprite.width,
      endSprite.height,
      coord.x * hucreBoyutu + offsetLeft,
      coord.y * hucreBoyutu + offsetLeft,
      hucreBoyutu - offsetRight,
      hucreBoyutu - offsetRight
    );
  }

  function temizle() {
    var canvasBoyutu= hucreBoyutu * harita.length;
    ctx.clearRect(0, 0, canvasBoyutu, canvasBoyutu);
  }

  if (endSprite != null) {
    drawEndMethod = drawEndSprite;
  } else {
    drawEndMethod = bitisCizme;
  }
  temizle();
  haritaCizme();
  drawEndMethod();
}

function Oyuncu(maze, c, _cellsize, onComplete, sprite = null) {
  var ctx = c.getContext("2d");
  var bitisCiz;
  var moves = 0;
  bitisCiz = drawSpriteCircle;
  if (sprite != null) {
    bitisCiz = drawSpriteImg;
  }
  var player = this;
  var harita = maze.harita();
  var hucreKord = {
    x: maze.baslamaKord().x,
    y: maze.baslamaKord().y
  };
  var hucreBoyutu = _cellsize;
  var halfCellSize = hucreBoyutu / 2;

  this.redrawPlayer = function(_cellsize) {
    hucreBoyutu = _cellsize;
    drawSpriteImg(hucreKord);
  };

  function drawSpriteCircle(coord) {
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(
      (coord.x + 1) * hucreBoyutu - halfCellSize,
      (coord.y + 1) * hucreBoyutu - halfCellSize,
      halfCellSize - 2,
      0,
      2 * Math.PI
    );
    ctx.fill();
    if (coord.x === maze.bitisKoord().x && coord.y === maze.bitisKoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function drawSpriteImg(coord) {
    var offsetLeft = hucreBoyutu / 50;
    var offsetRight = hucreBoyutu / 25;
    ctx.drawImage(
      sprite,
      0,
      0,
      sprite.width,
      sprite.height,
      coord.x * hucreBoyutu + offsetLeft,
      coord.y * hucreBoyutu + offsetLeft,
      hucreBoyutu - offsetRight,
      hucreBoyutu - offsetRight
    );
    if (coord.x === maze.bitisKoord().x && coord.y === maze.bitisKoord().y) {
      onComplete(moves);
      player.unbindKeyDown();
    }
  }

  function bitisSil(coord) {
    var offsetLeft = hucreBoyutu / 50;
    var offsetRight = hucreBoyutu / 25;
    ctx.clearRect(
      coord.x * hucreBoyutu + offsetLeft,
      coord.y * hucreBoyutu + offsetLeft,
      hucreBoyutu - offsetRight,
      hucreBoyutu - offsetRight
    );
  }

  function kontrol(e) {
    var cell = harita[hucreKord.x][hucreKord.y];
    moves++;
    switch (e.keyCode) {
      case 65:
      case 37: // bati
        if (cell.w == true) {
          bitisSil(hucreKord);
          hucreKord = {
            x: hucreKord.x - 1,
            y: hucreKord.y
          };
          bitisCiz(hucreKord);
        }
        break;
      case 87:
      case 38: // kuzey
        if (cell.n == true) {
          bitisSil(hucreKord);
          hucreKord = {
            x: hucreKord.x,
            y: hucreKord.y - 1
          };
          bitisCiz(hucreKord);
        }
        break;
      case 68:
      case 39: // dogu
        if (cell.e == true) {
          bitisSil(hucreKord);
          hucreKord = {
            x: hucreKord.x + 1,
            y: hucreKord.y
          };
          bitisCiz(hucreKord);
        }
        break;
      case 83:
      case 40: // guney
        if (cell.s == true) {
          bitisSil(hucreKord);
          hucreKord = {
            x: hucreKord.x,
            y: hucreKord.y + 1
          };
          bitisCiz(hucreKord);
        }
        break;
    }
  }

  this.bindKeyDown = function() {
    window.addEventListener("keydown", kontrol, false);

    $("#gorunum").swipe({
      swipe: function(
        event,
        direction,
        distance,
        duration,
        fingerCount,
        fingerData
      ) {
        console.log(direction);
        switch (direction) {
          case "up":
            kontrol({
              keyCode: 38
            });
            break;
          case "down":
            kontrol({
              keyCode: 40
            });
            break;
          case "left":
            kontrol({
              keyCode: 37
            });
            break;
          case "right":
            kontrol({
              keyCode: 39
            });
            break;
        }
      },
      threshold: 0
    });
  };

  this.unbindKeyDown = function() {
    window.removeEventListener("keydown", kontrol, false);
    $("#gorunum").swipe("victory");
  };

  bitisCiz(maze.baslamaKord());

  this.bindKeyDown();
}

var labirentCanvas = document.getElementById("labirentCanvas");
var ctx = labirentCanvas.getContext("2d");
var sprite;
var bitisCizgisi;
var maze, draw, player;
var hucreBoyutu;
var zorluk;

window.onload = function() {
  let viewWidth = $("#gorunum").width();
  let viewHeight = $("#gorunum").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }


  var completeOne = false;
  var completeTwo = false;
  var isComplete = () => {
    if(completeOne === true && completeTwo === true)
       {
         console.log("Runs");
         setTimeout(function(){
           labirentYapma();
         }, 500);         
       }
  };
  sprite = new Image();
  sprite.src =
    "res/rat.png" +
    "?" +
    new Date().getTime();
  sprite.setAttribute("crossOrigin", " ");
  sprite.onload = function() {
    sprite = parlakligiDegistir(1.2, sprite);
    completeOne = true;
    console.log(completeOne);
    isComplete();
  };

  bitisCizgisi = new Image();
  bitisCizgisi.src = "res/peynir.png"+
  "?" +
  new Date().getTime();
  bitisCizgisi.setAttribute("crossOrigin", " ");
  bitisCizgisi.onload = function() {
    bitisCizgisi = parlakligiDegistir(1.1, bitisCizgisi);
    completeTwo = true;
    console.log(completeTwo);
    isComplete();
  };
  
};

window.onresize = function() {
  let viewWidth = $("#gorunum").width();
  let viewHeight = $("#gorunum").height();
  if (viewHeight < viewWidth) {
    ctx.canvas.width = viewHeight - viewHeight / 100;
    ctx.canvas.height = viewHeight - viewHeight / 100;
  } else {
    ctx.canvas.width = viewWidth - viewWidth / 100;
    ctx.canvas.height = viewWidth - viewWidth / 100;
  }
  hucreBoyutu = labirentCanvas.width / zorluk;
  if (player != null) {
    draw.redrawMaze(hucreBoyutu);
    player.redrawPlayer(hucreBoyutu);
  }
};

function labirentYapma() {
  if (player != undefined) {
    player.unbindKeyDown();
    player = null;
  }
  var e = document.getElementById("zorlukSecimi");
  zorluk = e.options[e.selectedIndex].value;
  hucreBoyutu = labirentCanvas.width / zorluk;
  maze = new Labirent(zorluk, zorluk);
  draw = new labirentCizme(maze, ctx, hucreBoyutu, bitisCizgisi);
  player = new Oyuncu(maze, labirentCanvas, hucreBoyutu, hamleSayisi, sprite);
  if (document.getElementById("labirentAlanı").style.opacity < "100") {
    document.getElementById("labirentAlanı").style.opacity = "100";
  }
}