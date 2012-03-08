/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = GeoExplorer
 *  class = Embed
 *  base_link = GeoExplorer
 */
Ext.namespace("GeoExplorer");

/** api: constructor
 *  ..class:: GeoExplorer.Viewer(config)
 *
 *  Create a GeoExplorer application suitable for embedding in larger pages.
 */
GeoExplorer.Viewer = Ext.extend(GeoExplorer, {
    
    applyConfig: function(config) {
        var allTools = config.viewerTools || this.viewerTools;
        var tools = [];
        for (var i=0, len=allTools.length; i<len; i++) {
            var tool = allTools[i];
            if (tool.checked === true) {
                tools.push({ptype: tool.ptype, toggleGroup: tool.toggleGroup, actionTarget: tool.actionTarget});
            }
        }
        config.tools = tools;
        GeoExplorer.Viewer.superclass.applyConfig.call(this, config);
    },

    /** private: method[initPortal]
     * Create the various parts that compose the layout.
     */
    initPortal: function() {

        // TODO: make a proper component out of this
        var mapOverlay = this.createMapOverlay();
        this.mapPanel.add(mapOverlay);

        this.toolbar = new Ext.Toolbar({
            disabled: true,
            id: "paneltbar",
            items: this.createTools()
        });
        this.on("ready", function() {this.toolbar.enable();}, this);

        this.mapPanelContainer = new Ext.Panel({
            layout: "card",
            region: "center",
            defaults: {
                border: false
            },
            items: [
                this.mapPanel//,
                /*
                new gxp.GoogleEarthPanel({
                    mapPanel: this.mapPanel,
                    listeners: {
                        beforeadd: function(record) {
                            return record.get("group") !== "background";
                        }
                    }
                }) */
            ],
            activeItem: 0
        });

        this.portalItems = [{
            region: "center",
            layout: "border",
            tbar: this.toolbar,
            items: [
                this.mapPanelContainer
            ]
        }];
        
        GeoExplorer.superclass.initPortal.apply(this, arguments);        

    },

    /**
     * api: method[createTools]
     * Create the various parts that compose the layout.
     */
    createTools: function() {
        var tools = GeoExplorer.Viewer.superclass.createTools.apply(this, arguments);

        var layerChooser = new Ext.Button({
            tooltip: 'Layer Switcher',
            iconCls: 'icon-layer-switcher',
            menu: new gxp.menu.LayerMenu({
                layers: this.mapPanel.layers
            })
        });

        tools.unshift("-");
        tools.unshift(layerChooser);

        var aboutButton = new Ext.Button({
            tooltip: this.aboutText,
            iconCls: "icon-about",
            handler: this.displayAppInfo,
            scope: this
        });

        tools.push("->");
        tools.push(aboutButton);

        return tools;
    },

    /**
     * api: method[print]
     * Create the various parts that compose the layout.
     */
    createTextWindow: function(evt, target) {
        // event fires two times, so we skip creating an extra window
        // TODO: rewrite this
        if(Ext.get("gdxp_extwin")) {
            evt.preventDefault( );
            return;
        }
        var toolbar = new Ext.Toolbar({
            defaults:{
                iconAlign: 'top'
            },
            items: [
                new Ext.Toolbar.Fill(), // <--- we fill the empty space
                {text:'Imprimir',iconCls:'gxp-icon-print',handler: function(){
                                                            var printwin = window.open(target.href);
                                                            //only open the window, dont show dialog
                                                            //printwin.print();
                                                        }}]
        });
        var gdxp_win = new Ext.Window({modal: true,
                                layout: "fit",
                                id: "gdxp_extwin",
                                autoScroll: true,
                                width: 800,
                                height: 500,
                                bbar: toolbar,
                                autoLoad : {url :target.href,scripts: true } });
        //alert(target.href);
        gdxp_win.show();
        evt.preventDefault( );
    }
});
