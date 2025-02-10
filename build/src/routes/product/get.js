"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const { db } = db_module_js_1.default;
const getOneProduct = async (fastify) => {
    fastify.get('/product/:sku', async (request) => {
        let product = null;
        let status = "ok";
        const { sku } = request.params;
        try {
            product = await db.one(`SELECT * FROM product WHERE sku = '${sku}'`);
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            message: status === "ok" ? "product found" : "product not found",
            data: product || {}
        };
    });
};
exports.default = getOneProduct;
