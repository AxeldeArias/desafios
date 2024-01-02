import { expect, test } from "vitest";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import { APP_PATH } from "../src/utils/filenameUtils";
import { CartsManager } from "../src/managers/CartsManager";
import { ProductsManager } from "../src/managers/ProductsManager";
import { atunProduct, sojaProduct } from "./constants-test";

beforeEach(async () => {
  try {
    await fs.unlink(APP_PATH.cart);
  } catch (error) {}

  try {
    await fs.unlink(APP_PATH.productsFiles);
  } catch (error) {}

  try {
    await fs.unlink(APP_PATH.lastIdPath);
  } catch (error) {}
});

test("init with empty product list", async () => {
  const carts = new CartsManager({
    path: APP_PATH.cart,
  });

  await carts.createCart();
  expect(await carts.getCarts()).toEqual([{ cid: 1, products: [] }]);
});

test("add Products to a cart", async () => {
  const productManager = new ProductsManager({
    nombre: "Admin",
    path: APP_PATH.productsFiles,
  });

  await productManager.addProduct(sojaProduct);
  await productManager.addProduct(atunProduct);

  const carts = new CartsManager({
    path: APP_PATH.cart,
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
    path: APP_PATH.productsFiles,
  });

  await productManager.addProduct(sojaProduct);
  await productManager.addProduct(atunProduct);

  const carts = new CartsManager({
    path: APP_PATH.cart,
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
    path: APP_PATH.cart,
  });
  expect(
    carts.addProduct({ cid: 1, productId: 1, quantity: 1 })
  ).rejects.toThrowError();
});
