export function createHeaderDOM() {
  let bikeDetailsEndpoint =`${window.locationt.origin}/query-index.json`;

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

      // Fetch data from the API
      const bikeDetails = await getData(bikeDetailsEndpoint);

      const bikeList = document.getElementById("bike-list");
      const bikeDetailsElement = document.getElementById("bike-details");

      function displayBikeList(minCC, maxCC, newLaunch) {
        bikeList.innerHTML = "";
        bikeDetails.data.forEach((item) => {
          const displacement = parseInt(item["model-displacement"]);
          const isNewLaunch = item["model-new-launch"] === "yes";
          if (newLaunch === true) {
            if (isNewLaunch) {
              createBikeItem(item);
            }
          } else if (
            item.path.includes("/bikes/") &&
            displacement >= minCC &&
            displacement <= maxCC
          ) {
            createBikeItem(item);
          }
        });
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
        bikeDisplacement.textContent = `${item["model-displacement"]} cc engine`;

        bikeInfo.appendChild(bikeName);
        bikeInfo.appendChild(bikeDisplacement);
        bikeItem.appendChild(bikeImage);
        bikeItem.appendChild(bikeInfo);
        bikeList.appendChild(bikeItem);
      }

      function displayBikeDetails(bike) {
        bikeDetailsElement.innerHTML = `
          <img src="${
            bike["model-image"] ? bike["model-image"] : bike["image"]
          }" alt="${bike["model-name"]}">
          <h3>${bike["model-name"]} ${bike["model-displacement"]} cc</h3>
          <p>${bike.description}</p>
          <div class="actions">
            <button class="explore-btn" onclick="exploreBike('${
              bike["model-link"]
            }')">Explore</button>
            <button class="buy-btn" onclick="buyBike('${
              bike["model-link"]
            }')">Buy Now</button>
            <label><input type="checkbox"> Add to Compare</label>
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
    }
  });
}
  // can be converted to a utility cuntion in future
  const getData = async (url) => {
    try {
      const response = await fetch(url, {
        method: "GET",
        mode: "no-cors",
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
