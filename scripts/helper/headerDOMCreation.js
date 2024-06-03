export function createHeaderDOM() {
    let bikeDetailsEndpoint =`${window.location.origin}/query-index.json`;
  
    // Initialize the DOM elements
    const newHeaderMotorcyclev1 = `
      <div class="sidebar">
        <div class="cc-range new-launch" data-new-launch="yes">New Launch</div>
        <div class="cc-range" data-min="100" data-max="110">100 cc - 110 cc</div>
        <div class="cc-range" data-min="125" data-max="160">125 cc - 160 cc</div>
        <div class="cc-range" data-min="200" data-max="1000">200 cc or above</div>
      </div>
      <div class="main-content">
        <div id="bike-list" class="bike-list"></div>
      </div>
      <div id="bike-details" class="details"></div>
    `;
  
    // Find the MOTORCYCLES nav-drop
    const navDrops = document.querySelectorAll("li.nav-drop");
    navDrops.forEach(async (navDrop) => {
      if (navDrop.textContent.trim().startsWith("MOTORCYCLES")) {
        const existingUl = navDrop.querySelector("ul");
        if (existingUl) {
          existingUl.remove();
        }
  
        const newUl = document.createElement("ul");
        const newLi = document.createElement("li");
        newLi.innerHTML = newHeaderMotorcyclev1;
        newUl.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        newUl.appendChild(newLi);
        navDrop.appendChild(newUl);
  
        // Fetch data from the API and construct dom
        try {
          const bikeDetails = await getData(bikeDetailsEndpoint);
          const bikeList = document.getElementById("bike-list");
          const bikeDetailsElement = document.getElementById("bike-details");
  
          function displayBikeList(minCC, maxCC, newLaunch) {
            bikeList.innerHTML = "";
            let firstBike = null;
            bikeDetails.data.forEach((item) => {
              const displacement = parseInt(item["model-displacement"]);
              const isNewLaunch = item["model-new-launch"] === "yes";
              if (newLaunch === true) {
                if (isNewLaunch) {
                  if (!firstBike) firstBike = item;
                  createBikeItem(item);
                }
              } else if (
                (item.path.includes("/bikes/") || item.path.includes("/Bikes/")) &&
                displacement >= minCC &&
                displacement <= maxCC
              ) {
                if (!firstBike) firstBike = item;
                createBikeItem(item);
              }
            });
            if (firstBike) {
              displayBikeDetails(firstBike);
            }
          }
  
          function createBikeItem(item) {
            const bikeItem = document.createElement("div");
            bikeItem.className = "bike-item";
            bikeItem.addEventListener("click", () => displayBikeDetails(item));
  
            const bikeImage = document.createElement("img");
            bikeImage.src = item["model-image"]
              ? item["model-image"]
              : item["image"];
            bikeImage.alt = item["model-name"];
  
            const bikeInfo = document.createElement("div");
            bikeInfo.className = "bike-info";
  
            const bikeName = document.createElement("h4");
            bikeName.textContent = item["model-name"];
  
            const bikeDisplacement = document.createElement("p");
            bikeDisplacement.textContent = `${item["model-displacement"]}  engine`;
  
            bikeInfo.appendChild(bikeName);
            bikeInfo.appendChild(bikeDisplacement);
            bikeItem.appendChild(bikeImage);
            bikeItem.appendChild(bikeInfo);
            bikeList.appendChild(bikeItem);
          }
  
          function displayBikeDetails(bike) {
            bikeDetailsElement.innerHTML = `
             <div class="bike-details-container">
                <div class="bike-details-col-1">
                  <h3>${bike["model-name"]}</h3>
                  <img src="${bike["model-image"] ? bike["model-image"] : bike["image"]}" alt="${bike["model-name"]}">
                  <div class="bike-details-button actions">
                    <button class="explore-btn" onclick="exploreBike('${bike["model-link"]}')">EXPLORE</button>
                    <button class="buy-btn" onclick="buyBike('${bike["model-link"]}')">BUY NOW</button>
                  </div>
                </div>
                <div class="bike-details-col-2">
                  <div class="bike-details-engine-spec">
                    <p class="spec-value">${bike["model-displacement"]} <span class="spec-unit"></span></p>
                    <p class="spec-desc">Oil cooled 'TORQ-X' Engine</p>
                  </div>
                  <div class="bike-details-engine-power">
                    <p class="power-value">36 <span class="power-unit">NM</span></p>
                    <p class="power-desc">@4000 RPM</p>
                  </div>
                  <label class="compare-label">
                    <input type="checkbox"> Add to Compare
                  </label>
                </div>
              </div>
            `;
          }
  
          function exploreBike(link) {
            window.open(link, "_blank");
          }
  
          function buyBike(link) {
            window.open(link, "_blank");
          }
  
          document.querySelectorAll(".cc-range").forEach((element) => {
            element.addEventListener("click", () => {
              if (element.classList.contains("new-launch")) {
                displayBikeList(null, null, true);
              } else {
                const minCC = parseInt(element.getAttribute("data-min"));
                const maxCC = parseInt(element.getAttribute("data-max"));
                displayBikeList(minCC, maxCC, false);
              }
            });
          });
  
          // Initial display of bikes
          displayBikeList(null, null, true);
        } catch (error) {
          console.error("Error fetching bike details:", error);
        }
      }
    });
  }
    // can be converted to a utility cuntion in future
  const getData = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  };
  