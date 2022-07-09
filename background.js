chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url && tab.url.includes("ebay.com/sch")) {
    const queryParameters = tab.url.split(/3&_/)[1];
    console.log(queryParameters)
    const urlParameters = new URLSearchParams(queryParameters);

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      searchID: urlParameters.get("nkw")
    });
  }
})