"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const index_js_1 = require("../../models/index.js");
const utils_js_1 = require("../../plugins/utils.js");
const utils_js_2 = require("./utils.js");
const { db } = db_module_js_1.default;
const options = {
    schema: {
        body: {
            type: 'object',
            required: [
                'sku',
                'qty'
            ],
            properties: {
                sku: { type: 'string' },
                qty: { type: 'number' }
            }
        }
    }
};
const createTransaction = async (fastify) => {
    fastify.post('/adjustment-transaction', options, async (request) => {
        let transaction = {};
        let product = (0, index_js_1.emptyProduct)();
        let status = "ok";
        let columns = 'sku, qty, amount';
        const { sku, qty } = request.body;
        try {
            product = await db.one(`SELECT price, stock FROM product WHERE sku = '${(0, utils_js_1.sanitizeInput)(sku)}' AND stock > 0`);
            console.log('product =>', product);
            // check if qty is lower or equal to stock
            if (product && (product.stock - qty >= 0)) {
                const amount = product.price * qty;
                transaction = await db.any(`INSERT INTO adjustment_transaction (${columns}) VALUES ('${(0, utils_js_1.sanitizeInput)(sku)}', ${qty}, ${amount}) RETURNING *`);
                // update the product stock after transaction
                product = await (0, utils_js_2.updateProductStock)(sku, product.stock - qty);
            }
            else {
                status = "error";
                console.log('product not found or qty exceed the stock');
            }
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            message: status === "ok" ? "transaction created!" : "failed to create transaction",
            data: status === "ok" ? { transaction, product } : {}
        };
    });
};
exports.default = createTransaction;
