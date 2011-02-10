/**
 * @requires gdxp/Search.js
 */
 
Ext.namespace("gdxp");

gdxp.TextFieldSearch = Ext.extend(gdxp.Search, {
    
    /* API */
    baseURL: null,   // mandatory
    layer: null, // mandatory
    field: null, // mandatory
    /* ~API */
    
    dataStore: null,
    combo: null,
    
    initComponent: function() {
    
        this.dataStore = new Ext.data.Store({
            url: this.baseURL,
            baseParams: {
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
                root: 'features',
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
                    var p = new OpenLayers.Format.GeoJSON().read(record.data.geom, "Geometry").getCentroid();
                    this.zoomTo(p.x, p.y);
                },
                beforequery: function(e) {
                    // if(e.query.length > 1) { // minChars: 2
                        e.query = this.field + " LIKE '" + e.query + "%'"; // This is CQL for "text starts with..."
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
