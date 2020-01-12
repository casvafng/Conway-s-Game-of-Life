// This is the source code for FIT1-Final Project by Tung Nguyen, Duy Tran, and Moumini Banga.
var rows = 67;
var columns = 120;

var ground = false;

// Execute the setup function
function execute() {
    initializeGrids();
    resetGrids();
    layOutTable();
}

var grid = new Array(rows);
var nextGrid = new Array(rows);
function initializeGrids() {
    for (var i = 0; i < rows; i++) {
        grid[i] = new Array(columns);
        nextGrid[i] = new Array(columns);
    }
}

function resetGrids() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function layOutTable() {
    var gridContainer = document.getElementById('container');
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var r = document.createElement("r");
        for (var j = 0; j < columns; j++) {
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClick;
            r.appendChild(cell);
        }
        table.appendChild(r);
    }
    gridContainer.appendChild(table);
    }

    function cellClick() {
        var rowcol = this.id.split("_"); // split a string into an array of substrings, and returns the new array
        var row = rowcol[0];
        var col = rowcol[1];
        
        var classes = this.getAttribute("class");
        if(classes.indexOf("live") > -1) {  // returns the position of the first occurrence of a specified value in a string and returns -1 if the value to search for never occurs
            this.setAttribute("class", "dead");
            grid[row][col] = 0;  //State dead cell = 0
        } else {
            this.setAttribute("class", "live");
            grid[row][col] = 1;  //State live cell = 1
        }
        
    }
    
    function liveCells() {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) { // Loop to copy all live cells on the table
                var cell = document.getElementById(i + "_" + j);
                if (grid[i][j] == 0) {
                    cell.setAttribute("class", "dead");
                } else {
                    cell.setAttribute("class", "live");
                }
            }
        }
    }



function randomButton() {  // set table contains random live cells
    if (ground) return;
    clearButton();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            var randomCell = Math.round(Math.random());  //the value of Math.random() rounded to its nearest random integer from 0
            if (randomCell == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}

var time;
function clearButton() { // clear the table
    
    clearTimeout(time); //clears a timer set with the setTimeout() = regeneration Time

    var cellsLength = document.getElementsByClassName("live");
    var cells = [];
    for (var i = 0; i < cellsLength.length; i++) {
        cells.push(cellsLength[i]);  // returns the new length
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids();
}


function startButton() {
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";   

    if (ground) {
        ground = false;
        clearTimeout(time);
    } else {
        ground = true;
        play();
    }
}

var regenerationTime = 90;
function play() {    
    nextGeneration();
    if (ground) {
        time = setTimeout(play, regenerationTime);
    }
}
 
function resetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) { // Loop to copy and reset nextGrid
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

function nextGeneration() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            rules(i, j);
        }
    }
    resetGrid();
    liveCells();
}

function neighbor(x, y) {
    var count = 0;
    if (y+1 < columns) {
        if (grid[x][y+1] == 1) count++;
    }
    if (x+1 < rows) {
        if (grid[x+1][y] == 1) count++;
    }
    if (x+1 < rows && y-1 >= 0) {
        if (grid[x+1][y-1] == 1) count++;
    }
    if (x+1 < rows && y+1 < columns) {
        if (grid[x+1][y+1] == 1) count++;
    }
    if (x-1 >= 0) {
        if (grid[x-1][y] == 1) count++;
    }
    if (x-1 >= 0 && y-1 >= 0) {
        if (grid[x-1][y-1] == 1) count++;
    }
    if (x-1 >= 0 && y+1 < columns) {
        if (grid[x-1][y+1] == 1) count++;
    }
    if (x-1 >= 0) {
        if (grid[x][y-1] == 1) count++;
    }
    return count;
}

function rules(x, y) {
    var o = parseInt(document.getElementById('over').value);
    var u = parseInt(document.getElementById('under').value);
    var b = parseInt(document.getElementById('born').value);
    var l1 = parseInt(document.getElementById('live1').value);
    var l2 = parseInt(document.getElementById('live2').value);
    var neighbors = neighbor(x, y);
    if (grid[x][y] == 1) {          // State = alive
        if (neighbors == l1 || neighbors == l2) {
            nextGrid[x][y] = 1;     // State = remain alive because of stable population
        } else if (neighbors > o) {
            nextGrid[x][y] = 0;     // State = dead because of overpopulation
        } else if (neighbors < u) {
            nextGrid[x][y] = 0;     // State = dead because of underpopulation
        }
    } else if (grid[x][y] == 0) {   // State = dead
            if (neighbors == b) {
                nextGrid[x][y] = 1; // State = alive because of healthy population
            }
        }
    }

function howToPlay() {
    alert("The universe of the Game of Life is an infinite, two-dimensional orthogonal grid of square cells , each of which is in one of two possible states, alive or dead. Every cell interacts with its 8 neighbors , which are the cells that are horizontally, vertically, or diagonally adjacent. At each step in time, the following transitions occur:"+"\n"
    +"\n"+ "* Any live cell with more than [your input number] live neighbours dies, as if by overpopulation. (3 as original rules) " 
    +"\n"+ "* Any live cell with fewer than [your input number] live neighbours dies, as if by underpopulation.(2 as original rules)" 
    +"\n"+ "* Any dead cell with exactly [your input number] live neighbours becomes a live cell, as if by reproduction.(3 as original rules)"
    +"\n"+ "* Any live cell with [your input number] or [your input number] live neighbours lives on to the next generation.(2 or 3 as original rules)"+"\n"
    +"\n"+ "1. Input value to create your own rules."
    +"\n"+ "2. Click the cell to initialize pattern."
    +"\n"+ "3. Press [Start and Pause] button to Start the cell evolution. Press [Start and Pause] button again if you want to pause the cell evolution."
    +"\n"+ "4. Press [Clear] button if you want to clear the board."
    +"\n"+ "5. Press [Sample] button if you want to initialize a random pattern."+"\n"
    +"\n"+ "The initial pattern constitutes the seed of the system. The first generation is created by applying the above rules simultaneously to every cell in the seed; births and deaths occur simultaneously, and the discrete moment at which this happens is sometimes called a tick. Each generation is a function of the preceding one. The rules continue to be applied repeatedly to create further generations.");   
}
//RUN
window.onload = execute;