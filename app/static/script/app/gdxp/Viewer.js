/**
 * Copyright (c) 2011 Geodata Sistemas
 *
 * @requires GeoExplorer.js
 */

/** api: (define)
 *  module = gdxp
 *  class = Embed
 *  base_link = GeoExplorer
 */
Ext.namespace("GeoExplorer");

/** api: constructor
 *  ..class:: gdxp.Viewer(config)
 *
 *  Create a viewer similar to GeoExplorer.Composer but in 'read-only mode'.
 */
gdxp.Viewer = Ext.extend(GeoExplorer, {

    constructor: function(config) {
        this.mapItems = [{
            xtype: "gx_zoomslider",
            vertical: true,
            height: 100,
            plugins: new GeoExt.ZoomSliderTip({
                template: this.zoomSliderText
            })
        }];

        this.overrideTools = [
            {
                ptype: "gxp_layertree",
                outputConfig: {
                    id: "layertree"
                },
                outputTarget: "tree"
            }, {
                ptype: "gxp_legend",
                outputTarget: 'legend',
                outputConfig: {autoScroll: true}
            }, {
                ptype: "gxp_addlayers",
                actionTarget: "tree.tbar",
                upload: false
            }, {
                ptype: "gxp_removelayer",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_layerproperties",
                actionTarget: ["tree.tbar", "layertree.contextMenu"]
            }, {
                ptype: "gxp_zoomtolayerextent",
                actionTarget: {target: "layertree.contextMenu", index: 0}
            }, {
                iconCls: "gxp-icon-zoom-previous",
                ptype: "gxp_navigationhistory",
                actionTarget: {target: "paneltbar", index: 0}
            }, {
                iconCls: "gxp-icon-pan",
                ptype: "gxp_navigation", 
                toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 3}
            }, {
                iconCls: "gxp-icon-getfeatureinfo",
                ptype: "gxp_wmsgetfeatureinfo", 
                toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 4}
            }, {
                ptype: "gxp_measure", 
                toggleGroup: this.toggleGroup,
                actionTarget: {target: "paneltbar", index: 5}
            }, {
                ptype: "gxp_print",
                printService: config.printService,
                actionTarget: {target: "paneltbar", index: 6}
            }
        ]; 

        gdxp.Viewer.superclass.constructor.apply(this, arguments);
    },
    
    // Override config tools, and put our own
    initTools: function() {
        this.initialConfig.tools = this.overrideTools;
        gdxp.Viewer.superclass.initTools.apply(this, arguments);
    },
    
    createTools: function() {
        var tools = gdxp.Viewer.superclass.createTools.apply(this, arguments);

        var aboutButton = new Ext.Button({
            tooltip: this.aboutText,
            iconCls: "icon-about",
            handler: this.displayAppInfo,
            scope: this
        });

        tools.push("->");
        tools.push(aboutButton);

        return tools;
    }
});
