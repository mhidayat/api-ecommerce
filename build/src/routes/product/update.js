"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const index_js_1 = require("../../models/index.js");
const { db } = db_module_js_1.default;
const options = {
    schema: {
        body: {
            type: 'object',
            required: ['sku'],
            properties: {
                sku: { type: 'string' },
                title: { type: ['string', 'null'] },
                image: { type: ['string', 'null'] },
                price: { type: ['number', 'null'] },
                stock: { type: ['number', 'null'] },
                description: { type: ['string', 'null'] },
            }
        }
    }
};
const updateProduct = async (fastify) => {
    fastify.put('/product', options, async (request) => {
        let product = (0, index_js_1.emptyProduct)();
        let status = "ok";
        let queries = [];
        const { sku, title, image, price, stock, description } = request.body;
        if (title) {
            queries.push(`title = '${title}'`);
        }
        if (image) {
            queries.push(`image = '${image}'`);
        }
        if (price) {
            queries.push(`price = ${price}`);
        }
        if (stock) {
            queries.push(`stock = ${stock}`);
        }
        if (description) {
            queries.push(`description = '${description}'`);
        }
        try {
            product = await db.one(`UPDATE product SET ${queries.join(',')} WHERE sku = '${sku}' RETURNING *`);
            if (!product) {
                status = 'error';
            }
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            message: status === "ok" ? "data updated!" : "update failed",
            data: status === "ok" ? product : {}
        };
    });
};
exports.default = updateProduct;
