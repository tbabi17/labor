/**
 * Combo үүсгэх статик функцууд
 */

generateNumberField =  function(name, value, w, mx, mn) {	
	var numberfield = Ext.create('Ext.form.NumberField', {
        xtype            : 'numberfield_'+name,
        margins			 : '0 0 0 5', 
        allowBlank       : false,          
        width			 : w,
        value			 : value,
        maxValue		 : mx,
        minValue		 : mn,
        decimalPrecision : 1          
    });    
	
	return numberfield;
},

getDefaultValue=function(combo) {
	if (combo == 'sv_list')
		return logged;
	if (combo == 'section')
		return section;

	return '';
}

generateLocalCombo = function(queryName, modelName, value, display, caption, w) {
	var combo = Ext.create('Ext.form.ComboBox', {
		xtype: 'combo',
        store: Ext.sfa.stores[modelName],
        displayField: display,
        valueField: value,
        typeAhead: true,
		editable: false,
        queryMode: 'local',
        mode: 'local',
		value: getDefaultValue(queryName),
        hideLabel: true,
        triggerAction: 'all',
        margins: '0 0 0 5', 
        emptyText: caption,
        selectOnFocus: true,
        width: w	                 
    });
	
	return combo;
}

generateLocalComboWithCaption = function(queryName, modelName, value, display, caption, w) {
	var combo = Ext.create('Ext.form.ComboBox', {
		xtype: 'combo',
        store: Ext.sfa.stores[modelName],
        displayField: display,
        fieldLabel: caption,
        valueField: value,
        typeAhead: true,
		editable: false,
        queryMode: 'local',
        mode: 'local',        
        triggerAction: 'all',
        margins: '0 0 0 5', 
        emptyText: caption,
        selectOnFocus: true,
        width: w	                 
    });
	
	return combo;
}

generateRemoteCombo = function(queryName, modelName, value, display, caption) {
	var combo = Ext.create('Ext.form.ComboBox', {			
        store: Ext.create('Ext.data.JsonStore', {
			model: modelName,	     	   
			mode: 'remote',
			autoLoad: true,
	        proxy: {
				type: 'ajax',
				url: 'httpGW?xml='+_donate(queryName, 'SELECT', ' ', ' ', ' '),
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }	            
			}
	    }),
	    xtype: 'combo',
        displayField: display,
        valueField: value,
        typeAhead: true,        
        queryMode: 'remote',
        mode: 'remote',
		editable: false,
        triggerAction: 'all',
        margins: '0 0 0 5', 
        emptyText: caption,
        selectOnFocus: true,
        width: 160	                 
    });
	
	return combo;
}

generateRemoteComboWithFilter= function(queryName, modelName, value, display, caption, where) {    	
	var combo = Ext.create('Ext.form.ComboBox', {			
        store: Ext.create('Ext.data.JsonStore', {
			model: modelName,	     	   
			mode: 'remote',
			autoLoad: true,
	        proxy: {
				type: 'ajax',
				url: 'httpGW?xml='+_donate(queryName, 'SELECT', ' ', ' ', ' ', where),
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }	            
			}
	    }),
	    xtype: 'combobox',
        displayField: display,
        valueField: value,
		editable: false,
        typeAhead: true,        
        queryMode: 'remote',
        mode: 'remote',
        triggerAction: 'all',
        autoSelect: true,
        margins: '0 0 0 5', 
        emptyText: caption,
        selectOnFocus: true,
        width: 160	                 
    });
	
	return combo;
}