export class ProductManager {
    products=[]
    nombre;

    constructor({nombre}){
        if(!nombre) throw new Error("nombre is required")
        this.nombre = nombre
    }

    addProduct(newProduct){
        if(!this.products.find(currentProduct=> currentProduct.title === newProduct.title)){
            this.products = [...this.products, newProduct]
        }
    }

    getProductById(id){
      return this.products.find(currentProduct=> currentProduct.id === id)
    }

}

