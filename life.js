/* 
1 - alive
0 - dead

Any live cell with fewer than two live neighbours dies, as if by underpopulation. status = 1, <2 alive , status=0
Any live cell with two or three live neighbours lives on to the next generation. status = 1, >=2 <=3 alive, status = same
Any live cell with more than three live neighbours dies, as if by overpopulation. status = 1, >=3 alive, status =0
Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction. status=0, >=3 alive, status = 1

status = 1, <2 alive , status=0
status = 1, >=2 <=3 alive, status = same
status = 1, >=3 alive, status =0
status=0, >=3 alive, status = 1


8 neighborhood

a point can be an object
properties: 
1) position x,y
2) status 1,0
methods:
1) neighbors()
*/ 
function log(what, ...text){
    console.log(`logging ${what}`);
    console.log(text);
}

function logAD(points, num){
    if(num===1){
        console.log('logging alive points');
        for (pt of points) {
            if (pt.status === 1) {
                console.log(pt);
            }
        }
    }else{
        console.log('logging dead points');
        for (pt of points) {
            if (pt.status === 0) {
                console.log(pt);
            }
        }
    }
    
}

const canv = document.querySelector('.plot');
const ctx = canv.getContext('2d');

const width = (canv.width=window.innerWidth);
const height = (canv.height=window.innerHeight);
const size = 50;
const scaledWidth =Math.floor(width/size);
const scaledHeight = Math.floor(height/size);

const directions = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
    [-1, -1], [1, -1], [-1, 1], [1, 1]]  // up, down, right, left, bottom left, bottom right, top left, top right

const gridDimensions = {
    x: scaledWidth - 1, y: scaledHeight - 1,
    centroidx: Math.floor(this.x / 2), centroidy: Math.floor(this.y / 2)
};

let points = [];

ctx.scale(size, size);

// populate
let id = 0;
for(let i=0; i<gridDimensions.x; i++){
    for (let j = 0; j < gridDimensions.y; j++){
        let point = new Point(i,j,id);
        // log('point', point);
        points.push(point);
        id++;
    }
}

// gives you the index of the matching point in points list
function findIndex(x,y){
    for (ptID in points){
        const x1 = points[ptID].point[0];
        const y1 = points[ptID].point[1];
        if (x1===x && y1===y){
            return ptID;
        }
    }
    return null;
}

const adjMatDim = points.length;
const adjMat = [];

for (pt of points){
    newPoints = []
    for (d of directions) {
        const newPoint = [pt.point[0] + d[0], pt.point[1] + d[1]];
        
        // checking dimensions
        if (newPoint[0] > gridDimensions.x || newPoint[1] > gridDimensions.y){
            continue
        } else if (newPoint[0] < 0 || newPoint[1]<0){
            continue
        }
        
        const match = findIndex(newPoint[0], newPoint[1]);
        if (match!==null){
            pt.neighs.push(match);
        }
        
    }

}

log('points', points);


function Point(x,y, id){
    this.x = x;
    this.y = y;
    this.status = 0;
    this.id = id;
    this.neighs = [];
    this.color = "rgba(59, 224, 26, 0.68)";
    this.point = [x, y];

    this.draw = function(){
        if(this.status===1){
            ctx.fillStyle = this.color;
            ctx.fillRect(x, y, 1, 1);
            ctx.fill();
            // log('pt',pt);
        }
    }
    // number of living cells around cell in 8 neighborhood
    this.lives = function() {
        let live = 0;
        for (neigh of this.neighs){
            curr = points[neigh];
            // log('this', this);
            if (curr.status===1){
                live++;
            }
        }
        return live;
    }
    // changes status f cell in nieghborhood
    this.changeStatus = function(){
        let live = this.lives();
        // log('live', live, this.x, this.y);

        if (this.status===1){
            if (live<2){
                const status = 0;
                return status;
            }
            else if (live>=2 && live<=3){
                return 1;
            }
            else if (live>=3){
                const status = 0;
                return status;
            }
        }else{
            if (live>=3){
                const status = 1;
                return status;
            }
        }
    }
    // status = 1, < 2 alive, status = 0
    // status = 1, >= 2 <= 3 alive, status = same
    // status = 1, >= 3 alive, status = 0
    // status = 0, >= 3 alive, status = 1
}

// initial config - blinker
points[63].status = 1;
points[64].status = 1;
points[65].status = 1;


let points2 = points;
// plot animation, change status
// ================================ stopped here; check point variables for errors (are they being switched appropriately)
const end =2;

for(let i=0; i<end; i++){
    log('before');
    logAD(points, 1);

    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, width, height);
    log('iteration', i);
    for (let pt=0; pt <  points.length; pt++) {
        // need two sets of points
        points[pt].draw();
        let statusChange = points[pt].changeStatus();
        points2[pt].status = statusChange;
    }
    log('after');
    logAD(points, 1);

    points = points2;

    if (i==0){
        ctx.clearRect(0, 0, width, height);
    }
    
}
