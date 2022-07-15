import { getActiveTabUrl } from "./utils.js";
// adding a new url row to the popup
const addNewUrl = (urlElement, url) => {
  const urlContent = url[0]; // array of 1 element, url[0] is the object with url and title
  const UrlTitleElement = document.createElement("a");
  const newUrlElement = document.createElement("div");
  const deleteBtn = document.createElement("img");
  UrlTitleElement.textContent = urlContent.title;
  UrlTitleElement.href = urlContent.url; // make the title clickable, takes you to the listing
  UrlTitleElement.target = "_blank"; // open a new tab when clicked
  UrlTitleElement.className = "url-title";

  deleteBtn.className = "deleteBtn";
  deleteBtn.src = "assets/X_icon.png";
  deleteBtn.title = "Remove";
  deleteBtn.addEventListener("click", (e) => {
    newUrlElement.remove();
  });

  newUrlElement.id = "url-" + urlContent.url + urlContent.title;
  newUrlElement.className = "url";

  newUrlElement.appendChild(UrlTitleElement);
  newUrlElement.appendChild(deleteBtn);
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

const setUrlAttributes = document.addEventListener(
  "DOMContentLoaded",
  async () => {
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
  }
);
