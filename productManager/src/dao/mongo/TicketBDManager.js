import { __dirname } from "../../utils/filenameUtils.js";
import { ticketModel } from "../../models/ticket.model.js";

export class TicketBDManager {
  async create(ticket) {
    return await ticketModel.create(ticket);
  }
}
