Ext.Loader.setConfig({enabled: true});
Ext.require([
	 'Ext.grid.*',
	 'Ext.data.*',
	 'Ext.util.*',
	 'Ext.ux.GMapPanel',
	 'Ext.grid.plugin.BufferedRenderer'
]);

/**
 * Store Моделийн жагсаалт
 * OSS 3.6
 * 2013-01-02
 */

Ext.define('Ext.ux.desktop.ShortcutModel', {
    extend: 'Ext.data.Model',
    fields: [
       { name: 'name' },
       { name: 'iconCls' },
       { name: 'module' }
    ]
});

Ext.define('OSS.WallpaperModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'text' },
        { name: 'img' }
    ]
});

Ext.define('OSS.ModuleModel', {
    extend: 'Ext.data.Model',
    fields: [
        { name: 'text' },
        { name: 'name' }
    ]
});


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

/**
 * Стандарт үндсэн функцууд 
 */

var extend = [];

Ext.override(Ext.panel.Panel, {
	reload: function(){ 
		  me = this;
	  me.loader.load({
		scope: this,
		renderer:'html', 
		url:me.loader.url,
		params:me.loader.extraParams
	  });
	},
	setExtraParams: function (params){
	  this.loader.extraParams = this.loader.extraParams || {};
	  for(var x in params) {
		this.loader.extraParams[x] = params[x];
	  }
	 
	},
	setExtraParam: function (name, value){
	  this.loader.extraParams = this.loader.extraParams || {};
	  this.loader.extraParams[name] = value;
	},
	setURL: function(url){
	  this.loader.url = url;
	}
});

Ext.override(Ext.Window, {
    animShow: function(){
        this.afterShow();
    },
    animHide: function(){
       this.el.hide();
       this.afterHide();
    }
});

Ext.override(Ext.data.Store, {
	//here my code
	getLast: function(records, field) {
        var i = 1,
            len = records.length,
            value, last = 0;

        if (len > 0) {
	        last = records[len-1].get(field);
        }

        return last;
    },

	last: function(field, grouped) {
        var me = this;

        if (grouped && me.isGrouped()) {
            return me.aggregate(me.getLast, me, true, [field]);
        } else {
            return me.getLast(me.data.items, field);
        }
    },//end my code

	countif: function(grouped) { //here my code
        var me = this;

        if (grouped && me.groupField) {
        	return me.aggregate(me.getCountIf, me, true);
        } else {
        	return me.getCountIf(me.data.items);
        }
    }, 

	getCountIf: function(records){
        var i = 0, 
            len = records.length, 
            value, countif = 0;
                        
        for (; i < len; ++i) {
            value = records[i].get('sum_all');
            if (value > 0) {
                countif ++ ;
            }
        }
        return countif;
    }, 
	
	avgif: function(field, grouped) { 
        var me = this;

        if (grouped && me.groupField) {
        	return me.aggregate(me.getAvgIf, me, true, [field]);
        } else {
        	return me.getAvgIf(me.data.items, field);
        }
    }, 

	getAvgIf: function(records, field){
        var i = 0, 
            len = records.length, 
            value, avgif = 0, count = 0;
                        
        for (; i < len; ++i) {
            value = records[i].get(field);
            if (value > 0) {
                avgif += value;
				count++;
            }
        }
        return avgif/count;
    } //end my code
});

Ext.override(Ext.grid.feature.AbstractSummary, {
	getSummary: function(store, type, field, group){
        if (type) {
            if (Ext.isFunction(type)) {
                return store.aggregate(type, null, group);
            }

            switch (type) {
				case 'last'://here my code
            		return store.last(field, group);//end my code
				case 'countif'://here my code
            		return store.countif(group);//end my code
				case 'avgif'://here my code
            		return store.avgif(field, group);//end my code
                case 'count':
                    return store.count(group);
                case 'min':
                    return store.min(field, group);
                case 'max':
                    return store.max(field, group);
                case 'sum':
                    return store.sum(field, group);
                case 'average':
                    return store.average(field, group);
                default:
                    return group ? {} : '';
                    
            }
        }
    }
});

Ext.override(Ext.grid.RowEditor, {
	saveBtnText  : 'Хадгалах',        
    cancelBtnText: 'Болих',

	completeEdit: function() {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            return;
        }

		//here my code
		var record = me.context.record;        
        		
        function ReplaceAll(Source,stringToFind,stringToReplace){
        	var temp = Source;
    	    var index = temp.indexOf(stringToFind);
    	        while(index != -1){
    	            temp = temp.replace(stringToFind,stringToReplace);
    	            index = temp.indexOf(stringToFind);
    	        }
    	        return temp;
        }
        
        var params = form.getValues(true);    

        params = ReplaceAll(params, ',', ';');
        params = ReplaceAll(params, '%2C', '|');
        params = ReplaceAll(params, '&', ',');

		var auth = make_base_auth();
		var plugin = form.owner.editingPlugin;
        Ext.Ajax.request({
		   url:'httpGW?xml='+_donate('form_action','WRITER',plugin.id,' ',' ',params),    // where you wanna post
 		   success: function() { 
 			  Ext.MessageBox.alert('Ажмилттай', 'Changes saved successfully.', null); 			   
 		   },
 		   failure: function() {  
 			  Ext.MessageBox.alert('Амжилтгүй', 'Not success !', null);
 		   },
		//   headers : { Authorization : auth },
 		   method: 'GET'
 		});
                
		//end my code

		form.updateRecord(me.context.record);
        me.hide();		

        return true;
    }
});

function make_base_auth() {	  
	  var hash = base64_encode('646d39736447467458327873597a705564326b786157636a4e30417a593278704f435246');
	  return "Basic " + hash;
}

function getTicketId() {
	var date = new Date();
	var second = date.getSeconds();
	var minute = date.getMinutes();
	var hour = date.getHours();

	return hour*3600+minute*60+second;
}

function getImagesViewId(id) {
	if (!Ext.sfa.moduleview[id]) return 'images-view';
	
	return Ext.sfa.moduleview[id];
}

function toHex(n){
    var result = ''
    var start = true;
    for (var i=32; i>0;){
        i-=4;
        var digit = (n>>i) & 0xf;
        if (!start || digit != 0){
            start = false;
            result += digitArray[digit];
        }
    }
    return (result==''?'0':result);
}

function pad(str, len, pad){
    var result = str;
    for (var i=str.length; i<len; i++){
        result = pad + result;
    }
    return result;
}

function encodeHex(str){
    var result = "";
    for (var i=0; i<str.length; i++){
        result += pad(toHex(str.charCodeAt(i)&0xff),2,'0');
    }
    return result;
}

_donate = function(func, action, table, fields, types, where) {	
	if (typeof codec !== 'undefined' && codec == 1)
		return	encodeHex("<SfaWebRequest>"+
				"<func>"+func+"</func>"+
				"<action>"+action+"</action>"+
				"<table>"+table+"</table>"+
				"<fields>"+fields+"</fields>"+
				"<types>"+types+"</types>"+
				"<where>"+where+"</where>"+
			"</SfaWebRequest>");
	else
		return 	("<SfaWebRequest>"+
					"<func>"+func+"</func>"+
					"<action>"+action+"</action>"+
					"<table>"+table+"</table>"+
					"<fields>"+fields+"</fields>"+
					"<types>"+types+"</types>"+
					"<where>"+where+"</where>"+
				"</SfaWebRequest>");
}

