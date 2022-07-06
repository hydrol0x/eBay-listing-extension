chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("ebay.com/sch")) {
    const queryParameters = tab.url.split(/3&_/)[1];
    const urlParameters = new URLSearchParams(queryParameters);
    console.log(urlParameters)

    chrome.tabs.sendMessage(tabId, {
      type: "NEW",
      searchID: urlParameters.get("nkw")
    });
  }
})