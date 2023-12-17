import { expect, test } from "vitest";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import {
  CART_PATH,
  PRODUCTS_FILE_PATH,
  LAST_ID_PATH,
} from "../src/filenameUtils.js";
import { Carts } from "../src/models/Carts.js";
import { ProductManager } from "../src/models/ProductManager.js";
import { atunProduct, sojaProduct } from "./constants.js";

beforeEach(async () => {
  try {
    await fs.unlink(CART_PATH);
  } catch (error) {}

  try {
    await fs.unlink(PRODUCTS_FILE_PATH);
  } catch (error) {}

  try {
    await fs.unlink(LAST_ID_PATH);
  } catch (error) {}
});

test("init with empty product list", async () => {
  const carts = new Carts({
    path: CART_PATH,
  });

  expect(await carts.getCarts()).toBeUndefined();
});

test("add Products to a cart", async () => {
  const productManager = new ProductManager({
    nombre: "Admin",
    path: PRODUCTS_FILE_PATH,
  });

  await productManager.addProduct(sojaProduct);
  await productManager.addProduct(atunProduct);

  const carts = new Carts({
    path: CART_PATH,
  });

  await carts.addProduct({ cid: 1, productId: 1, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 1, quantity: 2 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 3 });
  const result = await carts.getCarts();

  expect(result).toEqual({
    1: [
      {
        productId: 1,
        quantity: 3,
      },
      {
        productId: 2,
        quantity: 4,
      },
    ],
  });
});

test("add Products to different carts", async () => {
  const productManager = new ProductManager({
    nombre: "Admin",
    path: PRODUCTS_FILE_PATH,
  });

  await productManager.addProduct(sojaProduct);
  await productManager.addProduct(atunProduct);

  const carts = new Carts({
    path: CART_PATH,
  });
  await carts.addProduct({ cid: 1, productId: 1, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 1, quantity: 1 });

  await carts.addProduct({ cid: 2, productId: 1, quantity: 1 });

  await carts.addProduct({ cid: 3, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 3, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 3, productId: 2, quantity: 1 });

  const result = await carts.getCarts();

  expect(result).toEqual({
    1: [
      {
        productId: 1,
        quantity: 2,
      },
      {
        productId: 2,
        quantity: 2,
      },
    ],
    2: [
      {
        productId: 1,
        quantity: 1,
      },
    ],
    3: [
      {
        productId: 2,
        quantity: 3,
      },
    ],
  });
});

test("add Product - throw product not exist error", async () => {
  const carts = new Carts({
    path: CART_PATH,
  });
  expect(
    carts.addProduct({ cid: 1, productId: 1, quantity: 1 })
  ).rejects.toThrowError();
});
