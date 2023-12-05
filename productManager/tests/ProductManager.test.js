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

test("init with empty product list", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
  });

  const productList = await newProductManager.getProducts();
  expect(productList).toEqual([]);
});

test("add new products", async () => {
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

test("update product", async () => {
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

test("delete product", async () => {
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

test("throw product already exists error", async () => {
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

test("throw required attribute errors", async () => {
  const newProductManager = new ProductManager({
    nombre: "Axel",
    path: FILE_PATH,
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
