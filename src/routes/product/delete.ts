import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";

const { db } = dbModule;

const options = {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          sku: {type: 'string'},
        },
      }
    }
}

interface DeletedProduct {
    sku: string;
    title: string;
}

interface DeleteParams {
    sku: string
}

const deleteProduct = async (fastify:FastifyInstance) => {
    fastify.delete<{Params: DeleteParams}>('/product/:sku', options, async (request) => {
        let deletedProduct: DeletedProduct[] = [];
        let status = "ok";
        console.log('params =>', request.params.sku)

        try {
            deletedProduct = await db.any(`DELETE FROM product WHERE sku = '${request.params.sku}' RETURNING sku, title`)
            console.log(deletedProduct);
            if(!deletedProduct.length) {
                status = "error";
            }
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "product deleted successfully" : "sku not found or failed to delete product",
            data: deletedProduct
        }
    })
}

export default deleteProduct