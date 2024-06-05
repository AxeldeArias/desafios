import { describe, it } from "mocha";
import supertest from "supertest";
import { expect } from "chai";
import { envConfig } from "../../src/config/envConfig.js";

const requester = supertest(envConfig.baseUrl);
describe("Product route", function () {
  beforeEach(async function () {
    const { headers } = await requester
      .post("/api/auth/login")
      .send({ email: "admin@admin.com", password: "1234" });

    this.cookie = headers["set-cookie"];
  });

  it("obtener productos", async function () {
    const { body, status } = await requester
      .get("/api/products")
      .set("Cookie", this.cookie);

    expect(status).to.equal(200);
    expect(Array.isArray(body.products)).to.be.true;
  });
});
