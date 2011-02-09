Ext.namespace("gdxp");

gdxp.Search = Ext.extend(Ext.Panel, {

    titleText: "Search",
    labelText: "Search for Data",
    loadingText: "Loading...",
    errorText: "Error accessing search service",

    /* API */
    map: null,        // mandatory
    projection: null, // Defaults to EPSG:23031
    zoomToScale: 500,
    /* ~API */
    
    layout: 'form',
    labelAlign: 'top',
    header: false,
    border: false,
    anchor: "100%",
    
    initComponent: function() {
        this.title = this.titleText,
        this.projection = this.projection || new OpenLayers.Projection("EPSG:23031");

        gdxp.Search.superclass.initComponent.apply(this, arguments);
    },
    
    zoomTo: function(x, y) {
        var point = new OpenLayers.LonLat(x, y);
        point.transform(this.projection, this.map.getProjectionObject());
        this.map.zoomToScale(this.zoomToScale);
        this.map.panTo(point);        
    }
    
});