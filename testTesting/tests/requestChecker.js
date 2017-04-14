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
const path = require("path");
const fs = require("fs-extra");
//////


/////Private requestOptions
function requestOptionsGet(url){
	return {
		method: "GET",
		uri: url,
		gzip: true
	};
}

function requestOptionsPost(url, jsonData){
	return {
		method: "POST",
		uri: url,
		gzip: true,
		json: true,
		body: jsonData
	};
}

function requestOptionsPut(url, jsonData){
	return {
		method: "PUT",
		uri: url,
		gzip: true,
		json: true,
		body: jsonData
	};
}

function requestOptionsPatch(url, jsonData){
	return {
		method: "PATCH",
		uri: url,
		gzip: true,
		json: true,
		body: jsonData
	};
}

function requestOptionsDelete(url){
	return {
		method: "DELETE",
		uri: url,
		gzip: true
	}
}

/////Private checks
function checkHttpStatus(error, response, expectedStatusCode){
	var deferred = Q.defer();
	if(error){
		deferred.reject(error);
	}
	if(response){
		var promise = expect(
				Promise.resolve(response.statusCode)
			).to.eventually.equal(expectedStatusCode);
		deferred.resolve(promise);
	}
	return deferred.promise;
}

function checkBodyNotEmpty(error, body){
	//body = String or Buffer, or JSON object if the json option have been supplied
	//most of the time, stores the html page
	var deferred = Q.defer();
	if(error){
		deferred.reject(error);
	}
	if(body){
		var promise = Q.all([
				expect(Promise.resolve(body)).to.eventually.exist, // = not.be.null && not.be.undefined

				Promise.resolve(body).should.eventually.be.a("string"),
				expect(Promise.resolve(body)).to.eventually.not.be.empty,

				expect(Promise.resolve(body)).to.eventually.contain("</body>"),
				expect(Promise.resolve(body)).to.eventually.contain("</html>")
			])
		deferred.resolve(promise);
	}
	return deferred.promise;
}

function checkReturnedId(error, body){
	//body = String or Buffer, or JSON object if the json option have been supplied
	//most of the time, stores the html page
	//here we expect a json object
	var deferred = Q.defer();
	if(error){
		deferred.reject(error);
	}
	if(body){
		var promise = Q.all([
				expect(Promise.resolve(body)).to.eventually.exist, // = not.be.null && not.be.undefined
				
				Promise.resolve(body).should.eventually.be.an("object"),

				expect(Promise.resolve(body.id)).to.eventually.exist, // = not.be.null && not.be.undefined
				expect(Promise.resolve(body.id)).to.eventually.not.be.NaN,
				expect(Promise.resolve(body.id)).to.eventually.be.a("number"),
				expect(Promise.resolve(body.id)).to.eventually.be.above(0)
			])
		deferred.resolve(promise);
	}
	return deferred.promise;
}

/*function checkHttpStatus(method, url, expectedStatusCode, multipart = null, form = null, formData = null) {
	var deferred = Q.defer();

	{
		method: method,
    	uri: url,
    	gzip: true,
    	multipart: multipart,
    	form: form,
    	formData: formData,
    	json: true,
    	body: body
    }

	request(
		options,
		requestFunction(error, response, body);    	
	);
	return deferred.promise;
}*/

/////Public checks
function checkGetHtmlHttpStatus(url, expectedStatusCode){
	var deferred = Q.defer();
	request(
		requestOptionsGet(url),
		function(error, response, body){
			var promise = Q.all([
					checkHttpStatus(error, response, expectedStatusCode), 
					checkBodyNotEmpty(error, body)
				]);
			deferred.resolve(promise);
		}
	);
	return deferred.promise;
}

function checkGetHttpStatus(url, expectedStatusCode){
	var deferred = Q.defer();
	request(
		requestOptionsGet(url),
		function(error, response, body){
			var promise = checkHttpStatus(error, response, expectedStatusCode);			
			deferred.resolve(promise);
		}
	);
	return deferred.promise;
}

function checkPostHttpStatus(url, expectedStatusCode, jsonData){
	var deferred = Q.defer();
	request(
		requestOptionsPost(url, jsonData),
		function(error, response, body){
			var promise = Q.all([
					checkHttpStatus(error, response, expectedStatusCode),
					checkReturnedId(error, body)
				]);
			deferred.resolve(promise);
		}
	);
	return deferred.promise;
}

function checkPutHttpStatus(url, expectedStatusCode, jsonData){
	var deferred = Q.defer();
	request(
		requestOptionsPut(url, jsonData),
		function(error, response, body){
			var promise = Q.all([
					checkHttpStatus(error, response, expectedStatusCode),
					checkReturnedId(error, body)
				]);
			deferred.resolve(promise);
		}
	);
	return deferred.promise;
}

function checkPatchHttpStatus(url, expectedStatusCode, jsonData){
	var deferred = Q.defer();
	request(
		requestOptionsPatch(url, jsonData),
		function(error, response, body){
			var promise = Q.all([
					checkHttpStatus(error, response, expectedStatusCode),
					checkReturnedId(error, body)
				]);
			deferred.resolve(promise);
		}
	);
	return deferred.promise; 
}

