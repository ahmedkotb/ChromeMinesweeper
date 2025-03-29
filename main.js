function newGameTab() {
  chrome.tabs.create({ url: "minesweeper.html" })
}

chrome.action.onClicked.addListener(newGameTab);

chrome.tabs.onActivated.addListener(() => {
  chrome.runtime.sendMessage({
    msg: "tab_changed",
    data: {}
  });
})
