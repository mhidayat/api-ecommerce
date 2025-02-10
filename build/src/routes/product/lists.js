"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const { db } = db_module_js_1.default;
const list = async (fastify) => {
    fastify.get('/product', async (request) => {
        let products = [];
        let total = 0;
        let status = "ok";
        let queries = ['SELECT * FROM product'];
        const { limit, offset } = request.query;
        if (limit) {
            queries.push(`LIMIT ${limit}`);
        }
        if (offset) {
            queries.push(`OFFSET ${offset}`);
        }
        try {
            products = await db.any(queries.join(' '));
            const countProduct = await db.one('SELECT COUNT(*) FROM product');
            total = countProduct.count;
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            total,
            data: products.sort((a, b) => b.id - a.id)
        };
    });
};
exports.default = list;
