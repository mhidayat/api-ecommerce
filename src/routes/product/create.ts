import { FastifyInstance } from "fastify"
import dbModule from "../../plugins/db-module.js";
import { Product, CreateProductBody, emptyProduct } from "../../models/index.js";
import { sanitizeInput } from "../../plugins/utils.js";

const { db } = dbModule;

const options = {
    schema: {
      body: {
        type: 'object',
        required: [
            'sku',
            'title',
            'image',
            'price',
            'stock'
        ],
        properties: {
          sku: { type: 'string' },
          title: { type: 'string' },
          image: { type: 'string' },
          price: { type: 'number' },
          stock: { type: 'number' },
          description: { type: ['string', 'null'] },
        }
      }
    }
}

const createProduct = async (fastify:FastifyInstance) => {
    
    fastify.post<{Body: CreateProductBody}>('/product', options, async (request) => {
        let product: Product = emptyProduct();
        let status = "ok";
        let queries = [];
        let columns = 'sku, title, image, price, stock';

        const { sku, title, image, price, stock, description } = request.body;
        
        queries.push(`'${sanitizeInput(sku)}', '${sanitizeInput(title)}', '${sanitizeInput(image)}', ${(price)}, ${stock}`);

        if(description) {
            columns += ', description';
            queries.push(`'${sanitizeInput(description)}'`);
        }

        try {
            product = await db.any(`INSERT INTO product (${columns}) VALUES (${queries.join(',')}) RETURNING *`)
        } catch(error: any) {
            console.log(error.detail)
            status = "error";
        };

        return {
            status,
            message: status === "ok" ? "product created!" : "failed to create product",
            data: status === "ok" ? product : {}
        }
    })
}

export default createProduct