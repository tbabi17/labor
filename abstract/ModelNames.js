/**
 * Store Моделийн жагсаалт
 * OSS 3.6
 * 2013-01-02
 */

Ext.regModel('code_model', { 
    fields: [
        {name: 'code', type: 'string'}	                 
    ]
});

Ext.regModel('set_model', { 
    fields: [
        {name: 'code', type: 'string'},	                 
        {name: 'count', type: 'int'}	                 
    ]
});

Ext.regModel('code_name_model', { 
    fields: [
        {name: 'code', type: 'string'},
        {name: 'name', type: 'string'},
        {name: 'parentID', type: 'int'}
    ]
});

Ext.regModel('user_stat_model', { 
    fields: [
        {name: 'data', type: 'string'},         
		{name: 'count', type: 'string'},
		{name: 'detail', type: 'string'} 
    ]
});

Ext.regModel('user_stat_model_1', { 
    fields: [
        {name: 'productCode', type: 'string'},         
		{name: 'rquantity', type: 'int'},
		{name: 'quantity', type: 'int'}, 
		{name: 'ramount', type: 'int'}, 
		{name: 'amount', type: 'int'}, 
		{name: 'total', type: 'int'}
    ]
});

Ext.regModel('user_stat_model_2', { 
    fields: [
         {name: 'day', type: 'string'},
		 {name: 'entered', type: 'int'},
		 {name: 'saled', type: 'int'},             
		 {name: 'ramount', type: 'int'},
		 {name: 'amount', type: 'int'},
		 {name: 'total', type: 'int'}
    ]
});

Ext.regModel('type_model', { 
    fields: [
        {name: 'type', type: 'int'},
        {name: 'descr', type: 'string'}
    ]
});

Ext.regModel('graph_model', {        
	idProperty: 'name',
    fields: [
  	         {name: 'name', type: 'string'},           
  	         {name: 'data', type: 'int'}	      	         
  	  	]
});

Ext.regModel('graph_model_plan', {        
	idProperty: 'name',
    fields: [
  	         {name: 'name', type: 'string'},           
  	         {name: 'data1', type: 'float'},	      	         
  	         {name: 'data2', type: 'float'}
  	  	]
});

Ext.regModel('form_data', {	
    fields: [                
        {name: 'name', type: 'string'},
        {name: 'descr', type: 'string'},
        {name: 'fname', type: 'string'},
        {name: 'ordinal', type: 'int'},
        {name: 'type', type: 'int'},
        {name: 'length', type: 'int'}
    ]
});

Ext.regModel('language', {
    idProperty: 'id',
    fields: [        
        {name: 'id', type: 'int'},
        {name: 'mon', type: 'string'},
        {name: 'rus', type: 'string'},
        {name: 'eng', type: 'string'}        
    ]
});

Ext.regModel('settings', {
    idProperty: 'name',
    fields: [        
        {name: 'name', type: 'string'},
        {name: 'value', type: 'string'},
        {name: 'descr', type: 'string'},
        {name: 'info', type: 'string'},
        {name: 'id', type: 'int'}
    ]
});

Ext.regModel('combo', {
    idProperty: 'name',
    fields: [        
        {name: 'name', type: 'string'},
        {name: 'combo1', type: 'string'},
        {name: 'combo2', type: 'string'},
        {name: 'combo3', type: 'string'},
        {name: 'combo4', type: 'string'}
    ]
});

Ext.regModel('constant', {
    idProperty: 'id',
    fields: [        
        {name: 'id', type: 'int'},
        {name: 'free_type', type: 'string'},
        {name: 'ban_type', type: 'string'},
        {name: 'active', type: 'string'},
        {name: 'graph', type: 'string'},
        {name: 'interval', type: 'string'},
        {name: 'isSale', type: 'string'},
        {name: 'price_types', type: 'string'},
        {name: 'promo_types', type: 'string'},
        {name: 'work_types', type: 'string'},
        {name: '_position', type: 'string'},
        {name: 'itemsStatus', type: 'string'},
        {name: 'unit_type', type: 'string'},
        {name: 'promo_direction', type: 'string'}
    ]
});


var form_data_store = Ext.create('Ext.data.JsonStore', {
    model: 'form_data',    
    proxy: {
		type: 'ajax',
		url: 'httpGW',
		method: 'POST',
        reader: {
			type: 'json',
            root:'items',
            totalProperty: 'results'
        },
        actionMethods: {                    
            read: 'POST'                   
        } 	            
	}
});

var languageData = Ext.create('Ext.data.JsonStore', {
    model: 'language',	        
    proxy: {
		type: 'ajax',
		url: 'httpGW',
		method: 'POST',
        reader: {
			type: 'json',
            root:'items',
            totalProperty: 'results'
        },
        actionMethods: {                    
            read: 'POST'                   
        } 	            
	}
});

var constantData = Ext.create('Ext.data.JsonStore', {
    model: 'constant',	        
    proxy: {
		type: 'ajax',
		url: 'httpGW',
		method: 'POST',
        reader: {
			type: 'json',
            root:'items',
            totalProperty: 'results'
        },
        actionMethods: {                    
            read: 'POST'                   
        } 	            
	}
});

var settingsData = Ext.create('Ext.data.JsonStore', {
    model: 'settings',	        
    proxy: {
		type: 'ajax',
		url: 'httpGW',
		method: 'POST',
        reader: {
			type: 'json',
            root:'items',
            totalProperty: 'results'
        },
        actionMethods: {                    
            read: 'POST'                   
        } 	            
	}
});

var comboData = Ext.create('Ext.data.JsonStore', {
    model: 'combo',	        
    proxy: {
		type: 'ajax',
		url: 'httpGW',
		method: 'POST',
        reader: {
			type: 'json',
            root:'items',
            totalProperty: 'results'
        },
        actionMethods: {                    
            read: 'POST'                   
        } 	            
	}
});