/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/**
 * @requires gdxp/Search.js
 */
 
Ext.namespace("gdxp");

/** api: (define)
 *  module = gdxp
 *  class = DoubleFieldSearch
 *  extends = gdxp.Search
 */

/** api: constructor
 *  .. class:: DoubleFieldSearch()
 *
 *      Connects to a GeoServer WFS service to locate features
 *      by one of its text attributes.
 *      
 *      It is GeoServer specific because it uses CQL filters
 *      and GeoJSON response format. A more generic approach
 *      would use WFS filters and GML.
 *      
 *      Must specify:
 *       * 'baseURL' the GeoServer WFS service,
 *       * 'layer' the layer name,
 *       * 'field' the field name to search for.
 */
gdxp.DoubleFieldSearch = Ext.extend(gdxp.Search, {
    
    /** api: config[baseURL]
     *  ``String``
     *  
     *  GeoServer WFS service endpoint. Required.
     */ 
    baseURL: null,

    /** api: config[baseURL]
     *  ``String``
     *
     *  GeoServer WFS service type layer name. Required.
     */
    typeLayer: null,

    /** api: config[baseURL]
     *  ``String``
     *  
     *  GeoServer WFS service POI layer name. Required.
     */ 
    poiLayer: null,

    /** api: config[baseURL]
     *  ``String``
     *
     *  Layer's text field to search for. Required.
     */
    typeField: null,

    /** api: config[baseURL]
     *  ``String``
     *  
     *  Layer's text field to search for. Required.
     */
    poiField: null,
    
    /** private: property[typeCombo]
     *  ``Ext.form.ComboBox`` Where type field values are displayed.
     */
    typeCombo: null,

    /** private: property[poiCombo]
     *  ``Ext.form.ComboBox`` Where POI field values are displayed.
     */
    poiCombo: null,
    
    /** private: method[initComponent]
     * 
     *  Instantiates datastore and combo.
     */
    initComponent: function() {
    
        this.typeDataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {
                // WFS request static parameters
                service: "WFS",
                version: "1.1",
                outputFormat: "json",
                request: "getFeature",
                typeName: this.typeLayer
            },
            remoteSort: false,
/* RESULTS ARE ALREADY ORDERED FROM THE VIEW
            sortInfo: { // This sort is case sensitive
                field: 'name',
                direction: 'ASC' 
            },
*/
            reader: new Ext.data.JsonReader({
                root: 'features'
            }, [
                {name: 'id', mapping: 'id'},
                {name: 'name', mapping: 'properties.'+this.typeField}
            ])
        });

        this.poiDataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {
                // WFS request static parameters
                service: "WFS",
                version: "1.1",
                outputFormat: "json",
                request: "getFeature",
                typeName: this.poiLayer
            },
            remoteSort: false,
            sortInfo: { // This sort is case sensitive
                field: 'name',
                direction: 'ASC'
            },
            reader: new Ext.data.JsonReader({
                root: 'features'
            }, [
                {name: 'id', mapping: 'id'},
                {name: 'name', mapping: 'properties.'+this.poiField},
                {name: 'geom', mapping: 'geometry'}
            ])
        });

        this.typeCombo = new Ext.form.ComboBox({
            fieldLabel: (this.texts && this.texts[this.lang] && this.texts[this.lang].type) || this.typeLabelText,
            editable: false,
            anchor: "100%",
            store: this.typeDataStore,
            queryParam: 'cql_filter',
            displayField:'name',
            typeAhead: false,
            loadingText: this.loadingText,
            tpl: new Ext.XTemplate( // Custom rendering result template
                '<tpl for="."><div class="search-item">{name}</div></tpl>'
            ),
            itemSelector: 'div.search-item',
            listeners: {
                select: function(combo, record, index) {
                    this.poiCombo.clearValue();
                },
                beforequery: function(e) {
                    // This would implement minChars -- commented out
                    // if(e.query.length > 1) {
                        // CQL syntax for "text starts with..."
                        //e.query = this.typeField + " ILIKE '" + e.query + "%'";
                        e.query = this.typeField + " ILIKE '" + "%'";
                    //} else {
                    //    return false;
                    //}
                },                
                scope: this
            }
        });

        this.poiCombo = new Ext.form.ComboBox({
            fieldLabel: (this.texts && this.texts[this.lang] && this.texts[this.lang].poi) || this.poiLabelText,
            editable: false,
            anchor: "100%",
            store: this.poiDataStore,
            queryParam: 'cql_filter',
            displayField:'name',
            typeAhead: false,
            loadingText: this.loadingText,
            tpl: new Ext.XTemplate( // Custom rendering result template
                '<tpl for="."><div class="search-item">{name}</div></tpl>'
            ),
            itemSelector: 'div.search-item',
            listeners: {
                select: function(combo, record, index) {
                    var p = new OpenLayers.Format.GeoJSON().read(record.get("geom"), "Geometry").getCentroid();
                    this.showLocation(p.x, p.y, record.get("name"));
                },
                beforequery: function(e) {
                    // This would implement minChars -- commented out
                    // if(e.query.length > 1) {
                        //escape single quotes
                        var value = this.typeCombo.getValue().replace("'", "''");
                        // CQL syntax
                        e.query = this.typeField + "='" + value + "'"; 
                    //} else {
                    //    return false;
                    //}
                },
                scope: this
            }
        });
        
        this.items = [this.typeCombo, this.poiCombo];
        
        gdxp.DoubleFieldSearch.superclass.initComponent.apply(this, arguments);
        
    }
});

Ext.reg('gdxp_doublefieldsearch', gdxp.DoubleFieldSearch);
