import { getActiveTabUrl } from "./utils.js";
// adding a new url row to the popup
//TODO: implement adding new url
const addNewUrl = (urlElement, url) => {
  const UrlTitleElement = document.createElement("div");
  const newUrlElement = document.createElement("div");
  UrlTitleElement.textContent = url[0].title;
  UrlTitleElement.className = "url-title";

  newUrlElement.id = "url-" + url.url + url.title;
  newUrlElement.className = "url";
  newUrlElement.setAttribute("url", url.url);

  newUrlElement.appendChild(UrlTitleElement);
  urlElement.appendChild(newUrlElement);
};

const viewUrls = (removedUrls = []) => {
  const urlElement = document.getElementById("urls");
  urlElement.innerHTML = "";

  if (removedUrls.length > 0) {
    for (const url of removedUrls) {
      addNewUrl(urlElement, url);
    }
  } else {
    urlElement.innerHTML = "<i class='row'>There are no bookmarks to show</i>";
  }
};

const onDelete = (e) => {};

document.addEventListener("DOMContentLoaded", async () => {
  let currentSearch = "";
  const activeTab = await getActiveTabUrl();
  const queryParameters = activeTab.url.split(/from=/)[1];
  const urlParameters = new URLSearchParams(queryParameters);

  // checking if the user is on an initial search or on a different search page, e.g search page 2
  // also checking if queryParameters exists in case user not on the eBay search URL
  if (queryParameters && queryParameters.includes("pgn=")) {
    currentSearch = urlParameters.get("_nkw") + urlParameters.get("_pgn"); // nkw is the search term, pgn is page num
  } else if (queryParameters && queryParameters.includes("_trksid")) {
    currentSearch = urlParameters.get("_trksid"); // trksid is some category / id number for search
  } else {
    console.log("Invalid URL");
  }

  if (activeTab.url.includes("ebay.com/sch") && currentSearch) {
    chrome.storage.sync.get(null, (obj) => {
      const removedUrls =
        Object.values(obj).length > 0 ? Object.values(obj) : [];

      viewUrls(removedUrls);
    });
  } else {
    const container = document.getElementsByClassName("container")[0];

    container.innerHTML =
      '<div class="title"> This is not an eBay search page </div>';
  }
});
