/**
 * Copyright (c) 2011 Geodata Sistemas
 */

/**
 * @requires gdxp/Search.js
 */

Ext.namespace("gdxp");

/** api: (define)
 *  module = gdxp
 *  class = UTMSearch
 *  extends = gdxp.Search
 */


/** api: constructor
 *  .. class:: UTMSearch()
 *
 *     Not a search engine at all. Just moves map to the specified point.
 *
 */
gdxp.UTMSearch = Ext.extend(gdxp.Search, {
    
    /* i18n */
    titleText: "UTM",
    labelText: "Type coordinate pair and press ENTER (example: X '325017', Y '4720317')",
    /* ~i18n */

    /** private: property[label]
     *  ``Ext.form.Label`` A brief description.
     */
    label: null,
    
    /** private: property[inputX]
     *  ``Ext.form.TextField`` The X coordinate.
     */
    inputX: null,
    
    /** private: property[inputX]
     *  ``Ext.form.TextField`` The Y coordinate.
     */    
    inputY: null,

    /** private: method[initComponent]
     * 
     *  Instantiates inputs.
     */    
    initComponent: function() {
        
        this.label = new Ext.form.Label({
            fieldLabel: this.labelText,
            //autoWidth: true,
            width: "100%"
        });
        
        this.inputX = new Ext.form.TextField({
            fieldLabel: "X (Eastings)",
            width: 100,
            listeners: {
                specialkey: this.onKeyPress,
                scope: this
            }
        });
        
        this.inputY = new Ext.form.TextField({
            fieldLabel: "Y (Northings)",
            width: 100,
            listeners: {
                specialkey: this.onKeyPress,
                scope: this
            }
        });
                
        this.items = [this.label, this.inputX, this.inputY];

        gdxp.UTMSearch.superclass.initComponent.apply(this, arguments);
    },

    /** private: method[onKeyPress]
     * 
     *  Captures the ENTER key to trigger showLocation.
     */     
    onKeyPress: function(field, e) {
        if (e.getKey() == e.ENTER) {
            // TODO: Validate coordinate values; restrict to a given BBOX.
            var x = this.inputX.getValue();
            var y = this.inputY.getValue();
            var text = "X: '"+x+"', Y:'"+y+"'";
            this.showLocation(x, y, text);
        }
    }
    
});

Ext.reg('gdxp_utmsearch', gdxp.UTMSearch);
