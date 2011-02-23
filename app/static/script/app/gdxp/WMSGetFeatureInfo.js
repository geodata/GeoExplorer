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
    }
    
});

Ext.preg(gdxp.WMSGetFeatureInfo.prototype.ptype, gdxp.WMSGetFeatureInfo);
