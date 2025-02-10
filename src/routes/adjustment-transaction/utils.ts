import dbModule from "../../plugins/db-module.js";
const { db } = dbModule;

import { emptyProduct, Product } from "../../models";

export const updateProductStock = async (sku: string, stock: number) => {
    let product: Product = emptyProduct();
    
    try {
        product = await db.one(`UPDATE product SET stock = ${stock} WHERE sku = '${sku}' RETURNING *`);

    } catch(error: any) {
        console.log(error)
    };

    return product;
}