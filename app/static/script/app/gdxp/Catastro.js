Ext.namespace("gdxp");

gdxp.Catastro = Ext.extend(Ext.Panel, {
    /* i18n */
    titleText: "Cadastre",
    labelText: "Cadatral Reference",
    loadingText: "Loading...",
    errorText: "Error accessing Cadaste search service",
    /* end i18n */
    
    /* API properties */
    map: null, // mandatory
    zoomToScale: 500,
    baseURL: "http://ovc.catastro.meh.es/Cartografia/WMS/BuscarParcelaGoogle.aspx",
    /* end API properties */
    
    layout: 'form',
    labelAlign: 'top',
    input: null,
    
    initComponent: function() {
        this.title = this.titleText,
        this.projection = new OpenLayers.Projection("EPSG:4326");

        this.input = new Ext.form.TextField({
            fieldLabel: this.labelText,
            anchor: "100%",
            listeners: {
                specialkey: function(field, e){
                    if (e.getKey() == e.ENTER) {
                        this.display.setValue(this.loadingText);
                        this.query(field.getValue());
                    }
                },
                scope: this
            }
        });
        
        this.display = new Ext.form.DisplayField({
            anchor: "100%"
        });
        
        this.items = [this.input, this.display];

        gdxp.Catastro.superclass.initComponent.apply(this, arguments);
    },
    
    query: function(q) {
        Ext.Ajax.request({
            url: this.baseURL,
            params: {
                RefCat: q
            },
            method: "GET",
            success: function(response) {
                try {
                    var name = Ext.DomQuery.selectValue("/kml/Document/Placemark/name",  response.responseXML);
                    this.display.setValue(name);
                } catch (e) {
                    this.display.setValue(this.errorText);
                }
                try{
                    var coords = Ext.DomQuery.selectValue("/kml/Document/Placemark/Point/coordinates",  response.responseXML).split(",");
                    this.zoomTo(coords[0], coords[1]);                    

                    var description = Ext.DomQuery.selectValue("/kml/Document/Placemark/description",  response.responseXML);
                    var link = new RegExp('<[Aa].*?href\s*=\s*["\']([^"\']+)[^>]*>.*?<\/[Aa]>').exec(description)[1];
                    this.display.setValue('<a href="'+link+'" target="_blank">' + this.display.getValue() + '</a>');
                } catch (e) {
                    // Just fine: No coords & no link
                }
            },
            failure: function() {
                this.display.setValue(this.errorText);
            },
            scope: this
        });
    },
    
    zoomTo: function(x, y) {
        var point = new OpenLayers.LonLat(x, y);
        point.transform(this.projection, this.map.getProjectionObject());
        this.map.zoomToScale(this.zoomToScale);
        this.map.panTo(point);        
    }
});
