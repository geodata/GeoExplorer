/**
 * @requires gdxp/Search.js
 */

Ext.namespace("gdxp");

gdxp.GoogleSearch = Ext.extend(gdxp.Search, {
    /* i18n */
    titleText: "Google",
    labelText: "Google geocoder",
    /* ~i18n */
   
    /* API */
    bounds: null, // Defaults to all world
    /* ~API */

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
    
    prepGeocoder: function() {
        this.add(new gxp.form.GoogleGeocoderComboBox({
            fieldLabel: this.labelText,
            bounds: this.bounds,
            anchor: "100%",
            listeners: {
                select: function(combo, record) {
                    var p = record.get("location");
                    this.zoomTo(p.lon, p.lat);
                },
                scope: this
            } 
        }));
    }
    
});