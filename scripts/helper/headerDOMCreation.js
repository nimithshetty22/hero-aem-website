export function createHeaderDOM() {
  let endpoint =
    "https://main--hero-aem-website--nimithshetty22.hlx.live/query-index.json";
    const apiData = getData(endpoint); 
  //const DOM = getData(endpoint).then(response => { console.log(response.data) }).catch(error => console.log('Error:', error));
  const newHeaderMotorcyclev1 = `
      <div class="sidebar">
        <h2>New Launch</h2>
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
  navDrops.forEach((navDrop) => {
    if (navDrop.textContent.trim().startsWith("MOTORCYCLES")) {
      // Clear any existing ul>li inside the MOTORCYCLES nav-drop
      const existingUl = navDrop.querySelector("ul");
      if (existingUl) {
        existingUl.remove();
      }

      const newUl = document.createElement("ul");
      const newLi = document.createElement("li");
      newLi.innerHTML = newHeaderMotorcyclev1;
      newUl.addEventListener("click", (event) => {
        event.stopPropagation()})
      newUl.appendChild(newLi);
      navDrop.appendChild(newUl);

      const data = {
        total: 4,
        offset: 0,
        limit: 4,
        data: [
          {
            path: "/",
            lastModified: "1716900618",
            title: "Home | AEM Forms Boilerplate",
            description:
              "Use this template repository as the starting point for new AEM Forms projects.",
            image:
              "/default-meta-image.png?width=1200&format=pjpg&optimize=medium",
            tags: "[]",
            keywords: "",
            template: "",
            date: "",
            "model-image": "",
            "model-name": "",
            "model-displacement": "",
            "model-tag": "",
            "model-link": "",
            "model-category": "",
          },
          {
            path: "/bikes/splendor-plus",
            lastModified: "1716901221",
            title: "Metadata",
            description: "",
            image:
              "/bikes/media_1305d7608b70186bb4ed944c4b15e5d76977d0ca0.png?width=1200&format=pjpg&optimize=medium#width=150&height=133",
            tags: "[]",
            keywords: "",
            template: "",
            date: "",
            "model-image":
              "./media_1305d7608b70186bb4ed944c4b15e5d76977d0ca0.png?width=750&format=png&optimize=medium",
            "model-name": "Splendor+",
            "model-displacement": "100CC",
            "model-tag": "-",
            "model-link":
              "https://www.heromotocorp.com/en-in/motorcycles/practical/splendor-plus.html",
            "model-category": "Practical",
          },
          {
            path: "/bikes/xtreme-200s-4v",
            lastModified: "1716901226",
            title: "XTREME 200S 4V",
            description: "",
            image:
              "/bikes/media_1cde6a61f5cbdd9e014e181e1eacc0fe6f82090bb.png?width=1200&format=pjpg&optimize=medium#width=162&height=167",
            tags: "[]",
            keywords: "",
            template: "",
            date: "",
            "model-image":
              "./media_1cde6a61f5cbdd9e014e181e1eacc0fe6f82090bb.png?width=750&format=png&optimize=medium",
            "model-name": "XTREME 200S 4V",
            "model-displacement": "200CC",
            "model-tag": "-",
            "model-link":
              "https://www.heromotocorp.com/en-in/motorcycles/practical/splendor-plus.html",
            "model-category": "Performance",
          },
          {
            path: "/bikes/splendor-plus-xtec",
            lastModified: "1716901202",
            title: "Metadata",
            description: "",
            image:
              "/bikes/media_1a76ef3f11317d8c2edf0de7432800c1f6194bd25.png?width=1200&format=pjpg&optimize=medium#width=150&height=133",
            tags: "[]",
            keywords: "",
            template: "",
            date: "",
            "model-image":
              "./media_1a76ef3f11317d8c2edf0de7432800c1f6194bd25.png?width=750&format=png&optimize=medium",
            "model-name": "Splendor+ XTEC",
            "model-displacement": "100CC",
            "model-tag": "-",
            "model-link":
              "https://www.heromotocorp.com/en-in/motorcycles/practical/splendor-plus.html",
            "model-category": "Practical",
          },
        ],
        ":type": "sheet",
      };

      const bikeList = document.getElementById("bike-list");
      const bikeDetails = document.getElementById("bike-details");

      function displayBikeList(minCC, maxCC) {
        bikeList.innerHTML = "";
        data.data.forEach((item) => {
          const displacement = parseInt(item["model-displacement"]);
          if (
            item.path.includes("/bikes/") &&
            displacement >= minCC &&
            displacement <= maxCC
          ) {
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
        });
      }

      function displayBikeDetails(bike) {
        bikeDetails.innerHTML = `
            <img src="${
              bike["model-image"] ? bike["model-image"] : bike["image"]
            }" alt="${bike["model-name"]}">
            <h3>${bike["model-name"]} ${bike["model-displacement"]} cc</h3>
            <p>${bike.description}</p>
            <div class="actions">
              <button onclick="exploreBike('${
                bike["model-link"]
              }')">Explore</button>
              <button onclick="buyBike('${
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
          const minCC = parseInt(element.getAttribute("data-min"));
          const maxCC = parseInt(element.getAttribute("data-max"));
          displayBikeList(minCC, maxCC);
        });
      });

      // Initial display of bikes
      displayBikeList(100, 110);
    }
  });
}

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

    const data = await response;
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
