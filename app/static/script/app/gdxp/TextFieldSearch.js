/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/**
 * @requires gdxp/Search.js
 */
 
Ext.namespace("gdxp");

/** api: (define)
 *  module = gdxp
 *  class = TextFieldSearch
 *  extends = gdxp.Search
 */

/** api: constructor
 *  .. class:: TextFieldSearch()
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
gdxp.TextFieldSearch = Ext.extend(gdxp.Search, {
    
    /** api: config[baseURL]
     *  ``String``
     *  
     *  GeoServer WFS service endpoint. Required.
     */ 
    baseURL: null,
    
    /** api: config[baseURL]
     *  ``String``
     *  
     *  GeoServer WFS service layer name. Required.
     */ 
    layer: null,

    /** api: config[baseURL]
     *  ``String``
     *  
     *  Layer's text field to search for. Required.
     */
    field: null,
    
    /** private: property[streetDataStore]
     *  ``Ext.data.Store`` Where field values are loaded.
     */    
    dataStore: null,
    
    /** private: property[streetCombo]
     *  ``Ext.form.ComboBox`` Where field values are displayed.
     */
    combo: null,
    
    /** private: method[initComponent]
     * 
     *  Instantiates datastore and combo.
     */
    initComponent: function() {
    
        this.dataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {
                // WFS request static parameters
                service: "WFS",
                version: "1.1",
                outputFormat: "json",
                request: "getFeature",
                typeName: this.layer
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
                {name: 'name', mapping: 'properties.'+this.field},
                {name: 'geom', mapping: 'geometry'}
            ])
        });

        this.combo = new Ext.form.ComboBox({
            fieldLabel: this.labelText,
            anchor: "100%",
            store: this.dataStore,
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
                        // CQL syntax for "text starts with..."
                        e.query = this.field + " LIKE '" + e.query + "%'";
                    //} else {
                    //    return false;
                    //}
                },                
                scope: this
            }
        });
        
        this.items = [this.combo];
        
        gdxp.TextFieldSearch.superclass.initComponent.apply(this, arguments);
        
    }
});

Ext.reg('gdxp_textfieldsearch', gdxp.TextFieldSearch);
