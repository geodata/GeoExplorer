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

var fileTree = function(dir) {
    var tree = [];
    FILE.list(dir).forEach(function(file){
        var item = {};
        item.text = file;
        var path = FILE.join(dir, file);
        var URL = path.replace(docRoot, baseURL).replace(/\\/g,"/"); // TODO
        if (FILE.isFile(path)) {
            item.leaf = true;
            item.href = URL;
            item.hrefTarget = "_blank";
            item.iconCls = "file-" + file.split(".").pop();
        } else if (FILE.isDirectory(path)) {
            item.text = file;
            item.cls = "folder";
            item.children = fileTree(path);
        }
        tree.push(item);
    });
    return tree;
};

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
    return FILE.join(dataDir, "documents");
};

exports.app = function(request, base, extra) {
    docRoot = getRootPath(request);
    baseURL = base;
    
    if (!extra) { // Return HTML page
        return Response.skin(module.resolve("../skins/documents.html"));
    } else if (extra.equals(".json")) { // Return JSON
        var tree = fileTree(docRoot);
        return createResponse(tree);
    } else { // Download a Document, or 404
        var file = FILE.join(docRoot, extra);
        if (FILE.isFile(file)) {
            // TODO: open file
            return {
                status: 200,
                headers: {},
                body: FILE.open(file, "rb")
            }
        } else {
            throw {notfound: true};
        }
    }
    
    //createResponse(arguments[2]);
};
