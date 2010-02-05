//main parameters
bombsNum = 40;
rows = 16;
cols = 16;
gameType = 0;   
//-----------------------------
//main variables     
uncovered = 0;
flaged = 0;
wrongFlaged = 0;
time = 0;
run = false;
game = true;
timerId = 0;
//startPos
startRow = 0;
startCol = 0;

//contain numbers written in each cell
//-1 means a bomb
cellsData = new Array(rows);

//contain cell proporties
cellsView = new Array(rows);
//1 is visible , 0 is not
//2 is flaged
function timer(){
    time++;
    document.getElementById("timerLabel").innerHTML = "Time:  " + formatTime(time);
    document.getElementById("flagsLabel").innerHTML = "Flags: "+ flaged + "/" + bombsNum;
}

function formatTime(time){
    var mins = Math.floor(time/60);
    var secs = time%60;
    return (mins > 9 ? mins: "0" + mins) + ":" + (secs > 9 ? secs: "0" + secs);
}
//sets the inner text value of a cell using the
//appropriate image
function setCellText(cell,value){
    if (value == 0) return;
    cell.style.backgroundImage = "url(images/nums/" + value + ".png)";    
}
function startNewGame(type){
    run = false;
    time = 0;
    game = false;
    uncovered = 0;
    flaged = 0;
    wrongFlaged = 0;
    clearInterval(timerId);
    gameType = type;
    if (type == 0){
        bombsNum = 10;
        rows = 8;
        cols = 8;   
    }else if (type == 1){
        bombsNum = 40;
        rows = 16;
        cols = 16;
    }else if (type == 2){
        bombsNum = 99;
        rows = 16;
        cols = 30;
    }
    drawBoard();
    //hide the scoreBoard if it was visible
    document.getElementById("scoreBoard").style.display = "none";
    //set the board to visible
    document.getElementById("board").style.display = "block";
    document.getElementById("pauseScreen").style.display = "none";
    //set the pause button
    document.getElementById("timerLabel").innerHTML = "Time:  00:00";
    document.getElementById("flagsLabel").innerHTML = "Flags: 0/" + bombsNum;
    
    document.pauseGameImg.src = "images/pause1.png";
    document.pauseGameImg.onmouseover = function () {this.src = "images/pause2.png";};
    document.pauseGameImg.onmouseout = function () {this.src = "images/pause1.png";};
}
function drawBoard(){
    var board = document.getElementById("board");
    var tbl = "<table cellspacing = '0'>";
    var i=0;
    var j=0;
    for (i = 0;i < rows;i++){
        tbl+="<tr>";
        cellsData[i] = new Array(cols);
        cellsView[i] = new Array(cols);   
        for (j = 0;j< cols;j++){
            tbl += " <td><div id = '" + i +"-" + j + "' class= 'cell_closed' onmouseup ='cell_click("+ i + "," + j + ",event)'> </div></td> ";            
            cellsData[i][j] = 0;
            cellsView[i][j] = 0;
        }
        tbl+= "</tr>";
    }
    board.innerHTML = tbl + "</table>";
}

function generate(){
    var i = 0
    while (i < bombsNum){
        var col=Math.floor(Math.random()*cols);
        var row=Math.floor(Math.random()*rows);
        //if new location is already a bomb
        if (cellsData[row][col] == -1) continue;
        //if new location is near the start region
      
        if (col == startCol-1 || col == startCol || col == startCol +1){
            if (row == startRow -1 || row == startRow || row == startRow+1)
                continue;
        }
      
        i++;
        cellsData[row][col] = -1;
        
        
        if (row+1 < rows && cellsData[row+1][col] != -1)
            cellsData[row+1][col] += 1;                
        if (row > 0 && cellsData[row-1][col] != -1)
            cellsData[row-1][col] += 1;
        if (col+1 < cols && cellsData[row][col+1] != -1)
            cellsData[row][col+1] += 1;
        if (col > 0 && cellsData[row][col-1] != -1)
            cellsData[row][col-1] += 1;
        //diagonals
        if (row +1 < rows && col+1 < cols && cellsData[row+1][col+1] != -1)
            cellsData[row+1][col+1] += 1;
        if (row > 0 && col > 0 && cellsData[row-1][col-1] != -1)
            cellsData[row-1][col-1] += 1;         
        if (row +1 < rows && col > 0 && cellsData[row+1][col-1] != -1)            
            cellsData[row+1][col-1] += 1;          
        if (row > 0 && col+1 < cols && cellsData[row-1][col+1] != -1)
            cellsData[row-1][col+1] += 1;                     

    }  
}


