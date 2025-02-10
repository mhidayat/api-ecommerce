"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const { db } = db_module_js_1.default;
const getOneTransaction = async (fastify) => {
    fastify.get('/adjustment-transaction/:id', async (request) => {
        let transaction = null;
        let status = "ok";
        const { id } = request.params;
        try {
            transaction = await db.one(`SELECT * FROM adjustment_transaction WHERE id = '${id}'`);
        }
        catch (error) {
            console.log(error);
            status = "error";
        }
        ;
        return {
            status,
            message: status === "ok" ? "transaction found" : "transaction not found",
            data: transaction || {}
        };
    });
};
exports.default = getOneTransaction;
