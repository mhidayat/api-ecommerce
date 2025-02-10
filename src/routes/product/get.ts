import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Product } from "../../models/index.js";

const { db } = dbModule;

interface listParams {
    sku: string;
}

const getOneProduct = async (fastify:FastifyInstance) => {
    fastify.get<{Params: listParams}>('/product/:sku', async (request) => {
        let product: Product | null =  null;
        let status = "ok";

        const { sku } = request.params;
        try {  
            product = await db.one(`SELECT * FROM product WHERE sku = '${sku}'`)
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "product found" : "product not found",
            data: product || {}
        }
    })
}

export default getOneProduct