function walk(row,col){
    if (row >= rows || col >= cols || row < 0 || col < 0 || cellsView[row][col] != 0)
	    return;

    cellsView[row][col] = 1;  
    uncovered +=1;
    cell = document.getElementById(row + "-" + col);
    cell.className = "cell_opened";
    //show the cell number
    setCellText(cell,cellsData[row][col]);
    
    if (cellsData[row][col] == 0){
	    walk(row+1,col);
	    walk(row,col+1);
	    walk(row,col-1);
	    walk(row-1,col);
	
	
	    walk(row-1,col-1);
	    walk(row+1,col+1);
	    walk(row+1,col-1);
	    walk(row-1,col+1);
    }
}

function showBombs(){
    //this can be improved alot by saving the position of the bombs
    //then showing them directly
    for (i=0;i<rows;i++){
        for (j=0;j<cols;j++){
            var cell = document.getElementById(i+ "-" + j);
            if (cellsView[i][j] != 2){
                if (cellsData[i][j] == -1){
                    //show a bomb image
                    cell.style.backgroundImage = "url(images/mine.png)";
                }else{
                    //show the cell number
                    cell.className = "cell_opened";
                    setCellText(cell,cellsData[i][j]);                    
                }
            }else{
                //found a wrong flag
                if (cellsData[i][j] != -1)                 
                    cell.style.backgroundImage = "url(images/flag2.png)";
            }         
        }
    }
}

//called when user clicked on an visible cell
//to uncover all the cells near it
function helper(row,col){
    if (!game) return;
    //counting flags
    var flags = 0;
    if (row > 0 && cellsView[row-1][col] == 2) flags++;
    if (row < rows-1 && cellsView[row+1][col] == 2) flags++;
    if (col > 0 && cellsView[row][col-1] == 2) flags++;
    if (col < cols-1 && cellsView[row][col+1] == 2) flags++;
    
    if (row > 0 && col > 0 && cellsView[row-1][col-1] == 2) flags++;
    if (row < rows-1 && col < cols-1 && cellsView[row+1][col+1] == 2) flags++;
    if (row > 0 && col < cols-1 && cellsView[row-1][col+1] == 2) flags++;
    if (row < rows-1 && col > 0 && cellsView[row+1][col-1] == 2) flags++;

    if (flags == cellsData[row][col]){
        if (row > 0 && cellsView[row-1][col] != 2)
            if (cellsData[row-1][col] == -1) {lostAction();return;} else walk(row-1,col);
            
        if (row < rows-1 && cellsView[row+1][col] != 2)
            if (cellsData[row+1][col] == -1)    {lostAction();return;} else walk(row+1,col);
            
        if (col > 0 && cellsView[row][col-1] != 2)
            if (cellsData[row][col-1] == -1)     {lostAction();return;} else walk(row,col-1);
            
        if (col < cols-1 && cellsView[row][col+1] != 2)
            if (cellsData[row][col+1] == -1)     {lostAction();return;} else walk(row,col+1);
            
        if (row > 0 && col > 0 && cellsView[row-1][col-1] != 2)
            if (cellsData[row-1][col-1] == -1)     {lostAction();return;} else walk(row-1,col-1);
            
        if (row < rows-1 && col < cols-1 && cellsView[row+1][col+1] != 2)
            if (cellsData[row+1][col+1] == -1)    {lostAction();return;} else walk(row+1,col+1);
            
        if (row > 0 && col < cols-1 && cellsView[row-1][col+1] != 2)
            if (cellsData[row-1][col+1] == -1)     {lostAction();return;} else walk(row-1,col+1);
            
        if (row < rows -1 && col > 0 && cellsView[row+1][col-1] != 2)
            if (cellsData[row+1][col-1] == -1)     {lostAction();return;} else walk(row+1,col-1);
    }
    
    
    
    if ((flaged == bombsNum || uncovered == rows*cols - bombsNum) && wrongFlaged == 0)
        winAction();   
}

function lostAction(){
    clearInterval(timerId);
    run = false;
    game = false;
    showBombs();
    setTimeout("finishGame(false)", 700);
}

function winAction(){
    clearInterval(timerId);
    run = false;
    game = false;
    showBombs();   
    setTimeout("finishGame(true)", 700);
}

