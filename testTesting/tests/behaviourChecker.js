"use strict";

/////Includes
const Nightmare = require('nightmare');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const Q = require("q");
/////

function checkLogIn(url, login, password, expectedMessage){
	var deferred = Q.defer();
	new Nightmare()
        .goto(url)
        .type("input[name='login_string']", login)
        .type("input[name='login_pass']", password)
        .click("#loginForm button[type='submit']")
        .wait(5000) //we have to wait some time because the login response is displayed asynchronously on this website, we sadly have no other choice than wait
        .evaluate(function() { //the js we execute in the page opened in the electron browser
            return document.querySelector("div.log-main > div.alert > p").innerText;
        })
        .end() //stops the navigation
		.then(function(evaluateResult) {
			//console.log("\t\t[LOG] Nightmare then function");
			//console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));
			var promise = Promise.resolve(evaluateResult).should.eventually.contain(expectedMessage)
			deferred.resolve(promise);
		})
		.catch(function (error) {
			console.error("\t\t[LOG] Nightmare error: ", error);
			deferred.reject(error);
		});
	return deferred.promise;
}

//making functions public
module.exports = {
	checkLogIn : checkLogIn
}