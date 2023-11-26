export class Product {
    id;
    title;
    description;
    price;
    thumbnail;
    code;
    stock;

    constructor({id, title,description,price,thumbnail,code,stock} = {}){
        if(!id) throw new Error("id is required")
        if(!title) throw new Error("title is required")
        if(!description) throw new Error("description is required")
        if(!price) throw new Error("price is required")
        if(!thumbnail) throw new Error("thumbnail is required")
        if(!code) throw new Error("code is required")
        if(!stock) throw new Error("stock is required")


        this.id = id
        this.title=title
        this.description=description
        this.price=price
        this.thumbnail=thumbnail
        this.code=code
        this.stock=stock
    }
}