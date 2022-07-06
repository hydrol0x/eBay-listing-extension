(() => {
    let currentSearch = "";
    let listings = "";
    let buttonId = 0;
    let listingUrl = ""
    let storedUrls = []

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, searchId } = obj;
    
        if (type === "NEW") {
            currentSearch = searchId
            newSearchLoaded();
        }
    });

    const newSearchLoaded = () => {
        const deleteBtnExists = document.getElementsByClassName("delete-btn")[0];

        listings = document.querySelector(".srp-results").querySelectorAll(".s-item");
        
        // loop over each listing and add a button
        listings.forEach((listing) => {
            // if the button doesn't already exist add it
            if (!deleteBtnExists) {
                const deleteBtn = document.createElement("button");
                deleteBtn.className = "btn " + "delete-btn"
                deleteBtn.textContent = "X"
                deleteBtn.title = "Remove listing"
                deleteBtn.id = buttonId

                listing.appendChild(deleteBtn);
                // on click remove listing and record url
                listingUrl = listing.getElementsByClassName("s-item__link")[0].href;
                deleteBtn.addEventListener("click", (e) => {
                    const newUrl = {
                        url: listingUrl,
                        name: "name",
                    };
            
                    chrome.storage.sync.set({
                        "removedUrls": JSON.stringify([newUrl])
                    });
                    
                    listing.remove();
                });

                buttonId++
        }
        });
    }
    newSearchLoaded();
})();

