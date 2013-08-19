var Request = require("ringo/webapp/request").Request;
var Response = require("ringo/webapp/response").Response;
var FILE = require("fs");
var System = Packages.java.lang.System;

var baseURL;
var docRoot;

var getRootPath = function(request) {
    var dataDir;
    if (request) {
        dataDir = request.env.servlet.getServletConfig().getInitParameter("GEOEXPLORER_DATA");
    }
    if (!dataDir) {
        dataDir = String(
            System.getProperty("GEOEXPLORER_DATA") || 
            System.getenv("GEOEXPLORER_DATA") || "."
        );
    }
    return FILE.join(dataDir, "custom");
};

exports.app = function(request, base, extra) {
    docRoot = getRootPath(request);
    baseURL = base;    
    var file = FILE.join(docRoot, extra);
    if (FILE.isFile(file)) {
        return {
            status: 200,
            headers: {},
            body: FILE.open(file, "rb")
        }
    } else {
        throw {notfound: true};
    }
};
