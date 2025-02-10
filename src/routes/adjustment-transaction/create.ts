import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Product, CreateTransactionBody, emptyProduct } from "../../models/index.js";
import { sanitizeInput } from "../../plugins/utils.js";
import { updateProductStock } from "./utils.js";

const { db } = dbModule;

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
}

const createTransaction = async (fastify:FastifyInstance) => {
    
    fastify.post<{Body: CreateTransactionBody}>('/adjustment-transaction', options, async (request) => {
        let transaction = {};
        let product: Product = emptyProduct();
        let status = "ok";
        let columns = 'sku, qty, amount';

        const { sku, qty } = request.body;

        try {  
            product = await db.one(`SELECT price, stock FROM product WHERE sku = '${sanitizeInput(sku)}' AND stock > 0`)
            console.log('product =>', product)
            
            // check if qty is lower or equal to stock
            if(product && (product.stock - qty >= 0)) {
                const amount = product.price * qty;
                transaction = await db.any(`INSERT INTO adjustment_transaction (${columns}) VALUES ('${sanitizeInput(sku)}', ${qty}, ${amount}) RETURNING *`)
                // update the product stock after transaction
                product =  await updateProductStock(sku, product.stock - qty);
            } else {
                status = "error";
                console.log('product not found or qty exceed the stock');
            }
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "transaction created!" : "failed to create transaction",
            data: status === "ok" ? {transaction, product} : {}
        }
    })
}

export default createTransaction