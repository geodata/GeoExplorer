var clientRequest = require("./httpclient").request;
var Headers = require("ringo/utils/http").Headers;
var objects = require("ringo/utils/objects");

function getGeoServerUrl(request) {
    var url = java.lang.System.getProperty("app.proxy.geoserver");
    if (url) {
        if (url.charAt(url.length-1) !== "/") {
            url = url + "/";
        }
    } else {
        url = request.scheme + "://" + request.host + (request.port ? ":" + request.port : "") + "/geoserver/";
    }
    return url;
}

function getLoginUrl(request) {
    return getGeoServerUrl(request) + "j_spring_security_check";
}

function getAuthUrl(request) {
    return getGeoServerUrl(request) + "rest";
}

// get status (ACK!) by parsing Location header
function parseStatus(exchange) {
    var status = 401; // Defaults to unauthorized
    var token = "";
    var location = exchange.headers.get("Location");
    if (exchange.status == 302 && /error=true/.test(location) == false) {
        status = 200; // If redirecting without error, authorize
        
        /* Get session cookie from j_spring_security_check */
        var cookie = exchange.headers.get("Set-Cookie");
        /* If not, try to get cookie from redirection */
        if (!cookie) {       	
	        var exchange2 = clientRequest({
	            url: location,
	            method: "GET",
	            async: false
	        });
	        exchange2.wait();
	        var cookie = exchange2.headers.get("Set-Cookie");
	    }
	    if (cookie) {
            token = cookie.split(";").shift();
        }
    }
    return {
        token: token,
        status: status
    };
}

exports.getStatus = function(request) {
    var url = getAuthUrl(request);
    var status = 401;
    var headers = new Headers(request.headers);
    var token = headers.get("Cookie");
    var exchange = clientRequest({
        url: url,
        method: "GET",
        async: false,
        headers: headers
    });
    exchange.wait();
    return exchange.status;
};

exports.authenticate = function(request) {
    var params = request.postParams;
    var status = 401;
    var token;
    if (params.username && params.password) {
        var url = getLoginUrl(request);
        var exchange = clientRequest({
            url: url,
            method: "POST",
            async: false,
            data: {
                username: params.username,
                password: params.password
            }
        });
        exchange.wait();
        var details = parseStatus(exchange);
        return details;
   } else {
   	   // Here, could check for session cookie
       return {status: 401}
   }
};
