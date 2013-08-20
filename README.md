# GeoExplorer

These instructions describe how to deploy GeoExplorer
assuming you have a copy of the application source code
from GitHub.

## Getting a copy of the application

To get a copy of the application source code, use subversion:

    you@prompt:~$ git clone git://github.com/geodata/GeoExplorer.git


## Dependencies

The GeoExplorer repository contains what you need to run the application
as a servlet with an integrated persistence layer.

To assemble the servlet or run in development mode, you need
[Ant](http://ant.apache.org/).  In addition, to pull in external dependencies,
you'll neeed [Git](http://git-scm.com/) installed.

Before running in development mode or preparing the application for deployment,
you need to pull in external dependencies.  Do this by running `ant init` in the
geoexplorer directory:

    you@prompt:~$ cd geoexplorer/
    you@prompt:~/geoexplorer$ ant init


## Running in development mode

The application can be run in development or distribution mode. In development mode,
individual scripts are available to a debugger. In distribution mode, scripts are
concatenated and minified.

To run the application in development mode, run `ant debug`:

    you@prompt:~$ cd geoexplorer
    you@prompt:~/geoexplorer$ ant debug

If the build succeeds, you'll be able to browse to the application at http://localhost:6969/.

By default, the application runs on port 6969. To change this, you can set the `app.port`
property as follows (setting the port to 9080):

    you@prompt:~/geoexplorer$ ant -Dapp.port=9080 debug

In addition, if you want to make a remote GeoServer available at the `/geoserver/` path,
you can set the `app.proxy.geoserver` system property as follows:

    you@prompt:~/geoexplorer$ ant -Dapp.proxy.geoserver=http://example.com/geoserver/ debug

## Preparing the application for deployment

Running GeoExplorer as described above is not suitable for production because JavaScript
files will be loaded dynamically.  Before moving your application to a production environment,
run ant with the "dist" target.  The "dist" target will result in a war file that can be
dropped in a servlet container.

    you@prompt:~$ cd geoexplorer
    you@prompt:~/geoexplorer$ ant dist

Move the geoexplorer.war file to your production environment (e.g. a servlet container).

GeoExplorer writes to a geoexplorer.db when saving maps. The location of this file is determined
by the `GEOEXPLORER_DATA` value at runtime. This value can be set as a servlet initialization
parameter or a Java system property.

The `GEOEXPLORER_DATA` value must be a path to a directory that is writable by the process that
runs the application. The servlet initialization parameter is given precedence over a system
property if both exist.

As an example, if you want the geoexplorer.db file to be written to your `/tmp` directory,
modify GeoExplorer's `web.xml` file to include the following:

    <init-param>
        <param-name>GEOEXPLORER_DATA</param-name>
        <param-value>/tmp</param-value>
    </init-param>

## Using custom profiles

You can run and build GeoExplorer with a custom profile, which will personalize your GeoExplorer
instance with a specific environment and configuration, both at build time and at runtime.
This specific configuration is pulled from the GEOEXPLORER_DATA location.

So, to use a specific profile, set the `geoexplorer.data` environment variable:

    you@prompt:~$ ant -Dgeoexplorer.data=profiles/my-custom-profile debug

### Profile dissection

The default profile can be found in `profiles/default` directory. Use it as a base profile
to setup your own. here are several directories:

* build: Files used at debug or build time.
 * The `build.properties` file will override the generic ant environment variables. Use it to set the development environment, such as app.proxy.geoserver.
 * The `web.xml` file will be used when the war file is built. Use it to set the production environment, such as the final GEOEXPLORER_DATA dir.
* documents: The contents that will be used to render the document tree in the index page.
* templates: A collection of map templates. Used when creating new maps.
* custom: Custom static files, such as `custom.css`, a profile specific CSS stylesheet.