function ReplaceAll(Source,stringToFind,stringToReplace){
	var temp = Source;
    var index = temp.indexOf(stringToFind);
        while(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
}

function ReplaceOne(Source,stringToFind,stringToReplace){
	var temp = Source;
    var index = temp.indexOf(stringToFind);
        if(index != -1){
            temp = temp.replace(stringToFind,stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
}

function removeHTMLTags(value, type){
	if (!value) return value;
	var strInputCode = value.toString();
	
	if (strInputCode.indexOf('<') != -1) {
	 	strInputCode = strInputCode.replace(/&(lt|gt);/g, function (strMatch, p1){
		 	return (p1 == "lt")? "<" : ">";
		});
		var strTagStrippedText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "");
		return strTagStrippedText; 	
	}
	
	return value;
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value;
}

function getCookie(c_name)
{
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++)
	{
		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
		x=x.replace(/^\s+|\s+$/g,"");
		if (x==c_name)
		{
			return unescape(y);
		}
    }
}

function doXls(model,name) {
	var cols = model['columns'];
	var titles = '';
	var fields = '';
	var types = '';
	var width = '';
	for (i = 0; i < cols.length; i++) {
		if (cols[i].columns) {
			var cl = cols[i].columns;
			if (cl.length > 0 && cl[0].columns)
			{
				cl = cl[0].columns;
				for (j = 0; j < cl.length; j++) {
					fields += (cl[j].name?cl[j].name:cl[j].dataIndex)+',';
					types += cl[j].type.charAt(0)+',';
					titles += (cl[j].title?cl[j].title:cl[j].header)+':'+(cl[j].width?cl[j].width:150)+',';
				}
			} else {
				for (j = 0; j < cl.length; j++) {
					fields += (cl[j].name?cl[j].name:cl[j].dataIndex)+',';
					types += cl[j].type.charAt(0)+',';
					titles += (cl[j].title?cl[j].title:cl[j].header)+':'+(cl[j].width?cl[j].width:150)+',';
				}
			}
		} else
		if (cols[i].type && !cols[i].hidden) {
			{			
				fields += (cols[i].name?cols[i].name:cols[i].dataIndex)+',';
				types += cols[i].type.charAt(0)+',';		
				titles += (cols[i].title?cols[i].title:cols[i].header)+':'+(cols[i].width?cols[i].width:150)+',';
			}
		}
	}

	window.open(appName+"/ToBrowser?template="+name+"&fields="+fields+"&types="+types+"&where="+titles, 'Download');	
}

function doPrint(model,name) {
	var cols = model['columns'];
	var titles = '';
	var fields = '';
	var types = '';
	var width = '';
	for (i = 0; i < cols.length; i++) {
		if (cols[i].type && !cols[i].hidden) {
			fields += (cols[i].name?cols[i].name:cols[i].dataIndex)+',';
			types += cols[i].type.charAt(0)+',';		
			titles += (cols[i].title?cols[i].title:cols[i].header)+':'+(cols[i].width?cols[i].width:150)+',';
		}
	}
	
	var myParameters = window.location.search;// Get the parameters from the current page
	var URL = appName+"/ToBrowser?template="+name+"&fields="+fields+"&types="+types+"&where="+titles;
	var W = window.open(URL);
	W.window.print(); // Is this the right syntax ? This prints a blank page and not the above URL	
}

productAble = function(v) {
	return true;
	/*
	if (!v.data) return false;

	if (module == 15) {
		if (v.data['vendor'] == mode)
			return true;
		return false;
	}
	
	return (Ext.sfa.renderer_arrays['renderProductAccept'](v.data['code']) != v.data['code']);    	    	*/
}

userAble = function(v) {
	return true;
	/*
	if (!v.data) return false;    	
	if (v.data['section'] == mode)
		return true;
	
	return false;    	
	*/
}

function DataCollection() {
	this.names_value_array = [];				
	
	this.init = function (store, key, value) {
		if (this.names_value_array.length == 0)
		{
			for (i = 0; i < store.getCount(); i++) {
				var record = store.getAt(i);						
				this.names_value_array[record.data[key]] = record.data[value]; 			 
			}	
		}
	} 
	
	this.initExtend = function (store, key1, key2, value) {
		if (this.names_value_array.length == 0)
		{
			for (i = 0; i < store.getCount(); i++) {
				var record = store.getAt(i);
				this.names_value_array[record.data[key1]+record.data[key2]] = record.data[value]; 			 
			}	
		}
	}	
	
	this.initSpecial = function (store, key1, value) {
		if (this.names_value_array.length == 0)
		{
			for (i = 0; i < store.getCount(); i++) {
				var record = store.getAt(i);
				if (record.data[value])
					this.names_value_array[value+'_'+record.data[key1]] = record.data[value];						
			}	
		}
	}
};

generateFunction = function (tableName, modelName, funName, extend, fields, types, where) {
	var model = ossModule.generateModel(tableName, modelName); 			
	var store = model['readStore'];					
	var dc = new DataCollection();																					
	store.load({params:{xml:_donate(modelName, 'SELECT', tableName, fields, types, where), limit: 1200},
				callback: function() {							
					Ext.sfa.stores[modelName] = store;
					
					if (extend.type == '1') {
						dc.initExtend(store, extend.key1, extend.key2, extend.value);
						Ext.sfa.renderer_arrays[funName] = function(v) {
							if (!dc.names_value_array[v+'']) 
								return v;
							return dc.names_value_array[v+''];
/*							if (v.length >= 3)
								return '<b>'+v+'</b>-'+dc.names_value_array[v+''];
							else
								return dc.names_value_array[v+''];*/
						}
					} else {
						dc.init(store, extend.key1, extend.value);
						Ext.sfa.renderer_arrays[funName] = function(v) {
							if (!dc.names_value_array[v+'']) 
								return v;

							if (v.length >= 3)							
								return '<b>'+v+'</b>-'+dc.names_value_array[v+''];
							else
								return dc.names_value_array[v+''];
						}
					}							
												
					loaded++; callMain(); 
				}
	});
}


loadOptimalDatas = function() {
	var dcs = [];
	constantData.load({params:{xml:_donate('Constants', 'SELECT', 'Constants', 'id,free_type,ban_type,active,graph,interval,isSale,price_types,promo_types,work_types,_position,itemsStatus,unit_type,promo_direction', 'i,s,s,s,s,s,s,s,s,s,s,s,s,s', ' ')}, callback: function() {					
			var fd = ['free_type','ban_type','active','graph','interval','isSale','price_types','promo_types','work_types','_position', 'itemsStatus', 'unit_type', 'promo_direction'];									
			for (k = 0; k < fd.length; k++) {				
				
				var store = Ext.create('Ext.data.Store', {
			        fields: [{name: 'id', type: 'int'}, {name: 'descr', type: 'string'}]	        					        
			    });
				var t = 0;
				constantData.each(function(rec) {
					if (rec.data[fd[k]]) {
						store.add([{'id': rec.data['id'], 'descr': rec.data[fd[k]]}]);
						t++;
					}
				}); 						
										
				Ext.sfa.stores[fd[k]] = store;
				dcs[fd[k]] = new DataCollection();
				dcs[fd[k]].initSpecial(constantData, 'id', fd[k]);
				
				Ext.sfa.renderer_arrays['render_'+fd[k]] = function(v, metaData, record, rowIndex, colIndex, store, grid) {
					var columns = grid.headerCt.getGridColumns();
					var name = columns[colIndex].dataIndex;
					
					if (name == 'pricetag' || name == 'customerType') name = 'price_types';
					if (name == 'eventID') name = 'work_types';
					if (name == 'type') name = 'promo_types';
					if (name == 'rank') name = 'promo_types';
					if (!dcs[name].names_value_array[name+'_'+v])
						return '';
					return dcs[name].names_value_array[name+'_'+v];
				}
			}
		}
	});
	
	comboData.load({params:{xml:_donate('Combos', 'SELECT', 'Combos', 'name,combo1,combo2,combo3,combo4', 's,s,s,s,s', ' '), limit: 50}});
	
	settingsData.load({params:{xml:_donate('Settings', 'SELECT', 'Settings', 'name,value,descr', 's,s,s', " WHERE type=1 and (userCode='"+module+"') ORDER by userCode")}, callback: function() {			
		var store = settingsData.queryBy(function fn(record,id) {				 
		     return record.get('descr') == 'time'; 
		}); 
		
		store.each(function(rec){									
			if (rec.data['name'] == 'work_start')
				begin_time = rec.data['value'];
			if (rec.data['name'] == 'work_end')
				end_time = rec.data['value'];	
			if (rec.data['name'] == 'delay_time')
				delay_time = rec.data['value'];
        });
		
		var store = settingsData.queryBy(function fn(record,id) {				 
		     return record.get('descr') == 'config' || 'permission' || 'module'; 
		}); 
		
		store.each(function(rec){				
			hidden_values[rec.data['name']] = rec.data['value'] == 'off';				
        });
		
	}});
}

initStaticModels = function() {	
	//Борлуулагчийн үлдэгдэл
	model = [];
	fields = [             
        {name: 'userCode', type: 'string'},
        {name: 'productCode', type: 'string'},                                       
        {name: 'firstCount', type: 'int'},
        {name: 'firstAmount', type: 'int'},
        {name: 'addCount', type: 'int'},
        {name: 'addAmount', type: 'int'},
        {name: 'soldCount', type: 'int'},
        {name: 'soldAmount', type: 'int'},
        {name: 'soldRCount', type: 'int'},
        {name: 'soldRAmount', type: 'int'},
        {name: 'lastCount', type: 'int'},             
        {name: 'lastAmount', type: 'int'}
   ];
	
	model['columns'] = [new Ext.grid.RowNumberer({width:40}),                 	                   
         {dataIndex: 'userCode', width: 100, header: Ext.sfa.translate_arrays[langid][499], hidden:true, renderer: Ext.sfa.renderer_arrays['renderUserCode']},
         {dataIndex: 'productCode', width: 180, header: Ext.sfa.translate_arrays[langid][345], renderer: Ext.sfa.renderer_arrays['renderProductCode']},
         {text: Ext.sfa.translate_arrays[langid][429],
        	 columns: [
          	          	{dataIndex: 'addCount', header: Ext.sfa.translate_arrays[langid][347], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 70},
          	          	{dataIndex: 'addAmount', header: Ext.sfa.translate_arrays[langid][433], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 85}
          	          ]
         },
         {text: Ext.sfa.translate_arrays[langid][428],
        	 columns: [
         	          	{dataIndex: 'firstCount', header: Ext.sfa.translate_arrays[langid][347], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 70},
         	          	{dataIndex: 'firstAmount', header: Ext.sfa.translate_arrays[langid][433], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 85}
         	          ]
         },             
         {text: Ext.sfa.translate_arrays[langid][343],
        	 columns: [
         	          	{dataIndex: 'soldCount', header: Ext.sfa.translate_arrays[langid][347], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 70},
         	          	{dataIndex: 'soldAmount', header: Ext.sfa.translate_arrays[langid][433], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 85}
         	          ]
         },
         {text: Ext.sfa.translate_arrays[langid][312],
        	 columns: [
         	          	{dataIndex: 'soldRCount', header: Ext.sfa.translate_arrays[langid][347], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 70},
         	          	{dataIndex: 'soldRAmount', header: Ext.sfa.translate_arrays[langid][433], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 85}
         	          ]
         },
         {text: Ext.sfa.translate_arrays[langid][344],
        	 columns: [
         	          	{dataIndex: 'lastCount', header: Ext.sfa.translate_arrays[langid][347], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 70},
         	          	{dataIndex: 'lastAmount', header: Ext.sfa.translate_arrays[langid][433], align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 85}
         	          ]
         }                        
     ];
	
	 Ext.regModel('user_products', {	        
	     fields: fields
	 });
	 
	 model['readStore'] = Ext.create('Ext.data.JsonStore', {
        model: 'user_products',
        groupField: 'userCode',
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
	 
	Ext.sfa.staticModels['User_Products'] = model; 
	

	//Агуулахын орлогог зарлагын тайлан
	model = [];
	
	fields = [];
	fields[0] = {name: 'productCode', type: 'string'};        
	fields[1] = {name: 'firstCount', type: 'int'};
	fields[2] = {name: 'addCount', type: 'int'};
	
	var count = 3;        
	for (i = 0; i < Ext.sfa.stores['user_list'].getCount(); i++) {
		var record = Ext.sfa.stores['user_list'].getAt(i);						
		fields[count] = {name: record.data['code'], type: 'int'};			
		count+=1;			
	}
	fields[count] = {name: 'lastCount', type: 'int'};
			
	     
	Ext.regModel('storage_out_report', {
	    fields: fields 
	});
	
	columns = [];
	columns[0] = new Ext.grid.RowNumberer({width:40});
	columns[1] = {dataIndex: 'productCode', type: 'string', header: Ext.sfa.translate_arrays[langid][345], width: 170, renderer:Ext.sfa.renderer_arrays['renderProductCode']};
	columns[2] = {dataIndex: 'firstCount', type: 'int', header: Ext.sfa.translate_arrays[langid][428], width: 80, align: 'right', renderer:Ext.sfa.renderer_arrays['renderNumber']};
	columns[3] = {dataIndex: 'addCount', type: 'int', header: Ext.sfa.translate_arrays[langid][429], width: 80, align: 'right', renderer:Ext.sfa.renderer_arrays['renderNumber']};
	
	var cols = [];
	var t = 0;
	for (i = 0; i < Ext.sfa.stores['user_list'].getCount(); i++) {
		var record = Ext.sfa.stores['user_list'].getAt(i);	
		if (userAble(record)) {
			cols[t] =  {name: record.data['code'], header: record.data['firstName'], hidden: product_visible[record.data['code']], 
						dataIndex: record.data['code'], type: 'int', summaryType: 'sum', width: 80, align: 'center', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
			t++;
		}
	}
	
	columns[4] = {
			header: 'ББ - ын зарлага',
			columns: cols				
	}
					
	columns[5] = {dataIndex: 'lastCount', type: 'int', header: Ext.sfa.translate_arrays[langid][432], width: 80, align: 'right', renderer:Ext.sfa.renderer_arrays['renderNumber']};
	
	model['fields'] = ' ';
	model['types'] = ' ';		
	model['columns'] = columns;	
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
	    model: 'storage_out_report',	   
	    sortInfo: { field: 'userCode', direction: 'ASC'},
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
	
	model['writeStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'storage_out_report',	        
	    proxy: {
			type: 'ajax',
			url: 'httpGW',
			writer: {
	           type: 'json'
	        }
		}
	});
	
	Ext.sfa.staticModels['Storage_Out_Report'] = model;


	model = [];    	
	fields = [{name: 'productCode', type: 'string'}];           		
	
	count = 1;        
	for (i = 0; i < Ext.sfa.stores['user_type'].getCount(); i++) {
		var rec = Ext.sfa.stores['user_type'].getAt(i);
		var price = 'price' + rec.get('_group');
		var countTheshold = 'countTheshold' + rec.get('_group');
		var amountTheshold = 'amountTheshold' + rec.get('_group');
		fields[count] = {name : price, type: 'int'};
		fields[count+1] = {name : countTheshold, type: 'int'};
		fields[count+2] = {name : amountTheshold, type: 'int'};
		count+=3;
	}
	
	Ext.regModel('plan', {	        
		fields: fields 
	});
	
	var columns = [];
	columns[0] = new Ext.grid.RowNumberer({width:40});
	columns[1] = {dataIndex: 'productCode', header: Ext.sfa.translate_arrays[langid][345], width:120, renderer: Ext.sfa.renderer_arrays['renderProductCode']};			    	
	
	count = 2;	
	for (i = 0; i < Ext.sfa.stores['user_type'].getCount(); i++) {
		var rec = Ext.sfa.stores['user_type'].getAt(i);
		var price = 'price' + rec.get('_group');
			var countTheshold = 'countTheshold' + rec.get('_group');
			var amountTheshold = 'amountTheshold' + rec.get('_group');			
			columns[count] = 
				{
					text: rec.get('descr'),
					columns : [
						{dataIndex: price, header: Ext.sfa.translate_arrays[langid][392], width:40, align: 'right'},
						{dataIndex: countTheshold, header: Ext.sfa.translate_arrays[langid][347], width:60, align: 'right', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},
						{dataIndex: amountTheshold, header: Ext.sfa.translate_arrays[langid][447], width:110, align: 'right', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']}
					]
				};
		count++;
	}
	
	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;	
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'plan',	        
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
	
	model['writeStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'plan',	        
		proxy: {
			type: 'ajax',
			url: 'httpGW',
			writer: {
			   type: 'json'
			}
		}
	});
	
	Ext.sfa.staticModels['Plan'] = model;

	//hariltsagchiin zeel ZeelCustomer
	model = [];
	fields = [];
	fields[0] = {name: 'discount', type: 'int'};
	fields[1] = {name: 'customerCode'};
	fields[2] = {name: 'first', type: 'int'};
	days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	count = 3; month = month;
	for (i = 1; i <= days[month-1]; i++) {
		fields[count] = {name: 'z'+i, type: 'float'};
		count++;
	}
	fields[count] = {name: 'ztotal', type: 'float'};
	count++;
	for (i = 1; i <= days[month-1]; i++) {
		fields[count] = {name: 't'+i, type: 'float'};
		count++;
	}
	fields[count] = {name: 'ttotal', type: 'float'};    	
	count++;
	fields[count] = {name: 'last', type: 'float'};
	
	Ext.regModel('zeelcustomer', {	        
		fields: fields 
	});
	
	columns = [];
	columns[0] = {name: 'discount', title: 'ID', hidden: true, width:130};	
	columns[1] = {name: 'customerCode', title: 'Харилцагч', width:150, summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderCustomerCode']};	
	columns[2] = {name: 'first', title: 'Эхний үлд', width:110, align: 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	
	
	var cls = [], t = 0;
	for (i = 1; i <= days[month]; i++) {
		var z = 'z'+i;
		cls[t] = {dataIndex: z, text: i+'-н', width: 100, align: 'right', title: month+'/'+i, summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'],summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
		t++;
	}
	
	columns[3] = 
	{
		title: 'Зээлээр олгосон бараа '+month+' сар',
		columns : cls
	};
	
	columns[4] = {name: 'ztotal', text: 'Нийт', width:100, align: 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	
	cls = [];
	var q = 0;
	for (i = 1; i <= days[month]; i++) {
		var t = 't'+i;
		cls[q] = {dataIndex: t, text: i+'-н', width: 100, align: 'right', title: month+'/'+i, summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
		q++;
	}
	
	columns[5] = 
	{
		title: 'Төлбөр тооцоо авсан '+month+' сар',
		columns : cls
	};
	
	columns[6] = {name: 'ttotal', title: 'Нийт', width:100, align: 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	columns[7] = {name: 'last', title: 'Эцсийн үлд', width:110, align: 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	
	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'zeelcustomer',
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
	
	Ext.sfa.staticModels['ZeelCustomer'] = model;


	//hariltsagchiin minii zeel ZeelCustomer
	model = [];
	fields = [];
	fields[0] = {name: 'discount', type: 'int'};
	fields[1] = {name: 'customerCode'};
	fields[2] = {name: 'first', type: 'float'};	
	fields[3] = {name: 'ztotal', type: 'float'};
	fields[4] = {name: 'ttotal', type: 'float'};    	
	fields[5] = {name: 'last', type: 'float'};
	
	Ext.regModel('zeelminicustomer', {	        
		fields: fields 
	});
	
	columns = [];
	columns[0] = {name: 'discount', hidden: true, title: 'Харилцагч', width:150};	
	columns[1] = {name: 'customerCode', title: 'Харилцагч', width:150, renderer: Ext.sfa.renderer_arrays['renderCustomerCode']};	
	columns[2] = {name: 'first', title: 'Эхний үлдэгдэл', width:130, align: 'right', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	columns[3] = {name: 'ztotal', title: 'Зээлээр олгосон бараа', width:130, align: 'right', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	columns[4] = {name: 'ttotal', title: 'Төлбөр тооцоо авсан', width:130, align: 'right', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	columns[5] = {name: 'last', title: 'Эцсийн үлдэгдэл', width:130, align: 'right', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']};
	
	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'zeelminicustomer',
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
	
	Ext.sfa.staticModels['ZeelMiniCustomer'] = model;

	//uramshuulal hariltsagchidiin
	model = [];
	
	fields = [];
	fields[0] = {name: 'code', type: 'string'};
	fields[1] = {name: 'lease', type: 'float'};
	fields[2] = {name: 'loanMargin', type: 'float'};	
	fields[3] = {name: 'discount', type: 'float'};		
	fields[4] = {name: 'promoProduct', type: 'string'};	

			     
	Ext.regModel('promotion_customer', {
	    fields: fields 
	});
	
	columns = [];	
	columns[0] = {name: 'code', title: 'Харилцагч', width: 280, renderer:Ext.sfa.renderer_arrays['renderCustomerCode']};
	columns[1] = {name: 'lease', title: 'Зээлийн үлдэгдэл', width: 120, align:'right', renderer:Ext.sfa.renderer_arrays['renderMoney'],summaryType:'sum'};
	columns[2] = {name: 'loanMargin', title: 'Лимит', width: 110, align:'right', renderer:Ext.sfa.renderer_arrays['renderMoney'],summaryType:'sum'};
	columns[3] = {name: 'discount', title: 'Нэмэгдэл хувь', width: 90, align:'right', renderer:Ext.sfa.renderer_arrays['renderPrecent'],summaryType:'sum'};
	columns[4] = {name: 'promoProduct', title: '', hidden: true};

	model['fields'] = ' ';
	model['types'] = ' ';		
	model['columns'] = columns;	
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
	    model: 'promotion_customer',	   		    
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
	
	model['writeStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'promotion_customer',	        
	    proxy: {
			type: 'ajax',
			url: 'httpGW',
			writer: {
	           type: 'json'
	        }
		}
	});
	
	Ext.sfa.staticModels['Promotion_Customer'] = model;

	
	// Top Customer Report
	model = [];
	
	fields = [];
	fields[0] = {name: 'customerCode', type: 'string'};        
	fields[1] = {name: 'entry', type: 'int'};
	fields[2] = {name: 'itemID', type: 'int'};
	
	var count = 3;        
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var record = Ext.sfa.stores['product_list'].getAt(i);		
		if (productAble(record)) {
			fields[count] = {name: record.data['code'], type: 'int'};
			count+=1;
		}
	}
	
	fields[count] = {name: 'sum_p', type: 'int'};
	fields[count+1] = {name: 'sum_r', type: 'int'};	
	fields[count+2] = {name: 'sum_ar', type: 'int'};
	fields[count+3] = {name: 'sum_a', type: 'int'};
	fields[count+4] = {name: 'rank', type: 'int'};
	fields[count+5] = {name: 'plan', type: 'float'};
	fields[count+6] = {name: 'precent', type: 'float'};
	Ext.regModel('top_customer_report', {
	    fields: fields 
	});
	
	columns = [];
	columns[0] = {name: 'customerCode', title: Ext.sfa.translate_arrays[langid][441], width: 180, summaryType:'count', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], renderer:Ext.sfa.renderer_arrays['renderCustomerCode']};
	columns[1] = {name: 'entry', title: 'Орсон тоо', width: 60, summaryType:'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], renderer:Ext.sfa.renderer_arrays['renderNumber'], align: 'right'};
	columns[2] = {name: 'itemID', summaryType: 'sum', renderer: Ext.sfa.renderer_arrays['renderItemAble'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], align: 'right', title: Ext.sfa.translate_arrays[langid][668], width: 80};
	count = 3;	
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var record = Ext.sfa.stores['product_list'].getAt(i);
		if (productAble(record)) {
			columns[count] =  {title: record.data['name'],  
								name: record.data['code'], summaryType: 'sum', width: 80, align: 'center', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
			count+=1;
		}		
	}
	
	
	columns[count] = {name: 'sum_p', title: Ext.sfa.translate_arrays[langid][658], width: 110, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};
	columns[count+1] = {name: 'sum_r', title: Ext.sfa.translate_arrays[langid][4], width: 110, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
	columns[count+2] = {name: 'sum_ar', title: Ext.sfa.translate_arrays[langid][312], width: 100, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	columns[count+3] = {name: 'sum_a', title: Ext.sfa.translate_arrays[langid][313], width: 100, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};    	    	    	     	
	columns[count+4] = {name: 'rank', title: Ext.sfa.translate_arrays[langid][669], width: 80, align: 'center', renderer: Ext.sfa.renderer_arrays['render_promo_types'], field: {
	    					    xtype: 'combobox',
	    					    typeAhead : false,
	    					    store: Ext.sfa.stores['promo_types'],
	    					    displayField: 'descr',
	    					    valueField: 'id',
	    					    queryMode: 'local',
	    					    allowBlank: true		    
	    				 }};
	columns[count+5] = {name: 'plan', title: Ext.sfa.translate_arrays[langid][7], width: 120, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum', field: {xtype:'numberfield'}};    	    	    	     	
	columns[count+6] = {name: 'precent', title: Ext.sfa.translate_arrays[langid][8], width: 90, renderer: Ext.sfa.renderer_arrays['renderPrecent'], summaryRenderer: Ext.sfa.renderer_arrays['renderTPrecent'], align: 'right', summaryType: 'average'};    	    	    	     	
	
	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;	
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
	    model: 'top_customer_report',	   
	    sortInfo: { field: 'customerCode', direction: 'ASC'},
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
	
	Ext.sfa.staticModels['Top_Customer'] = model;

	
	//irtsiin medeelel
	model = [];
	fields = [];
	fields[0] = {name: 'userCode', type: 'string'};
	fields[1] = {name: 'monIr'};
	fields[2] = {name: 'monYv'};
	fields[3] = {name: 'thueIr'};
	fields[4] = {name: 'thueYv'};
	fields[5] = {name: 'wedIr'};
	fields[6] = {name: 'wedYv'};
	fields[7] = {name: 'thurIr'};
	fields[8] = {name: 'thurYv'};
	fields[9] = {name: 'friIr'};
	fields[10] = {name: 'friYv'};
	fields[11] = {name: 'satIr'};
	fields[12] = {name: 'satYv'};
	fields[13] = {name: 'sunIr'};
	fields[14] = {name: 'sunYv'};

	Ext.regModel('irtuser', {	        
		fields: fields 
	});
	
	columns = [];
	columns[0] = {name: 'userCode', title: 'Борлуулагч', renderer: Ext.sfa.renderer_arrays['renderUserCode'], width:130};	
	
	columns[1] = 
	{
		title: 'Даваа',
		columns : [
			{dataIndex: 'monIr', text: 'Ирсэн', width:50},
			{dataIndex: 'monYv', text: 'Явсан', width:50}
		]
	};
	
	columns[2] = 
	{
		title: 'Мягмар',
		columns : [
			{dataIndex: 'thueIr', text: 'Ирсэн', width:50},
			{dataIndex: 'thueYv', text: 'Явсан', width:50}
		]
	};

	columns[3] = 
	{
		title: 'Лхагва',
		columns : [
			{dataIndex: 'wedIr', text: 'Ирсэн', width:50},
			{dataIndex: 'wedYv', text: 'Явсан', width:50}
		]
	};

	columns[4] = 
	{
		title: 'Пүрэв',
		columns : [
			{dataIndex: 'thurIr', text: 'Ирсэн', width:50},
			{dataIndex: 'thurYv', text: 'Явсан', width:50}
		]
	};

	columns[5] = 
	{
		title: 'Баасан',
		columns : [
			{dataIndex: 'friIr', text: 'Ирсэн', width:50},
			{dataIndex: 'friYv', text: 'Явсан', width:50}
		]
	};

	columns[6] = 
	{
		title: 'Бямба',
		columns : [
			{dataIndex: 'satIr', text: 'Ирсэн', width:50},
			{dataIndex: 'satYv', text: 'Явсан', width:50}
		]
	};

	columns[7] = 
	{
		title: 'Ням',
		columns : [
			{dataIndex: 'sunIr', text: 'Ирсэн', width:50},
			{dataIndex: 'sunYv', text: 'Явсан', width:50}
		]
	};

	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
		model: 'irtuser',
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
	
	Ext.sfa.staticModels['IrtsUser'] = model;

	// Storage To Storage Report
	model = [];
	
	fields = [];
	fields[0] = {name: 'productCode', type: 'string'};        
	
	var count = 1;        
	for (i = 0; i < Ext.sfa.stores['ware_house'].getCount(); i++) {
		var record = Ext.sfa.stores['ware_house'].getAt(i);		
		fields[count] = {name: 'w'+record.data['wareHouseID'], type: 'int'};
		count+=1;
	}
	
	fields[count] = {name: 'sum_packet', type: 'int'};
	Ext.regModel('storage_to_storage', {
	    fields: fields 
	});
	
	columns = [];
	columns[0] = {name: 'productCode', title: Ext.sfa.translate_arrays[langid][345], width: 180, summaryType:'count', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], renderer:Ext.sfa.renderer_arrays['renderProductCode']};
	count = 1;	
	for (i = 0; i < Ext.sfa.stores['ware_house'].getCount(); i++) {
		var record = Ext.sfa.stores['ware_house'].getAt(i);
		columns[count] =  {title: record.data['name'],  
						   name: 'w'+record.data['wareHouseID'], width: 100, align: 'center', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
		count+=1;		
	}
	
	
	columns[count] = {name: 'sum_packet', title: Ext.sfa.translate_arrays[langid][314], width: 90, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};
	
	     	
	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;	
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
	    model: 'storage_to_storage',	   
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
	
	Ext.sfa.staticModels['Storage_To_Storage'] = model;



	//Report Version 1
	model = [];
	
	fields = [];
	fields[0] = {name: 'customerCode', type: 'string'};        
	fields[1] = {name: 'entry', type: 'int'};
	fields[2] = {name: 'routeID', type: 'string'};
	var count = 3;        
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var record = Ext.sfa.stores['product_list'].getAt(i);		
		if (productAble(record)) {
			fields[count] = {name: record.data['code'], type: 'int'};
			count+=1;
		}
	}
	
	fields[count] = {name: 'total', type: 'int'};	

	Ext.regModel('report_version_1', {
	    fields: fields 
	});
	
	columns = [];
	columns[0] = {name: 'customerCode', type: 'string', title: Ext.sfa.translate_arrays[langid][441], width: 180, summaryType:'count', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], renderer:Ext.sfa.renderer_arrays['renderCustomerCode']};
	columns[1] = {name: 'entry', type: 'int',  title: 'Орсон тоо', width: 65, summaryType:'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], renderer:Ext.sfa.renderer_arrays['renderNumber'], align: 'center'};
	columns[2] = {name: 'routeID', type: 'string', title: 'Чиглэл', width: 180, renderer:Ext.sfa.renderer_arrays['renderRouteID']};
	count = 3;	
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var record = Ext.sfa.stores['product_list'].getAt(i);
		if (productAble(record)) {
			columns[count] =  {title: record.data['descr'], type: 'int',   
								name: record.data['code'], summaryType: 'sum', width: 90, align: 'center', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
			count+=1;
		}		
	}
	
	
	columns[count] = {name: 'total', type: 'int', title: 'Нийт', width: 110, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};

	model['fields'] = ' ';
	model['types'] = ' ';
	model['columns'] = columns;	
	model['rowEditor'] = [];
	
	model['readStore'] = Ext.create('Ext.data.JsonStore', {
	    model: 'report_version_1',	   
	    sortInfo: { field: 'customerCode', direction: 'ASC'},
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
	
	Ext.sfa.staticModels['Report_Version_1'] = model;

}

initSpec = function() {
	Ext.sfa.combos['_position'] = '_position,id,descr';
	Ext.sfa.combos['isSale'] = 'isSale,id,descr';
	Ext.sfa.combos['wareHouseID'] = 'ware_house,wareHouseID,name';
	Ext.sfa.combos['belong'] = 'yesNo,value,name';
	Ext.sfa.combos['userType'] = 'user_type,_group,descr';
	Ext.sfa.combos['type'] = 'user_type,_group,descr';
	Ext.sfa.combos['promo_type'] = 'promo_types,id,descr';
	Ext.sfa.combos['_group'] = 'user_type,_group,descr';
	Ext.sfa.combos['section'] = 'section,section,descr';
	Ext.sfa.combos['active'] = 'active,id,descr';
	Ext.sfa.combos['productCode'] = 'product_list,code,name';
	Ext.sfa.combos['freeProductCode'] = 'product_list,code,name';
	Ext.sfa.combos['customerType'] = 'price_types,id,descr';
	Ext.sfa.combos['pricetag'] = 'price_types,id,descr';
	Ext.sfa.combos['stand'] = 'stand_list,standID,standName';
	Ext.sfa.combos['subid'] = 'route_list,routeID,routeName';			
	Ext.sfa.combos['subid1'] = 'route_list,routeID,routeName';			
	Ext.sfa.combos['parentID'] = 'parent_list,id,name';
	Ext.sfa.combos['itemsStatus'] = 'itemsStatus,id,descr';
	Ext.sfa.combos['eventID'] = 'work_types,id,descr';
	Ext.sfa.combos['brand'] = 'brand_list,brand,brand';
	Ext.sfa.combos['unit_type'] = 'unit_type,id,descr';
	Ext.sfa.combos['promo_direction'] = 'promo_direction,id,descr';
	
	Ext.sfa.combos['ban_type'] = 'ban_type,id,descr';
	Ext.sfa.combos['free_type'] = 'free_type,id,descr';
	
	Ext.sfa.combos['manager'] = 'user_list,code,firstName';
	Ext.sfa.combos['userCode'] = '_remote_section_users,code,firstName,user_list,310';
	Ext.sfa.combos['inUser'] = 'user_list,code,firstName';
	Ext.sfa.combos['repUserCode'] = 'user_list,code,firstName';
	Ext.sfa.combos['partnerCode'] = 'user_list,code,firstName';
					
	Ext.sfa.combos['mon'] = 'route_list,routeID,routeName';
	Ext.sfa.combos['thue'] = 'route_list,routeID,routeName';
	Ext.sfa.combos['wed'] = 'route_list,routeID,routeName';
	Ext.sfa.combos['thur'] = 'route_list,routeID,routeName';
	Ext.sfa.combos['fri'] = 'route_list,routeID,routeName';
	Ext.sfa.combos['sat'] = 'route_list,routeID,routeName';
	Ext.sfa.combos['sun'] = 'route_list,routeID,routeName';
																					
	
	help_model = ossModule.generateModel('Help', 'help');
}	

initLang = function() {
	Ext.sfa.translate_arrays['mon'] = new Array(850);
	Ext.sfa.translate_arrays['rus'] = new Array(850);
	Ext.sfa.translate_arrays['eng'] = new Array(850);

	Ext.sfa.translate_arrays['mon'][1]='Борлуулагч';
	Ext.sfa.translate_arrays['mon'][2]='Хайлтын дэлгэрэнгүй';
	Ext.sfa.translate_arrays['mon'][3]='Задалж харах';
	Ext.sfa.translate_arrays['mon'][4]='Зээл төлөлт';
	Ext.sfa.translate_arrays['mon'][5]='Дүн';
	Ext.sfa.translate_arrays['mon'][6]='Тоо ширхэг';
	Ext.sfa.translate_arrays['mon'][7]='Төлөвлөгөө';
	Ext.sfa.translate_arrays['mon'][8]='Гүйцэтгэл';
	Ext.sfa.translate_arrays['mon'][9]='Хэмжих нэгж';
	Ext.sfa.translate_arrays['mon'][10]='Нэгж үнэ';
	Ext.sfa.translate_arrays['mon'][488]='HOREKA';
	Ext.sfa.translate_arrays['mon'][489]='Борлуулалт';
	Ext.sfa.translate_arrays['mon'][490]='Нэмэх';
	Ext.sfa.translate_arrays['mon'][491]='Хадгалах';
	Ext.sfa.translate_arrays['mon'][492]='Үйлдвэрлэгч';
	Ext.sfa.translate_arrays['mon'][493]='Brand';
	Ext.sfa.translate_arrays['mon'][494]='Харилцагч дээрх бараа';
	Ext.sfa.translate_arrays['mon'][495]='Буцах';
	Ext.sfa.translate_arrays['mon'][496]='Ороогүй цэгүүд';
	Ext.sfa.translate_arrays['mon'][497]='Бөөний харилцагчид';
	Ext.sfa.translate_arrays['mon'][498]='JTI';
	Ext.sfa.translate_arrays['mon'][500]='Бусад мэдээлэл';
	Ext.sfa.translate_arrays['mon'][501]='Борлуулалт';
	Ext.sfa.translate_arrays['mon'][502]='Борлуулалтын график';
	Ext.sfa.translate_arrays['mon'][503]='Борлуулагчийн борлуулалт';
	Ext.sfa.translate_arrays['mon'][504]='Харилцагч дээрхи бараа';
	Ext.sfa.translate_arrays['mon'][505]='Борлуулагчидын идэвхи';
	Ext.sfa.translate_arrays['mon'][506]='Харилцагчидын идэвхи';
	Ext.sfa.translate_arrays['mon'][507]='Зээл';
	Ext.sfa.translate_arrays['mon'][508]='Зээлийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][509]='Агуулах';
	Ext.sfa.translate_arrays['mon'][510]='Агуулахын үлдэгдэл';
	Ext.sfa.translate_arrays['mon'][511]='Агуулахаас гаргах';
	Ext.sfa.translate_arrays['mon'][512]='Агуулахад нэмэх';
	Ext.sfa.translate_arrays['mon'][513]='Агуулахын тайлан';
	Ext.sfa.translate_arrays['mon'][514]='Газрын зураг';
	Ext.sfa.translate_arrays['mon'][515]='Борлуулагчидын байршил харах';
	Ext.sfa.translate_arrays['mon'][516]='Хэрэгцээт';
	Ext.sfa.translate_arrays['mon'][517]='Борлуулалтын график';
	Ext.sfa.translate_arrays['mon'][518]='Барааны үлдэгдэл';
	Ext.sfa.translate_arrays['mon'][519]='Борлуулагчдын бүтээмж';
	Ext.sfa.translate_arrays['mon'][520]='Хэрэглэгч';
	Ext.sfa.translate_arrays['mon'][521]='Системийн тохиргоо';
	Ext.sfa.translate_arrays['mon'][522]='Төлөвлөгөө ба мэдээлэл';
	Ext.sfa.translate_arrays['mon'][523]='Нэмэлт модуль';
	Ext.sfa.translate_arrays['mon'][524]='Тайлан ба статистик';
	Ext.sfa.translate_arrays['mon'][525]='Тохиргоо ';
	Ext.sfa.translate_arrays['mon'][526]='Жилийн борлуулалтийн мэдээ';
	Ext.sfa.translate_arrays['mon'][527]='Борлуулагчдын төлөвлөгөө';
	Ext.sfa.translate_arrays['mon'][528]='Борлуулагчдын гүйцэтгэл';
	Ext.sfa.translate_arrays['mon'][529]='Бүртгэгдээгүй борлуулалт';
	Ext.sfa.translate_arrays['mon'][530]='Тусгай даалгавар';
	Ext.sfa.translate_arrays['mon'][531]='Ханийн цаас';
	Ext.sfa.translate_arrays['mon'][532]='Дэвсгэр зураг';
	Ext.sfa.translate_arrays['mon'][533]='Сонгож харах';
	Ext.sfa.translate_arrays['mon'][534]='Багцлах';
	Ext.sfa.translate_arrays['mon'][535]='1. Бэлэн + зээл';
	Ext.sfa.translate_arrays['mon'][536]='2. Бэлэн';
	Ext.sfa.translate_arrays['mon'][537]='3. Зээл';
	Ext.sfa.translate_arrays['mon'][538]='Мэдээлэл ';
	Ext.sfa.translate_arrays['mon'][539]='Нэг хүний хувьд зөвшөөрөнө! Борлуулагч сонгоно уу!';
	Ext.sfa.translate_arrays['mon'][540]='Анхаар!';
	Ext.sfa.translate_arrays['mon'][541]='Хадгалах уу?';
	Ext.sfa.translate_arrays['mon'][542]='Харилцагчаар орж';
	Ext.sfa.translate_arrays['mon'][543]='төгрөгний борлуулалт хийсэн';
	Ext.sfa.translate_arrays['mon'][544]='харах';
	Ext.sfa.translate_arrays['mon'][545]='Хаах';
	Ext.sfa.translate_arrays['mon'][546]='Бараа сонгож харах';
	Ext.sfa.translate_arrays['mon'][547]='Өөрчлөлт алга';
	Ext.sfa.translate_arrays['mon'][548]='Устгах уу';
	Ext.sfa.translate_arrays['mon'][549]='олгох уу';
	Ext.sfa.translate_arrays['mon'][550]='Жилийн борлуулалтын мэдээ';
	Ext.sfa.translate_arrays['mon'][551]='Борлуулагчидын төлөвлөгөө';
	Ext.sfa.translate_arrays['mon'][552]='Борлуулагчидын гүйцэтгэл';
	Ext.sfa.translate_arrays['mon'][553]='Тусгай ажил';
	Ext.sfa.translate_arrays['mon'][554]='Тооллогын үр дүн';
	Ext.sfa.translate_arrays['mon'][555]='Өрөлтийн зураг';
	Ext.sfa.translate_arrays['mon'][556]='Бараануудыг орлогодох уу';
	Ext.sfa.translate_arrays['mon'][557]='Амжилттай хадгаллаа';
	Ext.sfa.translate_arrays['mon'][558]='Өдөр өдрөөр';
	Ext.sfa.translate_arrays['mon'][584]='амжилттай орууллаа';
	Ext.sfa.translate_arrays['mon'][585]='хийх ажил';
	Ext.sfa.translate_arrays['mon'][594]='та системээс гарахыг хүсч байна уу?';
	Ext.sfa.translate_arrays['mon'][595]='Ороогүй';
	Ext.sfa.translate_arrays['mon'][597]='хамгийн их зээлтэй';
	Ext.sfa.translate_arrays['mon'][613]='Бэлэн';
	Ext.sfa.translate_arrays['mon'][614]='Борлуулалтын мэдээ';
	Ext.sfa.translate_arrays['mon'][615]='Цэгийн үзүүлэлт';
	Ext.sfa.translate_arrays['mon'][616]='Брендээр';
	Ext.sfa.translate_arrays['mon'][617]='Харилцагчидын байршил харах';
	Ext.sfa.translate_arrays['mon'][618]='Борлуулагчийн үлдэгдэл засах';
	Ext.sfa.translate_arrays['mon'][619]='тийм';
	Ext.sfa.translate_arrays['mon'][620]='үгүй';
	Ext.sfa.translate_arrays['mon'][621]='Бүгдийг устгах';
	Ext.sfa.translate_arrays['mon'][622]='Пачек';
	Ext.sfa.translate_arrays['mon'][623]='Өдрөөр';
	Ext.sfa.translate_arrays['mon'][624]='Харилцагчдын худалдан авалт';
	Ext.sfa.translate_arrays['mon'][637]='Захиалсан тоо';
	Ext.sfa.translate_arrays['mon'][638]='Зөвшөөрсөн тоо';
	Ext.sfa.translate_arrays['mon'][639]='Захиалгийн тайлан';
	Ext.sfa.translate_arrays['mon'][645]='Борлуулалтын тайлан';
	Ext.sfa.translate_arrays['mon'][641]='Жолооч';
	Ext.sfa.translate_arrays['mon'][642]='Машины нэр';
	Ext.sfa.translate_arrays['mon'][643]='Машины мэдээлэл';
	Ext.sfa.translate_arrays['mon'][644]='Багтаамж';
	Ext.sfa.translate_arrays['mon'][646]='Ачилт түгээлтийн тайлан';
	Ext.sfa.translate_arrays['mon'][647]='Тайлангийн төрөл';
	Ext.sfa.translate_arrays['mon'][649]='Эд хөрөнгийн бүртгэл';
	Ext.sfa.translate_arrays['mon'][650]='Хөрөнгийн нэр';
	Ext.sfa.translate_arrays['mon'][651]='Сериал дугаар';
	Ext.sfa.translate_arrays['mon'][652]='Тушаах';
	Ext.sfa.translate_arrays['mon'][653]='Төлөвлөгөө засах';
	Ext.sfa.translate_arrays['mon'][654]='Хайрцгаар';
	Ext.sfa.translate_arrays['mon'][655]='Бараа олголтын тайлан';
	Ext.sfa.translate_arrays['mon'][658]='Урамшуулалд оногдох дүн';
	Ext.sfa.translate_arrays['mon'][680]='Борлуулалт падаанаар';
	Ext.sfa.translate_arrays['mon'][659]='Урамшуулалын дүн';	
	Ext.sfa.translate_arrays['mon'][668]='';	
	Ext.sfa.translate_arrays['mon'][669]='Үнэлгээ';	
	Ext.sfa.translate_arrays['mon'][630]='';
	Ext.sfa.translate_arrays['mon'][631]='';
	Ext.sfa.translate_arrays['mon'][632]='Замд явж байгаа ';
	Ext.sfa.translate_arrays['mon'][633]='Гааль дээр';
	Ext.sfa.translate_arrays['mon'][634]='Төв агуулах ';
	Ext.sfa.translate_arrays['mon'][635]='';
	Ext.sfa.translate_arrays['mon'][499]='Бүх борлуулагчид';
	Ext.sfa.translate_arrays['mon'][559]='алдаа гарлаа!';
	Ext.sfa.translate_arrays['mon'][560]='мэдээллийг бүрэн оруулна уу';
	Ext.sfa.translate_arrays['mon'][561]='эхний тоо';
	Ext.sfa.translate_arrays['mon'][562]='эхний дүн';
	Ext.sfa.translate_arrays['mon'][563]='борлуулсан дүн';
	Ext.sfa.translate_arrays['mon'][564]='борлуулсан тоо';
	Ext.sfa.translate_arrays['mon'][565]='зээл дүн';
	Ext.sfa.translate_arrays['mon'][566]='зээл тоо';
	Ext.sfa.translate_arrays['mon'][567]='эцсийн тоо';
	Ext.sfa.translate_arrays['mon'][568]='эцсийн дүн';
	Ext.sfa.translate_arrays['mon'][569]='нэмж тоо';
	Ext.sfa.translate_arrays['mon'][570]='нэмж дүн';
	Ext.sfa.translate_arrays['mon'][571]='тооллого хийх ';
	Ext.sfa.translate_arrays['mon'][572]='өрөлт хийх';
	Ext.sfa.translate_arrays['mon'][573]='бөөний';
	Ext.sfa.translate_arrays['mon'][574]='зээлийн';
	Ext.sfa.translate_arrays['mon'][575]='Бараа олголт';
	Ext.sfa.translate_arrays['mon'][576]='боломжгүй';
	Ext.sfa.translate_arrays['mon'][577]='хийгээгүй';
	Ext.sfa.translate_arrays['mon'][578]='идэвхтэй харилцагчид';
	Ext.sfa.translate_arrays['mon'][579]='идэвхгүй харилцагчид';
	Ext.sfa.translate_arrays['mon'][580]='борлуулагчаар';
	Ext.sfa.translate_arrays['mon'][581]='худалдан авалт';
	Ext.sfa.translate_arrays['mon'][582]='харилцагчаар';
	Ext.sfa.translate_arrays['mon'][586]='ажил оруулах';
	Ext.sfa.translate_arrays['mon'][587]='оруулах уу?';
	Ext.sfa.translate_arrays['mon'][588]='алдаа!';
	Ext.sfa.translate_arrays['mon'][589]='Харилцагч ба борлуулагчийг сонгоно уу!';
	Ext.sfa.translate_arrays['mon'][590]='захиалга илгээх үү?';
	Ext.sfa.translate_arrays['mon'][591]='бүлэг';
	Ext.sfa.translate_arrays['mon'][592]='суваг';
	Ext.sfa.translate_arrays['mon'][593]='ачааллаж байна';
	Ext.sfa.translate_arrays['mon'][604]='Борлуулагчийн дэлгэрэнгүй';
	Ext.sfa.translate_arrays['mon'][605]='Графикаар харах';
	Ext.sfa.translate_arrays['mon'][606]='группээр харах';
	Ext.sfa.translate_arrays['mon'][607]='1,4 гариг';
	Ext.sfa.translate_arrays['mon'][608]='2,5 гариг';
	Ext.sfa.translate_arrays['mon'][609]='3,6 гариг';
	Ext.sfa.translate_arrays['mon'][610]='муу (0-50 ширхэг)';
	Ext.sfa.translate_arrays['mon'][611]='дунд (50-200 ширхэг)';
	Ext.sfa.translate_arrays['mon'][612]='сайн (200 аас дээш ширхэг)';
	Ext.sfa.translate_arrays['mon'][625]='Нийт зээлийн дүн';
	Ext.sfa.translate_arrays['mon'][626]='Борлуулагч дээрх зээл';
	Ext.sfa.translate_arrays['mon'][627]='Харилцагч дээрх зээл';
	Ext.sfa.translate_arrays['mon'][628]='Хамгийн их зээлтэй харилцагч';
	Ext.sfa.translate_arrays['mon'][629]='Хамгийн их зээлтэй борлуулагч';
	Ext.sfa.translate_arrays['mon'][583]='';
	Ext.sfa.translate_arrays['mon'][636]='Аюулгүйн нөөц';
	Ext.sfa.translate_arrays['mon'][656]='Давтамж';
	Ext.sfa.translate_arrays['mon'][258]='Шинэ захиалга';
	Ext.sfa.translate_arrays['mon'][259]='Өнөөдөр';
	Ext.sfa.translate_arrays['mon'][260]='Борлуулалт шалгах';
	Ext.sfa.translate_arrays['mon'][261]='Live  борлуулагчид';
	Ext.sfa.translate_arrays['mon'][262]='Manual борлуулагчид';
	Ext.sfa.translate_arrays['mon'][263]='Лавлагаа';
	Ext.sfa.translate_arrays['mon'][264]='Борлуулагчидын мэдээлэл';
	Ext.sfa.translate_arrays['mon'][265]='Харилцагчидийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][266]='Борлуулалтын  чиглэл';
	Ext.sfa.translate_arrays['mon'][267]='Чиглэлийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][268]='Чиглэл засах';
	Ext.sfa.translate_arrays['mon'][269]='Календар';
	Ext.sfa.translate_arrays['mon'][270]='Барааны мэдээлэл';
	Ext.sfa.translate_arrays['mon'][271]='Агуулахын мэдээлэл';
	Ext.sfa.translate_arrays['mon'][272]='Барааны үнэ оруулах';
	Ext.sfa.translate_arrays['mon'][273]='Багц зарлах';
	Ext.sfa.translate_arrays['mon'][487]='Үндсэн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][274]='Борлуулагчидын суваг';
	Ext.sfa.translate_arrays['mon'][275]='Агуулахын жагсаалт';
	Ext.sfa.translate_arrays['mon'][276]='Тавиурын жагсаалт';
	Ext.sfa.translate_arrays['mon'][277]='Борлуулалт & Төлөвлөгөө';
	Ext.sfa.translate_arrays['mon'][278]='Борлуулагчидын захиалга';
	Ext.sfa.translate_arrays['mon'][279]='Бараа олгох';
	Ext.sfa.translate_arrays['mon'][280]='Борлуулагчидын үлдэгдэл';
	Ext.sfa.translate_arrays['mon'][281]='Борлуулагчидын чиглэлийн үзүүлэлт';
	Ext.sfa.translate_arrays['mon'][282]='Зээлийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][283]='Борлуулагчаар харах';
	Ext.sfa.translate_arrays['mon'][284]='Харилцагчаар харах';
	Ext.sfa.translate_arrays['mon'][285]='Төлөвлөгөө';
	Ext.sfa.translate_arrays['mon'][286]='Гүйцэтгэл';
	Ext.sfa.translate_arrays['mon'][287]='Мөнгөн дүнгийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][288]='Борлуулагчидын явах чиглэл';
	Ext.sfa.translate_arrays['mon'][289]='Тусгай даалгавар';
	Ext.sfa.translate_arrays['mon'][290]='Тусгай даалгавар оноох';
	Ext.sfa.translate_arrays['mon'][291]='Тооллогын үр дүн';
	Ext.sfa.translate_arrays['mon'][292]='Өрөлтийн зурагууд';
	Ext.sfa.translate_arrays['mon'][293]='Захиалга гараар оруулах';
	Ext.sfa.translate_arrays['mon'][294]='Борлуулалт гараар оруулах';
	Ext.sfa.translate_arrays['mon'][295]='Борлуулалт засах';
	Ext.sfa.translate_arrays['mon'][296]='Дэлгэцүүд ';
	Ext.sfa.translate_arrays['mon'][297]='Харилцагчидын байршил';
	Ext.sfa.translate_arrays['mon'][298]='Борлуулагчидын байршил';
	Ext.sfa.translate_arrays['mon'][299]='Тайлан';
	Ext.sfa.translate_arrays['mon'][300]='Бараагаар тайлан авах';
	Ext.sfa.translate_arrays['mon'][301]='Харилцагчидаар тайлан авах';
	Ext.sfa.translate_arrays['mon'][302]='Тохиргоо';
	Ext.sfa.translate_arrays['mon'][303]='Үндсэн тохиргоо';
	Ext.sfa.translate_arrays['mon'][304]='Энгийн горим/Үндсэн горим';
	Ext.sfa.translate_arrays['mon'][305]='Тусламж';
	Ext.sfa.translate_arrays['mon'][306]='Заавар';
	Ext.sfa.translate_arrays['mon'][307]='Програмын тухай';
	Ext.sfa.translate_arrays['mon'][308]='Гарах';
	Ext.sfa.translate_arrays['mon'][309]='Нийт бэлэн борлуулалт';
	Ext.sfa.translate_arrays['mon'][310]='Борлуулагч';
	Ext.sfa.translate_arrays['mon'][311]='Зээл төлөлт оруулах';
	Ext.sfa.translate_arrays['mon'][312]='Зээл дүн';
	Ext.sfa.translate_arrays['mon'][313]='Бэлэн дүн';
	Ext.sfa.translate_arrays['mon'][314]='Нийт';
	Ext.sfa.translate_arrays['mon'][315]='Бөөний зах';
	Ext.sfa.translate_arrays['mon'][316]='Жижиглэн';
	Ext.sfa.translate_arrays['mon'][317]='ХОН';
	Ext.sfa.translate_arrays['mon'][318]='Зочид буудал';
	Ext.sfa.translate_arrays['mon'][319]='Ресторан';
	Ext.sfa.translate_arrays['mon'][320]='Караоке';
	Ext.sfa.translate_arrays['mon'][321]='Идэвхтэй';
	Ext.sfa.translate_arrays['mon'][322]='Борлуулалт хийгээгүй 30-аас дээш минут';
	Ext.sfa.translate_arrays['mon'][323]=' -ий дэлгэрэнгүй';
	Ext.sfa.translate_arrays['mon'][324]='Борлуулалтын үзүүлэлт';
	Ext.sfa.translate_arrays['mon'][325]='Борлуулагчийн дэлгэрэнгүй';
	Ext.sfa.translate_arrays['mon'][326]='Харах ';
	Ext.sfa.translate_arrays['mon'][327]='Хаах';
	Ext.sfa.translate_arrays['mon'][328]='Мэдээлэл';
	Ext.sfa.translate_arrays['mon'][329]='Утга ';
	Ext.sfa.translate_arrays['mon'][330]='Тайлбар';
	Ext.sfa.translate_arrays['mon'][331]='Нэр';
	Ext.sfa.translate_arrays['mon'][332]='Чиглэл';
	Ext.sfa.translate_arrays['mon'][333]='Сарын';
	Ext.sfa.translate_arrays['mon'][334]='Долоо хоног';
	Ext.sfa.translate_arrays['mon'][335]='Үлдэгдэл зээл';
	Ext.sfa.translate_arrays['mon'][336]='Төлөвлөгөө';
	Ext.sfa.translate_arrays['mon'][337]='Биелэлт';
	Ext.sfa.translate_arrays['mon'][338]='Сарын борлуулалт';
	Ext.sfa.translate_arrays['mon'][339]='Энэ  7 хоногийн борлуулалт';
	Ext.sfa.translate_arrays['mon'][340]='Зээлээр өгсөн';
	Ext.sfa.translate_arrays['mon'][341]='Огноо';
	Ext.sfa.translate_arrays['mon'][342]='Орсон';
	Ext.sfa.translate_arrays['mon'][343]='Борлуулсан ';
	Ext.sfa.translate_arrays['mon'][344]='Нийт';
	Ext.sfa.translate_arrays['mon'][345]='Бараа';
	Ext.sfa.translate_arrays['mon'][346]='Зээлээр';
	Ext.sfa.translate_arrays['mon'][347]='Бэлнээр';
	Ext.sfa.translate_arrays['mon'][348]='Мэдээлэл';
	Ext.sfa.translate_arrays['mon'][349]='Тоон үзүүлэлт';
	Ext.sfa.translate_arrays['mon'][350]='Тайлбар';
	Ext.sfa.translate_arrays['mon'][351]='Бэлэн борлуулалт';
	Ext.sfa.translate_arrays['mon'][352]='Зээлээр өгсөн';
	Ext.sfa.translate_arrays['mon'][353]='Нийт орлого';
	Ext.sfa.translate_arrays['mon'][354]='Нийт гаргасан барааны дүн';
	Ext.sfa.translate_arrays['mon'][355]='Ажиллаж байгаа борлуулагч';
	Ext.sfa.translate_arrays['mon'][356]='Топ борлуулагч';
	Ext.sfa.translate_arrays['mon'][357]='Муу борлуулагч';
	Ext.sfa.translate_arrays['mon'][358]='Удаан борлуулалт хийгээгүй борлуулагч';
	Ext.sfa.translate_arrays['mon'][359]='Топ худалдан авагч';
	Ext.sfa.translate_arrays['mon'][360]='Топ борлуулалттай бараа';
	Ext.sfa.translate_arrays['mon'][361]='Мэдээнд харгалзах огноо';
	Ext.sfa.translate_arrays['mon'][362]='Борлуулалтын график';
	Ext.sfa.translate_arrays['mon'][363]='Борлуулагчийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][364]='Харах';
	Ext.sfa.translate_arrays['mon'][365]='Шинэ борлуулагч нэмэх';
	Ext.sfa.translate_arrays['mon'][366]='Устгах';
	Ext.sfa.translate_arrays['mon'][367]='Тусламж';
	Ext.sfa.translate_arrays['mon'][368]='Хаах';
	Ext.sfa.translate_arrays['mon'][369]='Код';
	Ext.sfa.translate_arrays['mon'][370]='Нууц үг';
	Ext.sfa.translate_arrays['mon'][371]='Бүлэг';
	Ext.sfa.translate_arrays['mon'][372]='Байршил';
	Ext.sfa.translate_arrays['mon'][373]='Нэр';
	Ext.sfa.translate_arrays['mon'][374]='Овог';
	Ext.sfa.translate_arrays['mon'][375]='Агуулах';
	Ext.sfa.translate_arrays['mon'][376]='Идэвхтэй ';
	Ext.sfa.translate_arrays['mon'][377]='Идэвхгүй';
	Ext.sfa.translate_arrays['mon'][378]='Төв агуулах';
	Ext.sfa.translate_arrays['mon'][379]='Орон нутаг';
	Ext.sfa.translate_arrays['mon'][380]='Чиглэл сонгоно уу!';
	Ext.sfa.translate_arrays['mon'][381]='Шинэ харилцагч нэмэх';
	Ext.sfa.translate_arrays['mon'][382]='Импорт';
	Ext.sfa.translate_arrays['mon'][383]='Том жижиг үсэгээр ялгаж хайх';
	Ext.sfa.translate_arrays['mon'][384]='Байршил';
	Ext.sfa.translate_arrays['mon'][385]='Төрөл';
	Ext.sfa.translate_arrays['mon'][386]='Захирал';
	Ext.sfa.translate_arrays['mon'][387]='Хариуцагч';
	Ext.sfa.translate_arrays['mon'][388]='Утас';
	Ext.sfa.translate_arrays['mon'][389]='Тавиур';
	Ext.sfa.translate_arrays['mon'][390]='Бүртгэгдсэн';
	Ext.sfa.translate_arrays['mon'][391]='Өмч ';
	Ext.sfa.translate_arrays['mon'][392]='Үнэ';
	Ext.sfa.translate_arrays['mon'][393]='Хайх утга';
	Ext.sfa.translate_arrays['mon'][394]='Өдөр';
	Ext.sfa.translate_arrays['mon'][395]='Жил';
	Ext.sfa.translate_arrays['mon'][396]='Идэвхтэй';
	Ext.sfa.translate_arrays['mon'][397]='Амралт';
	Ext.sfa.translate_arrays['mon'][398]='Шинэ бараа нэмэх';
	Ext.sfa.translate_arrays['mon'][399]='Баркод';
	Ext.sfa.translate_arrays['mon'][400]='Төлөв';
	Ext.sfa.translate_arrays['mon'][401]='Тайлбар';
	Ext.sfa.translate_arrays['mon'][402]='Эрэмбэ';
	Ext.sfa.translate_arrays['mon'][403]='Зураг';
	Ext.sfa.translate_arrays['mon'][404]='Агуулахын мэдээлэл';
	Ext.sfa.translate_arrays['mon'][405]='Орлогдох';
	Ext.sfa.translate_arrays['mon'][406]='Барааны код ';
	Ext.sfa.translate_arrays['mon'][407]='Багцын мэдээлэл';
	Ext.sfa.translate_arrays['mon'][408]='Багцын нэр';
	Ext.sfa.translate_arrays['mon'][409]='Эхлэл';
	Ext.sfa.translate_arrays['mon'][410]='Дуусах';
	Ext.sfa.translate_arrays['mon'][411]='Чиглэл';
	Ext.sfa.translate_arrays['mon'][412]='Барааны нэр';
	Ext.sfa.translate_arrays['mon'][413]='Тоо';
	Ext.sfa.translate_arrays['mon'][414]='Үнэ';
	Ext.sfa.translate_arrays['mon'][415]='Сонголт';
	Ext.sfa.translate_arrays['mon'][416]='Шинээр үүсгэх';
	Ext.sfa.translate_arrays['mon'][417]='Оруулах';
	Ext.sfa.translate_arrays['mon'][418]='ID';
	Ext.sfa.translate_arrays['mon'][419]='Үнийн сонголт';
	Ext.sfa.translate_arrays['mon'][420]='Шинэ захиалга харах';
	Ext.sfa.translate_arrays['mon'][421]='Зөвшөөрөх';
	Ext.sfa.translate_arrays['mon'][422]='Үлдэгдэл харах';
	Ext.sfa.translate_arrays['mon'][423]='Огноо';
	Ext.sfa.translate_arrays['mon'][424]='Бодит үлд';
	Ext.sfa.translate_arrays['mon'][425]='Боломжит үлд';
	Ext.sfa.translate_arrays['mon'][426]='Захиалсан ';
	Ext.sfa.translate_arrays['mon'][427]='Олгох';
	Ext.sfa.translate_arrays['mon'][428]='Эхний үлдэгдэл';
	Ext.sfa.translate_arrays['mon'][429]='Нэмж авсан';
	Ext.sfa.translate_arrays['mon'][430]='Борлуулсан';
	Ext.sfa.translate_arrays['mon'][432]='Эцсийн үлдэгдэл';
	Ext.sfa.translate_arrays['mon'][433]='Үнийн дүн';
	Ext.sfa.translate_arrays['mon'][434]='Тоо';
	Ext.sfa.translate_arrays['mon'][435]='Борлуулагчидын чиглэлийн үзүүлэлт';
	Ext.sfa.translate_arrays['mon'][436]='Орсон';
	Ext.sfa.translate_arrays['mon'][437]='Үлдсэн';
	Ext.sfa.translate_arrays['mon'][438]='Борлуулсан';
	Ext.sfa.translate_arrays['mon'][439]='Нийт';
	Ext.sfa.translate_arrays['mon'][440]='Зээлийн мэдээлэл';
	Ext.sfa.translate_arrays['mon'][441]='Харилцагч';
	Ext.sfa.translate_arrays['mon'][442]='Зээлийн дүн';
	Ext.sfa.translate_arrays['mon'][443]='Төлсөн';
	Ext.sfa.translate_arrays['mon'][444]='Үлдэгдэл';
	Ext.sfa.translate_arrays['mon'][445]='Зээл';
	Ext.sfa.translate_arrays['mon'][446]='Жижиг зах';
	Ext.sfa.translate_arrays['mon'][447]='Үнийн дүнгээр';
	Ext.sfa.translate_arrays['mon'][448]='Төлөвлөгөөний нэр';
	Ext.sfa.translate_arrays['mon'][449]='Төлөвлөгөө нэмэх';
	Ext.sfa.translate_arrays['mon'][450]='Төлөвлөгөө устгах';
	Ext.sfa.translate_arrays['mon'][451]='Борлуулагчидын гүйцэтгэл';
	Ext.sfa.translate_arrays['mon'][452]='Нэгтгэж харах';
	Ext.sfa.translate_arrays['mon'][453]='Баланс';
	Ext.sfa.translate_arrays['mon'][454]='Нийлбэр';
	Ext.sfa.translate_arrays['mon'][455]='Дүнгээр';
	Ext.sfa.translate_arrays['mon'][456]='Чиглэл харах';
	Ext.sfa.translate_arrays['mon'][457]='Даваа';
	Ext.sfa.translate_arrays['mon'][458]='Мягмар';
	Ext.sfa.translate_arrays['mon'][459]='Лхагва';
	Ext.sfa.translate_arrays['mon'][460]='Пүрэв';
	Ext.sfa.translate_arrays['mon'][461]='Баасан';
	Ext.sfa.translate_arrays['mon'][462]='Бямба';
	Ext.sfa.translate_arrays['mon'][463]='Ням';
	Ext.sfa.translate_arrays['mon'][464]='Тусгай даалгавар';
	Ext.sfa.translate_arrays['mon'][465]='Шинэ ажил нэмэх';
	Ext.sfa.translate_arrays['mon'][466]='Харилцагч ';
	Ext.sfa.translate_arrays['mon'][467]='Ажил';
	Ext.sfa.translate_arrays['mon'][468]='Биелэлт';
	Ext.sfa.translate_arrays['mon'][469]='Харилцагч сонгоно уу!';
	Ext.sfa.translate_arrays['mon'][470]='Борлуулагч сонгоно уу!';
	Ext.sfa.translate_arrays['mon'][471]='Цэвэрлэх';
	Ext.sfa.translate_arrays['mon'][472]='Үнэ 1';
	Ext.sfa.translate_arrays['mon'][473]='Үнэ 2';
	Ext.sfa.translate_arrays['mon'][474]='Үнэ 3';
	Ext.sfa.translate_arrays['mon'][475]='Үнэ 4';
	Ext.sfa.translate_arrays['mon'][476]='Үнэ 5';
	Ext.sfa.translate_arrays['mon'][477]='Бараа';
	Ext.sfa.translate_arrays['mon'][478]='Зээлээр дүн';
	Ext.sfa.translate_arrays['mon'][479]='Бэлнээр дүн';
	Ext.sfa.translate_arrays['mon'][480]='Үзүүлэлт';
	Ext.sfa.translate_arrays['mon'][481]='Эхлэх';
	Ext.sfa.translate_arrays['mon'][482]='Бараагаар харах';
	Ext.sfa.translate_arrays['mon'][483]='Зээлээр авсан дүн';
	Ext.sfa.translate_arrays['mon'][484]='Худалдан авалтын дүн';
	Ext.sfa.translate_arrays['mon'][485]='Өөрчлөлт хийвэл заавал програмыг дахин ачаална уу!';
	Ext.sfa.translate_arrays['mon'][486]='Дэлгэрэнгүй';
	Ext.sfa.translate_arrays['mon'][598]='Зээл өгсөн';
	Ext.sfa.translate_arrays['mon'][599]='нийт борлуулагчидын тоо';
	Ext.sfa.translate_arrays['mon'][600]='хаалттай';
	Ext.sfa.translate_arrays['mon'][601]='аваагүй';
	Ext.sfa.translate_arrays['mon'][602]='багцаар';
	Ext.sfa.translate_arrays['mon'][603]='сүлжээ ';
	Ext.sfa.translate_arrays['mon'][648]='Нэгж';
	Ext.sfa.translate_arrays['mon'][681]='Авсан захиалга';
	Ext.sfa.translate_arrays['mon'][700]='Чиглэл шилжүүлэх';
	Ext.sfa.translate_arrays['mon'][701]='Урамшуулалын тайлан';
	Ext.sfa.translate_arrays['mon'][702]='Захиалгын дүн';
	Ext.sfa.translate_arrays['mon'][703]='Мөнгөн дүнгээр';
	loaded++;
}
	    		
initApp = function() {		
	form_data_store.load({params:{xml:_donate('_get_table_info', 'SELECT', ' ', ' ', ' ', ' ')}, callback: function() {
		
		loaded++; callMain();																			
		loaded++; initLang();

		/*languageData.load({params:{xml:_donate('Language', 'SELECT', 'Language', 'id,mon,rus,eng', 'i,s,s,s', ' ')},				
			callback: function() {					
				languageData.each(function(rec){							
					Ext.sfa.translate_arrays['mon'][rec.data['id']] = rec.data['mon'];
					Ext.sfa.translate_arrays['rus'][rec.data['id']] = rec.data['rus'];
					Ext.sfa.translate_arrays['eng'][rec.data['id']] = rec.data['eng'];
		        });								
			}
		});*/
		
		for (i = 0; i < Ext.sfa.genFun.length; i++) {
			generateFunction(Ext.sfa.genFun[i][0], Ext.sfa.genFun[i][1], Ext.sfa.genFun[i][2], Ext.sfa.genKeys[i], Ext.sfa.genFun[i][3], Ext.sfa.genFun[i][4], Ext.sfa.genFun[i][5]);
		}
						
		callMain();
		loadOptimalDatas();
	}});
}


var Utf8 = {
 
	// public method for url encoding
	encode : function (string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	},
 
	// public method for url decoding
	decode : function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;
 
		while ( i < utftext.length ) {
 
			c = utftext.charCodeAt(i);
 
			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			}
			else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			}
			else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
 
		}
 
		return string;
	}
 
}

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
function encode64(input)
{
	input = escape(input)
	var output = ""
	var chr1, chr2, chr3 = ""
	var enc1, enc2, enc3, enc4 = ""
	var i = 0
	do
	{
		chr1 = input.charCodeAt(i++)
		chr2 = input.charCodeAt(i++)
		chr3 = input.charCodeAt(i++)
		enc1 = chr1 >> 2
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
		enc4 = chr3 & 63
		if (isNaN(chr2))
		{
			enc3 = enc4 = 64
		}
		else if (isNaN(chr3))
		{
			enc4 = 64
		}
		output = output +
		keyStr.charAt(enc1) +
		keyStr.charAt(enc2) +
		keyStr.charAt(enc3) +
		keyStr.charAt(enc4)
		chr1 = chr2 = chr3 = ""
		enc1 = enc2 = enc3 = enc4 = ""
	}
	while(i < input.length)
	return output
}

function base64_encode (data) {
  // http://kevin.vanzonneveld.net
  // +   original by: Tyler Akins (http://rumkin.com)
  // +   improved by: Bayron Guevara
  // +   improved by: Thunder.m
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   bugfixed by: Pellentesque Malesuada
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Rafał Kukawski (http://kukawski.pl)
  // *     example 1: base64_encode('Kevin van Zonneveld');
  // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
  // mozilla has this native
  // - but breaks in 2.0.0.12!
  //if (typeof this.window['btoa'] == 'function') {
  //    return btoa(data);
  //}
  var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
    ac = 0,
    enc = "",
    tmp_arr = [];

  if (!data) {
    return data;
  }

  do { // pack three octets into four hexets
    o1 = data.charCodeAt(i++);
    o2 = data.charCodeAt(i++);
    o3 = data.charCodeAt(i++);

    bits = o1 << 16 | o2 << 8 | o3;

    h1 = bits >> 18 & 0x3f;
    h2 = bits >> 12 & 0x3f;
    h3 = bits >> 6 & 0x3f;
    h4 = bits & 0x3f;

    // use hexets to index into b64, and append result to encoded string
    tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  } while (i < data.length);

  enc = tmp_arr.join('');

  var r = data.length % 3;

  return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

}


/**
 * 
 */

Ext.sfa.renderer_arrays[''] = function renderDefault(v) {
	return v;
}

Ext.sfa.renderer_arrays['renderPasswordChar'] = function renderPasswordChar(v) {		
	return "****";
}

Ext.sfa.renderer_arrays['renderDate'] = Ext.util.Format.dateRenderer('Y-m-d');

Ext.sfa.renderer_arrays['renderSettings'] = function renderSettings(v, p, r) {
	if (r.data['descr'] == 'product')
		return Ext.sfa.renderer_arrays['renderProductCode'](v);
	
	return v;
}

Ext.sfa.renderer_arrays['renderPriceTag'] = function renderCustomerType(v) {
	return Ext.sfa.translate_arrays[langid][392]+(v+1);
}

Ext.sfa.stores['yesNo'] = Ext.create('Ext.data.ArrayStore', {
    fields: ['value', 'name'],
    data : [[0, 'No'],
            [1, 'Yes']]
});


Ext.sfa.renderer_arrays['renderItemAble'] = function renderItemAble(v) {
	if (v == 1)
		return 'Байгаа';
	else
		return '';			
}

Ext.sfa.renderer_arrays['renderBelong'] = function renderSpecialWorkType(v) {
	if (v == 1)
		return 'Yes';
	else
		return 'No';			
}

Ext.sfa.renderer_arrays['renderSpecialWorkType'] = function renderSpecialWorkType(v) {
	if (v == 0)
		return Ext.sfa.translate_arrays[langid][571];
	else
		return Ext.sfa.translate_arrays[langid][572];			
}

Ext.sfa.renderer_arrays['renderYesNo'] = function renderYesNo(v) {
	if (v == 0)
		return '<span  style="color:red;">No</span>';
	else
		return '<span  style="color:green;">Yes</span>';			
}

Ext.sfa.renderer_arrays['renderStands'] = function renderStands(v) {
	return v;
	/*
	var split = v.split('|');
	
	if (stands_array.length == 0)
	{
		for (i = 0; i < stands.getCount(); i++) {
			var record = stands.getAt(i);
			stands_array[record.data['standID']] = record.data['standName']; 			 
		}	
	}
	
	var result = '';
	
	for (i = 0; i < split.length; i++) {
		if (stands_array[split[i]])
			result += stands_array[split[i]]+',';
	}
	return result;*/
}

function renderRoutes(v) {	
	var sp = v.split('|');				
	var result = '';
	for (i = 0; i < sp.length; i++) {		
		result += (renderRouteID(sp[i])+',');
	}
	
	return result;
}

function renderOnlyDay(v) {		
	return v.substring(13, 8);
}

function renderSummaryNumber(v, p, record) {    		
    return '<b>' + Ext.util.Format.number(v, '00,00,000') + '</b>';	       
}

function renderIcon(value, p, record) {
	if (value == Ext.sfa.translate_arrays[langid][258])
		return "<img src='shared/icons/fam/order.png' style='margin-top:6px'>";
	
	if (value == Ext.sfa.translate_arrays[langid][575])
		return "<img src='shared/icons/fam/order_complete.png' style='margin-top:6px'>";
	
	return "<img src='shared/icons/fam/storage.png' style='margin-top:6px'>";
}

function renderTopic(value, p, record) {	    	
	return Ext.String.format(
            '<b style="margin-top:-6px">{0}</b><br>{1}',
            value,
            record.data.text);
}

Ext.sfa.renderer_arrays['renderStorageNumber'] = function renderStorageNumber(v, p, record) {
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var rec = Ext.sfa.stores['product_list'].getAt(i);
		if (rec.get('code') == record.data['productCode']) {			
			if (rec.get('_type') > v) 
				return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
			else
				return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
		}		
	}
	
	
	if(v >= 5000)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
	else
	if(v >= 1000)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';        
}

function renderStorageInfo(v) {
	if(v >= 5000)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
	else
	if(v >= 1000)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';        
}

function renderModuleNumber(v, p, record) {    	
	if (v == 0)
		return '';
	else {
		if (record.data['moduleName'].charAt('0') >= '0' && record.data['moduleName'].charAt('0') <= 9)
			return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
		else
			return '<span style="color:black;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
	}
}

Ext.sfa.renderer_arrays['renderNumber'] = function renderNumber(v, metaData, record, rowIndex, colIndex, store, grid) {
	if (box) {		
		var columns = grid.headerCt.getGridColumns();
		var name = columns[colIndex].dataIndex;
	
		var store = Ext.sfa.stores['product_list'].queryBy(function fn(record,id) {				 
			return record.get('code') == name;
		});
		if (store.getCount()>0)
			v = v/store.getAt(0).data['unit'];
	}
	
	if (v == 0)
		return '';
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
	else
	if(v >= 10)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
}

function renderNumber(v) {
	if (v == 0)
		return '';
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
	else
	if(v >= 10)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
}

Ext.sfa.renderer_arrays['renderFNumber'] = function renderNumber(v, p, record) {
	if (v == 0)
		return '';
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000.00') + '</span>';
	else
	if(v >= 10)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000.00') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000.00') + '</span>';
}

Ext.sfa.renderer_arrays['renderEntryNumber'] = function renderNumber(v, p, record) {
	if (v == 0)
		return '';
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
	else
	if(v >= 10)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000') + '</span>';
}

Ext.sfa.renderer_arrays['renderModuleNumber'] = function renderModuleNumber(value, metaData, record, rowIndex, colIndex, store) {
	if (value == 0)
		return '';
	
	var fieldName = weekFields[colIndex-3];	
	metaData.tdAttr = 'data-qtip="' + record.data['comment'+fieldName] +'"';
	var p = '';
	if (record.data['comment'+fieldName]) p ='*';
	if (value < 0)
		return '<span style="color:red;">' + Ext.util.Format.number(value, '00,00,000') + p + '</span>';
	
	return '<span style="color:green;">' + Ext.util.Format.number(value, '00,00,000') + p + '</span>';	       
}

Ext.sfa.renderer_arrays['renderTNumber'] = function renderTNumber(v, p, record) {    		
    return '<b style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000') + '</b>';	       
}

Ext.sfa.renderer_arrays['renderGPS'] = function renderTNumber(v, p, record) {    		
	if (record.data['posx'] > 0)
	    return '<b style="font-size:11px">' + v + '</b>';	    
	else
		return v;	 
}

Ext.sfa.renderer_arrays['renderLNumber'] = function renderLNumber(v, p, record) {	
	if (v == 0)
		return '';
	if(v >= 200)
        return '<span style="color:green; font-size:17px"><b>' + Ext.util.Format.number(v, '00,00,000') + '</b></span>';
	else
	if(v >= 50)
        return '<span style="color:orange; font-size:17px"><b>' + Ext.util.Format.number(v, '00,00,000') + '</b></span>';
    else
        return '<span style="color:red; font-size:17px"><b>' + Ext.util.Format.number(v, '00,00,000') + '</b></span>';        
}

function renderMoneyValue(v) {
	if (hidden_values['show_money_value'] == 'off')
		return '-.--';
	
	return Ext.util.Format.number(v, '00,00,000.00')+'₮';
}


Ext.sfa.renderer_arrays['renderPriceMoney'] = function renderPriceMoney(v, p, record) {	
	v = record.data['price']*record.data['count'];
	if (v == 0)
		return '';
	if(v >= 200)
        return '<span style="color:green; font-size:11px">' + Ext.util.Format.number(v, '00,00,000') + '₮</span>';
	else
	if(v >= 50)
        return '<span style="color:orange; font-size:11px">' + Ext.util.Format.number(v, '00,00,000') + '₮</span>';
    else
        return '<span style="color:red; font-size:11px">' + Ext.util.Format.number(v, '00,00,000') + '₮</span>';        
}



Ext.sfa.renderer_arrays['renderSurvey'] = function renderSurvey(v, p, r) {
	if (v == 1)
		return '<img src="shared/icons/fam/y.png"/>';
	if (v ==0 )
	return '';
	
	return v;
}

function renderFind(v, p, r) {
	if (v == 0) return '';
	
	return Ext.sfa.renderer_arrays[r.data['render']](v, p, r);
}

Ext.sfa.renderer_arrays['renderMoney'] = function renderMoney(v,metaData,record,colIndex,store,view) {
//	metaData.tdAttr = 'data-qtip="Double click : Дэлгэрэнгүй харах"';
	
	if (hidden_values['show_money_value'])
		return '-.--';
		
	if (v == 0)
		return '';
	
	//if (record.data && record.data['data'] == 355)		
		//return Ext.util.Format.number(v, '00,00,000')+currencyChr;	
	
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span>';
	else
	if(v >= 20)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span>';        
}

Ext.sfa.renderer_arrays['renderTMoney'] = function renderTMoney(v, p, record) {
	if (hidden_values['show_money_value'])
		return '-.--';
		
	if (v == 0)
		return '';
	if(v >= 50)
        return '<span style="color:green;"><b style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</b></span>';
	else
	if(v >= 20)
        return '<span style="color:orange;"><b style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</b></span>';
    else
        return '<span style="color:red;"><b style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</b></span>';        
}

Ext.sfa.renderer_arrays['renderLMoney'] = function renderMoney(v, p, record) {
	if (hidden_values['show_money_value'])
		return '-.--';
		
	if (v == 0)
		return '';
	if(v >= 1000000)
        return '<b><span style="color:green; font-size:12px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span></b>';
	else
	if(v >= 500000)
        return '<b ><span style="color:orange; font-size:12px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span></b>';
    else
        return '<span style="color:red; font-size:12px"><b>' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</b></span>';   
}

Ext.sfa.renderer_arrays['renderMMoney'] = function renderMoney(v, p, record) {
	if (hidden_values['show_money_value'])
		return '-.--';
		
	if (v == 0)
		return '';
	if(v >= 1000000)
        return '<b><span style="color:green; font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span></b>';
	else
	if(v >= 500000)
        return '<b ><span style="color:orange; font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span></b>';
    else
        return '<span style="color:red; font-size:11px"><b>' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</b></span>';   
}


Ext.sfa.renderer_arrays['renderSMoney'] = function renderSMoney(v, p, record) {
	if (hidden_values['show_money_value'])
		return '-.--';
		
    return Ext.util.Format.number(v, '00,00,000.00') + currencyChr;
}



Ext.sfa.renderer_arrays['renderFullMoney'] = function renderFullMoney(v, p, record) {    	
	if (hidden_values['show_money_value'])
		return '-.--';
	
	if (v == 0)
		return '';
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span>';
	else
	if(v >= 20)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000.00') + currencyChr+'</span>';        
}

function renderBelen(v, p, record) {		
	if (v == 0)	
		return '';	
		
    return '<span style="color:black;">' + v + '</span>';       
}

renderBelenZeel = function(name) {
	return function (value, metadata, record, rowIndex, colIndex, store) {
		if (value == 0)
			return '<span style="color:green;"></span>';								        
		else
		if (record.data && record.data[name+'A'] > 0 && record.data[name+'R'] > 0) {			
			return '<span style="color:orange;" title="'+('Зээл : '+record.data[name+'R'])+'">' + value + '</span>';
		} else
		if (record.data && record.data[name+'A'] > 0) {
			 if (record.data[name+'A'] == 0)
				return '<span style="color:green;"></span>';
			
			 return '<span style="color:green;">' + value + '</span>';
		} else		
		if (record.data && record.data[name+'R'] > 0) {
			 if (record.data[name+'R'] == 0)
				return '<span style="color:#3B5998;"></span>';
			 
			 return '<span style="color:#3B5998;">' + value + '</span>';
		} else										
			return '<span style="color:black;">' + value + '</span>';	
	}
}

function renderZeel(v, p, record) {
	if (v == 0)
		return '<span style="color:orange;"></span>';
		
    return '<span style="color:orange;">' + v + '</span>';       
}

function renderOrderNumber(v, p, record) {    	
	if (v == 0)
		return '<span style="color:red;">' + v + '</span>'
	if(v > 70)
        return '<span style="color:green;">' + v + '</span>';	       
}

Ext.sfa.renderer_arrays['renderUserPosition'] = function renderUserPosition(v) {	
	if (v < 5)
		return '<span style="color:green">'+Ext.sfa.translate_arrays[langid][321]+'</span>';	
	if (v >= 5)
		return '<span style="color:red">'+Ext.sfa.translate_arrays[langid][377]+'</span>';		
	
	return v;
}

Ext.sfa.renderer_arrays['renderUserCodeExtend'] = function renderUserCodeExtend(value, meta, record){
    meta.attr = 'ext:qtip="' + value + '"';
    return Ext.sfa.renderer_arrays['renderUserCode'](value)+'<a style=\"color:#3B5998\"> [dbclick]</a>';
}


Ext.sfa.renderer_arrays['renderSaleType'] = function renderSaleType(v) {
	if (v == 0)
		return '<span style="color:green;">'+Ext.sfa.translate_arrays[langid][313]+'</span>';
	if (v == 1)
		return '<span style="color:#3B5998;">'+Ext.sfa.translate_arrays[langid][312]+'</span>';	
	if (v == 2)
		return '<span style="color:orange;">'+Ext.sfa.translate_arrays[langid][573]+'</span>';	
	if (v == 3)
		return '<span style="color:#3B5998;">Зээл төлөлт</span>';
	if (v == 4)			
		return Ext.sfa.translate_arrays[langid][576];
	if (v == 5)			
		return Ext.sfa.translate_arrays[langid][577];
	
	if (v >= 10)
		return renderPacketCode(v);	
	
	return v;
}

function renderBPlanCountPercent(v, p, r) {
	//if (r)	
		//return r.get('countExecuted')*100/r.get('countTheshold');
	
	return 0;
}

function renderBPlanAmountPercent(v, p, r) {
	//if (r)
//		return r.get('amountExecuted')*100/r.get('amountTheshold');
	
	return 0;
}

function formatCurrency(num) {
    num = isNaN(num) || num === '' || num === null ? 0.00 : num;
    return parseFloat(num).toFixed(2);
}

function renderFloatNumber(v, p, r) {	
	return Ext.util.Format.number(v, '00,00.00');	
}

Ext.sfa.renderer_arrays['renderFloatNumber'] = function renderFloatNumber(v, p, r) {
	if (v == 0) return '';
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00.00') + '</span>';
	else
	if(v >= 20)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00.00') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00.00') + '</span>'; 
}

Ext.sfa.renderer_arrays['renderTFloatNumber'] = function renderFloatNumber(v, p, r) {	
	return '<b style="font-size:10px">'+Ext.util.Format.number(v, '00,00.00')+'</b>';	
}


Ext.sfa.renderer_arrays['renderPrecent'] = function renderPrecent(v, p, r) {
	if(v >= 50)
        return '<span style="color:green;">' + Ext.util.Format.number(v, '00,00,000.00%') + '</span>';
	else
	if(v >= 20)
        return '<span style="color:orange;">' + Ext.util.Format.number(v, '00,00,000.00%') + '</span>';
    else
        return '<span style="color:red;">' + Ext.util.Format.number(v, '00,00,000.00%') + '</span>';        
}

Ext.sfa.renderer_arrays['renderTPrecent'] = function renderTPrecent(v, p, r) {
	if(v >= 50)
        return '<b><span style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00%') + '</span></b>';
	else
	if(v >= 20)
        return '<b><span style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00%') + '</span></b>';
    else
        return '<b><span style="font-size:11px">' + Ext.util.Format.number(v, '00,00,000.00%') + '</span></b>';        
}

function renderIsNumber(v, p, r) {
	if (Number(v))
		return Ext.sfa.renderer_arrays['renderMoney'](v, p, r);
	
	return v;
}

function isNotNull(value) {
	if (typeof value == 'undefined') return false;
	if (!value) return false;
	if (value == 'null') return false;
	if (value == '') return false;
	
	return true;
}

function isInt(n) {
   return typeof n == 'number' && n % 1 == 0;
}

function renderDynamicNumberTotal(v, p, r) {		
	if(r.data['data'] == 'SKU %' || r.data['data'] == 'Amount %') {
		var n = 2;		
		return (isInt(v) ? v : v.toFixed(2))+(r.data['data'].indexOf('%')!=-1?'%':'');		
	}
	
	return Ext.util.Format.number(v, '00,00,000');
}

function renderDynamicNumber(v, p, r) {
	if (r.data['data'] == 'Amount') {
		return Ext.util.Format.number(v, '00,00,000');
	}
	
	if(r.data['data'] == 'SKU %' || r.data['data'] == 'Amount %') {
		var n = 2;		
		return (isInt(v) ? v : v.toFixed(2))+(r.data['data'].indexOf('%')!=-1?'%':'');		
	}
	
	return Ext.util.Format.number(v, '00,00,000');
}



Ext.sfa.renderer_arrays['renderDynamic'] = function renderDynamic(v, p, r) {
	if (r.data['attr'] == 'amount')
		return Ext.sfa.renderer_arrays['renderMoney'](v, p, r);
	else
	if (r.data['attr'] == 'count')
		return Ext.sfa.renderer_arrays['renderNumber'](v, p, r);

	return v;
}


function renderModuleColumn(v, p, r) {
	if (r.data['moduleName'] == Ext.sfa.translate_arrays[langid][508]) {
		return Ext.sfa.renderer_arrays['renderMoney'](v);
	} else
	if (r.data['moduleName'] == Ext.sfa.translate_arrays[langid][578] || r.data['moduleName'] == Ext.sfa.translate_arrays[langid][579] ) {
		var fields = ['<b>'+Ext.sfa.translate_arrays[langid][581]+'</b>', '', ''];
		return fields[v];
	} else
	if (r.data['moduleName'] == Ext.sfa.translate_arrays[langid][580] || r.data['moduleName'] == Ext.sfa.translate_arrays[langid][582]) {
		var fields = ['<b>'+Ext.sfa.translate_arrays[langid][444]+'</b>', '', ''];
		if (v == 0)
			return fields[v];
		else
			return Ext.sfa.renderer_arrays['renderMoney'](v);
	} else	
	if (r.data['count'] == 1) {
		return Ext.sfa.renderer_arrays['renderMoney'](v);
	}
	
	return v;	
}

function renderStar(v, p, r) {
	var t = parseInt(r.data['amount']/50000);	
	if (t > 5) t = 5;
	return '<img src="shared/icons/fam/star'+t+'.png"/>';
}

function renderStar(v, p, r) {
	var t = parseInt(r.data['amount']/50000);	
	if (t > 5) t = 5;
	return '<img src="shared/icons/fam/star'+t+'.png"/>';
}

function renderLevel(v, p, r) {	
	if (v <= delay_time*60 && r.data && r.data['sum_all']) {		
		var t = parseInt(r.data['sum_all']);	
	
		if (user_sale_history[r.data['name']] < t) {	    	
			return '<img height="12" src="shared/icons/fam/up.png" title="Өсөлттэй"/>';
		}
		if (user_sale_history[r.data['name']] == t) {			
			return '<img height="12" src="shared/icons/fam/middle.png" title="Өөрчлөлтгүй"/>';
		} 
		
		if (user_sale_history[r.data['name']] > t) 
			return '<img height="12" src="shared/icons/fam/down.png" title="Борлуулалт хийгээгүй"/>';
		
		user_sale_history[r.data['name']] = t;
	}
	else
	if (v > delay_time*60 && r.data && r.data['sum_all'] == 0)
		return '<img height="12" src="shared/icons/fam/nomobile.png" title="Ажиллаагүй"/>';
	else
	if (v > delay_time*60 && r.data && r.data['sum_all'] > 0) 			
		return '<img height="12" src="shared/icons/fam/wait.png" title="Борлуулалтгүй хийгээгүй 30 аас дээш минут"/>';		
	
	return '';
}

function rendererLanguage(v) {
	return Ext.sfa.translate_arrays[langid][parseInt(v)];
}

function loadScript() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&callback=initialize';
  document.body.appendChild(script);   
}

function initialize() {
	console.log('google map script loaded');
}
   
