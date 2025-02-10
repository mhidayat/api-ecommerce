"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const basic_auth_1 = __importDefault(require("@fastify/basic-auth"));
const cors_1 = __importDefault(require("@fastify/cors"));
const fetch_product_1 = __importDefault(require("./src/routes/fetch-product"));
const lists_1 = __importDefault(require("./src/routes/product/lists"));
const update_1 = __importDefault(require("./src/routes/product/update"));
const delete_1 = __importDefault(require("./src/routes/product/delete"));
const create_1 = __importDefault(require("./src/routes/product/create"));
const create_2 = __importDefault(require("./src/routes/adjustment-transaction/create"));
const lists_2 = __importDefault(require("./src/routes/adjustment-transaction/lists"));
const delete_2 = __importDefault(require("./src/routes/adjustment-transaction/delete"));
const get_1 = __importDefault(require("./src/routes/product/get"));
const update_2 = __importDefault(require("./src/routes/adjustment-transaction/update"));
const get_2 = __importDefault(require("./src/routes/adjustment-transaction/get"));
const server = (0, fastify_1.default)();
server.register(cors_1.default);
const authenticate = { realm: 'Westeros' };
server.register(basic_auth_1.default, { validate, authenticate });
async function validate(username, password, req, reply, done) {
    if (username === 'admin' && password === 'admin') {
        done();
    }
    else {
        done(new Error('Unauthorized'));
    }
}
server.register(fetch_product_1.default);
server.register(lists_1.default);
server.register(get_1.default);
server.register(create_1.default);
server.register(update_1.default);
server.register(delete_1.default);
server.register(lists_2.default);
server.register(get_2.default);
server.register(create_2.default);
server.register(update_2.default);
server.register(delete_2.default);
//simple auth route
server.post('/auth', async () => {
    return {
        statusCode: 200,
        message: "Authenticated."
    };
});
server.after(() => {
    // preHandler authenticate all route above
    server.addHook('preHandler', server.basicAuth);
});
server.listen({ port: 8080 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
