"use strict";

var chai = require('chai')
  , expect = chai.expect
  , should = chai.should();
var jsdom = require("jsdom");
var Nightmare = require('nightmare');
const Q = require("q");

var url = "https://testing.meditama.fr/";

///////
//Replace 
//	new Nightmare() by 
//	new Nightmare({ show: true })
//If you want to display what's appening in the electron browser
//To feel confortable
//You might need to replace .wait() with .wait(XXXX) where XXXX is milliseconds
///////

describe("testing.meditama.fr", function() {
	this.timeout(20000); //configuring mocha test so that they can resolve in 20 max sec instead of 2 sec by default
	this.slow(1000); //configuring mocha test so that it's considered slow if above 1 sec duration to complete

	var requestChecker = require("./tests/requestChecker")

	describe("Check page loading", function() {
		it("Main page returns status 200", function(done) {
			requestChecker.checkHttpStatus(url, 200).then(function(){
				console.log("then");
			}).fin(function(){
				console.log("finally");
				done();
			});
		});
	});

 //  	describe("Check interaction elements", function() {
	//     it("Navbar has 5 links", function(done) {
	//     	jsdom.env({
	// 			url: url,
	// 			scripts: ["http://code.jquery.com/jquery.js"],
	// 			done: function (err, window) {
	// 				var $ = window.$;
	// 				var count = $("#navbar").find("a").length;
	// 				expect(count).to.equal(5);
	// 				done();
	// 			}
	//     	});
	//     });

	//     it("Navbar has 2 input buttons", function(done) {
	//     	jsdom.env({
	// 			url: url,
	// 			scripts: ["http://code.jquery.com/jquery.js"],
	// 			done: function (err, window) {
	// 				var $ = window.$;
	// 				var count = $("#navbar").find("a > input[type='button']").length;
	// 				expect(count).to.equal(2);
	// 				done();
	// 			}
	//     	});
	//     });

	//     it("Nightmare test 1", function(done) {
	//     	new Nightmare()
	//             .goto(url)
	//             .click("#navbar a > input[type='button']") //pure js here, does a document.querySelector(XXX)
	//             .wait()
	//             .evaluate(function () {
	//             	//pure js here, no jquery
	//             	//js executed on the client side
	//                 return document.querySelector("#registerForm");
	//             })
	//             .end()
	// 			.then(function(evaluateResult) {
	// 				console.log("\t\t[LOG] Nightmare then function");
	// 				//console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));
	// 				evaluateResult.should.not.be.null;
	// 				evaluateResult.should.be.an('object');
	// 				done();
	// 			})
	// 			.catch(function (error) {
	// 				console.error("\t\t[LOG] Nightmare error: ", error);
	// 			});
	//     });

	//     it("Nightmare test 2", function(done) {
	//     	new Nightmare()
	//             .goto(url)
	//             .wait()
	//             .inject("js", "node_modules/jquery/dist/jquery.js")
	//             .evaluate(function () {
	//             	//jquery available here because of the inject() line
	//             	//js executed on the client side
	//             	$("#navbar a > input[type='button']:eq(1)").click();
	//                 return $("#registerForm");
	//             })
	//             .end()
	// 			.then(function(evaluateResult) {
	// 				console.log("\t\t[LOG] Nightmare then function");
	// 				//console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));
	// 				evaluateResult.should.not.be.null;
	// 				evaluateResult.should.be.an('object');
	// 				done();
	// 			})
	// 			.catch(function (error) {
	// 				console.error("\t\t[LOG] Nightmare error: ", error);
	// 			});
	//     });

 //  	});

 //    describe("User log in", function () {
	//     it("Connection failure", function (done) {
	//     	var login = "nonexistent@nonexistent.fr";
	//         var password = "nonexistent1";

	//         new Nightmare()
	//             .goto(url+"user")
	//             .type("input[name='login_string']", login)
	//             .type("input[name='login_pass']", password)
	//             .click("#loginForm button[type='submit']")
	//             .wait(5000) //we have to wait some time because the login response is asynchronous
	//             .evaluate(function () {
	//                 return document.querySelector("div.log-main > div.alert > p").innerText;
	//             })
	//             .end()
	// 			.then(function(evaluateResult) {
	// 				console.log("\t\t[LOG] Nightmare then function");
	// 				console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));
	// 				evaluateResult.should.contain("Erreur lors de la connexion, veuillez vérifier vos identifiants.");
	//                 done();
	// 			})
	// 			.catch(function (error) {
	// 				console.error("\t\t[LOG] Nightmare error: ", error);
	// 			});
 //        });

 //        it("Account locked", function (done) {
	//     	var login = "plop@plop.fr";
	//         var password = "plopplop1";

	//         new Nightmare()
	//             .goto(url+"user")
	//             .type("input[name='login_string']", login)
	//             .type("input[name='login_pass']", password)
	//             .click("#loginForm button[type='submit']")
	//             .wait(5000) //we have to wait some time because the login response is asynchronous
	//             .evaluate(function () {
	//                 return document.querySelector("div.log-main > div.alert > p").innerText;
	//             })
	//             .end()
	// 			.then(function(evaluateResult) {
	// 				console.log("\t\t[LOG] Nightmare then function");
	// 				console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));					
	// 				evaluateResult.should.contain("Compte temporairement verrouillé.");
	//                 done();
	// 			})
	// 			.catch(function (error) {
	// 				console.error("\t\t[LOG] Nightmare error: ", error);
	// 			});
 //        });
	// });
});
