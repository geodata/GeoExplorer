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
    baseURL: "/geoserver/wfs",
    
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
            proxy: new Ext.data.HttpProxy({
                url: this.baseURL,
                method: "GET"
            }),
            baseParams: {
                service: "WFS",
                version: "1.1",
                outputFormat: "json",
                request: "getFeature",
                typeName: this.streetLayer
            },
            reader: new Ext.data.JsonReader({
                root: 'features'
            }, [
                {name: 'sortname', mapping: 'properties.name'},
                {name: 'id', mapping: 'properties.codi'},
                {name: 'name', mapping: 'properties.etiqueta'}
            ]),
            sortInfo: {
                field: 'sortname',
                direction: 'ASC'
            },
            remoteSort: false
        });

        this.streetCombo = new Ext.form.ComboBox({
            fieldLabel: this.streetLabelText,
            anchor: "100%",
            store: this.streetDataStore,
            minChars: 3,
            queryParam: 'cql_filter',
            valueField:'id',
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
                beforequery: function(e) {
                    e.query = "etiqueta" + " LIKE '%" + e.query + "%'"; //CQL_FILTEr=etiqueta LIKE '%25major%25'
                }, 
                scope: this
            }
        });
        
        this.portalDataStore = new Ext.data.Store({
            proxy: new Ext.data.HttpProxy({
                url: this.baseURL,
                method: "GET"
            }),
            baseParams: {
                service: "WFS",
                version: "1.1",
                outputFormat: "json",
                request: "getFeature",
                typeName: this.portalLayer
            },
            reader: new Ext.data.JsonReader({
                root: 'features'
            }, [
                {name: 'number', mapping: 'properties.numero'},
                {name: 'x', mapping: 'properties.utm_x'},
                {name: 'y', mapping: 'properties.utm_y'}
            ]),
            sortInfo: {
                field: 'number',
                direction: 'ASC'
            },
            remoteSort: false
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
                    var text = this.streetCombo.getRawValue() + " " + record.get("number")
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
            params: {'cql_filter': "codi" + "='" + this.streetCombo.getValue() + "'"}
        });
    }
});

Ext.reg('gdxp_streetsearch', gdxp.StreetSearch);
