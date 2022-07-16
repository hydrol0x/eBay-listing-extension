(() => {
  let currentSearch = "";
  let listingId = 0;
  let listingUrl = "";
  let listingUrls = {};
  let removedUrls = [];

  const getUrls = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (obj) => {
        resolve(Object.values(obj).length > 0 ? Object.values(obj) : []);
      });
    });
  };

  const getSearchResults = () => {
    const searchResults = document
      .getElementsByClassName("srp-results")[0]
      .getElementsByClassName("s-item");

    return Array.from(searchResults);
  };

  const newSearchLoaded = async () => {
    const searchResults = getSearchResults();
    removedUrls = await getUrls(); // removed urls
    currentSearch = await messageListener;

    searchResults.forEach((listing) => {
      const id = `listing${listingId}${currentSearch}`;
      const deleteBtnExists = document.getElementById(id);
      const deleteBtn = document.createElement("button");
      if (!deleteBtnExists) {
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "x";
        deleteBtn.title = "Remove listing";
        deleteBtn.id = id;

        // button styling
        listing.style.paddingBottom = "2rem";
        deleteBtn.style.height = "26px";
        deleteBtn.style.width = "26px";
        deleteBtn.style.fontSize = "10pt";
        deleteBtn.style.float = "right";
        deleteBtn.style.marginRight = "0.2%";
        deleteBtn.style.backgroundColor = "white";
        deleteBtn.style.borderWidth = "1.5px";
        deleteBtn.style.borderRadius = "50%";
        deleteBtn.onmouseover = () => {
          deleteBtn.style.color = "red";
          deleteBtn.style.borderColor = "red";
        };
        deleteBtn.onmouseout = () => {
          deleteBtn.style.color = "black";
          deleteBtn.style.borderColor = "black";
        };
        deleteBtn.style.transition = "all 0.25s";

        listing.appendChild(deleteBtn);
      }

      listingUrl = listing.getElementsByClassName("s-item__link")[0].href; // get listing URL
      listingTitle =
        listing.getElementsByClassName("s-item__title")[0].textContent; // get listing title
      listingUrls[deleteBtn.id] = { url: listingUrl, title: listingTitle }; // add unique id to each url and add to the list of all urls

      for (const removedUrl of removedUrls) {
        // Check for removed listings
        if (listingUrl.split("&")[0] === removedUrl[0].url.split("&")[0]) {
          // urls change but are the same before &
          listing.remove();
        }
      }

      // on click remove listing and record url
      deleteBtn.addEventListener("click", (e) => {
        // can add more information later
        // TODO: store as a JSON object for easier parsing!!
        const newUrl = {
          url: listingUrls[deleteBtn.id].url,
          title: listingUrls[deleteBtn.id].title,
        };

        // store in chrome storage
        // key = button id; value is url.
        chrome.storage.sync.set({
          [deleteBtn.id]: [newUrl],
        });

        // remove the listing on button click
        listing.remove();
      });

      // next button will have id+1
      listingId++;
    });
  };

  let messageListener = new Promise((resolve) => {
    chrome.runtime.onMessage.addListener((obj) => {
      const { type, value, search } = obj;
      if (type === "NEW") {
        resolve(search);
        newSearchLoaded();
      } else if (type === "DELETE") {
        console.log(value);
      }
    });
  });
})();
