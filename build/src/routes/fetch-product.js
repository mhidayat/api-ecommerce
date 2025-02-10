"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../plugins/db-module.js"));
const utils_js_1 = require("../plugins/utils.js");
const { db } = db_module_js_1.default;
const insertProduct = (product) => {
    const { title, sku, stock, price, images, description } = product;
    const columns = 'title, sku, stock, price, image, description';
    const insertQuery = `INSERT INTO product (${columns}) VALUES ('${(0, utils_js_1.sanitizeInput)(title)}', '${sku}', ${stock}, ${price}, '${(0, utils_js_1.sanitizeInput)(images[0])}', '${(0, utils_js_1.sanitizeInput)(description)}')`;
    db.any(insertQuery, [true])
        .then(function (data) {
        // success;
        console.log(data);
    })
        .catch(function (error) {
        // error;
        console.log(error);
    });
};
const fetchProduct = async (fastify) => {
    fastify.get('/get-product', async () => {
        // loop the fetch request until total fetch is equal or more than the product total
        let fetched = 0;
        let products = [];
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
            if (json.total < fetched) {
                finishFetch = true;
            }
        }
        products.forEach(item => {
            insertProduct(item);
        });
        return { status: "ok", message: "data fetched successfully" };
    });
};
exports.default = fetchProduct;
