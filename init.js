function G(id) {
    return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', function () {
  startNewGame(-1);

  G("newEasyGameButton").addEventListener('click', function(){startNewGame(0)});
  G("newMedGameButton").addEventListener('click', function(){startNewGame(1)});
  G("newLargeGameButton").addEventListener('click', function(){startNewGame(2)});

  G("pauseGameImg").addEventListener('click', function(){setRun(!run)});
  G("scoreGameImg").addEventListener('click', showScoreBoard);

  G("board").ondragstart = function () {return false};
  G("pauseScreen").ondragstart = function () {return false};
  G("scoreBoard").ondragstart = function () {return false};
  G("board").oncontextmenu = function () {return false};
  G("pauseScreen").oncontextmenu= function () {return false};
  G("scoreBoard").oncontextmenu= function () {return false};
});
