"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const utils_js_1 = require("./utils.js");
const { db } = db_module_js_1.default;
const options = {
    schema: {
        body: {
            type: 'object',
            required: ['id', 'sku', 'qty'],
            properties: {
                id: { type: 'number' },
                sku: { type: 'string' },
                qty: { type: 'number' }
            }
        }
    }
};
const updateTransaction = async (fastify) => {
    fastify.put('/adjustment-transaction', options, async (request) => {
        let transaction = null;
        let status = "ok";
        let amount = 0;
        const { id, sku, qty } = request.body;
        try {
            //get the original sku product first
            let originTrans = await db.one(`SELECT product.sku, product.stock, trans.qty, product.price FROM adjustment_transaction AS trans JOIN product ON product.sku = trans.sku WHERE trans.id = ${id} AND product.stock > 0`);
            if (originTrans) {
                // compare the sku, check the product sku and stock
                if (originTrans.sku !== sku) {
                    // update to use new sku, check the new product
                    let newProduct = await db.one(`SELECT stock, price FROM product WHERE sku = '${sku}' AND stock > 0`);
                    if (newProduct && (newProduct.stock > 0 && (newProduct.stock - qty >= 0))) {
                        amount = newProduct.price * qty;
                        await (0, utils_js_1.updateProductStock)(sku, newProduct.stock - qty);
                        // update the original sku stock
                        await (0, utils_js_1.updateProductStock)(originTrans.sku, originTrans.stock + originTrans.qty);
                    }
                }
                else {
                    //same sku, just update stock
                    if (originTrans.stock - qty >= 0) {
                        amount = originTrans.price * qty;
                        await (0, utils_js_1.updateProductStock)(sku, originTrans.stock - qty);
                    }
                }
            }
            transaction = await db.any(`UPDATE adjustment_transaction SET sku = '${sku}', qty = ${qty}, amount = ${amount}  WHERE id = '${id}' RETURNING *`);
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            message: "data updated!",
            data: transaction || {}
        };
    });
};
exports.default = updateTransaction;
