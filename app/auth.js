var FILE = require("fs");
var System = Packages.java.lang.System;
var base64 = require('ringo/base64');

exports.middleware = function(conf) {
    return function(app) {
        return function (req) {
            // normalize multiple slashes in request path
            var path = (req.scriptName + req.pathInfo).replace(/\/+/g, '/');

            var authConf;
            for (var realm in conf) {
                if (path.indexOf(realm) == 0) {
                    authConf = conf[realm];
                    break;
                }
            }

            if (authConf) {
				authenticate(req);
				
				// Test if user has any of the required roles.
                if (!req.roles || intersect(authConf, req.roles).length == 0) {
                    return(unAuthResponse());
                }
            }
            return app(req);
        }
    }
};


authenticate = function(request) {
    var roles = null;

    if (request.headers.authorization) { // Extract credentials from HTTP.
        var credentials = base64.decode(request.headers.authorization
                .replace(/Basic /, '')).split(':');
    
        var authName = credentials[0];
        var authPass = credentials[1];
        
        getGeoServerUsers(request).forEach(function(user) {
            if(user.name.equals(authName) && user.password.equals(authPass)){
                request.roles = user.roles; // Put roles in request object
            }
        });
    }
}


getGeoServerUsers = function(request) {
    var dataDir;
	
	// Choose data_dir location
    if (request) {
        dataDir = request.env.servlet.getServletConfig().getInitParameter("GEOSERVER_DATA_DIR");
    }
    if (!dataDir) {
        dataDir = String(
            System.getProperty("GEOSERVER_DATA_DIR") || 
            System.getenv("GEOSERVER_DATA_DIR") || "."
        );
    }
    var path = FILE.join(dataDir, "security", "users.properties");
	

    // Parse "users.properties" file
    var users = [];
	FILE.read(path, "r").split(/\r?\n/).forEach(function(line) {
        var name, attr, password;
        
        line = line.match(/^[^#]*(?=#*)/)[0]; // Strip out #comments    	
        [name, attr] = line.split("="); // name=attr1,attr2,...,attrN
        if(attr) {
            attr = attr.split(",");
        }
        // first attribute is password; last attribute should be "enabled"
        if(attr && attr.length > 2 && attr.pop().trim().equals("enabled")){
            password = attr.shift().trim();
            // attributes in between are the roles
            users.push({name: name, password: password, roles: attr});
        }
    });

    return users;
}


unAuthResponse = function(){
    var msg = '401 Unauthorized';
    return {
        status: 401,
        headers: {
            'Content-Type': 'text/html',
            'WWW-Authenticate': 'Basic realm="GeoExplorer"'
        },
        body: [
            '<html><head><title>', msg, '</title></head>',
            '<body><h1>', msg, '</h1>',
            '</body></html>'
        ]
    };
}


intersect = function(a, b) {
	var x = new Array();
	var ai = bi = 0;
	
	a.sort();
    b.sort();
	
	while( ai < a.length && bi < b.length ) {
		if (a[ai] < b[bi]) {
			ai++;
		} else if (a[ai] > b[bi]){
			bi++;
		} else /* they're equal */ {
		   x.push(a[ai]);
		   ai++;
		   bi++;
		}
	}
		
	return x;
}
