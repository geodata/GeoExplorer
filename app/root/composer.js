var Response = require("ringo/webapp/response").Response;
var Request = require("ringo/webapp/request").Request;
var auth = require("../auth");

exports.app = function(req) {
    var request = new Request(req);
    var status = auth.getStatus(request);
    var response;
    /*
    if (details.status === 401) {
        var parts = request.path.split("/");
        parts.pop();
        parts.push("");
        response = {
            status: 301,
            headers: {"Location": request.scheme + "://" + request.host + ":" + request.port + parts.join("/")},
            body: []
        };
    } else {
    */    response = Response.skin(module.resolve("../skins/composer.html"));
          response.status = status || 404;
          
          // Reset GeoServer session, because we set JSESSIONID on '/' rather than '/geoserver'
          response.headers['Set-Cookie'] = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/geoserver";          
    //}
    return response;
};
