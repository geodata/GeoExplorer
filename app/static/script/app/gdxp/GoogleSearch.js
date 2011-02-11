/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/**
 * @requires gdxp/Search.js
 */

Ext.namespace("gdxp");

/** api: (define)
 *  module = gdxp
 *  class = GoogleSearch
 *  extends = gdxp.Search
 */


/** api: constructor
 *  .. class:: GoogleSearch()
 *
 *     Just a wrapper for ``gxp.form.GoogleGeocoderComboBox``.
 *
 */
gdxp.GoogleSearch = Ext.extend(gdxp.Search, {
    
    /* i18n */
    titleText: "Google",
    labelText: "Google geocoder",
    /* ~i18n */
   
   
    /** api: config[bounds]
     *  ``OpenLayers.Bounds``
     *  
     *  Restrict searches to a given BBOX. Defaults to all world.
     */ 
    bounds: null,

    /** private: method[initComponent]
     * 
     *  Uses ``gxp.plugins.GoogleSource`` to load GMaps API.
     */
    initComponent: function() {
        this.projection = new OpenLayers.Projection("EPSG:4326");
   
        if (!(window.google && google.maps)) {
            gxp.plugins.GoogleSource.loader.onLoad({
                callback: this.prepGeocoder,
                errback: function() {
                    throw new Error("The Google Maps script failed to load within the given timeout.");
                },
                scope: this
            });
        } else {
            // call in the next turn to complete initialization
            window.setTimeout((function() {
                this.prepGeocoder();
            }).createDelegate(this), 0);
        }
        gdxp.GoogleSearch.superclass.initComponent.apply(this, arguments);

    },

    /** private: method[initComponent]
     * 
     *  Actual ``gxp.form.GoogleGeocoderComboBox`` instantiation,
     *  called when GMaps API is finally available.
     */    
    prepGeocoder: function() {
        this.add(new gxp.form.GoogleGeocoderComboBox({
            fieldLabel: this.labelText,
            bounds: this.bounds,
            anchor: "100%",
            listeners: {
                select: function(combo, record) {
                    var p = record.get("location");
                    var text = record.get("address");
                    this.showLocation(p.lon, p.lat, text);
                },
                scope: this
            } 
        }));
    }
    
});

Ext.reg('gdxp_googlesearch', gdxp.GoogleSearch);