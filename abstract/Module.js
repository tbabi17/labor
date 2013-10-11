Ext.require([	    
	 'Ext.ux.grid.Printer'
]);

Ext.define('OSS.EngineModule', {
	extend: 'OSS.Module',
	autoLoad: true,	
	buttons: [],

    mixins: {
        observable: 'Ext.util.Observable'
    },

    constructor: function (config) {
        this.mixins.observable.constructor.call(this, config);
        this.init();
    },

    init: Ext.emptyFn,        
    
	getDefaultValue: function(combo) {
		if (combo == 'sv_list')
			return logged;
		if (combo == 'section')
			return section;

		return '';
	},

    createModel: function(name, modelName, id) {
		var me = this;
		me.filters = Ext.create('Ext.ux.grid.FiltersFeature',{
			ftype: 'filters',
			encode: false, 
			local: true
		});

    	this.id = id;	
    	if (Ext.sfa.staticModels[name]) {
    		this.model = Ext.sfa.staticModels[name];		
    		
    		if (Ext.sfa.params[name].charAt(3) == 'Q') {    			    			
    			this.columns = this.model['columns'];
    			this.feature = [{
    				id: modelName+'_summary',
    				ftype: 'summary'					       
    		    },me.filters];
    		} else
    		if (Ext.sfa.params[name].charAt(3) == 'S') {    			
    			this.columns = [new Ext.grid.RowNumberer({width:30}), this.model['columns']];    			
    			this.feature = [{
    				id: modelName+'_summary',
    				ftype: 'summary'					       
    		    },me.filters];
    		} else
			if (Ext.sfa.params[name].charAt(3) == 'W') {    			
    			this.columns = this.model['columns'];
				this.grouping = Ext.create('Ext.grid.feature.GroupingSummary', {    					
        				id: name+'_group',
         				ftype: 'groupingsummary',
         				groupHdTpl: '{name}',
         		        hideGroupedHeader: true
        		});

    			this.feature = [this.grouping,me.filters]; 
				
    		} else
    		if (Ext.sfa.params[name].charAt(3) == 'G') {
    			this.columns = [new Ext.grid.RowNumberer({width:30}), this.model['columns']];    			
				this.grouping = Ext.create('Ext.grid.feature.GroupingSummary', {    					
        				id: name+'_group',
         				ftype: 'groupingsummary',
         				groupHdTpl: '{name}',
         		        hideGroupedHeader: true
        		});
    			this.feature = [this.grouping,me.filters];    			
    		} else
    		if (Ext.sfa.params[name].charAt(3) == 'P') {
    			this.columns = [new Ext.grid.RowNumberer({width:30}), this.model['columns']];
    			this.feature = [{
     				id: name+'_group',
     				ftype: 'groupingsummary',
     				groupHdTpl: '{name}',
     		        hideGroupedHeader: true
    			}];
    		} else {					    			
    			this.feature = [];
    			this.columns = [new Ext.grid.RowNumberer({width:30}), this.model['columns']];
    		}
    	}
    	else {
    		this.model = this.generateModel(name, modelName);		
    		this.columns = this.createHeaders(this.model['columns']);
    		this.feature = [];
    		
    		if (Ext.sfa.params[name].charAt(3) == 'S') {    			
    			this.feature = [{
    				id: modelName+'_summary',
    				ftype: 'summary'					       
    		    },me.filters];
    		}
    		
    		if (Ext.sfa.params[name].charAt(3) == 'G') {    			
    			this.grouping = Ext.create('Ext.grid.feature.GroupingSummary', {    					
        				id: name+'_group',
         				ftype: 'groupingsummary',
         				groupHdTpl: '{name}',
         		        hideGroupedHeader: false
        		});
    			
    			this.feature = [this.grouping,me.filters];    			
    		}
    	}
    	    
    	if (this.feature.length == 0) {    		
    		this.filter =  {
    	        ftype: 'filters',
    	        autoReload: false,
    	        local: true,
    	        filters: [{
                	type: 'numeric',
                	dataIndex: 'id'
    	        }]
    		};
    	}
    		    	
    	var cols = this.model['columns'];
    	this.name = name;
    	this.modelName = modelName;
    	this.fields = this.model['fields'];
    	this.types = this.model['types'];	
    	this.titles = this.model['titles'];
    	this.store = this.model['readStore'];
    	this.row_editor = this.model['rowEditor'];
    	this.store_action = this.model['writeStore'];	
    	this.forms = [];
    	this.count = 0;   
    	
    	fW = this.calculateColumnWidth(name);
    	
    	for (i = 0; i < cols.length; i++) {
    		var column = cols[i];
    		if (!column.hidden) {
    			var xtype = 'textfield';
    			var value = '';
    						
    			if (column.type == 'int' || column.type == 'float') {
    				xtype = 'numberfield';
    				value = '0';
    			}
    			if (column.type == 'datetime' || column.type == 'date')
    				xtype = 'datefield';
    			
    			var allowBlank = (column.allowBlank != undefined ? true:false);
				if (name == 'Customer' && column.name == 'subid1')
					allowBlank = true;

    			if (name == 'Promotion') allowBlank = true;
    			
    			if (Ext.sfa.combos[this.duplicateFieldCombo(name, column.name)] && column.title != 'ID') { 
    				var combo = Ext.sfa.combos[this.duplicateFieldCombo(name, column.name)].split(',');

    				if (combo[0].indexOf("_remote") != -1) {
    					this.forms[this.count] = this.generateRemoteComboWithFilter(combo[0], 
    							combo[3], combo[1], combo[2], Ext.sfa.translate_arrays[langid][combo[4]], mode);
    					this.forms[this.count].fieldLabel = column.title;
    					this.forms[this.count].columnWidth = fW;							
    					this.forms[this.count].fieldLabel = column.title;
    					this.forms[this.count].name = column.name;
    				}
    				else {
					var dvalue = me.getDefaultValue(combo[0]);	
    				this.forms[this.count] = {
    					id: 'forms_'+this.name+'_'+i,
    					fieldLabel: column.title,
    				    name: column.name,            
    				    margin: '4 0 0 4',
    				    xtype: 'combobox',
    				    forceSelection : true,				    				    
    				    typeAhead : false,
						value : dvalue,
    				    store: Ext.sfa.stores[combo[0]],
    				    displayField: combo[2],
    				    valueField: combo[1],
    				    queryMode: 'local',
    				    allowBlank: allowBlank,
    				    emptyText: column.title,
    				    columnWidth: fW
    				}
				}
    			} else {
    				var mk = this.checkMaskRe(name, column.name)
    				if (mk > 0) {
    					var maskRe;
    					var maxLength = 0;
    					var minLength = 0;
						switch (mk) {
							case 1: maskRe = /[0-9A-Z]/;
							case 2: {
								maxLength = 6;
								minLength = 6;
								maskRe = /[0-9]/;
							}
						}    					
    				
    					this.forms[this.count] = {
    						id: 'forms_'+this.name+'_'+i,
    						fieldLabel: column.title,
    						name: column.name,
    						maskRe: maskRe,   
    						maxLength : maxLength,
    						minLength : minLength,
    						xtype : xtype,
    						value : value,
    						emptyText: column.title,
    						allowBlank: allowBlank,
    						margin: '4 0 0 4',
    						format: 'Y-m-d',
    						columnWidth: fW
    					};
    				} else {
    					if (column.type == 'datetime' || column.type == 'date') {
	    					this.forms[this.count] = {
	    						id: 'forms_'+this.name+'_'+i,
	    						fieldLabel: column.title,
	    						name: column.name,    						
	    						xtype : xtype,
	    						emptyText: column.title,
	    						allowBlank: allowBlank,
	    						margin: '4 0 0 4',
	    						value: currentDate,
	    						format: 'Y-m-d',
	    						columnWidth: fW
	        				};
    					} else {    						
    						if (column.name && column.name.indexOf('amount') != -1) 
    							this.forms[this.count] = {
		    						id: 'forms_'+this.name+'_'+i,
		    						fieldLabel: column.title,
		    						name: column.name,    						
		    						xtype: 'currencyfield',
		    		        		decimalPrecision:2,		    						
		    						allowBlank: allowBlank,
		    						margin: '4 0 0 4',
		    						value: value,
		    						columnWidth: fW
		        				};    				
    						else    						
	    						this.forms[this.count] = {
		    						id: 'forms_'+this.name+'_'+i,
		    						fieldLabel: column.title,
		    						name: column.name,    						
		    						xtype : xtype,
		    						emptyText: column.title,
		    						allowBlank: allowBlank,
		    						margin: '4 0 0 4',
		    						value: value,
		    						columnWidth: fW
		        				};    						    				
    					}
    				}
    			}
    			this.count++;
    		}
    	}
    	
    	if (Ext.sfa.where[this.name])
    		this.where = Ext.sfa.where[this.name];
    	else
    		this.where = ' ';
    },        
    
    loadStore: function() {    	
		var hashName = this.modelName;
			
		if (this.param) {
			this.store.load({params:{xml:_donate(hashName, 'SELECT', this.name, this.fields, this.types, this.param)}});
		} else		
		if (this.combo2) {
			this.store.load({params:{xml:_donate(hashName, 'SELECT', this.name, this.fields, this.types, (this.combo.xtype == 'datefield'?this.combo.getText():this.combo.getValue())+','+(this.combo1.xtype == 'datefield'?this.combo1.getText():this.combo1.getValue())+','+(this.combo2.xtype == 'datefield'?this.combo2.getText():this.combo2.getValue()))}});
		} else
		if (this.combo1) {			
			this.store.load({params:{xml:_donate(hashName, 'SELECT', this.name, this.fields, this.types, (this.combo.xtype == 'datefield'?this.combo.getText():this.combo.getValue())+','+(this.combo1.xtype == 'datefield'?this.combo1.getText():this.combo1.getValue()))}});
		} else
		if (this.combo) {									
			this.store.load({params:{xml:_donate(hashName, 'SELECT', this.name, this.fields, this.types, this.combo.xtype == 'datefield'?this.combo.getText():this.combo.getValue())}});
		}
		else {
			this.store.load({params:{xml:_donate(hashName, 'SELECT', this.name, this.fields, this.types, this.where)}});
		}    				
    },
    
    disableAutoLoad: function() {
    	this.autoLoad = false;
    },
    
    loadStoreParameterCombo: function(param, combo) {
    	var hashName = this.modelName;
    	
    	if (combo == 1)
    		this.combo.setValue(param);
    	if (combo == 2)
    		this.combo1.setValue(param);
    	if (combo == 3)
    		this.combo2.setValue(param);
    	
    },
    
    loadStoreParameter: function(param) {
    	var hashName = this.modelName;    	
    	this.param = param;
    	this.autoLoad = false;
    },
    
    addStore: function() {    	
    	var form = this.addForm.getForm();
    	if (form.isValid()) {
    		var values = this.id+'=0&'+form.getValues(true);
    		values = ReplaceAll(values, '&', ',');
    		
    		Ext.Ajax.request({
    		   url: 'httpGW?xml='+_donate('form_action', 'WRITER', this.name, ' ', ' ', values),
    		   success: function() { 
    			  Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][557], null);		  
    		   },
    		   failure: function() {  
    			  Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][559], null);
    		   },
    		   method: 'GET',
    		   params: Ext.encode(form.getValues())
    		});	
    		
    		form.reset();
    	} else
    		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][560], null);   	
    },
    
    removeStore: function(selection) {
    	this.store.remove(selection);
		var where = this.id+'='+selection.data[this.id];
		if (!this.isNumber(selection.data[this.id]))
			where = this.id+"='"+selection.data[this.id]+"'";
        this.store_action.load({params:{xml:_donate('delete', 'WRITER', this.name, ' ', ' ', where)}});
    },

	isNumber : function(v){
		return typeof v === 'number' && isFinite(v);
	},
    
    printTitle: function() {
    	var me = this;
    	if (this.name == 'User_Orders') {
    		var params = [];
    		if (me.combo)
    			params[0] = me.combo.getValue()+' '+me.combo.getRawValue();
    		if (me.combo1 && me.combo2)
    			params[1] = me.combo1.getText()+' / '+me.combo2.getText();
    		
    		var title = params[0] +', Хамаарах хугацаа '+params[1];
    		Ext.ux.grid.Printer.params[0] = title;
    	}
    },        
    
	createCustomButtons: function() {
    	var me = this;
    	me.buttons = [{
            text: Ext.sfa.translate_arrays[langid][326],
            iconCls: 'refresh',
            handler: function(){            
            	me.printTitle();
            	me.loadStore();            	
            }
        },{		                
            iconCls: 'search',
            hidden: !(Ext.sfa.params[me.name].charAt(0) == '1'),
            enableToggle: true,
            pressed: true,
            toggleHandler: function(item, pressed){		  
            	if (!pressed) {
            		var items = me.gridPanel.getDockedItems();            	
            		items[1].hide();
            	} else {
            		var items = me.gridPanel.getDockedItems();            	
            		items[1].show();
            	}
            }
        },'-',{        	
        	id: 'add-button'+me.name,
            text: Ext.sfa.translate_arrays[langid][490],            
            iconCls: 'icon-add',
            enableToggle: true,
            hidden: !(Ext.sfa.params[me.name].charAt(1) == '1'),
            disabled: hidden_values['accept_edit'],
            toggleHandler: function(item, pressed){
            	if (pressed)
            		me.addForm.show();
            	else
            		me.addForm.hide();
            }
        },
        {
            text: Ext.sfa.translate_arrays[langid][366],
            iconCls: 'icon-delete',
            hidden: !(Ext.sfa.params[me.name].charAt(1) == '1'),
            disabled: hidden_values['accept_edit'],
            handler: function(){
            	Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][548], function(btn, text){	                		
        			if (btn == 'yes'){
        				var selection = me.gridPanel.getView().getSelectionModel().getSelection()[0];
	                    if (selection) {
	                        me.removeStore(selection);
	                    }              				
        			} else {
        				
        			}
        		});	                   
            }
        },
        '-',          
        {
        	iconCls: 'grouping',
            hidden: !(Ext.sfa.params[me.name].charAt(3) != '0'),
            enableToggle: true,
            toolTip: 'Групплэж харах',
            toggleHandler: function(item, pressed) {
            	if (pressed)
            		me.grouping.enable();
            	else
            		me.grouping.disable();
            }
        }];
    },

    createToolbar: function(name) {
    	var me = this;
    	me.tb = Ext.create('Ext.toolbar.Toolbar');
    	var cb = comboData.queryBy(function fn(record,id) {				 
		     return record.get('name') == name; 
		}); 

		cb.each(function(rec){									
			for (i = 1; i <= 4; i++) {
				if (rec.data['combo'+i] != '') {
				   var c = rec.data['combo'+i].split(',');
				   var combo;
				   if (c[0] == 'generateDateField')
					   combo = me[c[0]](c[1], me.variable(c, 2));
				   else
				   if (c[0] == 'generateNumberField')
					   combo = me[c[0]](c[1], me.variable(c, 2), parseInt(c[3]), c[4], c[5]);				   
				   else {
					   combo = me[c[0]](c[1], c[2], c[3], c[4], Ext.sfa.translate_arrays[langid][c[5]], me.variableRemote(c));
					   if (c.length == 10 && c[8] == 'set') { 
						   combo.setValue(me.variableRemote(c));						   
					   }
					   if (c.length == 10)
						   combo.setVisible(c[9] == 'hidden'?false:true);
				   }
				   
				   if (i == 1) {
					   me.combo = combo;
					   me.tb.add(me.combo);
				   }
				   if (i == 2) {
					   me.combo1 = combo;
					   me.tb.add(me.combo1);
				   }
				   if (i == 3) {
					   me.combo2 = combo;
					   me.tb.add(me.combo2);
				   }
				   if (i == 4) {
					   me.combo3 = combo;
					   me.tb.add(me.combo3);
				   }
			
				   if (c[1].indexOf("users") != -1) {
					  // me.combo.setValue(userCode);
					   me.loadStoreParameter();
					   me.loadStore();
				   }
				}
			}
		});		
		
		me.createCustomButtons();
		me.addStandardButtons();
		me.tb.add(me.buttons);
    },      
    
    createPanel: function(name, model, id) {
    	var me = this;
    	
    	me.createModel(name, model, id);    				
		me.createToolbar(name);	

		if (me.autoLoad)
			me.loadStore();
						
		var gridType = 'Ext.grid.Panel';
		if (Ext.sfa.params[name].charAt(0) == '1')
			gridType = 'Ext.ux.LiveSearchGridPanel';						 				

		me.gridPanel = Ext.create(gridType, {
				id: 'grid_'+name,
				region: 'center',
				store: me.store,
				flex:1, 
				columnLines: true,
				loadMask: true,
				border: false,
				plugins:
					me.row_editor,
				
				selModel: {
					pruneRemoved: true
				},
				columns: me.columns,
				features: me.feature,				
				dockedItems: [me.tb],				
				viewConfig: {
	                stripeRows: true,
					trackOver: false,
	                listeners: {
	                	itemdblclick: function(dv, record, item, index, e) {
	                		me.expandDblClick(record);
	                    },
						celldblclick: function(gridView, htmlElement, columnIndex, dataRecord) {
							if (Ext.sfa.params[name].charAt(1) == '0')														
								me.cellDblClick(gridView, htmlElement, columnIndex, dataRecord);
						}
	                }
	            }	           	    		
		});
		
		me.specialCommand();		
		
		me.addForm = Ext.create('Ext.form.FormPanel', {	        
	        fieldDefaults: {
	            labelWidth: 120,
	            labelAlign: 'right'
	        },	        
	        margin: '2 0 0 0',
	        hidden: true,
			border: false,
	        flex: 0.6,	        
	        bodyPadding: 6,
	        items: [{
            	   	xtype: 'fieldset',
            	   	border: false,
            	   	defaultType: 'textfield',
            	   	layout: 'column',            	   	
            	   	items: me.forms
               }
	        ],
	        buttons: [{
	            text: 'Reset',
	            handler: function(){
					this.up('form').getForm().reset();
	            }
	        },{
	            text: Ext.sfa.translate_arrays[langid][491],
	            handler: function(){
	               me.addStore();
	            }
	        },{
	            text: Ext.sfa.translate_arrays[langid][327],
	            handler: function(){
	               me.tb.items.get('add_button'+me.name).toggle(false);	               
	               me.addForm.hide(); 
	            }
	        }]
	    });
		
		me.window = Ext.create('widget.panel', {				
			border: false,
			frame:false,
			plain: false,
			saveDelay: 10,
			shadow:false,
			bodyBorder:false,
			animCollapse:false,
			modal: true,
			constrainHeader:true,
			constrain:false,
			autoShow: true,
			animateTarget : false,
		    setAnimateTarget : Ext.emptyFn,
			layout: {
				type: 'vbox',
				align:'stretch'
			},						
			items: [me.gridPanel, me.addForm]
		});
		
		return me.window;
    },                 	    

    callModule: function(name) {    	
    	var module = ossApp.getModule(name),                        		                        		
		win = module && module.createWindow();

        if (win)
        	ossApp.getDesktop().restoreWindow(win);
        
        return module;
    },
    
    createModule: function(nodes, name, param) {
	    var	module = new OSS.KernelPanel();
		module.id = name;
		module.appType = name;
		ossApp.addModule(module);
		if (param != '')
			module.loadStoreParameter(param);
		module.createWindow(nodes[0], nodes[1], nodes[3], nodes[2], nodes[4], nodes[5], nodes[6]);

		module.loadStore();
    },        
    
    fillByComboValueToGrid: function(combo, _store, grid, store_id, field) {
    	var v = combo.getValue();
		_store.removeAll();	          		
    	for (i = 0; i < Ext.sfa.stores[store_id].getCount(); i++) {
			var record = Ext.sfa.stores[store_id].getAt(i);
			if (record.data[field] == v) {
				_store.add({code: record.data['code']});		    					     		    				
    		}
    	}
    	
    	grid.getView().refresh();
    },
    
    fillByValueToGrid: function(value, _store, grid, store_id, field) {
    	var v = value;
		_store.removeAll();	          		
    	for (i = 0; i < Ext.sfa.stores[store_id].getCount(); i++) {
			var record = Ext.sfa.stores[store_id].getAt(i);
			if (record.data[field] == v) {
				_store.add({code: record.data['code']});		    					     		    				
    		}
    	}
    	
    	grid.getView().refresh();
    },

	createHeadersWithNumbers: function(columns) {	
		var headers = [Ext.create('Ext.grid.RowNumberer', {width: 35})];
		for (i = 0; i < columns.length; i++) {							
				headers[i+1] = {					
						hidden	 : columns[i].hidden,	
						text	 : columns[i].title,
						dataIndex: columns[i].name,
						flex	 : columns[i].flex,					
						width	 : columns[i].width,
						align	 : columns[i].align,				
						renderer : columns[i].renderer,
						summaryRenderer : columns[i].summaryRenderer,
						summaryType: columns[i].summaryType,
						field	 : columns[i].field
				};			
		}
		
		return headers;
	},

	addStandardButtons: function() {
			var me = this;
			count = me.buttons.length;
			me.buttons[count] = '-';
			me.buttons[count+1] = {
									iconCls: 'icon-xls',		
									handler: function() {                     	
										doXls(me.model, me.name+','+me.modelName);
									}	                
								};
			me.buttons[count+2] = {			
									iconCls: 'icon-print',		
									handler: function() {                     	
										Ext.ux.grid.Printer.printAutomatically = true;            	
										Ext.ux.grid.Printer.print(me.gridPanel);
									}	                
								};
			me.buttons[count+3] = '-';
			me.buttons[count+4] = {
									text: Ext.sfa.translate_arrays[langid][305],
									iconCls: 'help',
									handler: function() {
										showHelpWindow(model);
									}	                
								};
			me.buttons[count+5] = '-';
	},
	
	addHelpButtons: function() {
			var me = this;
			count = me.buttons.length;
			me.buttons[count] = '-';
			me.buttons[count+1] = {
				text: Ext.sfa.translate_arrays[langid][305],
				iconCls: 'help',
				handler: function() {
					showHelpWindow(model);
				}	                
			};
	}
});