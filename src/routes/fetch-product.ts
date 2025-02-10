import { FastifyInstance } from "fastify"
import dbModule from '../plugins/db-module.js';
import { RawProduct } from "../models/index.js";
import { sanitizeInput } from "../plugins/utils.js";

const { db } = dbModule;

const insertProduct = (product: RawProduct) => {
  const { title, sku, stock, price, images, description } = product;
  const columns = 'title, sku, stock, price, image, description';
  const insertQuery = `INSERT INTO product (${columns}) VALUES ('${sanitizeInput(title)}', '${sku}', ${stock}, ${price}, '${sanitizeInput(images[0])}', '${sanitizeInput(description)}')`;

  db.any(insertQuery, [true])
    .then(function(data: any) {
        // success;
        console.log(data)
    })
    .catch(function(error: any) {
        // error;
        console.log(error)
    });
}

const fetchProduct = async (fastify:FastifyInstance, /**options*/) => {
    fastify.get('/get-product', async () => {
      // loop the fetch request until total fetch is equal or more than the product total
      let fetched = 0;
      let products: RawProduct[] = [];
      const limit = 10;
      let finishFetch = false;

      while (!finishFetch) {
        let url = `https://dummyjson.com/products?&limit=${limit}&skip=${fetched}&select=title,sku,images,price,stock,description`;

        const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
      
          const json = await response.json();
          fetched += limit;
          products = [...products, ...json.products];
          if(json.total < fetched) {
            finishFetch = true;
          }
      }

      products.forEach(item => {
        insertProduct(item);
      })

      return { status: "ok", message: "data fetched successfully" }
    })
}

export default fetchProduct