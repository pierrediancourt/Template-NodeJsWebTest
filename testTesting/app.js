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

/////Resources
//https://httpstatuses.com/
/////

var requestChecker = require("./tests/requestChecker")
var elementChecker = require("./tests/elementChecker")
var behaviourChecker = require("./tests/behaviourChecker")

describe("Demos", function() {
	this.timeout(20000); //configuring mocha test so that they can resolve in 20 max sec instead of 2 sec by default
	this.slow(1000); //configuring mocha test so that it's considered slow if above 1 sec duration to complete
	
	describe("Nothing special here yet", function(){
		it("This is a non written pending test");
	})

	var typicodeUrl = "https://jsonplaceholder.typicode.com";
	describe(typicodeUrl, function() {
		it("Get / should return status 200 (OK) with html and body content", function() {
			return requestChecker.checkGetHtmlHttpStatus(typicodeUrl+"/", 200);
		});

		it("Get /posts should return status 200 (OK)", function() {
			return requestChecker.checkGetHttpStatus(typicodeUrl+"/posts", 200);
		});

		it("Get /posts/1 should return status 200 (OK)", function() {
			return requestChecker.checkGetHttpStatus(typicodeUrl+"/posts/1", 200);
		});

		it("Get /posts/1/comments should return status 200 (OK)", function() {
			return requestChecker.checkGetHttpStatus(typicodeUrl+"/posts/1/comments", 200);
		});

		it("Get /comments?postId=1 should return status 200 (OK)", function() {
			return requestChecker.checkGetHttpStatus(typicodeUrl+"/comments?postId=1", 200);
		});

		it("Get /posts?userId=1 should return status 200 (OK)", function() {
			return requestChecker.checkGetHttpStatus(typicodeUrl+"/posts?userId=1", 200);
		});
			
		it("Post /posts should return status 200 (CREATED)", function() {
			var jsonData = {
				//"id": 1, //we don't specify the id to insert in base
						   //we will receive it in the body and we wrote in the checkPostHttpStatus that we expect it to be sent
				"userId": 1,
				"title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
				"body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
			};
			return requestChecker.checkPostHttpStatus(typicodeUrl+"/posts", 201, jsonData);
		});

		it("Put /posts/1 should return status 200 (OK)", function() {
			var jsonData = {
			    //"id": 1, //we don't specify the id to edit in base
			    		   //because we pass it in the url
			    "userId": 1,
			    "title": 'foo',
			    "body": 'bar'		    
		    }
		    return requestChecker.checkPutHttpStatus(typicodeUrl+"/posts/1", 200, jsonData);
		});

		it("Patch /posts/1 should return status 200 (OK)", function() {
			var jsonData = {
				//"id": 1, //we don't specify the id to edit in base
			    		   //because we pass it in the url
			    "title": 'foobar'		    
		    }
		    return requestChecker.checkPatchHttpStatus(typicodeUrl+"/posts/1", 200, jsonData);
		});

		it("Delete /posts/1 should return stats 200 (OK)", function() {
			return requestChecker.checkDeleteHttpStatus(typicodeUrl+"/posts/1", 200);
		});
	});

	var httpbinUrl = "https://httpbin.org";
	describe(httpbinUrl, function(){
		it("Get /html should return status 200 (OK) with html and body content", function() {
			return requestChecker.checkGetHtmlHttpStatus(httpbinUrl+"/html", 200);
		});

		it("Get /status/418 should return status 418 (TEAPOT) and writing html content to file should pass", function(){
			return requestChecker.checkFileDownloadHttpStatus(httpbinUrl+"/status/418", "./downloaded/teapot.txt", 418);
		});

		it("Get /range/10240?duration=2&chunk_size=1 should return status 200 (OK) and writing chunked binary data to file should pass", function() {
			return requestChecker.checkFileDownloadHttpStatus(httpbinUrl+"/range/10240?duration=1&chunk_size=1", "./downloaded/bytes.bin", 200);
		});

		it("Http basic auth /basic-auth/user/passwd should fail", function(){
			return requestChecker.checkBasicAuthHttpStatus(httpbinUrl+"/basic-auth/user/passwd", "wrongUser", "wrongPass", 401);
		});

		it("Http basic auth /basic-auth/user/passwd should pass", function(){
			return requestChecker.checkBasicAuthHttpStatus(httpbinUrl+"/basic-auth/user/passwd", "user", "passwd", 200);
		});

		it("Http digest auth /digest-auth/auth/user/passwd/MD5 should fail", function(){
			return requestChecker.checkDigestAuthHttpStatus(httpbinUrl+"/basic-auth/user/passwd", "wrongUser", "wrongPass", 401);
		});

		it("Http digest auth /digest-auth/auth/user/passwd/MD5 should pass", function(){
			return requestChecker.checkDigestAuthHttpStatus(httpbinUrl+"/basic-auth/user/passwd", "user", "passwd", 200);
		});

		it("Get /image/png should return status 200 (OK) and writing image to file should pass", function(){
			return requestChecker.checkFileDownloadHttpStatus(httpbinUrl+"/image/png", "./downloaded/image.png", 200);
		});

		it("Get /stream/5 should return status 200 (OK) and writing streamed lines of text to file should pass", function(){
			return requestChecker.checkFileDownloadHttpStatus(httpbinUrl+"/stream/5", "./downloaded/data.json", 200);
		});
		
		it("Get /links/5 should have 5 links directly in its body", function(){
			return elementChecker.checkDirectBodyLinksCount(httpbinUrl+"/links/5", 4);
		})

		//  "/forms/post"
	})

	var meditamaUrl = "https://testing.meditama.fr";
	describe(meditamaUrl, function(){
		describe("Navbar", function() {
		    it("Should have 5 links", function() {
		    	return elementChecker.checkNavbarLinksCount(meditamaUrl, 5);
		    });

		    //This test will pass only if we have 5 links and 2 buttons in the navbar
			//It's an example of having multiple expectations for a function to validate the test
			//Where this expectations are in multiple test functions located in the same checker file
		    it("Should have 2 input buttons", function() {
		    	return elementChecker.checkNavbar(meditamaUrl, 2);
		    });

			//Another way of doing the exactly the same thing as above
			//Doing this way you could call multiple test functions located in different checker files
		    it("Should have 2 input buttons", function() {
		    	return elementChecker.checkNavbarLinksCount(meditamaUrl, 5)
		    		.then(elementChecker.checkNavbarButtonsCount(meditamaUrl, 2))
		    });

	    	it("Nightmare test 1", function() {
		    	return behaviourChecker.check1(meditamaUrl);
		    });

		    it("Nightmare test 2", function() {
		    	return behaviourChecker.check2(meditamaUrl);
		    });
	   	});

	    describe("User log in", function() {
		    it("Connection failure", function() {
		    	var login = "bim@bim.fr";
		        var password = "bimbim1";
		        return behaviourChecker.checkLogIn(meditamaUrl+"/user", login, password, "Erreur lors de la connexion, veuillez vérifier vos identifiants.");
	        });

	        it("Account locked", function() {
		    	var login = "plop@plop.fr";
		        var password = "plopplop1";
		        return behaviourChecker.checkLogIn(meditamaUrl+"/user", login, password, "Compte temporairement verrouillé.");	        
	        });
		});
	});
	
});

