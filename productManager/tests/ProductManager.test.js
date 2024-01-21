import { expect, test } from "vitest";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import {
  atunProduct,
  sojaProduct,
  sojaProductDuplicated,
} from "./constants-test";
import { ProductsFSManager } from "../src/Dao/ProductsFSManager";
import { ABSOLUTE_PATHS } from "../src/utils/filenameUtils.js";

beforeEach(async () => {
  try {
    await fs.unlink(ABSOLUTE_PATHS.productsFiles);
  } catch (error) {}

  try {
    await fs.unlink(ABSOLUTE_PATHS.lastIdPath);
  } catch (error) {}
});

test("init with empty product list", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  const productList = await newProductsFSManager.getProducts();
  expect(productList).toEqual([]);
});

test("add new products", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  await newProductsFSManager.addProduct(sojaProduct);
  await newProductsFSManager.addProduct(atunProduct);

  const productList = await newProductsFSManager.getProducts();

  expect(productList[0]).toEqual({ ...sojaProduct, id: 1 });
  expect(productList[1]).toEqual({ ...atunProduct, id: 2 });
  expect(productList.length).toBe(2);
});

test("get product by id", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  await newProductsFSManager.addProduct(sojaProduct);

  const product = await newProductsFSManager.getProductById(1);

  expect(product).toEqual({ ...sojaProduct, id: 1 });
});

test("update product", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  const productsResult = await newProductsFSManager.addProduct(sojaProduct);

  const products = await newProductsFSManager.getProducts();
  expect(products).toEqual(productsResult);
});

test("delete product", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  await newProductsFSManager.addProduct(sojaProduct);
  await newProductsFSManager.deleteProduct(1);

  const products = await newProductsFSManager.getProducts();

  expect(products).not.toContainEqual({
    ...sojaProduct,
    id: 1,
  });
  expect(products.length).toBe(0);
});

test("delete product - throw product not exist error", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  expect(newProductsFSManager.deleteProduct(1)).rejects.toThrow(
    "El producto no existe"
  );
});

test("update product - throw you can not change the product id", async () => {
  const sojaProductId = 1;
  const atunProductId = 2;

  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });
  await newProductsFSManager.addProduct(sojaProduct);
  await newProductsFSManager.addProduct(atunProduct);

  expect(
    newProductsFSManager.updateProduct(sojaProductId, {
      id: atunProductId,
    })
  ).rejects.toThrow("No se puede cambiar el id");
});

test("add product - throw product already exists error", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  await newProductsFSManager.addProduct(sojaProduct);
  expect(
    newProductsFSManager.addProduct(sojaProductDuplicated)
  ).rejects.toThrow("El producto ya fue ingresado");
  const products = await newProductsFSManager.getProducts();

  expect(products[0]).toEqual({ ...sojaProduct, id: 1 });
  expect(products.length).toBe(1);
});

test("add product - throw required attribute errors", async () => {
  const newProductsFSManager = new ProductsFSManager({
    nombre: "Axel",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  const { description, ...productWithoutDescription } = sojaProduct;
  expect(
    newProductsFSManager.addProduct(productWithoutDescription)
  ).rejects.toThrow("description es requerido");

  const { title, ...productWithoutTitle } = sojaProduct;
  expect(newProductsFSManager.addProduct(productWithoutTitle)).rejects.toThrow(
    "title es requerido"
  );

  const { price, ...productWithoutPrice } = sojaProduct;
  expect(newProductsFSManager.addProduct(productWithoutPrice)).rejects.toThrow(
    "price es requerido"
  );

  const { thumbnail, ...productWithoutThumbnail } = sojaProduct;
  expect(
    newProductsFSManager.addProduct(productWithoutThumbnail)
  ).rejects.toThrow("thumbnail es requerido");

  const { code, ...productWithoutCode } = sojaProduct;
  expect(newProductsFSManager.addProduct(productWithoutCode)).rejects.toThrow(
    "code es requerido"
  );

  const { stock, ...productWithoutStock } = sojaProduct;
  expect(newProductsFSManager.addProduct(productWithoutStock)).rejects.toThrow(
    "stock es requerido"
  );

  const productList = await newProductsFSManager.getProducts();
  expect(productList).toEqual([]);
});
