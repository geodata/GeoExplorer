/**
 * Copyright (c) 2011 Geodata Sistemas
 */
Ext.namespace("gdxp");

gdxp.WMSGetFeatureInfo = Ext.extend(gxp.plugins.WMSGetFeatureInfo, {
    
    /** api: ptype = gdxp_wmsgetfeatureinfo */
    ptype: "gdxp_wmsgetfeatureinfo",
    
    displayPopup: function(evt, title, text) {
        var popup;
        var popupKey = evt.xy.x + "." + evt.xy.y;

        // patch for catastro layer
        if(evt.object.url == "http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx" 
            || evt.object.url == "http://www1.sedecatastro.gob.es/Cartografia/WMS/ServidorWMS.aspx")
            text = text.replace("<a", "<a target='_blank'");

        if (!(popupKey in this.popupCache)) {
            popup = this.addOutput({
                xtype: "gx_popup",
                title: this.popupTitle,
                layout: "accordion",
                location: evt.xy,
                map: this.target.mapPanel,
                autoScroll: true, // !!
                fill: false, // !!
                width: 350,
                height: 350,
                listeners: {
                    close: (function(key) {
                        return function(panel){
                            delete this.popupCache[key];
                        };
                    })(popupKey),
                    scope: this
                }
            });
            this.popupCache[popupKey] = popup;
        } else {
            popup = this.popupCache[popupKey];
        }

        // extract just the body content
        popup.add({
            title: title,
            html: text,
            autoScroll: true,
            autoWidth: true,
            autoHeight: true, // !!
            collapsible: true
        });
        popup.doLayout();

        if(Ext.get("gdxp_newwindow")) Ext.get("gdxp_newwindow").on("click", GeoExplorer.Viewer.prototype.createTextWindow);
    }
    
});

Ext.preg(gdxp.WMSGetFeatureInfo.prototype.ptype, gdxp.WMSGetFeatureInfo);
