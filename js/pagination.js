document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll(".card");
    const pagination = document.querySelector(".pagination");
    const pageItems = document.querySelectorAll(".page-item");
    const pageLinks = document.querySelectorAll(".page-link");
    const seeMoreButtons = document.querySelectorAll(".btn-success");
    let currentPage = 1;
    let storedPage = sessionStorage.getItem("currentPage");
    let sortOption = ""; 
    if (storedPage) {
        currentPage = parseInt(storedPage);
    }

    function sortData(data) {
        if (sortOption === "price-high-low") {
            data.sort((a, b) => b.price - a.price);
        } else if (sortOption === "price-low-high") {
            data.sort((a, b) => a.price - b.price);
        } else if (sortOption === "lot-area-high-low") {
            data.sort((a, b) => b.lotAreaValue - a.lotAreaValue);
        } else if (sortOption === "lot-area-low-high") {
            data.sort((a, b) => a.lotAreaValue - b.lotAreaValue);
        }
    }

    function fetchData() {
        fetch("json/data.json")
            .then((response) => response.json())
            .then((data) => {
                sortData(data);
                let startIndex = (currentPage - 1) * cards.length;
                let endIndex = Math.min(startIndex + cards.length, data.length);

                for (let i = 0; i < cards.length; i++) {
                    let index = startIndex + i;
                    if (index < data.length) {
                        let item = data[index];
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

    function updatePagination() {
        for (let i = 0; i < pageItems.length; i++) {
            pageItems[i].classList.remove("active");
            pageItems[i].classList.remove("disabled");
        }
        pageItems[currentPage].classList.add("active");
        if (currentPage === 1) {
            pageItems[0].classList.add("disabled");
        }
        if (currentPage === 8) {
            pageItems[9].classList.add("disabled");
        }
    }

    function handleClick(event, resetPage = false) {
        event.preventDefault();
        let text = event.target.textContent;
        if (text === "Previous") {
            if (currentPage > 1) {
                currentPage--;
            }
        } else if (text === "Next") {
            if (currentPage < 8) {
                currentPage++;
            }
        } else {
            currentPage = parseInt(text);
        }
        sessionStorage.setItem("currentPage", currentPage.toString());
        fetchData();
        updatePagination();
        if (resetPage) {
            sessionStorage.removeItem("currentPage");
        }
    }

    for (let i = 0; i < pageLinks.length; i++) {
        pageLinks[i].addEventListener("click", function (event) {
            handleClick(event, true);
        });
    }

    function redirectToPropertyPage(propertyId) {
        sessionStorage.setItem("currentPage", currentPage.toString());
        window.location.href = `Singlepage.html?zpid=${propertyId}`;
    }

    for (let i = 0; i < seeMoreButtons.length; i++) {
        seeMoreButtons[i].addEventListener("click", function () {
            let propertyId = seeMoreButtons[i].getAttribute("data-id");
            redirectToPropertyPage(propertyId);
        });
    }

    const sortOptions = document.querySelectorAll(".sort-option");
    sortOptions.forEach((option) => {
        option.addEventListener("click", function (event) {
            event.preventDefault();
            sortOption = option.getAttribute("data-sort");
            sessionStorage.setItem("sortOption", sortOption);
            currentPage = 1;
            sessionStorage.setItem("currentPage", currentPage.toString());
            fetchData(sortOption);
            updatePagination();
        });
    });


    const storedSortOption = sessionStorage.getItem("sortOption");
    if (storedSortOption) {
        sortOption = storedSortOption;
        const selectedSortOption = document.querySelector(`.sort-option[data-sort="${sortOption}"]`);
        if (selectedSortOption) {
            selectedSortOption.classList.add("active");
        }
    }

    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    if (pageParam) {
        currentPage = parseInt(pageParam);
        sessionStorage.setItem("currentPage", currentPage.toString());
    } else {
        sessionStorage.removeItem("currentPage");
    }

    fetchData();
    updatePagination();
});