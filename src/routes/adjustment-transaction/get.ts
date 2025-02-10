import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Transaction } from "../../models/index.js";

const { db } = dbModule;

interface listParams {
    id: number;
}

const getOneTransaction = async (fastify:FastifyInstance) => {
    fastify.get<{Params: listParams}>('/adjustment-transaction/:id', async (request) => {
        let transaction: Transaction | null =  null;
        let status = "ok";

        const { id } = request.params;
        try {  
            transaction = await db.one(`SELECT * FROM adjustment_transaction WHERE id = '${id}'`)
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "transaction found" : "transaction not found",
            data: transaction || {}
        }
    })
}

export default getOneTransaction