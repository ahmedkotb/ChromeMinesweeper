//main parameters
bombsNum = 40;
rows = 16;
cols = 16;   
//-----------------------------
//main variables     
uncovered = 0;
flaged = 0;
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
    var mins = Math.floor(time/60);
    var secs = time%60;
    document.getElementById("timerLabel").innerHTML = "Time:  " + (mins > 9 ? mins: "0" + mins) + ":" + (secs > 9 ? secs: "0" + secs)+ "";   
    document.getElementById("flagsLabel").innerHTML = "Flags: "+ flaged + "/" + bombsNum;
}
function startNewGame(){
    run = false;
    time = 0;
    game = false;
    uncovered = 0;
    flaged = 0;
    clearInterval(timerId);
    drawBoard();
    
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
            tbl += " <td><div id = '" + i +"-" + j + "' class= 'cell_closed' onmouseup ='test("+ i + "," + j + ",event)'> </div></td> ";
            //tbl+= "<td> <INPUT TYPE='button' VALUE='' > </td> ";
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
    if (cellsData[row][col] != 0)
        cell.innerHTML = cellsData[row][col];
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
                    cell.style.backgroundImage = "url(images/mine.png)";
                }else{
                    cell.style.backgroundImage = "";
                    cell.className = "cell_opened";
                    if (cellsData[i][j] != 0) cell.innerHTML = cellsData[i][j];        
                }
            }else{
                if (cellsData[i][j] != -1){
                    cell.style.backgroundColor = "red";
                }    
            }         
        }
    }
}
//called when user clicked on an visible cell
//to uncover all the cells near it
function helper(row,col){
    if (!game) return;
    //counting flags
    flags = 0;
    if (row > 0 && cellsView[row-1][col] == 2) flags++;
    if (row < rows-1 && cellsView[row+1][col] == 2) flags++;
    if (col > 0 && cellsView[row][col-1] == 2) flags++;
    if (col < cols-1 && cellsView[row][col+1] == 2) flags++;
    
    if (row > 0 && col > 0 && cellsView[row-1][col-1] == 2) flags++;
    if (row < rows-1 && col < cols-1 && cellsView[row+1][col+1] == 2) flags++;
    if (row > 0 && col < cols-1 && cellsView[row-1][col+1] == 2) flags++;
    if (row < rows-1 && col > 0 && cellsView[row+1][col-1] == 2) flags++;

    //alert(flags);

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

    if (flaged == bombsNum || uncovered == rows*cols - bombsNum )
        winAction();   
}

function lostAction(){
    clearInterval(timerId);
    run = false;
    game = false;
    showBombs();
    alert("how unlucky you are ?!!!\nbetter luck next time :D");
}

function winAction(){
    clearInterval(timerId);
    run = false;
    game = false;
    showBombs();
    alert("Bravo...you won in " + time + " seconds");
    clearIm
}
function pauseResume(){
    if (!game) return;
    //var board = document.getElementById("board");
    if (!run){
        run = true;
        timerId = setInterval("timer()",1000);
        //board.style.display = "block";
        document.pauseGameImg.src = "images/pause1.png";
        document.pauseGameImg.onmouseover = function () {this.src = "images/pause2.png";};
        document.pauseGameImg.onmouseout = function () {this.src = "images/pause1.png";};
    }else{
        run = false;
        clearInterval(timerId);
        //board.style.display = "none";
        document.pauseGameImg.src = "images/play1.png";
        document.pauseGameImg.onmouseover = function () {this.src = "images/play2.png";};
        document.pauseGameImg.onmouseout = function () {this.src = "images/play1.png";};
    }
}

function test(row,col,e){ 
    //start a new game
    if (uncovered == 0){
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
        }else{
            cell.style.backgroundImage = "";
            cellsView[row][col] = 0;                     
            flaged--;
        }
    }
}

