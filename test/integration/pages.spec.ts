import * as chai from "chai";
import chaiHttp from "chai-http";

import app from "../../src/app";

chai.use(chaiHttp);
const expect = chai.expect;

describe("Pages", function () {
  describe("All GET requests", function () {
    it("should return the login page if the login information isn't in the session cookie", function (done) {
      chai
        .request(app)
        .get("/")
        .then((res) => {
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done();
        });
    });
  });
});
