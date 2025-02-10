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
        querystring: {
            type: 'object',
            properties: {
                id: { type: 'number' },
            },
        }
    }
};
const deleteTransaction = async (fastify) => {
    fastify.delete('/adjustment-transaction/:id', options, async (request) => {
        let deletedProduct = [];
        let status = "ok";
        console.log('params =>', request.params.id);
        try {
            deletedProduct = await db.any(`DELETE FROM adjustment_transaction WHERE id = '${request.params.id}' RETURNING sku, qty`);
            console.log(deletedProduct);
            if (deletedProduct.length) {
                const product = await db.one(`SELECT sku, stock FROM product WHERE sku ='${deletedProduct[0].sku}'`);
                // update stock if the qty is equal or below the current stock
                if (product.stock > 0 && (product.stock + deletedProduct[0].qty >= 0)) {
                    await (0, utils_js_1.updateProductStock)(product.sku, product.stock + deletedProduct[0].qty);
                }
            }
            else {
                status = "error";
            }
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            message: status === "ok" ? "transaction deleted successfully" : "transaction not found or failed to delete",
            data: deletedProduct
        };
    });
};
exports.default = deleteTransaction;
