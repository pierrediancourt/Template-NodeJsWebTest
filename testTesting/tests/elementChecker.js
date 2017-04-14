"use strict";

/////Includes
const jsdom = require("jsdom");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const Q = require("q");
/////

/////Private checks
function checkElementsCount(url, expectedLinksCount, jQuerySelector){
	var deferred = Q.defer();
	jsdom.env({
		url: url,
		scripts: ["http://code.jquery.com/jquery.js"],
		done: function (error, window) {
			if(error){
				deferred.reject(error);
			}
			if(window){
				var $ = window.$; //get jQuery object
				var count = $(jQuerySelector).length;
				var promise = expect(
					Promise.resolve(count)
					).to.eventually.equal(expectedLinksCount);
				deferred.resolve(promise);
			}
		}
	});
	return deferred.promise;
}

/////Public checks
function checkNavbarLinksCount(url, linksCount) {
	return checkElementsCount(url, linksCount, "#navbar a");
}

//This test will pass only if we have 5 links and x buttons in the navbar
//It's an example of having multiple expectations for a function to validate the test
//Where this expectations are in multiple test functions located in the same checker file
function checkNavbar(url, linksCount) {
	return checkNavbarLinksCount(url, 5)
	.then(checkElementsCount(url, linksCount, "#navbar a > input[type='button']"));
}

function checkNavbarButtonsCount(url, linksCount) {
	return checkElementsCount(url, linksCount, "#navbar a > input[type='button']");
}

function checkDirectBodyLinksCount(url, linksCount){
	return checkElementsCount(url, linksCount, "body > a");
}

//making functions public
module.exports = {
	checkDirectBodyLinksCount : checkDirectBodyLinksCount,
	checkNavbarLinksCount : checkNavbarLinksCount,
	checkNavbarButtonsCount : checkNavbarButtonsCount,
	checkNavbar : checkNavbar
}