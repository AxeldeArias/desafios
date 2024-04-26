export class TicketRepository {
  #dao;

  constructor(ticketDao) {
    this.#dao = ticketDao;
  }

  async create(ticket) {
    return this.#dao.create(ticket);
  }
}
