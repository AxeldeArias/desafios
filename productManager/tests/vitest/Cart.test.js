import { expect, test } from "vitest";
import { beforeEach } from "vitest";
import * as fs from "node:fs/promises";
import { ABSOLUTE_PATHS } from "../../src/utils/filenameUtils.js";
import { atunProduct, sojaProduct } from "./constants-test";
import { CartsFSManager } from "../../src/dao/file/CartsFSManager.js";
import { ProductsFSManager } from "../../src/dao/file/ProductsFSManager.js";

beforeEach(async () => {
  try {
    await fs.unlink(ABSOLUTE_PATHS.cart);
  } catch (error) {}

  try {
    await fs.unlink(ABSOLUTE_PATHS.productsFiles);
  } catch (error) {}

  try {
    await fs.unlink(ABSOLUTE_PATHS.lastIdPath);
  } catch (error) {}
});

test("init with empty product list", async () => {
  const carts = new CartsFSManager({
    path: ABSOLUTE_PATHS.cart,
  });

  await carts.createCart();
  expect(await carts.getCarts()).toEqual([{ cid: 1, products: [] }]);
});

test("add Products to a cart", async () => {
  const productsFSManager = new ProductsFSManager({
    nombre: "Admin",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  await productsFSManager.addProduct(sojaProduct);
  await productsFSManager.addProduct(atunProduct);

  const carts = new CartsFSManager({
    path: ABSOLUTE_PATHS.cart,
  });
  const cid = await carts.createCart();

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
  const productsFSManager = new ProductsFSManager({
    nombre: "Admin",
    path: ABSOLUTE_PATHS.productsFiles,
  });

  await productsFSManager.addProduct(sojaProduct);
  await productsFSManager.addProduct(atunProduct);

  const carts = new CartsFSManager({
    path: ABSOLUTE_PATHS.cart,
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
  const carts = new CartsFSManager({
    path: ABSOLUTE_PATHS.cart,
  });
  expect(
    carts.addProduct({ cid: 1, productId: 1, quantity: 1 })
  ).rejects.toThrowError();
});
