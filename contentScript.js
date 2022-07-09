(() => {
    let currentSearch = "";
    let searchResults = "";
    let listingId = 0;
    let listingUrl = "";
    let listingUrls = {};
    let removedUrls = [];
 
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, searchId } = obj;
        if (type === "NEW") {
            currentSearch = searchId
            newSearchLoaded();
        }
    });

    const fetchUrls = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get(null, (obj) => {
                resolve(Object.values(obj).length>0 ? Object.values(obj) : [])
            });
        });
    }

    const newSearchLoaded = async () => {

        searchResults = document.querySelector(".srp-results").querySelectorAll(".s-item");     // list of search results
        removedUrls = await fetchUrls();    // removed urls

        searchResults.forEach((listing) => {   

            // add button if it doesn't already exist
            let deleteBtnExists = listing.getElementsByClassName("btn")[0]
            if (!deleteBtnExists){
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn " + "delete-btn"
                deleteBtn.textContent = "X"
                deleteBtn.title = "Remove listing"
                deleteBtn.id = `listing${listingId}` // ${searchId}`

                listing.appendChild(deleteBtn);
            }

            listingUrl = listing.getElementsByClassName("s-item__link")[0].href;    // get listing URL
            listingUrls[deleteBtn.id] = listingUrl  // add unique id to each url and add to the list of all urls

            for(const url of removedUrls){  // Check for removed listings 
                console.log(listingUrl.split("&"))
                console.log(url[0].url.split("&"))
                if (listingUrl.split("&")[0] === url[0].url.split("&")[0]){ // urls change but are the same before & 
                    console.log(`removed listing with url ${url}`);
                    listing.remove();
                }
            };

            // on click remove listing and record url
            deleteBtn.addEventListener("click", (e) => {
                // can add more information later
                let newUrl = {
                    url: listingUrls[deleteBtn.id], 
                    name: "name",
                };
                
                // store in chrome storage
                // key = button id; value is url.
                chrome.storage.sync.set({
                    [deleteBtn.id]: [newUrl] 
                });

                // remove the listing on button click
                listing.remove();
            });

                // next button will have id+1
                listingId++
        
        });
    }
    newSearchLoaded();
})();

