const jsonUrl = "json/data.json";
const zpid = new URLSearchParams(window.location.search).get("zpid");
const propertyTitle = document.querySelector("#property-title");
const propertyImage = document.querySelector("#property-image");
const propertyDetails = document.querySelector("#property-details");

function fetchData() {
  fetch(jsonUrl)
    .then((response) => response.json())
    .then((data) => {
      let item = data.find((item) => item.zpid == zpid);
      if (item) {
        propertyTitle.textContent = item.homeStatus
          ? `${item.city}, ${item.country}`
          : `${item.city}, ${item.country}`;
        propertyImage.src = item.imgSrc;
        propertyDetails.innerHTML = `
        <div class="container">
          <div class="row">
          <h1 class="col-md-12 fs-5 text-left">Home status: <span id="home-status">${item.homeStatus}</span></h1>
          <h1 class="col-md-4 fs-5">City: <span id="city"><i class="bi bi-geo-alt-fill"></i> ${item.city}</span></h1>
          <h1 class="col-md-4 fs-5">Country: <span id="country"><i class="bi bi-flag-fill"></i> ${item.country}</span></h1>
          <h1 class="col-md-4 fs-5">Price: <span id="price"> ${item.price ? `$${item.price.toLocaleString()}` : 'N/A'}</span></h1>
          <h1 class="col-md-4 fs-5">Lot area: <span id="lot-area"><i class="bi bi-rulers"></i> ${item.lotAreaValue !== undefined && item.lotAreaUnit !== undefined ? `${item.lotAreaValue} ${item.lotAreaUnit}` : 'N/A'}</span></h1>
          <h1 class="col-md-4 fs-5">Bedrooms: <span id="bedrooms"><i class="bi bi-door-open-fill"></i>${item.bedrooms !== undefined && !isNaN(item.bedrooms) ? item.bedrooms : 'N/A'}</span></h1>
          <h1 class="col-md-4 fs-5">Bathrooms: <span id="bathrooms"><i class="bi bi-droplet-fill"></i>${item.bathrooms !== undefined && !isNaN(item.bathrooms) ? item.bathrooms : 'N/A'}</span></h1>
        `;
      } else {
        alert("No property found with that zpid.");
      }
    })
    .catch((error) => {
      alert(`Error fetching data: ${error}`);
    });
}

fetchData();

function goBack() {
  window.location.href = 'pagination.html';
}

function myFunction() {
  var dots = document.getElementById("dots");
  var moreText = document.getElementById("more");
  var btnText = document.getElementById("readMore");

  if (dots.style.display === "none") {
    dots.style.display = "inline";
    btnText.innerHTML = "Read More...";
    moreText.style.display = "none";
  } else {
    dots.style.display = "none";
    btnText.innerHTML = "Read Less...";
    moreText.style.display = "inline";
  }
}