function finishGame(win){
    var lastAddedScore = "";
    if (win){
        alert("Bravo...you won in " + time + " seconds\n you can click one of the faces to start a new game");
        lastAddedScore = chrome.extension.getBackgroundPage().saveScore(time,gameType);   
    }else{
        alert("how unlucky you are !!!\nbetter luck next time :D \n you can click one of the faces to start a new game");
    }
    
    generateScoreBoard(lastAddedScore);
}


//generate the score Board
function generateScoreBoard(lastAddedScore){

    var scoreBoard = document.getElementById("scoreBoard");
    var board = document.getElementById("board");
    
    var tbl = "<table > <th style = 'background-color:#c3d9ff;'> Small </th>" 
    tbl +=  "<th style = 'background-color:#c3d9ff;'> Medium </th>"
    tbl += "<th style = 'background-color:#c3d9ff;'> Large </th> ";
    
    for (var i=0;i<10;i++){    
        tbl += "<tr>";
        for (var j=0;j<3;j++){    
            if (localStorage["score" + j + "" + i] == null || localStorage["score" + j + "" + i] == "undefined")
                tbl += "<td align = 'center'> - </td>";
            else{
                if (lastAddedScore == "score" + j + "" + i)
                    tbl += "<td style = 'background-color:#fbcc67' align = 'center'> " + formatTime(localStorage["score" + j + "" + i]) + " </td>";
                else
                    tbl += "<td align = 'center'> " + formatTime(localStorage["score" + j + "" + i]) + " </td>";
            }
        }       
        tbl += "</tr>";
    }
    tbl += "</table>";
    scoreBoard.innerHTML = tbl;
    scoreBoard.style.display = "block";
    board.style.display = "none"; 
}


//show the score Board
//will pause the game
function showScoreBoard(){
    if (!game){
        generateScoreBoard("");
        return;
    }
   if (run)
        pauseResume();        
    generateScoreBoard("");
}

function pauseResume(){
    if (!game) return;
    var board = document.getElementById("board");
    var pauseScreen = document.getElementById("pauseScreen");
    var scoreBoard = document.getElementById("scoreBoard");
    
    if (!run){
        run = true;
        timerId = setInterval("timer()",1000);
        board.style.display = "block";
        pauseScreen.style.display = "none";
        document.pauseGameImg.src = "images/pause1.png";
        document.pauseGameImg.onmouseover = function () {this.src = "images/pause2.png";};
        document.pauseGameImg.onmouseout = function () {this.src = "images/pause1.png";};
        scoreBoard.style.display = "none";
    }else{
        run = false;
        clearInterval(timerId);
        
        pauseScreen.style.width = board.clientWidth;
        pauseScreen.style.Height = board.clientHeight;
        pauseScreen.style.backgroundColor = "#c3d9ff";
        pauseScreen.innerHTML = "  <h3 style ='background-color: #c3d9ff;display:inline'> Game Paused </h3>";

        
        board.style.display = "none";
        pauseScreen.style.display = "inline";
        
        document.pauseGameImg.src = "images/play1.png";
        document.pauseGameImg.onmouseover = function () {this.src = "images/play2.png";};
        document.pauseGameImg.onmouseout = function () {this.src = "images/play1.png";};
    }
}

function cell_click(row,col,e){ 
    //start a new game
    if (uncovered == 0 && game == false){
        run = true;
        timerId = setInterval("timer()",1000);
        game = true;
        startRow = row;
        startCol = col;
        generate();
    }else{
        if (!run) return;
    }
  
    if (e.which == 1 && cellsView[row][col] == 0){
        if (cellsData[row][col] == -1){         
            lostAction();
        }else{
            walk(row,col);                   
            if (flaged == bombsNum || uncovered == rows*cols - bombsNum )
                winAction();
        }
    }else if (e.which == 1 && cellsView[row][col] == 1){
        helper(row,col);
    }else if (e.which == 3 && cellsView[row][col] != 1) {
        cell = document.getElementById(row+ "-" +col);
        if (cellsView[row][col] == 0){
            cell.style.backgroundImage = "url(images/flag.png)";
            cellsView[row][col] = 2;
            flaged++;
            if (cellsData[row][col] != -1) wrongFlaged++;
        }else{
            cell.style.backgroundImage = "";
            cellsView[row][col] = 0;                     
            flaged--;
            if (cellsData[row][col] != -1) wrongFlaged--;
        }
    }
}

