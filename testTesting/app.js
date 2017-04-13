"use strict";

/////Includes
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const Q = require("q");
/////

var url = "https://testing.meditama.fr/";

/*const winston = require("winston");
var logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
     json: true,
     stringify: (obj) => JSON.stringify(obj)
    })
  ]
});*/

/////Alternatives
//Replace 
//	new Nightmare() by 
//	new Nightmare({ show: true })
//If you want to display what's appening in the electron browser
//To feel confortable
//You might need to replace .wait() with .wait(XXXX) where XXXX is milliseconds
/////

/////Notes
//it() is returning a promise, no need to call done()
/////

var requestChecker = require("./tests/requestChecker")
var elementChecker = require("./tests/elementChecker")
var behaviourChecker = require("./tests/behaviourChecker")

describe("testing.meditama.fr", function() {
	this.timeout(20000); //configuring mocha test so that they can resolve in 20 max sec instead of 2 sec by default
	this.slow(1000); //configuring mocha test so that it's considered slow if above 1 sec duration to complete
	
	describe("Check page loading", function() {
		it("Main page returns status 200", function() {
			return requestChecker.checkHttpStatus(url, 200);
		});
	});

  	describe("Check interaction elements", function() {
  		//it() is returning a promise, no need to call done()
	    it("Navbar has 5 links", function() {
	    	return elementChecker.checkNavbarLinksCount(url, 5);
	    });

	    //This test will pass only if we have 5 links and 2 buttons in the navbar
		//It's an example of having multiple expectations for a function to validate the test
		//Where this expectations are in multiple test functions located in the same checker file
	    it("Navbar has 2 input buttons", function() {
	    	return elementChecker.checkNavbar(url, 2);
	    });

		//Another way of doing the exactly the same thing as above
		//Doing this way you could call multiple test functions located in different checker files
	    it("Navbar has 2 input buttons", function() {
	    	return elementChecker.checkNavbarLinksCount(url, 5)
	    		.then(elementChecker.checkNavbarButtonsCount(url, 2))
	    });

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

   	});

    describe("User log in", function() {
	    it("Connection failure", function() {
	    	var login = "bim@bim.fr";
	        var password = "bimbim1";
	        return behaviourChecker.checkLogIn(url+"user", login, password, "Erreur lors de la connexion, veuillez vérifier vos identifiants.");
        });

        it("Account locked", function() {
	    	var login = "plop@plop.fr";
	        var password = "plopplop1";
	        return behaviourChecker.checkLogIn(url+"user", login, password, "Compte temporairement verrouillé.");	        
        });
	});
});

