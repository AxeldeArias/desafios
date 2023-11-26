import { ProductManager } from "./ProductManager.mjs";

const newProductManager = new ProductManager({ nombre: "Axel" });

const sojaProduct = {
  title: "Soja",
  description: "vegetal",
  price: 22.2,
  thumbnail:
    "https://ichef.bbci.co.uk/news/640/cpsprodpb/6C84/production/_120708772_fba27772-4c3e-45a8-ba1d-c1bf8031017a.jpg",
  code: "soja",
  stock: 10,
};

const sojaProductDuplicated = {
  title: "Soja",
  description: "vegetal",
  price: 22.2,
  thumbnail:
    "https://ichef.bbci.co.uk/news/640/cpsprodpb/6C84/production/_120708772_fba27772-4c3e-45a8-ba1d-c1bf8031017a.jpg",
  code: "soja",
  stock: 10,
};

const atunProduct = {
  title: "Atun",
  description: "Animal",
  price: 1800.2,
  thumbnail: "https://portal.ucm.cl//content/uploads/2021/04/ATUN-UCM.jpg",
  code: "atun",
  stock: 10,
};

const atunProductDuplicated = {
  title: "Atun",
  description: "Animal",
  price: 1800.2,
  thumbnail: "https://portal.ucm.cl//content/uploads/2021/04/ATUN-UCM.jpg",
  code: "atun",
  stock: 10,
};

console.log(
  `\n\n\n############ ${newProductManager.nombre}\`s Empty Product List ############\n`
);
console.log(newProductManager.getProducts());

newProductManager.addProduct(sojaProduct);
newProductManager.addProduct(atunProduct);

console.log(
  `\n\n\n############ ${newProductManager.nombre}\`s Product List with 2 elements ############\n`
);
console.log(newProductManager.getProductById(0));
console.log(newProductManager.getProductById(1));

console.log("\n\n\n############ Error producto duplicado  ############\n");
console.log("// descomentar \n");
// newProductManager.addProduct(atunProductDuplicated);

console.log("\n############ Error id no encontrado  ############\n");

console.log("// descomentar \n");
// console.log(newProductManager.getProductById(2));
