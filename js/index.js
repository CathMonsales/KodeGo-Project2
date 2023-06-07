function fetchData() {
    fetch("json/data.json")
        .then((response) => response.json())
        .then((data) => {

            let heroLeft = document.querySelector(".hero_left");
            let heroRight = document.querySelector(".hero_right");
            let heroCenter = document.querySelector(".hero_center");

            let leftIndex = Math.floor(Math.random() * data.length);
            let rightIndex = Math.floor(Math.random() * data.length);
            let centerIndex = Math.floor(Math.random() * data.length);

            let leftPhoto = data[leftIndex].imgSrc;
            let rightPhoto = data[rightIndex].imgSrc;
            let centerPhoto = data[centerIndex].imgSrc;


            setHeroImage(heroLeft, leftPhoto, data);
            setHeroImage(heroRight, rightPhoto, data);
            setHeroImage(heroCenter, centerPhoto, data);
        })
        .catch((error) => {
            alert(`Error fetching data: ${error}`);
        });
}

function generateUniqueIndex(maxIndex, usedIndices) {
    let newIndex = Math.floor(Math.random() * maxIndex);
    while (usedIndices.includes(newIndex)) {
        newIndex = Math.floor(Math.random() * maxIndex);
    }

    usedIndices.push(newIndex);

    return newIndex;
}

function setHeroImage(heroElement, photoSrc, data) {
    const fallbackImage = 'images/placeholder.jpg';
    const img = new Image();

    img.onload = () => {
        heroElement.style.backgroundImage = `url(${photoSrc})`;
    };

    img.onerror = () => {
        const fallbackIndex = Math.floor(Math.random() * data.length);
        const fallbackPhoto = data[fallbackIndex].imgSrc;
        heroElement.style.backgroundImage = `url(${fallbackPhoto || fallbackImage})`;
    };

    img.src = photoSrc;
}

function initializeCarousel() {
    const carouselInner = document.querySelector(".carousel-inner");

    carouselInner.innerHTML = "";

    fetch("json/data.json")
        .then((response) => response.json())
        .then((data) => {

            const indices = generateSpecificIndices(data.length, 36, 40);

            indices.forEach((index) => {
                const item = document.createElement("div");
                item.classList.add("carousel-item");

                const image = document.createElement("img");
                image.classList.add("d-block", "w-100");
                image.onerror = handleImageError;
                image.src = data[index].imgSrc;

                item.appendChild(image);
                carouselInner.appendChild(item);
            });

            carouselInner.firstChild.classList.add("active");
        })
        .catch((error) => {
            console.log("Error fetching data:", error);
        });
}

function handleImageError(event) {
    const errorImage = event.target;

    fetch("api/alt-images")
        .then((response) => response.json())
        .then((data) => {
            const altImages = data.images;
            const randomIndex = Math.floor(Math.random() * altImages.length);
            const altImageSrc = altImages[randomIndex];
            errorImage.src = altImageSrc;
        })
        .catch((error) => {
            console.log("Error fetching alternative images:", error);
        });
}

function generateSpecificIndices(maxLength, start, end) {
    const indices = [];

    for (let i = start; i <= end; i++) {
        if (i >= 0 && i < maxLength) {
            indices.push(i);
        }
    }

    return indices;
}

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const pagination = document.querySelector(".pagination");
    const pageItems = document.querySelectorAll(".page-item");
    const pageLinks = document.querySelectorAll(".page-link");
    const seeMoreButtons = document.querySelectorAll(".btn-success");
    let currentPage = 1;

    function fetchData() {
fetch("json/data.json")
.then((response) => response.json())
.then((data) => {
    let randomizedData = shuffleArray(data);

    let startIndex = (currentPage - 1) * cards.length;
    let endIndex = Math.min(startIndex + cards.length, randomizedData.length);

    for (let i = 0; i < cards.length; i++) {
        let index = (currentPage - 1) * cards.length + i;
        if (index < randomizedData.length) {
            let item = randomizedData[index];
            let listItems = cards[i].querySelectorAll("li");
            let existingImage = cards[i].querySelector("img");
            if (existingImage) {
                cards[i].removeChild(existingImage);
            }
            let image = document.createElement("img");
            image.src = item.imgSrc;
            image.addEventListener("error", function () {
                image.src = "images/placeholder.jpg";
            });
            image.addEventListener("click", function () {
                showModal(item.imgSrc);
            });
            cards[i].prepend(image);

            listItems[0].innerHTML = `<i class="bi bi-house-fill me-2"></i>${item.homeStatus ? item.homeStatus : ""}`;
            listItems[1].innerHTML = `<i class="bi bi-geo-alt-fill me-2"></i>${item.city ? item.city : ""}`;
            listItems[2].innerHTML = `<i class="bi bi-flag-fill me-2"></i>${item.country ? item.country : ""}`;

            let sellingPrice = item.price ? `$${item.price.toLocaleString()}` : "";
            listItems[3].innerHTML = `<i class="bi bi-currency-dollar me-2"></i>Selling Price: ${sellingPrice}`;

            listItems[4].style.display = (item.lotAreaValue !== undefined && item.lotAreaUnit !== undefined) ? "list-item" : "none";
            if (item.lotAreaValue !== undefined && item.lotAreaUnit !== undefined) {
                let roundedLotArea = parseFloat(item.lotAreaValue.toFixed(2));
                let lotAreaContent = Number.isNaN(roundedLotArea) ? "" : `${roundedLotArea} ${item.lotAreaUnit}`;
                listItems[4].innerHTML = `<i class="bi bi-bounding-box me-2"></i>Lot Area: ${lotAreaContent}`;
            } else {
                listItems[4].textContent = "";
            }

            seeMoreButtons[i].setAttribute("data-id", item.zpid);
        }
    }
})
.catch((error) => {
    alert(`Error fetching data: ${error}`);
});
}

    function shuffleArray(array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    function redirectToPropertyPage(propertyId) {
        fetch("json/data.json")
            .then((response) => response.json())
            .then((data) => {
                let propertyData = data.find((item) => item.zpid == propertyId);
                window.location.href = `Singlepage.html?zpid=${propertyId}&data=${JSON.stringify(propertyData)}`;
            })
            .catch((error) => {
                alert(`Error fetching data: ${error}`);
            });
    }

    for (let i = 0; i < seeMoreButtons.length; i++) {
        seeMoreButtons[i].addEventListener("click", function () {
            let propertyId = seeMoreButtons[i].getAttribute("data-id");
            redirectToPropertyPage(propertyId);
        });
    }
    fetchData();

});

document.addEventListener("DOMContentLoaded", () => {
    fetchData();
    initializeCarousel();
});