/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/** api: (define)
 *  module = gdxp
 *  class = Search
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */

Ext.namespace("gdxp");


/** api: constructor
 *  .. class:: Search()
 *
 *      Abstract class containing generic properties and helper methods
 *      for search widgets. This class is not intended to be instantiated,
 *      but extended.
 *      
 *      Specify at least a 'map' option with an ``OpenLayers.map``
 *      to render results.
 */
gdxp.Search = Ext.extend(Ext.Panel, {

    /* i18n */

    /** api: config[titleText]
     *  ``String``
     *  Search panel title text.
     */
    titleText: "Search",
    
    /** api: config[url]
     *  ``String``
     *  Label accompanying the search box.
     */
    labelText: "Search for Data",
    
    /** private: property[loadingText]
     *  ``String``
     *  A text to indicate we're waiting for a response.
     */
    loadingText: "Loading...",

    /** private: property[errorText]
     *  ``String``
     *  A text to indicate the search service is not available.
     */
    errorText: "Error accessing search service",

    /* ~i18n */

   
    /** api: config[lang]
     *  ``String``
     *  The 2-letter language code in which text labels will be rendered. Defaults to "en" (English).
     */
    lang: "en",
   
    /** api: config[map]
     *  ``OpenLayers.Map``
     *  The map to which search result is rendered. Required.
     */
    map: null,
    
    /** api: config[projetion]
     *  ``OpenLayers.Projection``
     *  The search engine projection. Defaults to EPSG:23031.
     */
    projection: null,
    
    /** api: config[zoomToScale]
     *  ``Number``
     *  The zoom scale denominator used when rendering a
     *  search result. Defaults to 2500.
     */    
    zoomToScale: 2500,
    
    /** private: property[layout]
     */
    layout: 'form',
    
    /** private: property[labelAlign]
     */
    labelAlign: 'top',
    
    /** private: property[header]
     */
    header: false,
    
    /** private: property[border]
     */
    border: false,
    
    /** private: property[anchor]
     */
    anchor: "100%",
    
    /** private: method[initComponent]
     * 
     *  Assigns title and projection.
     */
    initComponent: function() {
        this.title = (this.texts && this.texts[this.lang] && this.texts[this.lang].title) || this.titleText,
        this.projection = this.projection || new OpenLayers.Projection("EPSG:23031");

        gdxp.Search.superclass.initComponent.apply(this, arguments);
    },

    /** private: method[showLocation]
     *  :arg x: ``Number`` X coordinate of result location.
     *  :arg y: ``Number`` Y coordinate of result location.
     *  :arg text: ``String`` Text to be shown in result location. Can be HTML.
     *  
     *  Called to show a result on the map.
     *  
     *  Centers map in (x, y), applies zoomToScale, and displays
     *  text in that location.
     */    
    showLocation: function(x, y, text) {
        var point = new OpenLayers.LonLat(x, y);
        point.transform(this.projection, this.map.getProjectionObject());
        this.map.zoomToScale(this.zoomToScale);
        this.map.panTo(point);
        this.displayPopup(point, text);
    },
    
    /** private: method[showLocation]
     *  :arg point: ``OpenLayers.LonLat`` Popup location.
     *  :arg text: ``String`` Text to be shown in result location. Can be HTML.
     *  
     *  Shows a ``GeoExt.Popup`` on the map.
     */    
    displayPopup: function(point, text){
        var popup = new GeoExt.Popup({
            layout: "fit",
            width: "128",
            location: point,
            map: this.map,
            title: this.titleText,
            html: text
        });
        popup.show();
    }

});
