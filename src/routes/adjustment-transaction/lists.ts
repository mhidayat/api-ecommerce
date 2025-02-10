import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Transaction } from "../../models/index.js";

const { db } = dbModule;

interface listParams {
    limit?: number;
    offset?: number;
}

const listTransaction = async (fastify:FastifyInstance) => {
    fastify.get<{Querystring: listParams}>('/adjustment-transaction', async (request) => {
        let transactions: Transaction[] = [];
        let status = "ok";
        let queries = ['SELECT * FROM adjustment_transaction'];

        const { limit, offset } = request.query;

        if(limit) {
            queries.push(`LIMIT ${limit}`)
        }
        if(offset) {
            queries.push(`OFFSET ${offset}`)
        }

        try {  
            transactions = await db.any(queries.join(' '))
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            total: transactions.length,
            data: transactions.sort((a, b) => a.id - b.id)
        }
    })
}

export default listTransaction