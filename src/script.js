function rdm (max){
    return Math.floor(Math.random()*(max +1));
};
function random ( min, max, floor){
    if (floor) return Math.floor((Math.random()*(max - min + 1)) + min);
    return (Math.random()*(max - min)) + min;
};
function rdmAround (x, floor){
    if (floor) return Math.floor( Math.random()* x * 2 - x )
    return Math.random()* x * 2 - x
}
function write (input){
    console.log('%c' +  JSON.stringify(input), 'color: #8BF');
    return void 0;
};
function error (input){
    console.log('%c' + JSON.stringify(input), 'color: #F54;');
    return void 0;
};
function $ (id){
    return document.getElementById(id);
};
function randomColor (){
    return `hsl( ${rdm(360)}, ${random( 20, 70, true)}%, 50%)`
}

let canvas = $('canvas')
let c = canvas.getContext('2d')
// w and h are offset by - 1
let w = 9 + 1
let h = 9 + 1
let a = Math.floor(window.innerHeight / h)
let b = Math.floor(window.innerWidth / w)
let res = a < b ? a : b;
let width = w*res - res
let height = h*res - res
let fps = 100
let turn = 1
let winner = null

canvas.width = width
canvas.height = height

c.fillStyle = '#CCC'
c.strokeStyle = '#CCC'

let mouse = {
    x: width/2,
    y: height/2,
    z: false
}

window.addEventListener( 'mousemove', ( event)=>{
    mouse.x = event.x
    mouse.y = event.y
})

window.addEventListener( 'mousedown', ()=>{
    mouse.z = true
})

window.addEventListener( 'mouseup', ()=>{
    mouse.z = false
})

class Shape {
    constructor(x, y, type, a, b, strokeStyle, fillStyle) {
        
        this.x = x;
        this.y = y;

        this.vx = 0;
        this.vy = 0;

        this.type = type;

        switch (this.type) {
            case 'quad':{
                this.w = a;
                this.h = b;
                break
            }
            case 'circle':{
                this.r = a;
                this.a = b;
                break
            }
            case 'fillCircle':{
                this.r = a;
                this.a = b;
                break
            }
        }

        this.strokeStyle = strokeStyle;
        this.fillStyle = fillStyle;

        this.render = ()=>{

            c.strokeStyle = this.strokeStyle;
            c.fillStyle = this.fillStyle;

            switch (this.type) {
                case 'quad': {
                    c.fillRect(this.x, this.y, this.w, this.h);
                    break;
                }
                case 'circle': {
                    c.beginPath();
                    c.arc(this.x, this.y, this.r, 0, this.a, false);
                    c.stroke();
                    break;
                }
                case 'fillCircle': {
                    c.beginPath();
                    c.arc(this.x, this.y, this.r, 0, this.a, false);
                    c.fill();
                    c.stroke();
                    break;
                }

            }
        }
        this.update = ()=>{
            this.x += this.vx
            this.y += this.vy
        }
    }
}

let cursor = new Shape( 0, 0, 'fillCircle', res/2.5, 8, 'rgb(210, 210, 61)', 'rgb(210, 210, 61)')

function loop(){
    requestAnimationFrame(loop);
    cursor.x = mouse.x
    cursor.y = mouse.y
    render()
}


function update(){
    //horizontal
    for ( let x in arr ){
        for ( let y in arr[x]){
            let connceted = 0
            for ( let i = x ; i <= x + width ; i++ ){
                if ( arr[i] != undefined ){
                    if ( arr[i][y] == arr[x][y] & arr[i][y] != 0){
                        connceted++
                        if ( connceted == 4 ){
                            return arr[x][y]
                        }
                    } else {
                        connceted = 0
                    }
                }
            }
        }
    }
    //vertical
    for ( let x in arr ){
        for ( let y in arr[x]){
            let connceted = 0
            for ( let i = y ; i <= y + h ; i++){
                if ( arr[x][i] == arr[x][y] & arr[x][y] != 0 ){
                    connceted++
                    if ( connceted == 4 ){
                        return arr[x][i]
                    }
                } else {
                    connceted = 0
                }
            }
        }
    }
    //diagonal ++
    for ( let x = 0 ; x < arr.length ; x++ ){
        for ( let y = 0 ; y < arr[x].length ; y++){
            if ( arr[x+1] != undefined & arr[x+2] != undefined & arr[x+3] != undefined) {
                if ( arr[x+1][y+1] == arr[x][y] & arr[x+2][y+2] == arr[x][y] & arr[x+3][y+3] == arr[x][y] & arr[x][y] != 0){
                    return arr[x][y]                            
                }
                if ( arr[x+1][y-1] == arr[x][y] & arr[x+2][y-2] == arr[x][y] & arr[x+3][y-3] == arr[x][y] & arr[x][y] != 0){
                    return arr[x][y]                            
                }
            }
        }
    }
    return null
}

function render(){
    c.clearRect( 0, 0, width, height)
    board.render()
    for ( let i in arr ){
        for ( let a in arr[i]){
            switch (arr[i][a]) {
                case 0:{
                    c.fillStyle = 'rgb( 28, 43, 66)'
                    break
                }
                case 1:{
                    c.fillStyle = 'rgb( 238, 238, 52)'
                    break
                }
                case 2:{
                    c.fillStyle = 'rgb( 200, 60, 60)'
                    break
                }
            }
            c.beginPath()
            c.arc( i*res+res/2, a*res+res/2, res/2 - 2, 0, 8, false)
            c.fill()
            c.font = `${res*0.75}px monospace`
            c.fillStyle = 'rgb(37, 71, 123)'
            c.fillText( i/1+1 , (i/1+0.28)*res, res*0.75)
    }
    }
    cursor.render()
}

let board = new Shape( 0, 0, 'quad', res*w+res, res*h+res, 'rgb(37, 71, 123)', 'rgb(37, 71, 123)')

let arr = []
for ( let i = 0 ; i < w - 1 ; i++ ){
    arr.push([])
    for ( let a = 0 ; a < h - 1 ; a++ ){
        arr[i].push(0)
    }
}

window.addEventListener( 'click', ()=>{
    if (winner == null){
        let x = Math.floor(mouse.x/res)
        for ( let y in arr[x]){
            if ( arr[x][y/1+1] != 0 & arr[x][y] == 0){
                arr[x][y] = turn
                break
            }
        }
        if ( turn == 1){
            turn = 2
            cursor.fillStyle = 'rgb(167, 52, 52)'
            cursor.strokeStyle = 'rgb(167, 52, 52)'
        }
        else{
            turn = 1
            cursor.fillStyle = 'rgb(210, 210, 61)'
            cursor.strokeStyle = 'rgb(210, 210, 61)'
        }

        // i made thse sound effects with my mouth lol

        let randomSfx = random( 1, 7, true)
        new Audio(`./sfx/pop (${randomSfx}).m4a`).play()

        winner = update() 
        
        if ( winner == 1){
            $('gui').innerHTML = `
                <div id="winner">YELLOW WON</div>
                <div id="restart">press [R] to restart</div>
            `
        }
        if ( winner == 2){
            $('gui').innerHTML = `
            <div id="winner">RED WON</div>
            <div id="restart">press [R] to restart</div>
            `
        }
    }
})
window.addEventListener( 'keypress', (key)=>{
    if ( key.key == 'r' ){
        document.location.reload()
    }
})

loop()