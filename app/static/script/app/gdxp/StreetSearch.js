Ext.namespace("gdxp");

gdxp.StreetSearch = Ext.extend(Ext.Panel, {
    /* i18n */
    titleText: "Search",
    streetText: "Street",
    portalText: "Portal",
    loadingText: "Loading...",
    /* end i18n */
    
    /* API properties */
    map: null, // mandatory
    projection: null, // defaults to EPSG:23031
    zoomToScale: 500,
    baseURL: "http://oslo.geodata.es/geosearch/castellbisbal",
    /* end API properties */
    
    layout: 'form',
    labelAlign: 'top',
    
    streetDataStore: null,
    streetCombo: null,
    portalDataStore: null,
    portalCombo: null,
    
    initComponent: function() {
        this.title = this.titleText,
        
        this.projection = (this.projection || new OpenLayers.Projection("EPSG:23031"));
    
        this.streetDataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {
                op: "getStreets"
            },
            reader: new Ext.data.JsonReader({
                root: '',
            }, [
                {name: 'id', mapping: 'id'},
                {name: 'name', mapping: 'name'}
            ])
        });

        this.streetCombo = new Ext.form.ComboBox({
            fieldLabel: this.streetText,
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
            fieldLabel:     this.portalText,
            displayField:   'number',
            valueField:     'number',
            store: this.portalDataStore,
            listeners: {
                select: function(combo, record, index) {
                    this.zoomTo(record.data.x, record.data.y);
                },
                scope: this
            }
        });
        
        this.items = [this.streetCombo, this.portalCombo];

        gdxp.StreetSearch.superclass.initComponent.apply(this, arguments);
        
    },
    
    loadPortals: function(streetId) {
        this.portalDataStore.reload({
            params: {
                street: streetId
            }
        });
    },
    
    zoomTo: function(x, y) {
        var point = new OpenLayers.LonLat(x, y);
        point.transform(this.projection, this.map.getProjectionObject());
        this.map.zoomToScale(this.zoomToScale);
        this.map.panTo(point);        
    }
});
