/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/** api: (define)
 *  module = gdxp
 *  class = ICCOverviewMap
 *  base_link = `Ext.Panel <http://dev.sencha.com/deploy/dev/docs/?class=Ext.Panel>`_
 */

Ext.namespace("gdxp");

/** api: constructor
 *  .. class:: ICCOverviewMap()
 *    
 *      Specify at least a 'map' option with an ``OpenLayers.map``
 *      to render results.
 */
gdxp.ICCOverviewMap = Ext.extend(Ext.Panel, {
    
    titleText: "Overview Map",
    
    map: null,
    
    box: null,
    control: null,
    collapsible: true,
    cls: 'overlay-overviewMap',
    width: 246,
    height: 166,

    initComponent: function() {
        this.title = this.titleText;
        
        this.box = new Ext.BoxComponent({
            layout: 'fit',
            autoEl: {
                tag: "div",
                cls: "olControlOverviewMapElement"
            },
            listeners: {
                'render': function() {
                    this.control = new OpenLayers.Control.OverviewMap({
                        size: new OpenLayers.Size(240, 135),
                        div: this.box.getEl().dom,
                        minRatio: 32,
                        maxRatio: 64,
                        mapOptions: {
                            projection: "EPSG:23031",
                            units: "m",
                            resolutions: [1100,550,275,100,50,25,10,5,2,1,0.5,0.25],
                            maxExtent: new OpenLayers.Bounds(258000, 4485000, 536000, 4752000)
                        },
                        layers: [
                            new OpenLayers.Layer.WMS(
                                "Topogràfic", "http://mapcache.icc.cat/map/bases/service",
                                {layers: 'topo', format:"image/jpeg", exceptions:"application/vnd.ogc.se_xml"},
                                {buffer:0, transitionEffect:'resize'}
                            )
                        ]
                    });
                    this.map.addControl(this.control);
                    //this.control.update();
                },
                scope: this
            }
        });
                       
        this.items = [this.box];

        gdxp.ICCOverviewMap.superclass.initComponent.apply(this, arguments);
    }
});

Ext.reg('gdxp_iccoverviewmap', gdxp.ICCOverviewMap);