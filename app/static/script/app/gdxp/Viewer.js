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
                ptype: "gdxp_wmsgetfeatureinfo", /* INFO GDXP */
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
            }, {
	            ptype: "gxp_featuremanager",
	            id: "featuremanager",
	            paging: false,
	           	autoLoadFeatures: true,
	           	autoZoomPage: true,
	           	format: "JSON",
	           	//maxFeatures: 100,
	           	//pagingType: gxp.plugins.FeatureManager.QUADTREE_PAGING,
	            autoSetLayer: true,
                symbolizer: {
                    pointRadius: 6,
                    fillColor: "#ff0000",
                    strokeWidth: 2,
                    strokeColor: "#ffcc33"
                }
	            /* si es vol una capa predefinida 
	           	layer: {
	           	    source: "local",
	           	    name: "intranet:cad_parce_ajuntament"
	           	}*/
				/*filter: new OpenLayers.Filter.Function({ 
					name  : 'boundary', 
					params: [featureStore.geometryName] 
				}),*/
	            /*listeners: {
	            	'layerchange': function(tool, layer, schema) {
	            		tool.featureStore.featureFilter = new OpenLayers.Filter.Function({
	            			type: 'Function',
							name  : 'boundary', 
							params: [tool.featureStore.geometryName] 
						})
	            	},
	            	'beforequery': function(tool, filter, callback, scope) {
	            		if (!filter && tool.featureStore)  {
							filter = new OpenLayers.Filter.Function({ 
								name  : 'boundary', 
								params: [tool.featureStore.geometryName] 
							})
							this.loadFeatures(tool, filter, callback, scope);
							return false;
						} else  {
							return true;
						}
	            	},
	            	'query': function(tool, store, filter) {
	            		alert(filter);
	            	}
	            }*/
	        }, {
	            ptype: "gxp_featuregrid",
                outputConfig: {
                    id: "featuregrid",
                    fieldVisibility: {
                        "shape_area": true,
                        "adr": true,
                        "rc": true,
                        "reg": true
                    },
                    loadMask: true
                },
                //alwaysDisplayOnMap: true, // removes 'mostra al mapa' button
	            autoCollapse: true,
	            autoExpand: true,
	            autoLoadFeature: true,
	            displayMode: "selected",
	            selectOnMap: true,
	            //showTotalResults: true,
				featureManager: "featuremanager",
				outputTarget: "south"
				/*
				listeners : {
	                'render': function() {
	                    // Do Something, like Adding a ZoomTo Icon
	                }
	            }*/
			
	        }, {
			    ptype: "gxp_zoomtoselectedfeatures",
			    featureManager: "featuremanager",
			    actionTarget: "featuregrid.contextMenu"
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
