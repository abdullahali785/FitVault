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

main()
  .then(data => console.log(data))
  .catch(err => console.error(err));