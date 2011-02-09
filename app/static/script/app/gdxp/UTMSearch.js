/**
 * @requires gdxp/Search.js
 */
 
Ext.namespace("gdxp");

gdxp.UTMSearch = Ext.extend(gdxp.Search, {
    /* i18n */
    titleText: "UTM",
    labelText: "Type coordinate pair and press ENTER (example: X '415165', Y '4592355')",
    /* ~i18n */

    inputX: null,
    inputY: null,
    labelAlign: '',
    
    initComponent: function() {
        
        this.inputX = new Ext.form.TextField({
            fieldLabel: "X",
            width: 100,
            listeners: {
                specialkey: this.onKeyPress,
                scope: this
            }
        });
        
        this.inputY = new Ext.form.TextField({
            fieldLabel: "Y",
            width: 100,
            listeners: {
                specialkey: this.onKeyPress,
                scope: this
            }
        });
                
        this.items = [this.inputX, this.inputY];

        gdxp.UTMSearch.superclass.initComponent.apply(this, arguments);
    },
    
    onKeyPress: function(field, e) {
        if (e.getKey() == e.ENTER) {
            this.zoomTo(this.inputX.getValue(), this.inputY.getValue());
        }        
    }
    
});
