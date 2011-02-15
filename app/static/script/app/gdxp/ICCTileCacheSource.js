/**
 * Copyright (c) 2011 Geodata Sistemas
 *
 */

/**
 * @requires ../externals/gdxp/plugins/LayerSource.js
 */

/** api: (define)
 *  module = gdxp
 *  class = ICCTileCacheSource
 */

/** api: (extends)
 *  plugins/LayerSource.js
 */
Ext.namespace("gdxp");

/** api: constructor
 *  .. class:: ICCTileCacheSource(config)
 *
 *    Plugin for using the Institut Cartografic de Catalunya
 *    TileCache layers with :class:`gxp.Viewer` instances.
 *
 *    Available layer names are "topo", "orto" and "geol"
 */
/** api: example
 *  The configuration in the ``sources`` property of the :class:`gxp.Viewer` is
 *  straightforward:
 *
 *  .. code-block:: javascript
 *
 *    "icc": {
 *        ptype: "gdxp_icc_tilecache"
 *    }
 *
 *  A typical configuration for a layer from this source (in the ``layers``
 *  array of the viewer's ``map`` config option would look like this:
 *
 *  .. code-block:: javascript
 *
 *    {
 *        source: "icc",
 *        name: "topo"
 *    }
 *
 */
gdxp.ICCTileCacheSource = Ext.extend(gxp.plugins.LayerSource, {
    
    /** api: ptype = gxp_osmsource */
    ptype: "gdxp_icc_tilecache",

    /** api: property[store]
     *  ``GeoExt.data.LayerStore``. Will contain records with "topo", "orto" and
     *  "geol" as name field values.
     */
    
    /** api: config[title]
     *  ``String``
     *  A descriptive title for this layer source (i18n).
     */
    title: "TileCache ICC",

    /** api: config[mapnikAttribution]
     *  ``String``
     *  Attribution string for ICC layers (i18n).
     */
    iccAttribution: "&copy; <a href='http://www.icc.cat/' target='_blank'>Institut Cartogr&agrave;fic de Catalunya</a>",

    /** api: config[mapnikAttribution]
     *  ``String``
     *  Attribution string for ICC layers (i18n).
     */
    igcAttribution: "&copy; <a href='http://www.igc.cat/' target='_blank'>Institut Geol&ograve;gic de Catalunya</a>",


    /** api: method[createStore]
     *
     *  Creates a store of layer records.  Fires "ready" when store is loaded.
     */
    createStore: function() {
        
        var params = {
            format: "image/jpeg",
            exceptions: "application/vnd.ogc.se_xml"            
        };

        var options = {
            projection: "EPSG:23031",
            maxExtent: new OpenLayers.Bounds(258000, 4485000, 536000, 4752000),
            maxResolution: 550,
            resolutions: [550, 275, 100, 50, 25, 10, 5, 2, 1, 0.5, 0.25],
            units: "m",
            buffer: 0,
            transitionEffect: "resize",
            attribution: this.iccAttribution
        };
        
        var layers = [
            new OpenLayers.Layer.WMS(
                "Mapa topogràfic de Catalunya / ICC",
                "http://sagitari.icc.cat/tilecache/tilecache.py",
                OpenLayers.Util.applyDefaults({
                    layers: "topo"
                }, params),
                options
            ),
            new OpenLayers.Layer.WMS(
                "Ortofotoimatge de Catalunya / ICC",
                "http://sagitari.icc.cat/tilecache/tilecache.py",
                OpenLayers.Util.applyDefaults({
                    layers: "orto"
                }, params),
                options
            ),
            new OpenLayers.Layer.WMS(
                "Mapa geològic de Catalunya / IGC",
                "http://sagitari.icc.cat/tilecache/tilecache.py",
                OpenLayers.Util.applyDefaults({
                    layers: "geol"                  
                }, params),
                OpenLayers.Util.applyDefaults({
                    resolutions: [550, 275, 100, 50, 25, 10, 5],
                    attribution: this.igcAttribution
                }, options)
            )
        ];
        
        this.store = new GeoExt.data.LayerStore({
            layers: layers,
            fields: [
                {name: "source", type: "string"},
                {name: "title", type: "string", mapping: "name"},
                {name: "abstract", type: "string", mapping: "attribution"},
                {name: "group", type: "string", defaultValue: "background"},
                {name: "fixed", type: "boolean", defaultValue: true},
                {name: "selected", type: "boolean"}
            ]
        });
        this.store.each(function(l) {
            l.set("group", "background");
            l.set("name", l.get("layer").params.LAYERS);
        });
        this.fireEvent("ready", this);

    },
    
    /** api: method[createLayerRecord]
     *  :arg config:  ``Object``  The application config for this layer.
     *  :returns: ``GeoExt.data.LayerRecord``
     *
     *  Create a layer record given the config.
     */
    createLayerRecord: function(config) {
        var record;
        var index = this.store.findExact("name", config.name);
        if (index > -1) {

            record = this.store.getAt(index).copy(Ext.data.Record.id({}));
            var layer = record.getLayer().clone();
 
            // set layer title from config
            if (config.title) {
                /**
                 * Because the layer title data is duplicated, we have
                 * to set it in both places.  After records have been
                 * added to the store, the store handles this
                 * synchronization.
                 */
                layer.setName(config.title);
                record.set("title", config.title);
            }

            // set visibility from config
            if ("visibility" in config) {
                layer.visibility = config.visibility;
            }
            
            record.set("selected", config.selected || false);
            record.set("source", config.source);
            record.set("name", config.name);
            if ("group" in config) {
                record.set("group", config.group);
            }

            record.data.layer = layer;
            record.commit();
        }
        return record;
    }

});

Ext.preg(gdxp.ICCTileCacheSource.prototype.ptype, gdxp.ICCTileCacheSource);
