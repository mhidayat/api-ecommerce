"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const { db } = db_module_js_1.default;
const options = {
    schema: {
        querystring: {
            type: 'object',
            properties: {
                sku: { type: 'string' },
            },
        }
    }
};
const deleteProduct = async (fastify) => {
    fastify.delete('/product/:sku', options, async (request) => {
        let deletedProduct = [];
        let status = "ok";
        console.log('params =>', request.params.sku);
        try {
            deletedProduct = await db.any(`DELETE FROM product WHERE sku = '${request.params.sku}' RETURNING sku, title`);
            console.log(deletedProduct);
            if (!deletedProduct.length) {
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
            message: status === "ok" ? "product deleted successfully" : "sku not found or failed to delete product",
            data: deletedProduct
        };
    });
};
exports.default = deleteProduct;
