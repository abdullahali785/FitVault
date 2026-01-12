import dotenv from 'dotenv';
dotenv.config();

async function main() {
    const response = await fetch('https://api.kicks.dev/v3/goat/products?query=&slugs=&sku=&page=1&limit=20&filters=brand+%3D+%27Nike%27&display%5Bvariants%5D=true&sort=rank%3Aasc&market=US', {
        headers: {
            Authorization: `Bearer ${process.env.GOAT_API_KEY}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch data');
    }

    const data = await response.json();
    return data;
}


function map(data: JSON) {
    console.log(data);

    // Identify required data
    // Check validity
    // Add to db

    // id (stored as productId), sku, name, brand, category, imageurl, product_type, link, releaseDate

    // We check products table if it has the product (check by sku)
    // If no, we add the product 
    // If yes, we just add the offer 
}


main()
  .then(data => map(data[0]))
  .catch(err => console.error(err));