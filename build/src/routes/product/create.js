"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const index_js_1 = require("../../models/index.js");
const utils_js_1 = require("../../plugins/utils.js");
const { db } = db_module_js_1.default;
const options = {
    schema: {
        body: {
            type: 'object',
            required: [
                'sku',
                'title',
                'image',
                'price',
                'stock'
            ],
            properties: {
                sku: { type: 'string' },
                title: { type: 'string' },
                image: { type: 'string' },
                price: { type: 'number' },
                stock: { type: 'number' },
                description: { type: ['string', 'null'] },
            }
        }
    }
};
const createProduct = async (fastify) => {
    fastify.post('/product', options, async (request) => {
        let product = (0, index_js_1.emptyProduct)();
        let status = "ok";
        let queries = [];
        let columns = 'sku, title, image, price, stock';
        const { sku, title, image, price, stock, description } = request.body;
        queries.push(`'${(0, utils_js_1.sanitizeInput)(sku)}', '${(0, utils_js_1.sanitizeInput)(title)}', '${(0, utils_js_1.sanitizeInput)(image)}', ${(price)}, ${stock}`);
        if (description) {
            columns += ', description';
            queries.push(`'${(0, utils_js_1.sanitizeInput)(description)}'`);
        }
        try {
            product = await db.any(`INSERT INTO product (${columns}) VALUES (${queries.join(',')}) RETURNING *`);
        }
        catch (error) {
            console.log(error.detail);
            status = "error";
        }
        ;
        return {
            status,
            message: status === "ok" ? "product created!" : "failed to create product",
            data: status === "ok" ? product : {}
        };
    });
};
exports.default = createProduct;
