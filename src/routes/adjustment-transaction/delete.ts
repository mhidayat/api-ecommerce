import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { updateProductStock } from "./utils.js";
import { Product } from "../../models/index.js";

const { db } = dbModule;

const options = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          id: {type: 'number'},
        },
      }
    }
}

interface DeletedTransaction {
    id: number;
    sku: string;
    qty: number;
    amount: number;
}

interface DeleteParams {
    id: string;
}

const deleteTransaction = async (fastify:FastifyInstance) => {
    fastify.delete<{Params: DeleteParams}>('/adjustment-transaction/:id', options, async (request) => {
        let deletedProduct: DeletedTransaction[] = [];
        let status = "ok";
        console.log('params =>', request.params.id)

        try {
            deletedProduct = await db.any(`DELETE FROM adjustment_transaction WHERE id = '${request.params.id}' RETURNING sku, qty`)
            console.log(deletedProduct);
            if(deletedProduct.length) {
                const product: {sku: string, stock: number} = await db.one(`SELECT sku, stock FROM product WHERE sku ='${deletedProduct[0].sku}'`)
                // update stock if the qty is equal or below the current stock
                if(product.stock > 0 && (product.stock + deletedProduct[0].qty >= 0)) {
                    await updateProductStock(product.sku, product.stock + deletedProduct[0].qty);
                }
            } else {
                status = "error";
            }
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "transaction deleted successfully" : "transaction not found or failed to delete",
            data: deletedProduct
        }
    })
}

export default deleteTransaction