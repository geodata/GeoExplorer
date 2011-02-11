/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/**
 * @requires gdxp/Search.js
 */

Ext.namespace("gdxp");

/** api: (define)
 *  module = gdxp
 *  class = StreetSearch
 *  extends = gdxp.Search
 */


/** api: constructor
 *  .. class:: StreetSearch()
 *
 *      Connects to a GeoSearch web service to retrieve streets
 *      and portals from a municipality.
 *      
 *      Specify at least a 'baseURL' option to the GeoSearch service
 *      endpoint.
 */
gdxp.StreetSearch = Ext.extend(gdxp.Search, {
    
    /* i18n */
   
    /** api: config[titleText]
     *  ``String``
     *  
     *  Panel title text.
     */
    titleText: "Street Directory",
    
    /** api: config[streetLabelText]
     *  ``String``
     *  
     *  Street combo label text.
     */
    streetLabelText: "Street",
    
    /** api: config[streetLabelText]
     *  ``String``
     *  
     *  Portal combo label text.
     */
    portalLabelText: "Number",
    
    /* ~i18n */
    
    
    /** api: config[baseURL]
     *  ``String``
     *  
     *  GeoSearch service base URL. Required.
     */   
    baseURL: null,
    
    /** private: property[streetDataStore]
     *  ``Ext.data.Store`` Where streets are loaded
     */
    streetDataStore: null,
    
    /** private: property[streetCombo]
     *  ``Ext.form.ComboBox`` Where streets are displayed
     */
    streetCombo: null,

    /** private: property[portalDataStore]
     *  ``Ext.data.Store`` Where portals are loaded
     */
    portalDataStore: null,

    /** private: property[portalCombo]
     *  ``Ext.form.ComboBox`` Where portals are displayed
     */
    portalCombo: null,


    /** private: method[initComponent]
     * 
     *  Instantiates datastores and combos.
     */    
    initComponent: function() {
    
        this.streetDataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {op: "getStreets"},
            reader: new Ext.data.JsonReader({
                root: '',
            }, [
                {name: 'id', mapping: 'id'},
                {name: 'name', mapping: 'name'}
            ])
        });

        this.streetCombo = new Ext.form.ComboBox({
            fieldLabel: this.streetLabelText,
            anchor: "100%",
            store: this.streetDataStore,
            minChars: 3,
            queryParam: 'name',
            displayField:'name',
            typeAhead: false,
            loadingText: this.loadingText,
            tpl: new Ext.XTemplate( // Custom rendering result template
                '<tpl for="."><div class="search-item">{name}</div></tpl>'
            ),
            itemSelector: 'div.search-item',
            listeners: {
                select: function(combo, record, index) {
                    this.loadPortals(record.id);
                },
                scope: this
            }
        });
        
        this.portalDataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {
                op: "getNumbers"
            },
            reader: new Ext.data.JsonReader({
                root: 'data',
                successProperty: 'success',
                idProperty: 'value'
            }, [
                {name: 'number', mapping: 'value'},
                {name: 'x', mapping: 'x'},
                {name: 'y', mapping: 'y'}
            ])
        });

        this.portalCombo = new Ext.form.ComboBox({
            width:          50,
            xtype:          'combo',
            mode:           'local',
            triggerAction:  'all',
            forceSelection: true,
            editable:       false,
            fieldLabel:     this.portalLabelText,
            displayField:   'number',
            valueField:     'number',
            store: this.portalDataStore,
            listeners: {
                select: function(combo, record, index) {
                    var text = this.streetCombo.getValue() + " " + record.get("number")
                    this.showLocation(record.get("x"), record.get("y"), text);
                },
                scope: this
            }
        });
        
        this.items = [this.streetCombo, this.portalCombo];

        gdxp.StreetSearch.superclass.initComponent.apply(this, arguments);
        
    },

    /** private: method[loadPortals]
     * 
     *  Called on street select to retrieve its portals.
     */       
    loadPortals: function(streetId) {
        this.portalDataStore.reload({
            params: {street: streetId}
        });
    }
});

Ext.reg('gdxp_streetsearch', gdxp.StreetSearch);
