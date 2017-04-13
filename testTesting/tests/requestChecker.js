"use strict";

/////Includes
const request = require("request");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
const expect = chai.expect;
const assert = chai.assert;
const should = chai.should();
const Q = require("q");
//////

function checkHttpStatus(url, statusCode) {
	var deferred = Q.defer();
	request(url, function(error, response, body) {
		if(error){
			deferred.reject(error);
		}
		if(response){
			var promise = expect(
				Promise.resolve(response.statusCode)
				).to.eventually.equal(statusCode);
			deferred.resolve(promise);
		}
	});
	return deferred.promise;
}

//making functions public
module.exports = {
	checkHttpStatus : checkHttpStatus
}