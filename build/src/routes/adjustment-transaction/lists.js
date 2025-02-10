"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const { db } = db_module_js_1.default;
const listTransaction = async (fastify) => {
    fastify.get('/adjustment-transaction', async (request) => {
        let transactions = [];
        let status = "ok";
        let queries = ['SELECT * FROM adjustment_transaction'];
        const { limit, offset } = request.query;
        if (limit) {
            queries.push(`LIMIT ${limit}`);
        }
        if (offset) {
            queries.push(`OFFSET ${offset}`);
        }
        try {
            transactions = await db.any(queries.join(' '));
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            total: transactions.length,
            data: transactions.sort((a, b) => a.id - b.id)
        };
    });
};
exports.default = listTransaction;
