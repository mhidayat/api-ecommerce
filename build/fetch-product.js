"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("./db-module.js"));
const { db } = db_module_js_1.default;
const fetchProduct = (fastify) => __awaiter(void 0, void 0, void 0, function* () {
    fastify.get('/fetch-product', () => __awaiter(void 0, void 0, void 0, function* () {
        // loop the fetch request until total fetch is equal or more than the product total
        let fetched = 0;
        let product = [];
        const limit = 10;
        let finishFetch = false;
        while (!finishFetch) {
            let url = `https://dummyjson.com/products?&limit=${limit}&skip=${fetched}&select=title,sku,images,price,stock`;
            const response = yield fetch(url);
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }
            const json = yield response.json();
            fetched += limit;
            product = [...product, ...json.products];
            if (json.total < fetched) {
                finishFetch = true;
            }
        }
        db.any('SELECT * FROM migrations', [true])
            .then(function (data) {
            // success;
            console.log(data);
        })
            .catch(function (error) {
            // error;
            console.log(error);
        });
        return { product };
    }));
});
exports.default = fetchProduct;
