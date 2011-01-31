Ext.namespace("gdxp");

gdxp.UTMSearch = Ext.extend(Ext.Panel, {
    /* i18n */
    titleText: "UTM",
    labelText: "ED50",
    /* end i18n */
    
    /* API properties */
    map: null, // mandatory
    zoomToScale: 500,
    /* end API properties */
    
    layout: 'form',
    input: null,
    
    initComponent: function() {
        this.title = this.titleText,
        this.projection = new OpenLayers.Projection("EPSG:23031");

        this.inputX = new Ext.form.TextField({
            fieldLabel: "X",
            width: 100,
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        this.zoomTo(this.inputX.getValue(), this.inputY.getValue());
                    }
                },
                scope: this
            }
        });
        
        this.inputY = new Ext.form.TextField({
            fieldLabel: "Y",
            width: 100,
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        this.zoomTo(this.inputX.getValue(), this.inputY.getValue());
                    }
                },
                scope: this
            }
        });
                
        this.items = [this.inputX, this.inputY];

        gdxp.UTMSearch.superclass.initComponent.apply(this, arguments);
    },
        
    zoomTo: function(x, y) {
        var point = new OpenLayers.LonLat(x, y);
        point.transform(this.projection, this.map.getProjectionObject());
        this.map.zoomToScale(this.zoomToScale);
        this.map.panTo(point);        
    }
});
