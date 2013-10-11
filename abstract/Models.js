/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/*!
 * Ext JS Library 4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
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

Ext.define('OSS.Module', {
	duplicateFieldCombo: function(table, fieldName) {		
		if (table == 'Promotion' && fieldName == 'type') {			
			return 'promo_type';
		}
		
		return fieldName;
	},
	
	generateModel: function(table,modelName) {
    	var me = this, model = [], columns = [], types = [];
    	types[56] = 'int';
    	types[60] = 'float';
    	types[62] = 'float';
    	types[61] = 'datetime';
    	types[40] = 'date';
    	types[231] = types[35] = 'string';
    	types[167] = 'string';
    	types[34] = 'string';	
    					
    	var count = 0;
    	var fields = '';
    	var type_s = '';
    	var titles = '';
    	
    	var store = form_data_store.queryBy(function fn(record,id) {				 
    	     return record.get('name') == table; 
    	}); 
    	
    	store.each(function(rec){
    		var descr = rec.data['descr'];				
    		fields += rec.data['fname']+',';
    		type_s += types[rec.data['type']].charAt(0)+',';
    		var title =  me.parseDescription(descr, 'title');
			if (!isNaN(title)) {				
				title = Ext.sfa.translate_arrays[langs[ln]][parseInt(title)];
			}
			
    		if (me.parseFieldType(types[rec.data['type']], me.parseDescription(descr, 'extend')) == 'combo') {    			
    			var combo = Ext.sfa.combos[me.duplicateFieldCombo(table, rec.data['fname'])].split(',');
								
	    		columns[count] = {name: rec.data['fname'], 				  
	    				  type: types[rec.data['type']],
	    				  xtype: 'gridcolumn',
	    				  title: title, 
	    				  width: me.parseWidth(me.parseDescription(descr, 'width')),
	    				  hidden: me.parseBoolean(me.parseDescription(descr, 'hidden')),
	    				  flex: me.parseFlex(me.parseDescription(descr, 'flex')),    				  
	    				  align: me.parseAlign(me.parseDescription(descr, 'align')),
	    				  renderer: Ext.sfa.renderer_arrays[me.parseDescription(descr, 'renderer')],
	    				  field: {	    							    						            	    					   
	    					    xtype: 'combobox',
	    					    disabled: me.parseBoolean(me.parseDescription(descr, 'fieldDisabled')),
	    					    typeAhead : false,
	    					    store: Ext.sfa.stores[combo[0]],
	    					    displayField: combo[2],
	    					    valueField: combo[1],
	    					    queryMode: 'local',
	    					    allowBlank: true	    					    
	    				 } 
	    		};	
    		} else
    		if (me.parseFieldType(types[rec.data['type']], me.parseDescription(descr, 'extend')) == 'datefield') {    			
    			columns[count] = {name: rec.data['fname'], 				  
	    				  type: types[rec.data['type']],
	    				  xtype: 'datecolumn',
	    				  dateFormat: 'Y-m-d',	    				  
	    				  title: title, 
	    				  width: me.parseWidth(me.parseDescription(descr, 'width')),
	    				  hidden: me.parseBoolean(me.parseDescription(descr, 'hidden')),
	    				  flex: me.parseFlex(me.parseDescription(descr, 'flex')),    				  
	    				  align: me.parseAlign(me.parseDescription(descr, 'align')),
	    				  renderer: Ext.sfa.renderer_arrays[me.parseDescription(descr, 'renderer')],
	    				  field: {	    							    						            	    					   
	    					    xtype: 'datefield',
	    		                allowBlank: true,
	    		                format: 'Y-m-d'	    		                 					   
	    				 } 
	    		};
    		} else {    			    		
    			if (rec.data['type'] == 60) {//amount
    				columns[count] = {name: rec.data['fname'], 
							  type: types[rec.data['type']],
							  xtype: me.parseColumnType(types[rec.data['type']], me.parseDescription(descr, 'extend')),						  
							  title: title,     							  
							  width: me.parseWidth(me.parseDescription(descr, 'width')),
							  hidden: me.parseBoolean(me.parseDescription(descr, 'hidden')),
							  flex: me.parseFlex(me.parseDescription(descr, 'flex')),
							  align: me.parseAlign(me.parseDescription(descr, 'align')),
							  summaryType: me.parseSummary(me.parseDescription(descr, 'summaryType')),
							  summaryRenderer: Ext.sfa.renderer_arrays[me.parseDescription(descr, 'summaryRenderer')],
							  renderer: Ext.sfa.renderer_arrays[me.parseDescription(descr, 'renderer')],
							  field: {disabled: me.parseBoolean(me.parseDescription(descr, 'fieldDisabled')), xtype: 'numberfield', hidden: me.parseBoolean(me.parseDescription(descr, 'fieldHidden')), format: me.parseDescription(descr, 'fieldFormat'), decimalPrecision:2}
    				};
    			} else    			
	    			columns[count] = {name: rec.data['fname'], 
	    							  type: types[rec.data['type']],
	    							  xtype: me.parseColumnType(types[rec.data['type']], me.parseDescription(descr, 'extend')),						  
	    							  title: title,     							  
	    							  width: me.parseWidth(me.parseDescription(descr, 'width')),
	    							  hidden: me.parseBoolean(me.parseDescription(descr, 'hidden')),
	    							  flex: me.parseFlex(me.parseDescription(descr, 'flex')),
	    							  align: me.parseAlign(me.parseDescription(descr, 'align')),
	    							  summaryType: me.parseSummary(me.parseDescription(descr, 'summaryType')),
	    							  summaryRenderer: Ext.sfa.renderer_arrays[me.parseDescription(descr, 'summaryRenderer')],
	    							  renderer: Ext.sfa.renderer_arrays[me.parseDescription(descr, 'renderer')],
	    							  field: {disabled: me.parseBoolean(me.parseDescription(descr, 'fieldDisabled')), xtype: me.parseFieldType(types[rec.data['type']], me.parseDescription(descr, 'extend')), hidden: me.parseBoolean(me.parseDescription(descr, 'fieldHidden')), format: me.parseDescription(descr, 'fieldFormat'), decimalPrecision:2}
	    			};
    		}
    		titles += columns[count].title+',';
    		count++;
    	});
    	
    	fields = fields.substring(0, fields.length-1);
    	type_s = type_s.substring(0, type_s.length-1);    	
    	
    	Ext.regModel(modelName, {        
            fields: columns
        });								
    	
    	model['fields'] = fields;
    	model['types'] = type_s;
    	model['columns'] = columns;
    	model['titles'] = titles;
    		
    	if (/*!hidden_values['accept_edit'] || */(Ext.sfa.params[table] && Ext.sfa.params[table].charAt(1) != '0')) {
    		model['rowEditor'] = Ext.create('Ext.grid.plugin.RowEditing', {
    			id: table,
				ptype: 'rowediting'
    		});
    				
    		model['cellEditor'] = new Ext.grid.plugin.CellEditing({
    			id: table,
    			clicksToEdit: 1		
    		});
    	}
    	else
    		model['rowEditor'] = [];
    	
    	var groupField = '';
    	if (Ext.sfa.params[table] && Ext.sfa.params[table].charAt(3) == 'G') {    		
			groupField = Ext.sfa.params[table+'_Group'];	    			
		}
    	
    	model['readStore'] = Ext.create('Ext.data.Store', {
            model: modelName,	
            groupField: groupField,
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
            model: 'product',	        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    	
    	return model;
    },
    
    createHeaders: function(columns) {	
    	var headers = [new Ext.grid.RowNumberer({width:30})];
    	var count = 1;
    	for (i = 0; i < columns.length; i++) {
    		if (columns[i].columns) {
    			headers[count] = {													
    					header	 : columns[i].title,
    					width	 : columns[i].width,    					
    					columns  : columns[i].columns
    			};
    		} else
    		if (columns[i].xtype == 'checkcolumn') {			
    			headers[count] = {
    					//id       : columns[i].name,													
    					header	 : columns[i].title,
    					dataIndex: columns[i].name,    	
    					filter	 : true,
    					width	 : columns[i].width,
    					align	 : columns[i].align,    					
    					xtype	 : columns[i].xtype,
    					editor: {
    		                xtype: 'checkbox',
    		                cls: 'x-grid-checkheader-editor'
    		            }
    			};
    		} else
    		if (columns[i].xtype && columns[i].renderer) {			
    			headers[count] = {
    					//id       : columns[i].name,								
    					hidden	 : columns[i].hidden,	
    					header	 : columns[i].title,
    					filterable	 : true,
    					dataIndex: columns[i].name,
    					flex	 : columns[i].flex,					
    					width	 : columns[i].width,
    					align	 : columns[i].align,    					
    					field	 : columns[i].field,
    					xtype	 : columns[i].xtype,
    					renderer : columns[i].renderer					
    			};
    		} else
    		if (columns[i].xtype) {			
    			headers[count] = {
    					//id       : columns[i].name,																
    					dataIndex: columns[i].name,															
    					flex	 : columns[i].flex,
    					filterable : true,
    					header	 : columns[i].title,
    					align	 : columns[i].align,					
    					hidden	 : columns[i].hidden,    					
    					width	 : columns[i].width,
    					filter	 : true,
    					field	 : columns[i].field,					
    					xtype	 : columns[i].xtype,
    					summaryType : columns[i].summaryType	
    			};
    		} else	
    		if (columns[i].renderer) {			
    			headers[count] = {
    					//id       : columns[i].name,																
    					dataIndex: columns[i].name,														
    					flex	 : columns[i].flex,
    					align	 : columns[i].align,
    					header	 : columns[i].title,					
    					hidden	 : columns[i].hidden,
    					width	 : columns[i].width,
    					filterable	 : true,
    					field	 : columns[i].field,			    					
    					renderer	 : columns[i].renderer,
    					summaryType : columns[i].summaryType,	
    					summaryRenderer : columns[i].summaryRenderer
    			};
    		} else				
    		{
    			headers[count] = {
    					//id       : columns[i].name,
    					header   : columns[i].title,							
    					hidden	 : columns[i].hidden,					
    					dataIndex: columns[i].name,					
    					align	 : columns[i].align,					
    					flex	 : columns[i].flex,		
    					filterable	 : true,
    					width	 : columns[i].width,    					
    					field	 : columns[i].field,
    					xtype	 : columns[i].xtype,
    					renderer : Ext.sfa.renderer_arrays['renderDefault']
    			};
    		}
    		
    		count++;
    		
    	}
    	
    	return headers;
    },        
    
    createHeadersMixed: function(columns) {    	
    	var headers = [];
    	var count = 0;
    	for (i = 0; i < columns.length; i++) {
    		if (columns[i].columns) {
    			headers[count] = {						
    					id       : columns[i].id,	
    					header	 : columns[i].title,
    					width	 : columns[i].width,    					
    					columns  : columns[i].columns
    			};
    		} else
    		if (columns[i].xtype == 'checkcolumn') {			
    			headers[count] = {
    					//id       : columns[i].name,													
    					header	 : columns[i].title,
    					dataIndex: columns[i].name,    		    					
    					width	 : columns[i].width,
    					align	 : columns[i].align,    					
    					xtype	 : columns[i].xtype,
    					editor: {
    		                xtype: 'checkbox',
    		                cls: 'x-grid-checkheader-editor'
    		            }
    			};
    		} else
    		if (columns[i].xtype && columns[i].renderer) {			
    			headers[count] = {
    					id       : columns[i].id,								
    					hidden	 : columns[i].hidden,	
    					header	 : columns[i].title,
    					dataIndex: columns[i].name,
    					flex	 : columns[i].flex,					
    					width	 : columns[i].width,
    					align	 : columns[i].align,    					
    					field	 : columns[i].field,
    					xtype	 : columns[i].xtype,
    					renderer : columns[i].renderer					
    			};
    		} else
    		if (columns[i].xtype) {			
    			headers[count] = {
    					id       : columns[i].id,																
    					dataIndex: columns[i].name,															
    					flex	 : columns[i].flex,
    					header	 : columns[i].title,
    					align	 : columns[i].align,					
    					hidden	 : columns[i].hidden,    					
    					width	 : columns[i].width,
    					field	 : columns[i].field,					
    					xtype	 : columns[i].xtype,
    					summaryType : columns[i].summaryType	
    			};
    		} else	
    		if (columns[i].renderer) {			
    			headers[count] = {
    					id       : columns[i].id,																
    					dataIndex: columns[i].name,														
    					flex	 : columns[i].flex,
    					align	 : columns[i].align,
    					header	 : columns[i].title,					
    					hidden	 : columns[i].hidden,
    					width	 : columns[i].width,
    					field	 : columns[i].field,			    					
    					renderer	 : columns[i].renderer,
    					summaryType : columns[i].summaryType,	
    					summaryRenderer : columns[i].summaryRenderer
    			};
    		} else				
    		{
    			headers[count] = {
    					id       : columns[i].id,
    					header   : columns[i].title,							
    					hidden	 : columns[i].hidden,					
    					dataIndex: columns[i].name,					
    					align	 : columns[i].align,					
    					flex	 : columns[i].flex,					
    					width	 : columns[i].width,    					
    					field	 : columns[i].field,
    					xtype	 : columns[i].xtype,
    					renderer : Ext.sfa.renderer_arrays['renderDefault']
    			};
    		}
    		
    		count++;
    		
    	}
    	
    	return headers;
    }, 
    
    generateNumberField: function(name, value, w, mx, mn) {	
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


    generateDateField: function(name) {	
    	var datefield = Ext.create('Ext.button.Button', {
    		id : 'datefield'+name,
    		xtype: 'datefield',
            text    : currentDate,        
            scope   : this,
            iconCls: 'calendar',
            menu	: Ext.create('Ext.menu.DatePicker', {
            	text: currentDate,
                handler: function(dp, date){
                	var dt= Ext.Date.format(date, 'Y-m-d');
                	datefield.setText(dt);  
                }
            })
        });
    	
    	return datefield;
    },
    
    generateDateField: function(name, value) {	
    	var datefield = Ext.create('Ext.button.Button', {
    		id : 'datefield'+name,
    		xtype: 'datefield',
            text    : value,        
            scope   : this,
            iconCls: 'calendar',
            menu	: Ext.create('Ext.menu.DatePicker', {
            	text: currentDate,
                handler: function(dp, date){
                	var dt= Ext.Date.format(date, 'Y-m-d');
                	datefield.setText(dt);  
                }
            })
        });
    	
    	return datefield;
    },

    generateLocalCombo: function(queryName, modelName, value, display, caption, w) {
		if (typeof w == undefined || w == 0) w = 250;		
    	var combo = Ext.create('Ext.form.ComboBox', {
    		xtype: 'combobox',
            store: Ext.sfa.stores[modelName],
            displayField: display,
            valueField: value,
            typeAhead: true,
            queryMode: 'local',
            mode: 'local',
            hideLabel: true,
			editable: false,
            triggerAction: 'all',
            margins: '0 0 0 5', 
            emptyText: caption,
            selectOnFocus: true,
            width: w	                 
        });
    	
    	return combo;
    },
	
	generateLocalComboEditAble: function(queryName, modelName, value, display, caption, w) {
    	var combo = Ext.create('Ext.form.ComboBox', {
    		xtype: 'combobox',
            store: Ext.sfa.stores[modelName],
            displayField: display,
            valueField: value,
            typeAhead: true,
            queryMode: 'local',
            mode: 'local',
            hideLabel: true,
			editable: true,
            triggerAction: 'all',
            margins: '0 0 0 5', 
            emptyText: caption,
            selectOnFocus: true,
            width: 250	                 
        });
    	
    	return combo;
    },

    generateLocalComboWithField: function(queryName, modelName, value, display, caption, w, field) {
    	var combo = Ext.create('Ext.form.ComboBox', {
    		xtype: 'combobox',
            store: Ext.sfa.stores[modelName],
            fieldLabel: field,
            displayField: display,
            valueField: value,
            typeAhead: true,
            queryMode: 'local',
			editable: false,
            mode: 'local',            
            triggerAction: 'all',
            margins: '0 0 0 5', 
            emptyText: caption,
            selectOnFocus: true,
            width: w	                 
        });
    	
    	return combo;
    },
    
    generateRemoteCombo: function(queryName, modelName, value, display, caption) {
    	var combo = Ext.create('Ext.form.ComboBox', {			
            store: Ext.create('Ext.data.JsonStore', {
    			model: modelName,	     	   
    			mode: 'remote',
    			autoLoad: true,
    	        proxy: {
    				type: 'ajax',
    				url: 'httpGW?xml='+_donate(queryName, 'SELECT', ' ', ' ', ' ', ' '),
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
    },
    
    generateRemoteComboWithFilter: function(queryName, modelName, value, display, caption, where) {    	
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
            typeAhead: true,  
			name: modelName,
			editable: false,
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
    },
    
    generateRemoteCombo: function(queryName, modelName, value, display, caption, width) {
    	var combo = Ext.create('Ext.form.ComboBox', {			
            store: Ext.create('Ext.data.JsonStore', {
    			model: modelName,	     	   
    			mode: 'remote',
    			autoLoad: true,
    	        proxy: {
    				type: 'ajax',
    				url: 'httpGW?xml='+_donate(queryName, 'SELECT', ' ', ' ', ' ', ' '),
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
            typeAhead: true,        
			editable: false,
            queryMode: 'remote',
            mode: 'remote',
            triggerAction: 'all',
            margins: '0 0 0 5', 
            emptyText: caption,
            selectOnFocus: true,
            width: width	                 
        });
    	
    	return combo;
    },        
    
    parseDescription: function(value,field) {
    	value += ',';
    	if (value.indexOf(field) != -1) {
    		value = value.substring(value.indexOf(field)+field.length+1, value.length);
    		return value.substring(0, value.indexOf(','));
    	}
    	
    	return '';
    },

    parseWidth: function(value) {
    	if (value == '') return 0;
    	
    	return parseInt(value);
    },

    parseFlex: function(value) {
    	if (value == '') return 0;
    	
    	return parseFloat(value);
    },
    
    parseSummary: function(value) {
    	if (value == '') return '';
    	
    	return value;
    },
    
    parseAlign: function(value) {
    	if (value == '') return 'left';
    	
    	return value;
    },

    parseBoolean: function(value) {
    	if (value == '') return false;
    	
    	return value == 'true';
    },

    parseCombo: function(value, extend) {	
    	if (extend == 'combo') {
    		return Ext.sfa.combos[value];
    	}	
    },

    parseFieldType: function(value, extend) {	
    	if (extend == 'boolean')
    		return 'checkbox';
    	if (extend == 'textfield')
    		return 'textfield';
    	if (extend == 'combo')
    		return 'combo';
    	
    	if (value == 'date')
    		return 'datefield';
    	if (value == 'datetime') 
    		return 'datefield';
    		
    	return value == 'string'?'textfield':'numberfield';
    },

    parseColumnType: function(value, extend) {	
    	if (extend == 'boolean')
    		return 'checkcolumn';
    	if (extend == 'int')
    		return 'numbercolumn';	
    	
    	return '';
    },
    
    calculateColumnWidth: function(v) {
    	var divide = parseInt(Ext.sfa.params[v].charAt(4));
    	
    	return 1/divide;	
    },
    
    productAble: function(v) {
		return true;

    	/*if (!v.data) return false;
    	if (module == 15) {
    		if (v.data['vendor'] == mode)
    			return true;
    		return false;
    	}
    	
    	return (Ext.sfa.renderer_arrays['renderProductAccept'](v.data['code']) != v.data['code']);    	    	*/
    },
    
    userAble: function(v) {

		return true;

		/*
    	if (!v.data) return false;    	
    	if (v.data['section'] == mode)
    		return true;
    	
    	return false;    	*/
    },
    
    checkMaskRe: function(name, column) {
    	if (name == 'Customer' && column == 'code')
    		return 1;
    	if (name == 'Parent_Names' && column == 'id')
    		return 2;
    	
    	return 0;
    },
    
    variableRemote: function(c) {
    	if (c.length == 10) {
    		if (c[7] == 'mode')
        		return mode;	
    	} else    
    	if (c.length == 7)
    	{
    		if (c[6] == 'mode')
        		return mode;
    	}
    	
    	
    	return c[6];
    },
    
    variable: function(c, index) {
    	if (c[index] == 'year') return year;
    	if (c[index] == 'month') return month;
    	if (c[index] == 'firstDay') return firstDay;
    	if (c[index] == 'nextDate') return nextDate;
    	if (c[index] == 'currentDate') return currentDate;
    	
    	return c[index];
    }
});
