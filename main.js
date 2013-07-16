function saveScore(score,type){
    var storeStr = "score" + type;
    var i,j;
    for (i=0;i < 10;i++){
        if (localStorage[storeStr + i] == null ||localStorage[storeStr + i] == "undefined" ||  (  score < parseInt(localStorage[storeStr + i])))
            break;
    }
    if (i < 10){
        //shift all scores
        for (j=9;j>i;j--)
            localStorage[storeStr + j] = localStorage[storeStr + (j-1)];

        localStorage[storeStr + i] = score;
        return storeStr + i;
    }
    return "";
}

function newGameTab(tab){
    chrome.tabs.create({url:"minesweeper.html"})
}

chrome.browserAction.onClicked.addListener(newGameTab);
