"use strict";

const request = require("request");
const expect = require('chai').expect;
const Q = require("q");

function checkHttpStatus(url, statusCode) {
	var deferred = Q.defer();
	request(url, function(error, response, body) {
		expect(response.statusCode).to.equal(statusCode);
		deferred.resolve();
	});
	return deferred.promise;
}

module.exports = {
	checkHttpStatus : checkHttpStatus
}