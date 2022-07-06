(() => {
    let currentSearch = "";
    let listings = "";
    let buttonId = 0;
    let listingUrl = ""
    let removedUrls = [];
 
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, searchId } = obj;
    
        if (type === "NEW") {
            currentSearch = searchId
            newSearchLoaded();
        }
    });

    const fetchUrls = async () => {
        let urls = [];
        await chrome.storage.sync.get(null, (result) => {
            let allVals = Object.values(result);
            for(const value of allVals){
                urls.push(value[0].url);
            };
        });
        return urls ? urls : [];
    }

    const newSearchLoaded = async () => {

        const deleteBtnExists = document.getElementsByClassName("delete-btn")[0];
        // list of search results
        listings = document.querySelector(".srp-results").querySelectorAll(".s-item");
        // list of removed URLs
        removedUrls = await fetchUrls();
        // loop over each listing and add a button
        console.log(removedUrls)
        listings.forEach((listing) => {
            // First check for removed listings
            listingUrl = listing.getElementsByClassName("s-item__link")[0].href;
            removedUrls.forEach((url) => {
                console.log(url);
                if (listingUrl === url){
                    listing.style.backgroundColor = "red";
                }
            });
            // if the button doesn't already exist add it
            if (!deleteBtnExists) {
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn " + "delete-btn"
                deleteBtn.textContent = "X"
                deleteBtn.title = "Remove listing"
                deleteBtn.id = buttonId

                listing.appendChild(deleteBtn);
                // on click remove listing and record url
                deleteBtn.addEventListener("click", (e) => {
                    // can add more information later
                    const newUrl = {
                        url: listingUrl,
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
                buttonId++
        }
        });
    }
    newSearchLoaded();
})();