function checkDeleteHttpStatus(url, expectedStatusCode){
	var deferred = Q.defer();
	request(
		requestOptionsDelete(url),
		function(error, response, body){
			var promise = checkHttpStatus(error, response, expectedStatusCode);
			deferred.resolve(promise);
		}
	);
	return deferred.promise; 
}

function checkBasicAuthHttpStatus(url, username, password, expectedStatusCode){
	var deferred = Q.defer();
	request.get(url, function(error, response, body){
		if(error){
			deferred.reject(error);
		}
		if(response){
			var promise = expect(
				Promise.resolve(response.statusCode)
				).to.eventually.equal(expectedStatusCode);
			deferred.resolve(promise);
		}
	}).auth(username, password, true); //this true is necessary for the Basic Auth to be supported
	return deferred.promise;
}

//untested
function checkDigestAuthHttpStatus(url, username, password, expectedStatusCode){
	var deferred = Q.defer();
	request.get(url, function(error, response, body) {
		if(error){
			deferred.reject(error);
		}
		if(response){
			var promise = expect(
				Promise.resolve(response.statusCode)
				).to.eventually.equal(expectedStatusCode);
			deferred.resolve(promise);
		}
	}).auth(username, password, false); //this false is necessary for the Digest Auth to be supported
	return deferred.promise;
}

//untested
function checkBearerAuthHttpStatus(url, bearerToken, expectedStatusCode){
	var deferred = Q.defer();
	request.get(url, function(error, response, body){
		if(error){
			deferred.reject(error);
		}
		if(response){
			var promise = expect(
				Promise.resolve(response.statusCode)
				).to.eventually.equal(expectedStatusCode);
			deferred.resolve(promise);
		}
	}).auth(null, null, true, bearerToken); //this true is necessary for the Basic Auth to be supported
	return deferred.promise;
}

//untested
//multipart/form-data
function checkFormHttpStatus(url, expectedStatusCode){
	var formData = {
	  // Pass a simple key-value pair
	  my_field: 'my_value',
	  // Pass data via Buffers
	  my_buffer: new Buffer([1, 2, 3]),
	  // Pass data via Streams
	  my_file: fs.createReadStream(__dirname + '/unicycle.jpg'),
	  // Pass multiple values /w an Array
	  attachments: [
	    fs.createReadStream(__dirname + '/attachment1.jpg'),
	    fs.createReadStream(__dirname + '/attachment2.jpg')
	  ],
	  // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
	  // Use case: for some types of streams, you'll need to provide "file"-related information manually.
	  // See the `form-data` README for more information about options: https://github.com/form-data/form-data
	  custom_file: {
	    value:  fs.createReadStream('/dev/urandom'),
	    options: {
	      filename: 'topsecret.jpg',
	      contentType: 'image/jpeg'
	    }
	  }
	};

	checkHttpStatus("POST", url, expectedStatusCode, null, null, formData);
}

//untested
//application/x-www-form-urlencoded
function checkFormUrlencodedHttpStatus(url, expectedStatusCode){
	var form = {key:'value'};
	checkHttpStatus("POST", url, expectedStatusCode, null, form);
}

//untested
//multipart/related
function checkPutMultipartHttpStatus(url, expectedStatusCode){
	var multipart = [ 
	      	{ 
	      		'content-type': 'application/json',
	        	body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
	        },
	        { 
	        	body: 'I am an attachment' 
	        },
	        { body: fs.createReadStream('image.png') }
	      ];

	var multipart2 = {
      chunked: false,
      data: [
        {
          'content-type': 'application/json',
          body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
        },
        { body: 'I am an attachment' }
      ]
    };
	checkHttpStatus("PUT", url, expectedStatusCode, multipart);
}

function checkFileDownloadHttpStatus(url, filepath, expectedStatusCode){
	fs.ensureDirSync(path.dirname(filepath));

	var deferred = Q.defer();
	request.get(url)
	.on("error", function(error) {
		deferred.reject(error);
	})
	.on("response", function(response){
		var promise = expect(
			Promise.resolve(response.statusCode)
			).to.eventually.equal(expectedStatusCode);
		deferred.resolve(promise);
	})
	.pipe(fs.createWriteStream(filepath));
	return deferred.promise;
}

//untested
function checkFileUploadHttpStatus(url, filepath){
	fs.createReadStream(filepath).pipe(request.put(url))
}




//making functions public
module.exports = {
	checkGetHtmlHttpStatus : checkGetHtmlHttpStatus,
	checkGetHttpStatus : checkGetHttpStatus,
	checkPostHttpStatus : checkPostHttpStatus,
	checkPutHttpStatus : checkPutHttpStatus,
	checkPatchHttpStatus : checkPatchHttpStatus,
	checkDeleteHttpStatus : checkDeleteHttpStatus,
	checkBasicAuthHttpStatus : checkBasicAuthHttpStatus,	
	checkDigestAuthHttpStatus : checkDigestAuthHttpStatus,
	//checkBearerAuthHttpStatus : checkBearerAuthHttpStatus
	checkFileDownloadHttpStatus: checkFileDownloadHttpStatus
}