import { expect, test } from "vitest";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import { atunProduct, sojaProduct, sojaProductDuplicated } from "./constants";
import { ProductManager } from "../src/models/ProductManager.js";
import { LAST_ID_PATH, PRODUCTS_FILE_PATH } from "../src/filenameUtils.js";

beforeEach(async () => {
  try {
    await fs.unlink(PRODUCTS_FILE_PATH);
  } catch (error) {}

  try {
    await fs.unlink(LAST_ID_PATH);
  } catch (error) {}
});

test("init with empty product list", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  const productList = await newProductManager.getProducts();
  expect(productList).toEqual([]);
});

test("add new products", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);
  await newProductManager.addProduct(atunProduct);

  const productList = await newProductManager.getProducts();

  expect(productList[0]).toEqual({ ...sojaProduct, id: 1 });
  expect(productList[1]).toEqual({ ...atunProduct, id: 2 });
  expect(productList.length).toBe(2);
});

test("get product by id", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);

  const product = await newProductManager.getProductById(1);

  expect(product).toEqual({ ...sojaProduct, id: 1 });
});

test("update product", async () => {
  const newDescription = "soja refinada";

  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  const newProduct = await newProductManager.addProduct(sojaProduct);
  expect(newProduct).toEqual({ ...sojaProduct, id: 1 });
  await newProductManager.updateProduct(newProduct.id, {
    description: newDescription,
  });

  const products = await newProductManager.getProducts();
  expect(products[0]).toEqual({
    ...sojaProduct,
    description: newDescription,
    id: 1,
  });
});

test("delete product", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);
  await newProductManager.deleteProduct(1);

  const products = await newProductManager.getProducts();

  expect(products).not.toContainEqual({
    ...sojaProduct,
    id: 1,
  });
  expect(products.length).toBe(0);
});

test("delete product - throw product not exist error", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  expect(newProductManager.deleteProduct(1)).rejects.toThrow(
    "El producto no existe"
  );
});

test("update product - throw you can not change the product id", async () => {
  const sojaProductId = 1;
  const atunProductId = 2;

  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });
  await newProductManager.addProduct(sojaProduct);
  await newProductManager.addProduct(atunProduct);

  expect(
    newProductManager.updateProduct(sojaProductId, {
      id: atunProductId,
    })
  ).rejects.toThrow("No se puede cambiar el id");
});

test("add product - throw product already exists error", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);
  expect(newProductManager.addProduct(sojaProductDuplicated)).rejects.toThrow(
    "El producto ya fue ingresado"
  );
  const products = await newProductManager.getProducts();

  expect(products[0]).toEqual({ ...sojaProduct, id: 1 });
  expect(products.length).toBe(1);
});

test("add product - throw required attribute errors", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: PRODUCTS_FILE_PATH,
  });

  const { description, ...productWithoutDescription } = sojaProduct;
  expect(
    newProductManager.addProduct(productWithoutDescription)
  ).rejects.toThrow("description es requerido");

  const { title, ...productWithoutTitle } = sojaProduct;
  expect(newProductManager.addProduct(productWithoutTitle)).rejects.toThrow(
    "title es requerido"
  );

  const { price, ...productWithoutPrice } = sojaProduct;
  expect(newProductManager.addProduct(productWithoutPrice)).rejects.toThrow(
    "price es requerido"
  );

  const { thumbnail, ...productWithoutThumbnail } = sojaProduct;
  expect(newProductManager.addProduct(productWithoutThumbnail)).rejects.toThrow(
    "thumbnail es requerido"
  );

  const { code, ...productWithoutCode } = sojaProduct;
  expect(newProductManager.addProduct(productWithoutCode)).rejects.toThrow(
    "code es requerido"
  );

  const { stock, ...productWithoutStock } = sojaProduct;
  expect(newProductManager.addProduct(productWithoutStock)).rejects.toThrow(
    "stock es requerido"
  );

  const productList = await newProductManager.getProducts();
  expect(productList).toEqual([]);
});
