var Request = require("ringo/webapp/request").Request;
var Response = require("ringo/webapp/response").Response;
var FILE = require("fs");
var System = Packages.java.lang.System;

var baseURL;
var docRoot;

var createResponse = function(data, status) {
    if (typeof data !== "string") {
        data = JSON.stringify(data);
    }
    return {
        status: status || 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: [data]
    };
};

var templateList = function(dir) {
    var list = [];
    FILE.list(dir).forEach(function(file){
        var item = {};
        item.id = FILE.base(file, ".json");
        var path = FILE.join(dir, file);
        if (FILE.isFile(path)) {
        	var map = eval("(" + FILE.open(path).read() + ")");
        	item.title = map.about.title,
        	item.description = map.about.abstract
        }
        list.push(item);
    });
    return list;
};

exports.app = function(request, base, extra) {
    var dataDir = FILE.absolute("app/static/config");
    var list = templateList(dataDir);
    return createResponse(list);
};
