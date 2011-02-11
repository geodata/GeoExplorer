/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/**
 * @requires gdxp/Search.js
 */

Ext.namespace("gdxp");

/** api: (define)
 *  module = gdxp
 *  class = CatastroSearch
 *  extends = gdxp.Search
 */


/** api: constructor
 *  .. class:: CatastroSearch()
 *
 *      Uses KML Catastro web service to retrieve parcels by its cadastral reference.
 *      http://ovc.catastro.meh.es/Cartografia/WMS/BuscarParcelaGoogle.aspx
 *
 */
gdxp.CatastroSearch = Ext.extend(gdxp.Search, {
    
    /* i18n */
    titleText: "Cadastre",
    labelText: "Type the cadastral reference and press ENTER (example: '5123501DF1952S')",
    /* ~i18n */

    /** private: property[input]
     *  ``Ext.form.TextField`` Where cadastral reference is typed
     */
    input: null,

    /** private: property[display]
     *  ``Ext.form.DisplayField`` Where result is shown
     */
    display: null,

    /** private: method[initComponent]
     * 
     *  Instantiates input and display components.
     */
    initComponent: function() {
    
        this.projection = new OpenLayers.Projection("EPSG:4326");
        this.baseURL = "http://ovc.catastro.meh.es/Cartografia/WMS/BuscarParcelaGoogle.aspx";

        this.input = new Ext.form.TextField({
            fieldLabel: this.labelText,
            anchor: "100%",
            listeners: {
                specialkey: function(field, e) {
                    if (e.getKey() == e.ENTER) {
                        this.display.setValue(this.loadingText);
                        this.query(field.getValue());
                    }
                },
                scope: this
            }
        });
        
        this.display = new Ext.form.DisplayField({anchor: "100%", value: ' '});
        
        this.items = [this.input, this.display];

        gdxp.CatastroSearch.superclass.initComponent.apply(this, arguments);
    },

    /** private: method[initComponent]
     *  :arg q: ``String`` The cadastral reference.
     *  
     *  Here is where Ajax request is performed and KML response is parsed.
     */    
    query: function(q) {
        Ext.Ajax.request({
            url: this.baseURL,
            params: {RefCat: q},
            method: "GET",
            success: function(response) {
                try {
                    var name = Ext.DomQuery.selectValue("/kml/Document/Placemark/name",  response.responseXML);
                    this.display.setValue(name);
                } catch (e) {
                    this.display.setValue(this.errorText);
                }
                try {
                    // Get coordinate pair
                    var coords = Ext.DomQuery.selectValue("/kml/Document/Placemark/Point/coordinates",  response.responseXML).split(",");
                    
                    // Get result description
                    var description = Ext.DomQuery.selectValue("/kml/Document/Placemark/description",  response.responseXML);
                    
                    // Extract link to the full Catastro register from description
                    var link = new RegExp('<[Aa].*?href\s*=\s*["\']([^"\']+)[^>]*>.*?<\/[Aa]>').exec(description)[1];
                    
                    // Build response to be displayed
                    var text = '<a href="'+link+'" target="_blank">' + this.display.getValue() + '</a>';
                    
                    this.display.setValue(text);
                    this.showLocation(coords[0], coords[1], text);
                } catch (e) {
                    // Just fine: No coords & no link
                }
            },
            failure: function() {
                this.display.setValue(this.errorText);
            },
            scope: this
        });
    }

});

Ext.reg('gdxp_catastrosearch', gdxp.CatastroSearch);
