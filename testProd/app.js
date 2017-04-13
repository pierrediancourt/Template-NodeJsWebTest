var expect    = require("chai").expect;
var request = require("request");
var jsdom = require("jsdom");

var url = "https://www.meditama.fr/";

describe("www.meditama.fr", function() {
	this.timeout(5000); //configuring mocha test so that they can resolve in 5 max sec instead of 2 sec by default
	this.slow(1000); //configuring mocha test so that it's considered slow if above 1 sec duration to complete

	describe("Check page loading", function() {
		it("Main page returns status 200", function(done) {
	      request(url, function(error, response, body) {
	        expect(response.statusCode).to.equal(200);
	        done();
	      });
	    });
	});

  	describe("Check interaction elements", function() {
	    it("Navbar has 3 links", function(done) {
	    	jsdom.env({
				url: url,
				scripts: ["http://code.jquery.com/jquery.js"],
				done: function (err, window) {
					var $ = window.$;
					var count = $("#navbar").find("a").length;
					expect(count).to.equal(3);
					done();
				}
	    	});
	    });
  	});

});