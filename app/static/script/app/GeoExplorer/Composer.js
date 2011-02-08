/**
 * Copyright (c) 2009-2010 The Open Planning Project
 *
 * @requires GeoExplorer.js
 */

/**
 * api: (define)
 * module = GeoExplorer
 * class = GeoExplorer.Composer(config)
 * extends = GeoExplorer
 */

/** api: constructor
 *  .. class:: GeoExplorer.Composer(config)
 *
 *      Create a GeoExplorer application intended for full-screen display.
 */
GeoExplorer.Composer = Ext.extend(GeoExplorer, {

    // Begin i18n.
    publishMapText: "Publish Map",
    saveMapText: "Save Map",
    mapSizeText: "Map Size",
    miniText: "Mini",
    smallText: "Small",
    largeText: "Large",
    heightText: "Height",
    widthText: "Width",
    exportMapText: "Export Map",
    embedText: "Your map is ready to be published to the web! Simply copy the following HTML to embed the map in your website:",
    loadMapText: "Load Map",
    editMapPropertiesText: "Edit map properties",
    abstractText: "Abstract",
    availableMapsText: "Available Maps",
    deleteMapText: "Delete Map",
    loadText: "Load",
    saveText: "Save",
    cancelText: "Cancel",
    closeText: "Close",
    overviewMapText: "Map Overview",
    // End i18n.

    /**
     * api: method[createTools]
     * Create the toolbar configuration for the main view.
     */
    createTools: function() {
        var tools = GeoExplorer.Composer.superclass.createTools.apply(this, arguments);

        var aboutButton = new Ext.Button({
            text: this.appInfoText,
            iconCls: "icon-geoexplorer",
            handler: this.displayAppInfo,
            scope: this
        });

        tools.unshift("-");
        tools.unshift(new Ext.Button({
            tooltip: this.publishMapText,
            handler: function() {
                this.editMapDescription(this.showEmbedWindow);
            },
            scope: this,
            iconCls: 'icon-export'
        }));
        tools.unshift(new Ext.Button({
            tooltip: this.saveMapText,
            handler: function() {
                this.editMapDescription(this.showUrl);
            },
            scope: this,
            iconCls: "icon-save"
        }));
        tools.unshift(new Ext.Button({
            tooltip: this.loadMapText,
            handler: function() {
                this.loadMapWindow();
            },
            scope: this,
            iconCls: 'icon-load'
        }));
        tools.unshift("-");
        tools.unshift(aboutButton);
        return tools;
    },

    /** private: method[showEmbedWindow]
     */
    showEmbedWindow: function() {

        // TODO: Get rid of viewer.html
        var obj = OpenLayers.Util.createUrlObject("viewer.html");
        var port = (obj.port === "80") ? "" : ":" + obj.port;
        var url = obj.protocol + "//" + obj.host + port + obj.pathname + "#maps/" + this.id;

        var snippetArea = new Ext.form.TextArea({
            height: 70,
            selectOnFocus: true,
            readOnly: true
        });
 
        var updateSnippet = function() {
            snippetArea.setValue(
                '<iframe height="' + heightField.getValue() +
                ' " width="' + widthField.getValue() + '" src="' + url + '"> </iframe>'
            );
        };

        var heightField = new Ext.form.NumberField({
            width: 50,
            value: 400,
            listeners: {change: updateSnippet}
        });
        var widthField = new Ext.form.NumberField({
            width: 50,
            value: 600,
            listeners: {change: updateSnippet}
        });        

        var adjustments = new Ext.Container({
            layout: "column",
            defaults: {
                border: false,
                xtype: "box"
            },
            items: [
                {autoEl: {cls: "gx-field-label", html: this.mapSizeText}},
                new Ext.form.ComboBox({
                    editable: false,
                    width: 70,
                    store: new Ext.data.SimpleStore({
                        fields: ["name", "height", "width"],
                        data: [
                            [this.miniText, 100, 100],
                            [this.smallText, 200, 300],
                            [this.largeText, 400, 600]
                        ]
                    }),
                    triggerAction: 'all',
                    displayField: 'name',
                    value: this.largeText,
                    mode: 'local',
                    listeners: {
                        select: function(combo, record, index) {
                            widthField.setValue(record.get("width"));
                            heightField.setValue(record.get("height"));
                            updateSnippet();
                        }
                    }
                }),
                {autoEl: {cls: "gx-field-label", html: this.heightText}},
                heightField,
                {autoEl: {cls: "gx-field-label", html: this.widthText}},
                widthField
            ]
        });

        var win = new Ext.Window({
            height: 205,
            width: 350,
            modal: true,
            title: this.exportMapText,
            layout: "fit",
            items: [{
                xtype: "container",
                border: false,
                defaults: {
                    border: false,
                    cls: "gx-export-section",
                    xtype: "container",
                    layout: "fit"
                },
                items: [{
                    xtype: "box",
                    autoEl: {
                        tag: "p",
                        html: this.embedText
                    }
                }, {
                    items: [snippetArea]
                }, {
                    items: [adjustments]
                }]
            }],
            listeners: {afterrender: updateSnippet}
        });
        win.show();
    },
    
    loadMapWindow: function() {

        var loadMap = function() {
            var record = Ext.getCmp('mapGridPanel').getSelectionModel().getSelected();
            if (!record) {
                return false;
            }
            window.location.hash = "#maps/" + record.get("id");
            app.loadConfig(record.get("config"));
            Ext.getCmp('mapGridWindow').close();
        };

        var removeMap = function() {
            var grid = Ext.getCmp('mapGridPanel');
            var rec = grid.getSelectionModel().getSelected();
            if (!rec) {
                return false;
            }
            grid.store.remove(rec);
            mapStore.reload();
        };

        var mapStore = new Ext.data.JsonStore({
            autoDestroy: true,
            autoLoad: true,
            restful: true,
            url: 'maps',
            storeId: 'maps',
            root: 'maps',
            idProperty: 'id',
            fields: [
                'id',
                {name:'title', mapping: 'config.about.title'},
                {name:'abstract', mapping: 'config.about.abstract'},
                'config'
            ],
            writer: new Ext.data.JsonWriter({
                encode: true, writeAllFields: true
            })
        });

        var expander = new Ext.grid.RowExpander({
            tpl: new Ext.Template(this.abstractTemplateText)
        });
        
        var mapGridPanel = new Ext.grid.GridPanel({
            id: "mapGridPanel",
            layout: "fit",
            region: "center",
            autoScroll: true,
            autoExpandColumn: "title",
            store: mapStore,
            plugins: [expander],
            colModel: new Ext.grid.ColumnModel([
                expander,
                {id: "title", header: this.titleText, dataIndex: "title", sortable: true},
                {header: this.idText, dataIndex: "id", width: 40, sortable: true}
            ]),
            listeners: {
                rowdblclick: loadMap,
                scope: this
            }
        });

        var mapGridWindow = new Ext.Window({
            title: this.availableMapsText,
            id: "mapGridWindow",
            layout: "border",
            height: 300,
            width: 450,
            modal: true,
            items: [mapGridPanel],
            bbar: [
                new Ext.Button({
                    text: this.deleteMapText,
                    iconCls: "icon-removemap",
                    handler: removeMap,
                    scope : this
                }),
                "->",
                new Ext.Button({
                    text: this.loadMapText,
                    iconCls: "icon-loadmap",
                    handler: loadMap,
                    scope : this
                }),
                new Ext.Button({
                    text: this.closeText,
                    handler: function() {
                        Ext.getCmp('mapGridWindow').close();
                    }
                })
            ]
        }).show();
    },

    // Edit map properties before saving
    editMapDescription: function(callback, scope) {

        var form = new Ext.form.FormPanel({
            labelAlign: 'top',
            layout: 'form',
            bodyStyle: "padding: 5px;border:0;background-color:transparent;",
            defaults: {
                anchor: "100%",
                xtype:"textarea"
            },
            items: [{
                name: "title",
                xtype: "textfield",
                fieldLabel: this.titleText,
                value: this.about.title
            },{
                name: "contact",
                fieldLabel: this.contactText,
                value: this.about.contact,
                height: 40
            },{
                name: "abstract",
                fieldLabel: this.abstractText,
                value: this.about["abstract"],
                anchor: "100% -113"
            }]
        });

        new Ext.Window({
            width: 360, height: 280,
            title: this.editMapPropertiesText,
            id: "save-about",
            layout: 'fit',
            items: form,
            modal: true,
            buttons: [{
                text: this.saveText,
                handler: function(){
                    var f = form.getForm();
                    this.about.title = f.findField('title').getValue();
                    this.about["abstract"] = f.findField('abstract').getValue();
                    this.about.contact = f.findField('contact').getValue();
                    GeoExplorer.Composer.superclass.save.apply(this, [callback, scope]);
                    Ext.getCmp('save-about').close();
                },
                scope: this
            },{
                text: this.cancelText,
                handler: function(btn){
                    Ext.getCmp('save-about').close();
                }
            }]
        }).show();
    },
    
    initPortal: function() {
        GeoExplorer.Composer.superclass.initPortal.apply(this);
       
        this.on("ready", function(){
            var mapOverview = this.createMapOverview();
            this.mapPanel.add(mapOverview);
            this.mapPanel.doLayout();
        }, this);
    },
    
    createMapOverview: function(config) {
    
        var overviewMap = new Ext.BoxComponent({
            autoEl: {
                tag: "div",
                cls: "olControlOverviewMapElement"
            }
        });

        overviewMap.on('render', function(){
            var overviewControl = new OpenLayers.Control.OverviewMap({
                size: new OpenLayers.Size(240, 135),
                div: overviewMap.getEl().dom,
                minRatio: 32, maxRatio: 64,
                mapOptions: {
                    projection: "EPSG:23031",
                    units: "m",
                    resolutions: [1100,550,275,100,50,25,10,5,2,1,0.5,0.25],
                    maxExtent: new OpenLayers.Bounds(258000, 4485000, 536000, 4752000)
                },
                layers: [
                    new OpenLayers.Layer.WMS(
                        "Topogràfic", "http://sagitari.icc.cat/tilecache/tilecache.py",
                        {layers: 'topo', format:"image/jpeg", exceptions:"application/vnd.ogc.se_xml"},
                        {buffer:0, transitionEffect:'resize'}
                    )
                ]
            });
            this.mapPanel.map.addControl(overviewControl);
            overviewControl.update();
        }, this);
                       
        var mapOverviewPanel = new Ext.Panel({
            xtype: 'panel',
            title: this.overviewMapText,
            cls: 'overlay-overviewMap',
            collapsible: true,
            items: [overviewMap]
        });
        
        return mapOverviewPanel;
    },
    
    applyConfig: function(config) {
        // On load map, force resolutions defined in map config, if any
        GeoExplorer.Composer.superclass.applyConfig.apply(this, [config]);
        if (config.map.resolutions) {
            this.mapPanel.map.resolutions = config.map.resolutions;
        }
    }

});
