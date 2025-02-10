import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Product, UpdateProductBody, emptyProduct } from "../../models/index.js";

const { db } = dbModule;

const options = {
    schema: {
      body: {
        type: 'object',
        required: ['sku'],
        properties: {
          sku: { type: 'string' },
          title: { type: ['string', 'null'] },
          image: { type: ['string', 'null'] },
          price: { type: ['number', 'null'] },
          stock: { type: ['number', 'null'] },
          description: { type: ['string', 'null'] },
        }
      }
    }
}

const updateProduct = async (fastify:FastifyInstance) => {
    
    fastify.put<{Body: UpdateProductBody}>('/product', options, async (request) => {
        let product: Product = emptyProduct();
        let status = "ok";
        let queries = [];

        const { sku, title, image, price, stock, description } = request.body;
        
        if(title) {
            queries.push(`title = '${title}'`);
        }
        if(image) {
            queries.push(`image = '${image}'`);
        }
        if(price) {
            queries.push(`price = ${price}`);
        }
        if(stock) {
            queries.push(`stock = ${stock}`);
        }
        if(description) {
            queries.push(`description = '${description}'`);
        }

        try {
            product = await db.one(`UPDATE product SET ${queries.join(',')} WHERE sku = '${sku}' RETURNING *`)
            if(!product) {
                status = 'error';
            }
        } catch(error: any) {
            console.log(error)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "data updated!" : "update failed",
            data: status === "ok" ? product : {}
        }
    })
}

export default updateProduct