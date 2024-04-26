import { CartsBDManager } from "../dao/mongo/CartsBDManager.js";
import { ChatBDManager } from "../dao/mongo/ChatBDManager.js";
import { ProductsBDManager } from "../dao/mongo/ProductsBDManager.js";
import { TicketBDManager } from "../dao/mongo/TicketBDManager.js";
import { UsersBDManager } from "../dao/mongo/UsersBDManager.js";
import { CartsRepository } from "./carts.repository.js";
import { ChatRepository } from "./chat.repository.js";
import { ProductsRepository } from "./products.repository.js";
import { TicketRepository } from "./ticket.repository.js";
import { UserRepository } from "./users.repository.js";

export const userService = new UserRepository(new UsersBDManager());
export const productsService = new ProductsRepository(
  new ProductsBDManager({ nombre: "server" })
);
export const cartsService = new CartsRepository(new CartsBDManager());
export const ticketService = new TicketRepository(new TicketBDManager());

export const chatService = new ChatRepository(
  new ChatBDManager({ nombre: "main chat" })
);
