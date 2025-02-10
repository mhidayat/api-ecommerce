import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Transaction, UpdateTransactionBody } from "../../models/index.js";
import { updateProductStock } from "./utils.js";

const { db } = dbModule;

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
}

const updateTransaction = async (fastify:FastifyInstance) => {
    
    fastify.put<{Body: UpdateTransactionBody}>('/adjustment-transaction', options, async (request) => {
        let transaction: Transaction | null = null;
        let status = "ok";
        let amount = 0;

        const { id, sku, qty } = request.body;
        try {
            //get the original sku product first
            let originTrans: {sku: string, stock: number, qty: number, price:number} = 
            await db.one(`SELECT product.sku, product.stock, trans.qty, product.price FROM adjustment_transaction AS trans JOIN product ON product.sku = trans.sku WHERE trans.id = ${id} AND product.stock > 0`)
            
            if(originTrans) {
                // compare the sku, check the product sku and stock
                if(originTrans.sku !== sku) {
                    // update to use new sku, check the new product
                    let newProduct: {stock: number, price: number} = await db.one(`SELECT stock, price FROM product WHERE sku = '${sku}' AND stock > 0`);
                    if(newProduct && (newProduct.stock > 0 && (newProduct.stock - qty >= 0))) {
                        amount = newProduct.price * qty;
                        await updateProductStock(sku, newProduct.stock - qty);
                        // update the original sku stock
                        await updateProductStock(originTrans.sku, originTrans.stock + originTrans.qty);
                    }
                } else {
                    //same sku, just update stock
                    if(originTrans.stock - qty >= 0) {
                        amount = originTrans.price * qty;
                        await updateProductStock(sku, originTrans.stock - qty);
                    }
                }
            }
            transaction = await db.any(`UPDATE adjustment_transaction SET sku = '${sku}', qty = ${qty}, amount = ${amount}  WHERE id = '${id}' RETURNING *`)
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: "data updated!",
            data: transaction || {}
        }
    })
}

export default updateTransaction