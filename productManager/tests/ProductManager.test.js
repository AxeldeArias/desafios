import { expect, test } from "vitest";
import { ProductManager } from "../ProductManager.mjs";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import { atunProduct, sojaProduct, sojaProductDuplicated } from "./constants";

const FILE_PATH = "./files/productManager-test.json";
beforeEach(async () => {
  fs.unlink(FILE_PATH)
    .then(() => {})
    .catch(() => {});
});

test("when a new Product Manager is created they should have an empty product list", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
  });

  const productList = await newProductManager.getProducts();
  expect(productList).toEqual([]);
});

test("when some products are added, the product list should contains them", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);
  await newProductManager.addProduct(atunProduct);

  const productList = await newProductManager.getProducts();

  expect(productList[0]).toEqual({ ...sojaProduct, id: 0 });
  expect(productList[1]).toEqual({ ...atunProduct, id: 1 });
  expect(productList.length).toBe(2);
});

test("when an existing product there should be an error", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);
  expect(newProductManager.addProduct(sojaProductDuplicated)).rejects.toThrow(
    "El producto ya fue ingresado"
  );
  const products = await newProductManager.getProducts();

  expect(products[0]).toEqual({ ...sojaProduct, id: 0 });
  expect(products.length).toBe(1);
});

test("if a product is updated, the product list should have the changes", async () => {
  const newDescription = "soja refinada";

  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
  });

  const newProduct = await newProductManager.addProduct(sojaProduct);
  expect(newProduct).toEqual({ ...sojaProduct, id: 0 });

  await newProductManager.updateProduct(newProduct.id, {
    description: newDescription,
  });

  const products = await newProductManager.getProducts();

  expect(products[0]).toEqual({
    ...sojaProduct,
    description: newDescription,
    id: 0,
  });
});

test("if a product is deleted, the product list should have this one anymore", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
  });

  await newProductManager.addProduct(sojaProduct);
  await newProductManager.deleteProduct(sojaProduct);

  const products = await newProductManager.getProducts();

  expect(products).not.toContainEqual({
    ...sojaProduct,
    id: 0,
  });
  expect(products.length).toBe(0);
});
