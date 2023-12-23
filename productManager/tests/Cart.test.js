import { expect, test } from "vitest";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import {
  CART_PATH,
  PRODUCTS_FILE_PATH,
  LAST_ID_PATH,
} from "../src/filenameUtils";
import { CartsManager } from "../src/managers/CartsManager";
import { ProductsManager } from "../src/managers/ProductsManager";
import { atunProduct, sojaProduct } from "./constants-test";

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
  const carts = new CartsManager({
    path: CART_PATH,
  });

  await carts.createCart();
  expect(await carts.getCarts()).toEqual([{ cid: 1, products: [] }]);
});

test("add Products to a cart", async () => {
  const productManager = new ProductsManager({
    nombre: "Admin",
    path: PRODUCTS_FILE_PATH,
  });

  await productManager.addProduct(sojaProduct);
  await productManager.addProduct(atunProduct);

  const carts = new CartsManager({
    path: CART_PATH,
  });
  const cid = await carts.createCart();
  console.log({ cid });

  await carts.addProduct({ cid: 1, productId: 1, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 1, quantity: 2 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 3 });
  const result = await carts.getCarts();

  expect(result).toEqual([
    {
      cid: 1,
      products: [
        { productId: 1, quantity: 3 },
        { productId: 2, quantity: 4 },
      ],
    },
  ]);
});

test("add Products to different carts", async () => {
  const productManager = new ProductsManager({
    nombre: "Admin",
    path: PRODUCTS_FILE_PATH,
  });

  await productManager.addProduct(sojaProduct);
  await productManager.addProduct(atunProduct);

  const carts = new CartsManager({
    path: CART_PATH,
  });

  await carts.createCart();
  await carts.createCart();
  await carts.createCart();

  await carts.addProduct({ cid: 1, productId: 1, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 1, productId: 1, quantity: 1 });

  await carts.addProduct({ cid: 2, productId: 1, quantity: 1 });

  await carts.addProduct({ cid: 3, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 3, productId: 2, quantity: 1 });
  await carts.addProduct({ cid: 3, productId: 2, quantity: 1 });

  const result = await carts.getCarts();

  expect(result).toEqual([
    {
      cid: 1,
      products: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 2 },
      ],
    },
    {
      cid: 2,
      products: [{ productId: 1, quantity: 1 }],
    },
    {
      cid: 3,
      products: [{ productId: 2, quantity: 3 }],
    },
  ]);
});

test("add Product - throw product not exist error", async () => {
  const carts = new CartsManager({
    path: CART_PATH,
  });
  expect(
    carts.addProduct({ cid: 1, productId: 1, quantity: 1 })
  ).rejects.toThrowError();
});
