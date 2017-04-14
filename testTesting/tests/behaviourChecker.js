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
			//console.error("\t\t[LOG] Nightmare error: ", error);
			deferred.reject(error);
		});
	return deferred.promise;
}

function check1(url){
	var deferred = Q.defer();
	new Nightmare()
        .goto(url)
        .click("#navbar a > input[type='button']") //pure js here, does a document.querySelector(XXX)
        .wait()
        .evaluate(function () { //the js we execute in the page opened in the electron browser
        	//pure js here, no jquery
        	//js executed on the client side
            return document.querySelector("#registerForm");
        })
        .end() //stops the navigation
		.then(function(evaluateResult) {
			//console.log("\t\t[LOG] Nightmare then function");
			//console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));
			var promise = Q.all([
					Promise.resolve(evaluateResult).should.eventually.not.be.null,
					Promise.resolve(evaluateResult).should.eventually.be.an('object')
				]);
			deferred.resolve(promise);
		})
		.catch(function (error) {
			//console.error("\t\t[LOG] Nightmare error: ", error);
			deferred.reject(error);
		});
	return deferred.promise;
}

function check2(url){
	var deferred = Q.defer();
	new Nightmare()
        .goto(url)
        .wait()
        .inject("js", "node_modules/jquery/dist/jquery.js")
        .evaluate(function () {
        	//jquery available here because of the inject() line
        	//js executed on the client side
        	$("#navbar a > input[type='button']:eq(1)").click();
            return $("#registerForm");
        })
        .end()
		.then(function(evaluateResult) {
			//console.log("\t\t[LOG] Nightmare then function");
			//console.log("\t\t[LOG] "+JSON.stringify(evaluateResult));
			var promise = Q.all([
					Promise.resolve(evaluateResult).should.eventually.not.be.null,
					Promise.resolve(evaluateResult).should.eventually.be.an('object')
				]);
			deferred.resolve(promise);
		})
		.catch(function (error) {
			//console.error("\t\t[LOG] Nightmare error: ", error);
			deferred.reject(error);
		});
	return deferred.promise;
}

//making functions public
module.exports = {
	checkLogIn : checkLogIn,
	check2 : check2,
	check1 : check1
}