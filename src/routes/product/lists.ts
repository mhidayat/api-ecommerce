import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Product } from "../../models/index.js";

const { db } = dbModule;

interface listParams {
    limit?: number;
    offset?: number;
}

const list = async (fastify:FastifyInstance) => {
    fastify.get<{Querystring: listParams}>('/product', async (request) => {
        let products: Product[] = [];
        let total = 0;
        let status = "ok";
        let queries = ['SELECT * FROM product'];

        const { limit, offset } = request.query;

        if(limit) {
            queries.push(`LIMIT ${limit}`)
        }
        if(offset) {
            queries.push(`OFFSET ${offset}`)
        }

        try {  
            products = await db.any(queries.join(' '))
            const countProduct = await db.one('SELECT COUNT(*) FROM product');
            total = countProduct.count;
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            total,
            data: products.sort((a, b) => b.id - a.id)
        }
    })
}

export default list