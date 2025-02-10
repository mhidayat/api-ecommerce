import fastify from 'fastify';
import fastifyBasicAuth from '@fastify/basic-auth';
import cors from '@fastify/cors'

import fetchProduct from './src/routes/fetch-product';
import listProduct from './src/routes/product/lists';
import updateProduct from './src/routes/product/update';
import deleteProduct from './src/routes/product/delete';
import createProduct from './src/routes/product/create';
import createTransaction from './src/routes/adjustment-transaction/create';
import listTransaction from './src/routes/adjustment-transaction/lists';
import deleteTransaction from './src/routes/adjustment-transaction/delete';
import getOneProduct from './src/routes/product/get';
import updateTransaction from './src/routes/adjustment-transaction/update';
import getOneTransaction from './src/routes/adjustment-transaction/get';

const server = fastify();

server.register(cors);

const authenticate = {realm: 'Westeros'}
server.register(fastifyBasicAuth, { validate, authenticate })
async function validate (username: string, password: string, req: any, reply: any, done: any) {
  if (username === 'admin' && password === 'admin') {
    done();
  } else {
    done(new Error('Unauthorized'));
  }
}

server.register(fetchProduct);

server.register(listProduct);
server.register(getOneProduct);
server.register(createProduct);
server.register(updateProduct);
server.register(deleteProduct);


server.register(listTransaction);
server.register(getOneTransaction);
server.register(createTransaction);
server.register(updateTransaction);
server.register(deleteTransaction);

//simple auth route
server.post('/auth', async () => {
  return {
      statusCode: 200,
      message: "Authenticated."
  }
});

server.after(() => {
  // preHandler authenticate all route above
  server.addHook('preHandler', server.basicAuth);
})

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})