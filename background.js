chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.includes("ebay.com/sch")
  ) {
    const queryParameters = tab.url.split(/from/)[1];
    chrome.tabs.sendMessage(tabId, {
      search: queryParameters,
      type: "NEW",
    });
  }
});
