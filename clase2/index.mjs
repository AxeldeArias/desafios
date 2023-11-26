import { Product } from "./Product.mjs";
import { ProductManager } from "./ProductManager.mjs";

const newProductManager = new ProductManager({ nombre: "Axel" });

const sojaProduct = new Product({
  id: "1",
  title: "Soja",
  description: "vegetal",
  price: 22.2,
  thumbnail:
    "https://ichef.bbci.co.uk/news/640/cpsprodpb/6C84/production/_120708772_fba27772-4c3e-45a8-ba1d-c1bf8031017a.jpg",
  code: "soja",
  stock: 10,
});

const sojaProductDuplicated = new Product({
  id: "3",
  title: "Soja",
  description: "vegetal",
  price: 22.2,
  thumbnail:
    "https://ichef.bbci.co.uk/news/640/cpsprodpb/6C84/production/_120708772_fba27772-4c3e-45a8-ba1d-c1bf8031017a.jpg",
  code: "soja",
  stock: 10,
});

const atunProduct = new Product({
  id: "4",
  title: "Atun",
  description: "Animal",
  price: 1800.2,
  thumbnail: "https://portal.ucm.cl//content/uploads/2021/04/ATUN-UCM.jpg",
  code: "atun",
  stock: 10,
});

const atunProductDuplicated = new Product({
  id: "5",
  title: "Atun",
  description: "Animal",
  price: 1800.2,
  thumbnail: "https://portal.ucm.cl//content/uploads/2021/04/ATUN-UCM.jpg",
  code: "atun",
  stock: 10,
});

newProductManager.addProduct(sojaProduct);
newProductManager.addProduct(sojaProductDuplicated);
newProductManager.addProduct(atunProduct);
newProductManager.addProduct(atunProductDuplicated);

console.log("\n\n\n############ Product Manager ############\n");
console.log(newProductManager);

console.log("\n\n\n############ Get Soja product ############\n");
console.log(newProductManager.getProductById(sojaProduct.id));
