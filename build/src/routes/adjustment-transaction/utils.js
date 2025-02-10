"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductStock = void 0;
const db_module_js_1 = __importDefault(require("../../plugins/db-module.js"));
const { db } = db_module_js_1.default;
const models_1 = require("../../models");
const updateProductStock = async (sku, stock) => {
    let product = (0, models_1.emptyProduct)();
    try {
        product = await db.one(`UPDATE product SET stock = ${stock} WHERE sku = '${sku}' RETURNING *`);
    }
    catch (error) {
        console.log(error);
    }
    ;
    return product;
};
exports.updateProductStock = updateProductStock;
