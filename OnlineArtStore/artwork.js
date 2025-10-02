const ART_URL = "https://api.artic.edu/api/v1/artworks?limit=20";
const artCard = document.querySelector(".art-card");

// function add_to_cart(){
//      window.location.href="/cart/cart.html"
// }
   
function getRandomPrice() {
  return (Math.floor(Math.random() * 4900) + 100).toLocaleString();
}

async function fetchArtworks(url) {
  try {
    const res = await fetch(url);
    const { data } = await res.json();

    const artworks = data
      .filter(art => art.image_id) 
      .map(art => ({
        title: art.title,
        artist: art.artist_display || "Unknown Artist",
        year: art.date_display || "Unknown Year",
        image: `https://www.artic.edu/iiif/2/${art.image_id}/full/843,/0/default.jpg`,
        price:` ${getRandomPrice()} `
      }));

    displayArtworks(artworks);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
fetchArtworks(ART_URL);

function displayArtworks(artworks) {
  artCard.innerHTML = "";
  artworks.forEach(({ title, year, image, price }) => {
    const card = document.createElement("div");
    card.className = "art-cards";
    card.innerHTML = `
      <img src="${image}" alt="${title}" onerror="this.src='https://via.placeholder.com/200';" />
      <h3 class="art-title">${title}</h3>
      <p class="art-year">${year}</p>
      <div class="line"> 
      <p class="art-price">${price}</p>
      <p class="art-cart" onclick= add_to_cart()> Add to Cart </p>
      </div>
    `;
    artCard.appendChild(card);
  });
}