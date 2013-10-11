var date1 = firstDay;
var array = [];
var userPlanPanel,moduleTree;
var winSaleInsert,winOrderInsert;
var userPlan_ds;
var winPacketForm, winCustomerInfoSpecial, winUserCusomterStat;
var op;	
var win_add, win_delete, suvag, win_edit;


function showAddSpecialWork() {
	var win_add;

	var workType = Ext.create('Ext.form.ComboBox', {        	
    	xtype: 'combo',
    	name: 'workType',    
    	emptyText: Ext.sfa.translate_arrays[langid][585],
	    displayField: 'descr',
	    valueField: 'id',
	    store: Ext.sfa.stores['work_types'],
	    margins: '0 0 0 5',
	    flex: 0.35,
	    queryMode: 'local'	    
	});
	
	var userList = generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);						
	
	Ext.regModel('remote_customer', {
	    idProperty: 'customerCode',
	    fields: [        
	        {name: 'customerCode', type: 'string'},
	        {name: 'customerName', type: 'string'}
	    ]
	});

	var customerStore = new Ext.data.Store({
		model: 'remote_customer',
		proxy: {
				type: 'ajax',
				url: 'httpGW', 				
				reader: {
					type: 'json', 	 				
		            root:'items',
		            totalProperty: 'results'
		        }           
			} 			
	});

	var routeList = Ext.create('Ext.form.ComboBox', {			    		
        name: 'routelist',            	            
        xtype: 'combo',                   
        emptyText: Ext.sfa.translate_arrays[langid][380],
        store: Ext.sfa.stores['route_list'],
        displayField: 'routeName',
        valueField: 'routeID',	            
        flex: 0.35,
        queryMode: 'local',
        triggerAction: 'all',
        listeners: {
        	select: function(f, r, i) {
        		customerStore.load({params:{xml:_donate(r[0].data['routeID']+'_customer_list', 'SELECT', 'Route_Customer', 'customerCode,customerName', 's,s', " WHERE routeID='"+r[0].data['routeID']+"'")}});
        		
        		googleMap.markers = [];
        		
        		customer_marker_ds.load({params:{xml:_donate('_customer_routeid_markers', 'SELECT', ' ', ' ', ' ', r[0].data['routeID'])}, 
       			 callback: function() {
       				 	var markers = [];
       				 	
       					for (i = 0; i < customer_marker_ds.getCount(); i++) {
       						var p = customer_marker_ds.getAt(i);
       						
       						var title = '';       						
       						title = Ext.sfa.renderer_arrays['renderCustomerCode'](p.data['code']);
       						
       						markers[i] = {
       				                lat: p.data['lat'],
       				                lng: p.data['lng'],	                
       				                marker: {
       				                	title: title,
       				                	status: 7,
       				                	code: p.data['code']
       				                },
       				                listeners: {
       				                    click: function(e){
       				                    	
       				                    }
       				                }
       				        };			
       					}
       					
       					if (win_add.getHeight() == 650)
       						win_add.setSize(610, 655);
       					
       					googleMap.removeMarkers();
       					googleMap.addMarkers(markers);
       			 }
       		});
        	}
        }
	});
	
	var customerList = Ext.create('Ext.form.ComboBox', {			    		
        name: 'customerCode',            
        margins: '0 0 0 5',
        xtype: 'combo',
        emptyText:  Ext.sfa.translate_arrays[langid][469],
        flex: 0.65,
        width: 200,        
        store: customerStore,
        displayField: 'customerName',
        valueField: 'customerCode',
        queryMode: 'local',
        triggerAction: 'all',
        listeners: {
        	select: function(f, r, i) {        		        		        		
       			for (i = 0; i < customer_marker_ds.getCount(); i++) {
       				var p = customer_marker_ds.getAt(i);
       						
       				var title = '';       						
       				
       				if (r[0].data['customerCode'] == p.data['code']) {		
       					googleMap.getMap().setCenter(new GLatLng(p.data['lat'], p.data['lng']), 13);
       				}       					
       			 }
        	}
        }
	});
	
	var datefield = new Ext.form.DateField({
        format: 'Y-m-d', 		                        
        flex: 0.25,
        value: currentDate
    });
	
	var planExecute_ds = Ext.create('Ext.data.JsonStore', {              
        proxy: {
			type: 'ajax',
			url: 'httpGW',
			writer: {
	           type: 'json'
	        }
		}
    });
	
	Ext.regModel('customer_markers', {		    
		idProperty: 'code',
	    fields: [                
	        {name: 'code', type: 'string'},
	        {name: 'lat', type: 'float'},
	        {name: 'lng', type: 'float'}	        
	    ]
	});

	var customer_marker_ds = Ext.create('Ext.data.JsonStore', {
	    model: 'customer_markers',    
	    proxy: {
			type: 'ajax',
			url: 'httpGW',
	        reader: {
				type: 'json',
	            root:'items',
	            totalProperty: 'results'
	        }	            
		}
	});
	
	var googleMap = Ext.create('Ext.ux.GMapPanel', {
		height: 420,
        xtype: 'gmappanel',               
        zoomLevel: 13,
        border: true,
        gmapType: 'map',                        
        setCenter: {
            geoCodeAddr: '15171, Ulaanbaatar, Mongolia',
            marker: {title:''}
        },            
        mapConfOpts: ['enableScrollWheelZoom','enableDoubleClickZoom','enableDragging'],
        mapControls: ['GSmallMapControl','GMapTypeControl','NonExistantControl'],            
        
        markers: [],
        listeners: {
            resize: {
                fn: function(el) {                    	
                	googleMap.setSize(win_add.getWidth(), 420, false);
                }
            }
        }
	});   
	
	
	var form = Ext.widget('form', {
        layout: {
            type: 'vbox',
            align: 'stretch'
        },
        bodyBorder: 0,
        border: false,
        bodyPadding: 10,
        
        fieldDefaults: {
            labelAlign: 'top',
            labelWidth: 100,
            labelStyle: 'font-weight:bold'
        },
        defaults: {
            margins: '0 0 10 0'
        },

        items: [
          {
        	xtype: 'fieldcontainer',
            fieldLabel: '',                        
            labelStyle: 'font-weight:bold;padding:0',
            layout: 'hbox',
            defaultType: 'textfield',

            fieldDefaults: {
                labelAlign: 'top'
            },

            items: [datefield, userList, workType]
          }, {
            xtype: 'fieldcontainer',
            fieldLabel: Ext.sfa.translate_arrays[langid][586],
            labelStyle: 'font-weight:bold;padding:0',
            layout: 'hbox',	                    
            defaultType: 'textfield',

            fieldDefaults: {
                labelAlign: 'top'
            },

            items: [routeList, customerList]
        }, {
            xtype: 'fieldcontainer',
            fieldLabel: Ext.sfa.translate_arrays[langid][514],
            labelStyle: 'font-weight:bold;padding:0',
            layout: 'fit',
            
            items: [googleMap]
        }],	                
        buttons: [{
            text: Ext.sfa.translate_arrays[langid][417],
            handler: function() {                    	
            	var dv = datefield.formatDate(datefield.getValue());
            	var cv = customerList.getValue();
            	if (cv) {
	            	var values = 'd'+dv+',s'+userList.getValue()+',s'+customerList.getValue()+',i'+workType.getValue()+',s'+logged;
	            	planExecute_ds.load({params:{xml:_donate('insert', 'WRITER', 'Plan_Execute', '_date,userCode,customerCode,eventID,orderedby', values, ' ')},
	            		callback: function() {
	            			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][584], null);            			            			
	            		}});
            	} else {
            		
            		for (i = 0; i < customerStore.getCount(); i++) {
            			var rec = customerStore.getAt(i);
	            		var values = 'd'+dv+',s'+userList.getValue()+',s'+rec.get('customerCode')+',i'+workType.getValue()+',s'+logged;
		            	planExecute_ds.load({params:{xml:_donate('insert', 'WRITER', 'Plan_Execute', '_date,userCode,customerCode,eventID,orderedby', values, ' ')},
		            		callback: function() {
		            			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][584], null);            			            			
		            		}});
            		}
            	}
            	                    	
            	win_add.hide();
            }
        },                 
        {
            text: Ext.sfa.translate_arrays[langid][545],
            handler: function() {
                win_add.hide();
            }
        }]
    });
	
	win_add = Ext.widget('window', {
        title: Ext.sfa.translate_arrays[langid][465],
        closeAction: 'hide',        
        width: 600,
        height: 650,
        minHeight: 400,
        layout: 'fit',
        resizable: true,               
        items: form
    });
	
	win_add.show();
}

function showSaleHandImportWindow() {
	var sale_temp_data = [];
	var t = 0;
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var record = Ext.sfa.stores['product_list'].getAt(i);
		if (productAble(record)) {
			sale_temp_data[t] = {'productCode':record.data['code'], 'quantity':0, 'price':0, 'total':0};
			t++;
		}
	}
	
	var sale_row_ds = Ext.create('Ext.data.JsonStore', {		     	    
        fields: [
            {name: 'productCode'},
            {name: 'quantity',  type: 'int'},            
            {name: 'price', type: 'int'},
            {name: 'total',  type: 'int'}       
        ]        
    });
	
	sale_row_ds.loadData(sale_temp_data);
	
	var sale_row_ds1 = Ext.create('Ext.data.JsonStore', {		     
	    proxy: {
			type: 'ajax',
			url: 'httpGW',
	        reader: {
				type: 'json',
	            root:'items',
	            totalProperty: 'results'
	        }    
		},
        fields: [
            {name: 'productCode'},
            {name: 'type', type: 'int'},
            {name: 'quantity',  type: 'int'},            
            {name: 'price', type: 'int'},
            {name: 'total',  type: 'int'}       
        ]        
    });


	var cstore = Ext.create('Ext.data.JsonStore', {
		model: 'code_name_model',     
	    proxy: {
			type: 'ajax',
			url: 'httpGW',
	        reader: {
				type: 'json',
	            root:'items',
	            totalProperty: 'results'
	        }	            
		}
	});
	
	var userList = generateRemoteComboWithFilter('_remote_section_users', 'user_all_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);
	
	userList.on('select', function() {		
		cstore.load({params:{xml:_donate('_get_customer_dealer', 'SELECT', 'Customer', ' ', ' ', userList.getValue())}});
	}, userList);

	var clearData = function() {
		var t = 0;
		sale_temp_data = [];
		for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);
			if (record.data['vendor'] == 'bosa') {
				sale_temp_data[t] = {'productCode':record.data['code'], 'type': 0, 'quantity':0, 'price':0, 'total':0};
				t++;
			}                	                	
		}
			
		sale_row_ds.loadData(sale_temp_data); 	
	}
	
	var ognoo = Ext.create('Ext.form.DateField', {        
        name: 'ognoo',        
        format: 'Y-m-d',
        width: 90,
        value: currentDate,
        margins: '0 0 0 5',                        
        xtype: 'datefield'
    });
	
	var gridPanel = Ext.create('Ext.grid.Panel', {			
		xtype: 'gridpanel',			
		store: sale_row_ds,			
		columnLines: true,		
		region: 'center',
		features:[{
		     id: 'summary_sale_temp',
		     ftype: 'summary'
		}], 
		columns: [ new Ext.grid.RowNumberer(),
		    {			
				text: Ext.sfa.translate_arrays[langid][345],			
	   			dataIndex: 'productCode',
	   			flex: 1,
	   			renderer: Ext.sfa.renderer_arrays['renderProductCode']	   			   	
			},
			{			
				text: 'Төрөл',			
	   			dataIndex: 'type',	   				   		
	   			renderer: Ext.sfa.renderer_arrays['renderSaleType'],	   			
	   			width: 80	   			   	
			},
			{			
				text: Ext.sfa.translate_arrays[langid][347],			
	   			dataIndex: 'quantity',
	   			align: 'right',
	   			summaryType: 'sum',
	   			renderer: Ext.sfa.renderer_arrays['renderNumber'],
	   			summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'],
	   			width: 80	   			   	
			},
			{			
				text: Ext.sfa.translate_arrays[langid][392],
				align: 'right',
	   			dataIndex: 'price',	
	   			renderer: Ext.sfa.renderer_arrays['renderMoney'],
	   			width: 80	   				   			   
			},
			{			
				text: Ext.sfa.translate_arrays[langid][314],			
	   			dataIndex: 'total',
	   			width: 120,
	   			align: 'right',
	   			summaryType: 'sum',
	   			renderer: Ext.sfa.renderer_arrays['renderMoney'],
	   			summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']
			}
		],					
		listeners: {
			selectionchange: function(model, records) {
				var rec = records[0];
				if (rec) {
					var productCode = rec.data['productCode'];
					
					var price_list = generateLocalComboWithCaption('local_customerType_combo', 'price_types', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100);
					if (op)
						price_list.setValue(op);
					price_list.on('change', function(e) {
						var price = 0;
						for (i = 0; i < Ext.sfa.stores['price_list'].getCount(); i++) {
				    		var record = Ext.sfa.stores['price_list'].getAt(i);
				    		if (record.data['productCode'] == productCode && record.data['customerType'] == price_list.getValue())
				    			price = record.data['price'];
				    	}  
						
						
                		total_value = quantity.getValue()*price;                		
                		total.setValue(total_value);
                		op = price_list.getValue();
			    	});
			    	
					
					var total_value = 0;
					var quantity = Ext.create('Ext.form.NumberField', {
		                xtype: 'numberfield',
		                fieldLabel: Ext.sfa.translate_arrays[langid][347],
		                name: 'quantity',	                
		                value: rec.data['quantity'],
		                align: 'right',
		                allowDecimals: true,
		                editable: true,
		                decimalPrecision: 1,	                
		                listeners: {
		                	'change': function() {	                
		                		var price = 0;
								for (i = 0; i < Ext.sfa.stores['price_list'].getCount(); i++) {
						    		var record = Ext.sfa.stores['price_list'].getAt(i);
						    		if (record.data['productCode'] == productCode && record.data['customerType'] == price_list.getValue())
						    			price = record.data['price'];
						    	}  
								
		                		total_value = quantity.getValue()*price;
		                		total.setValue(total_value);
		                	}
		                }
		            });								
					
					var total = Ext.create('Ext.ux.form.NumericField', {
		                xtype: 'currencyfield',
		                fieldLabel: Ext.sfa.translate_arrays[langid][314],
		                name: 'total',
		                minValue: 0,
		                align: 'right',
		                decimalPrecision:2,
		                hasfocus:false,
		                maxValue: 9000000000,
		                editable: false,
		                allowDecimals: true
		            });
					
					var sale_row = Ext.createWidget('form', {			        			        
				        bodyPadding: 5,				       
				        border: false,
				        fieldDefaults: {
				            labelAlign: 'left',
				            labelWidth: 105,
				            fieldWidth: 100,
				            anchor: '100%'
				        },
				        items: [quantity,
				                price_list,
				                total],
			            buttons: [{
			                    text: 'Бэлнээр',
			                    handler: function() {
			                    	if (price_list.getValue()) {
				                    	var price = 0;
										for (i = 0; i < Ext.sfa.stores['price_list'].getCount(); i++) {
								    		var record = Ext.sfa.stores['price_list'].getAt(i);
								    		if (record.data['productCode'] == productCode && record.data['customerType'] == price_list.getValue())
								    			price = record.data['price'];
								    	}  									
				                		for (i = 0; i < sale_row_ds.getCount(); i++) {
				                			var record = sale_row_ds.getAt(i);			                			
				                			if (record.data['productCode'] == productCode) {		                				
				                				sale_temp_data[i] = {'productCode':record.data['productCode'], 'quantity':quantity.getValue(), 'price':price, 'type': 0, 'total':total.getValue()};			                				
				                			}
				                		}
				                				                    			                    	
				                		sale_row_ds.loadData(sale_temp_data);
				                		
				                		win_row.hide();
			                    	} else {
			                    		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], 'Шаардлагатай талбарыг сонгон уу!', null);
			                    	}
			                    }
			            	},
			            	{
			                    text: 'Зээлээр',
			                    handler: function() {
			                    	if (price_list.getValue()) {
				                    	var price = 0;
										for (i = 0; i < Ext.sfa.stores['price_list'].getCount(); i++) {
								    		var record = Ext.sfa.stores['price_list'].getAt(i);
								    		if (record.data['productCode'] == productCode && record.data['customerType'] == price_list.getValue())
								    			price = record.data['price'];
								    	}  									
				                		for (i = 0; i < sale_row_ds.getCount(); i++) {
				                			var record = sale_row_ds.getAt(i);			                			
				                			if (record.data['productCode'] == productCode) {		                				
				                				sale_temp_data[i] = {'productCode':record.data['productCode'], 'quantity':quantity.getValue(), 'type': 1, 'price':price, 'total':total.getValue()};			                				
				                			}
				                		}
				                				                    			                    	
				                		sale_row_ds.loadData(sale_temp_data);
				                		
				                		win_row.hide();
			                    	} else {
			                    		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], 'Шаардлагатай талбарыг сонгон уу!', null);
			                    	}
			                    }
			            	},
			            	{
			                    text: Ext.sfa.translate_arrays[langid][545],
			                    handler: function() {
			                    	win_row.hide();
			                    }
			            	}
			            ]
				    });
									
					
					var win_row = Ext.widget('window', {
						title: Ext.sfa.renderer_arrays['renderProductCode'](productCode),
						closeAction: 'hide',			
						bodyPadding: 0,
						border: false,
						layout: 'fit',
						width: 300,
						height: 180,
						items: [sale_row]
					});
					
					win_row.show();
				}
			}
		}
	});	
	
	var grid1 = Ext.create('Ext.grid.GridPanel', {    		
		xtype: 'grid',
		border: false,
		columnLines: true,
		width: 300,
		split: true,
		region: 'west',		
		store: cstore,    		
		selModel: Ext.create('Ext.selection.CheckboxModel', {
			listeners: {
				selectionchange: function(sm, selections) {
					
				}
			}
		}),	
		columns: [{
            text     : 'Код',
            width	 : 60,
            sortable : true,                
            dataIndex: 'code'            
        }, {
            text     : Ext.sfa.translate_arrays[langid][466],
            flex	 : 1,
            sortable : true,                
            dataIndex: 'name'            
        }]            
	});   
	
	winSaleInsert = Ext.widget('window', {
		title: Ext.sfa.translate_arrays[langid][294],
		closeAction: 'hide',			
		bodyPadding: 0,
		border: true,
		layout: 'border',
		width: 850,
		height: 460,
		items: [grid1, gridPanel],
		dockedItems: [{
            xtype: 'toolbar',
            items: [ognoo, userList, {
                text: Ext.sfa.translate_arrays[langid][417],
                iconCls: 'icon-add',
                disabled: hidden_values['sale_insert_button'],
                handler: function(){                	        	    	
                	var userCode = userList.getValue();                	
                	var parentID = '0';
                	var ticketID = getTicketId();
                	var customer = grid1.getView().getSelectionModel().getSelection();  	                	                	                	
                	if (customer.length > 0 && userCode) {
                		var customerCode = customer[0].get('code'); 
                    	parentID = customer[0].get('parentID');
                		Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][587], function(btn, text){	                		
                			if (btn == 'yes') {	
				                		var action_sale_temp = Ext.create('Ext.data.JsonStore', {                 	                         	        
				                 	        proxy: {
				                 				type: 'ajax',
				                 				url: 'httpGW',
				                 	            writer: {
				                 					type: 'json'                 	                
				                 	            }	            
				                 			}
				                 	    });	
				                		
				                		var date = Ext.Date.format(ognoo.getValue(), 'Y-m-d');
				                		var sent = false;
				                		for (i = 0; i < sale_row_ds.getCount(); i++) {
				                			var rec = sale_row_ds.getAt(i);
				                			
				                			if (rec.data['total'] > 0) {
				                				sent = true;
				                				var xml = _donate('action_sale', 'WRITER', 'Sales', '_dateStamp,customerCode,userCode,productCode,posX,posY,type,quantity,price,amount,discount,flag,ticketID', 
														   'd'+date+',s'+customerCode+',s'+userCode+',s'+rec.data['productCode']+',f0,f0,i'+rec.data['type']+',i'+rec.data['quantity']+',f'+rec.data['price']+',f'+rec.data['total']+',i'+parentID+',f'+rec.data['total']+',i'+ticketID, ' ');
				                				
				                				action_sale_temp.load({params:{xml:xml}});
				                			}
				                		}
				                		if (!sent)
				                			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], 'Амжилгүй ! Борлуулалт оруулаагүй байна !', null);
				                		else
				                			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][557], function() {
				                				clearData();
				                			});
				                	}
                			});
                		}else {
	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], Ext.sfa.translate_arrays[langid][589], null);
	                	}	                	
                }
            },'-',
            {
                text: Ext.sfa.translate_arrays[langid][471],
                iconCls: 'icon-delete',
                disabled: hidden_values['sale_insert_button'],
                handler: function(){                	        	    	
                	clearData();
                }
            }]
        }]
	});
	
    winSaleInsert.show();
}

function showOrderHandImportWindow() {
	var order_temp_data = [];
	var t = 0;
	var ow, op;
	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
		var record = Ext.sfa.stores['product_list'].getAt(i);
		if (record.data['vendor'] == 'bosa') {
			order_temp_data[t] = {'productCode':record.data['code'], 'requestCount':0, 'price': 0, 'amount': 0, 'wareHouseID': 0, 'pr': 0};
			t++;
		}
	}
	
	var order_row_ds = Ext.create('Ext.data.JsonStore', {
        fields: [
            {name: 'productCode'},
            {name: 'requestCount',  type: 'int'},
            {name: 'wareHouseID',  type: 'int'},
            {name: 'price',  type: 'int'},
            {name: 'amount', type: 'float'},
            {name: 'pr', type: 'int'}
        ]
    });
	 
	order_row_ds.loadData(order_temp_data);
	
	var ognoo = Ext.create('Ext.form.DateField', {        
        name: 'ognoo',        
        format: 'Y-m-d',
        width: 90,
        value: currentDate,
        margins: '0 0 0 5',
        xtype: 'datefield'
    });
	
	var userList = generateRemoteCombo('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310]);			
	
	var clearData = function(b) {		
		var t = 0;
		for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);			
			if (record.data['vendor'] == 'bosa') {
				order_temp_data[t] = {'productCode':record.data['code'], 'requestCount':0, 'price': 0, 'amount': 0, 'wareHouseID': 0, pr: 0};
				t++;
			}
		}                	                	
    	
    	order_row_ds.loadData(order_temp_data);
    	
    	if (b)
    		userList.setValue('');    	
	}
	clearData(false);
	var gridPanel = Ext.create('Ext.grid.GridPanel', {			
		xtype: 'gridpanel',			
		store: order_row_ds,			
		columnLines: true,		
		features:[
	          {
	        	  id: 'summary_order_temp',
	        	  ftype: 'summary'
	          }
		], 
		columns: [new Ext.grid.RowNumberer({width:30}), 
		    {			
				text: Ext.sfa.translate_arrays[langid][345],			
	   			dataIndex: 'productCode',
	   			flex: 1,
	   			renderer: Ext.sfa.renderer_arrays['renderProductCode']	   			   	
			},
			{			
				text: Ext.sfa.translate_arrays[langid][413],			
	   			dataIndex: 'requestCount',
	   			align: 'right',
	   			summaryType: 'sum',
	   			renderer: Ext.sfa.renderer_arrays['renderNumber'],
	   			summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'],
	   			width: 60	   				   			
			},{			
				text: Ext.sfa.translate_arrays[langid][392],			
	   			dataIndex: 'price',
	   			align: 'right',	   			
	   			renderer: Ext.sfa.renderer_arrays['renderMoney'],	   			
	   			width: 70	   				   			
			},{			
				text: 'Дүн',			
	   			dataIndex: 'amount',
	   			align: 'right',	   	
	   			summaryType: 'sum',
	   			renderer: Ext.sfa.renderer_arrays['renderMoney'],	
	   			summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'],
	   			width: 100	   				   			
			},{			
				text: Ext.sfa.translate_arrays[langid][509],			
	   			dataIndex: 'wareHouseID',
	   			align: 'right',	   			
	   			renderer: Ext.sfa.renderer_arrays['renderWareHouseID'],	   			
	   			width: 80	   				   			
			}
		],			
		dockedItems: [{
            xtype: 'toolbar',
            items: [ognoo, userList, {
                text: Ext.sfa.translate_arrays[langid][417],
                iconCls: 'icon-add',
                disabled: hidden_values['sale_insert_button'],
                handler: function(){                	        	    	
                	var userCode = userList.getValue();
                	
                	if (isNotNull(userCode)) {
                		Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][590], function(btn, text){	                		
                			if (btn == 'yes') {                
                					var ticketID = getTicketId();
			                		var action_order_temp = Ext.create('Ext.data.JsonStore', {                 	                         	        
			                 	        proxy: {
			                 				type: 'ajax',
			                 				url: 'httpGW',
			                 	            writer: {
			                 					type: 'json'                 	                
			                 	            }	            
			                 			}
			                 	    });	
			                		var date = Ext.Date.format(ognoo.getValue(), 'Y-m-d');
			                		var sent = false;			                		
			                		for (i = 0; i < order_row_ds.getCount(); i++) {
			                			var rec = order_row_ds.getAt(i);
			                			
			                			if (rec.data['requestCount'] > 0) {
			                				sent = true;
			                				action_order_temp.load({params:{xml:_donate('insert', 'WRITER', 'Orders', '_date,userCode,customerCode,productCode,requestCount,price,wareHouseID,ticketID', 
													   'd'+date+',s'+userCode+',s'+userCode+',s'+rec.data['productCode']+',i'+rec.data['requestCount']+',f'+rec.data['price']+',i'+rec.data['wareHouseID']+',i'+ticketID, ' ')}});
			                			}
			                		}
			                		
			                		if (!sent)
			                			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], 'Амжилгүй ! Захиалга оруулаагүй байна !', null);
			                		else
			                			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][557], function() {
			                				clearData(true);
			                			});			                	
                			}
                			else {
                		
                			}
                		});
                	} else {
	                	Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], Ext.sfa.translate_arrays[langid][470], null);
	                }
                }
            },'-',
            {
                text: Ext.sfa.translate_arrays[langid][471],
                iconCls: 'icon-delete',
                disabled: hidden_values['sale_insert_button'],
                handler: function(){                	        	    	
                	clearData();
                }
            }]
        }],
		listeners: {
			selectionchange: function(model, records) {
				var rec = records[0];
				if (rec) {
					var productCode = rec.data['productCode'];										
										
					var requestCount = Ext.create('Ext.form.NumberField', {
		                xtype: 'numberfield',
		                fieldLabel: Ext.sfa.translate_arrays[langid][347],
		                name: 'requestCount',
		                minValue: 0,
		                maxValue: 900000,
		                hideTrigger: true,
		                value: rec.data['requestCount'],
		                align: 'right',
		                hasfocus:true,
		                allowBlank: false,
		                allowDecimals: true,
		                decimalPrecision: 2,
		                listeners: {
		                    afterrender: function(field) {
		                    	requestCount.focus(false, 200);
		                    }
		                  }
		            });																		
					
					var price = Ext.create('Ext.ux.form.NumericField', {		                
		                fieldLabel: Ext.sfa.translate_arrays[langid][392],
		                name: 'price',
		                minValue: 0,
		                maxValue: 900000,
		                hideTrigger: true,
		                value: rec.data['price'],
		                xtype: 'currencyfield',
		                allowBlank: false,
		        		decimalPrecision:2,
		                align: 'right',
		                allowDecimals: true		                	               
		            });		
					
					requestCount.on('change', function(e) {
						for (i = 0; i < Ext.sfa.stores['price_list'].getCount(); i++) {
				    		var record = Ext.sfa.stores['price_list'].getAt(i);
				    		if (record.data['productCode'] == productCode && record.data['customerType'] == price_list.getValue())
				    			price.setValue(record.data['price']);
				    	}    
			    	});
					
					var wareHouse = generateRemoteComboWithFilter('_remote_ware_house', 'ware_house', 'wareHouseID', 'name', Ext.sfa.translate_arrays[langid][509], mode);
					if (rec.data['wareHouseID'] != 0)
						wareHouse.setValue(rec.data['wareHouseID']);
					
					if (ow != 0)
						wareHouse.setValue(ow);
					
					wareHouse.allowBlank = false;
					var price_list = generateLocalComboWithCaption('local_customerType_combo', 'price_types', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100);
					if (rec.data['pr'] != 0)
						price_list.setValue(rec.data['pr']);
					price_list.allowBlank = false;
					if (op != 0)
						price_list.setValue(op);
					
					price_list.on('change', function(e) {
						for (i = 0; i < Ext.sfa.stores['price_list'].getCount(); i++) {
				    		var record = Ext.sfa.stores['price_list'].getAt(i);				    		
				    		if (record.data['productCode'] == productCode && record.data['customerType'] == price_list.getValue())
				    			price.setValue(record.data['price']);
				    	}    
			    	});
			    	
					wareHouse.fieldLabel = 'Агуулах';
					price_list.fieldLabel = 'Үнэ';
					
					var order_row = Ext.createWidget('form', {			        			        
				        bodyPadding: 5,				        
				        border: false,
				        fieldDefaults: {
				            labelAlign: 'left',
				            labelWidth: 105,
				            fieldWidth: 100,
				            anchor: '100%'
				        },
				        items: [requestCount, price_list, price, wareHouse],
			            buttons: [{
			                    text: 'Оруулах',
			                    handler: function() {			                    	
			                    	if (requestCount.getValue() > 0 && wareHouse.getValue() > 0) {
			                    		ow = wareHouse.getValue();
			                    		op = price_list.getValue();
				                		for (i = 0; i < order_temp_data.length; i++) {
				                			var record = order_temp_data[i];
				                			if (record['productCode'] == productCode)		                				
				                				order_temp_data[i] = {'productCode':productCode, 'requestCount':requestCount.getValue(), 'price': price.getValue(), 'amount': (requestCount.getValue()*price.getValue()), 'wareHouseID': wareHouse.getValue(), 'pr': price_list.getValue()};		                							                					                		
				                		}
				                				                    			                    	
				                		order_row_ds.loadData(order_temp_data);
				                		
				                		win_row.hide();
			                    	}
			                    }
			            	},
			            	{
			                    text: Ext.sfa.translate_arrays[langid][545],
			                    handler: function() {
			                    	win_row.hide();
			                    }
			            	}
			            ]
				    });
									
					
					var win_row = Ext.widget('window', {
						title: Ext.sfa.renderer_arrays['renderProductCode'](productCode),
						closeAction: 'hide',			
						bodyPadding: 0,
						border: false,
						layout: 'fit',
						width: 300,
						height: 210,
						items: [order_row]
					});
					
					win_row.show();
				}
			}
		}
	});
	
	winOrderInsert = Ext.widget('window', {
		title: Ext.sfa.translate_arrays[langid][293],
		closeAction: 'hide',			
		bodyPadding: 0,
		border: true,
		layout: 'fit',
		width: 580,
		height: 460,
		items: [gridPanel]
	});
	
    winOrderInsert.show();
}

function showHelpWindow(id) {			    			
	var rc_columns = help_model['columns'];				
	var rc_ds = help_model['readStore']; 			
	var rc_ds_action = help_model['writeStore'];
	           
    var help = Ext.create('Ext.Panel', {   
        width: 540,
        height: 200,
        layout: 'border',
        items: [
        {
                id: 'detailPanel',
                region: 'center',
                bodyPadding: 7,
                border: false,
                bodyStyle: "background: #ffffff;",
                autoLoad: {
                	url: 'fileGW?fn='+id+'.html'
                }   
        }]
    });        
    
    var winHelp = Ext.widget('window', {
		title: Ext.sfa.translate_arrays[langid][305],
		closeAction: 'hide',			
		bodyPadding: 0,
		border: false,
		layout: 'fit',
		width: 850,
		height: 620,
		items: [help]
	});
	
    winHelp.show();
}

function showPacketForm() {
	if (!winPacketForm) {
		Ext.regModel('packet', { 
	        fields: [
             {name: 'code', type: 'int'},{name: 'name', type: 'string'}, {name: 'startDate', type: 'string'}, {name: 'endDate', type: 'string'}, {name: 'routeList', type:'string'}	                 
            ]
	    });
		
		var packet = Ext.create('Ext.data.JsonStore', {
	        model: 'packet',	     
	        pageSize: 10,
	        mode: 'remote',
	        proxy: {
				type: 'ajax',
				url: 'httpGW',
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }	            
			}
	    });	
		
		var packetGrid = Ext.create('Ext.grid.GridPanel', {		
			flex: 0.5,
			xtype: 'gridpanel',
			border: true,
			columnLines: true,			
			store: packet,						
			columns: [
				  {
					  text: Ext.sfa.translate_arrays[langid][369],
					  dataIndex: 'code',
					  align:'right',
					  width : 30      	  
			      },
		          {
		        	  text: Ext.sfa.translate_arrays[langid][373],
		        	  dataIndex: 'name',		        	  
		        	  flex : 1		        	  
		          }, 
		          {
		        	  text: Ext.sfa.translate_arrays[langid][481],
		        	  dataIndex: 'startDate',
		        	  width: 80		        	  
		          },
		          {
		        	  text: Ext.sfa.translate_arrays[langid][410],
		        	  dataIndex: 'endDate',
		        	  width: 80
		          },
		          {
		        	  text: Ext.sfa.translate_arrays[langid][411],
		        	  dataIndex: 'routeList',
		        	  width: 300
		        	  //renderer: renderRoutes
		          }
			],			
 			listeners: {
 				selectionchange: function(model, records) {
 					if (records[0]) {
 						var rec = records[0];
 						var code = rec.data['code'];
 						codeField.setValue(code);
 						packetNames.setValue(rec.data['name']); 						
 						startDateField.setValue(rec.data['startDate'].substring(0, 10));
 						endDateField.setValue(rec.data['endDate'].substring(0, 10)); 						
 						routeList.setValue(replaceCharactersComma(rec.data['routeList']));
 						packet_product.load({params:{xml:_donate('_packet_data', 'SELECT', 'Packet', ' ', ' ', code+',0,'+mode)}});				
 						packet_freeproduct.load({params:{xml:_donate('_packet_data', 'SELECT', 'Packet', ' ', ' ', code+',1,'+mode)}});
 					}
 				}
 			}	
		});
				
		packet.load({params:{xml:_donate('Packet', 'SELECT', 'Packet', 'avg(code) as code,name,max(startDate) as startDate,max(endDate) as endDate,max(routeList) as routeList', 'i,s,s,s,s', ' GROUP by name')}});
		
		Ext.regModel('packetproduct', { 
	        fields: [
	                 {name: 'productCode', type: 'string'}, {name: 'quantity', type: 'int'}, {name: 'price', type: 'int'}, {name: 'status', type:'bool'}	                 
	                ]
	    });
		
		var packet_product = Ext.create('Ext.data.JsonStore', {
	        model: 'packetproduct',	     
	        pageSize: 10,
	        mode: 'remote',
	        proxy: {
				type: 'ajax',
				url: 'httpGW',
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }	            
			}
	    });	
		
		var packet_freeproduct = Ext.create('Ext.data.JsonStore', {
	        model: 'packetproduct',	     
	        pageSize: 10,
	        mode: 'remote',
	        proxy: {
				type: 'ajax',
				url: 'httpGW',
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }	            
			}
	    });	
				
		var packet_ds_action = Ext.create('Ext.data.JsonStore', {
	        model: 'packetproduct',	     	        
	        proxy: {
				type: 'ajax',
				url: 'httpGW',
				writer: {
		           type: 'json'
		        }
			}
	    });
		
		var cellEditing = new Ext.grid.plugin.CellEditing({
	        clicksToEdit: 1
	    });
		
		var cellEditingFree = new Ext.grid.plugin.CellEditing({
	        clicksToEdit: 1
	    });
		
		var productPanel = Ext.create('Ext.grid.GridPanel', {		
			flex: 1,
			xtype: 'gridpanel',
			border: true,
			columnLines: true,			
			store: packet_product,			
			plugins: [cellEditing],
			columns: [
		          {
		        	  text: Ext.sfa.translate_arrays[langid][345],
		        	  dataIndex: 'productCode',
		        	  renderer: Ext.sfa.renderer_arrays['renderProductCode'],
		        	  flex : 1		        	  
		          }, 
		          {
		        	  text: Ext.sfa.translate_arrays[langid][347],
		        	  dataIndex: 'quantity',
		        	  align: 'right',
		        	  width: 50,
		        	  field: { xtype: 'numberfield' }
		          },
		          {
		        	  text: Ext.sfa.translate_arrays[langid][392],
		        	  dataIndex: 'price',
		        	  width: 50,
		        	  align: 'right',
		        	  field: { 		        		                                                                           
                         xtype: 'combo',	                    		                    	                	    	                	   
                	     displayField: 'price',
                	     valueField: 'price',
                	     store: Ext.sfa.stores['price_counts'],
                	     queryMode: 'local'	   		        		  
		        	  }
		          },
		          {
		        	  text: Ext.sfa.translate_arrays[langid][415],
		        	  dataIndex: 'status',
		        	  width: 50,
		        	  field: { xtype: 'checkbox' },
		        	  xtype: 'checkcolumn'
		          }
			]	
		});
		
		var bonusPanel = Ext.create('Ext.grid.GridPanel', {		
			flex: 1,
			margins: '0 0 0 5', 
			xtype: 'gridpanel',
			border: true,
			columnLines: true,			
			store: packet_freeproduct,			
			plugins: [cellEditingFree],
			columns: [
		          {
		        	  text: Ext.sfa.translate_arrays[langid][345],
		        	  dataIndex: 'productCode',
		        	  renderer: Ext.sfa.renderer_arrays['renderProductCode'],
		        	  flex : 1		        	  
		          }, 
		          {
		        	  text: Ext.sfa.translate_arrays[langid][347],
		        	  dataIndex: 'quantity',
		        	  width: 50,
		        	  field: { xtype: 'numberfield' }
		          },		          
		          {
		        	  text: Ext.sfa.translate_arrays[langid][415],
		        	  dataIndex: 'status',
		        	  width: 50,
		        	  field: { xtype: 'checkbox' },
		        	  xtype: 'checkcolumn'
		          }
			]	
		});
						
		packet_product.load({params:{xml:_donate('_packet_data', 'SELECT', 'Packet', ' ', ' ', ' ,0,'+mode)}});				
		packet_freeproduct.load({params:{xml:_donate('_packet_data', 'SELECT', 'Packet', ' ', ' ', ' ,1,'+mode)}});
		var packetNames = Ext.create('Ext.form.TextField', {
                flex: 1.2,
                name: 'name',
                fieldLabel: Ext.sfa.translate_arrays[langid][331],  
                margins: '0 0 0 5', 
                xtype: 'textfield'                
        });
		
		var routeList = Ext.create('Ext.form.ComboBox', {			
            	flex: 3,
            	xtype: 'combo',
            	name: 'route',
            	fieldLabel: Ext.sfa.translate_arrays[langid][332],                	    
        	    multiSelect: true,
        	    displayField: 'routeName',
        	    valueField: 'routeID',
        	    store: Ext.sfa.stores['route_list'],
        	    queryMode: 'local',
        	    margins: '0 0 0 5'
		});
		
		var startDateField = Ext.create('Ext.form.DateField', {
            flex: 1,
            name: 'startDate',
            fieldLabel: Ext.sfa.translate_arrays[langid][481],
            format: 'Y-m-d',
            margins: '0 0 0 5',                        
            xtype: 'datefield'
        });
		
		var codeField = Ext.create('Ext.form.NumberField', {
            flex: 0.5,
            name: 'codeValue',
            fieldLabel: Ext.sfa.translate_arrays[langid][369],
            minValue: 10,
            value: 10,
            xtype: 'numberfield'
        });
		
		var endDateField = Ext.create('Ext.form.DateField', {			
            flex: 1,
            name: 'endDate',
            fieldLabel: Ext.sfa.translate_arrays[langid][410],
            format: 'Y-m-d',
            margins: '0 0 0 5',                                                
            xtype: 'datefield'                    
		});
		
		var formPanel = Ext.create('Ext.form.FormPanel', {
			layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bodyPadding: 10,

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 100,
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },	        
	        items: [{
	                xtype: 'fieldcontainer',
	                fieldLabel: Ext.sfa.translate_arrays[langid][407],
	                labelStyle: 'font-weight:bold;padding:0',
	                layout: 'hbox',	                    
	                defaultType: 'textfield',
	
	                fieldDefaults: {
	                    labelAlign: 'top'
	                },
	                items: [codeField, packetNames, startDateField, endDateField,routeList]
	        	}, {
	        		flex: 1,
	        		xtype: 'fieldcontainer',	  
	        		defaultType: 'gridpanel',
	        		layout: {
	                    type: 'hbox',
	                    align: 'stretch'
	                },
	                items :[productPanel, bonusPanel]
	        	},
	        	packetGrid
	        ],	                
            buttons: [{
            	  text: Ext.sfa.translate_arrays[langid][416],
            	  disabled: hidden_values['accept_edit'],
                  handler: function() {
                	  codeField.setValue('');
                	  packetNames.setValue('');
                	  routeList.setValue('');
                	  startDateField.setValue('');
                	  endDateField.setValue('');
                	  packet_product.load({params:{xml:_donate('_packet_data', 'SELECT', 'Packet', ' ', ' ', ' ,0')}});				
              		  packet_freeproduct.load({params:{xml:_donate('_packet_data', 'SELECT', 'Packet', ' ', ' ', ' ,1')}});
                  }
            },{
                text: Ext.sfa.translate_arrays[langid][417],
                disabled: hidden_values['accept_edit'],
                handler: function() {                          	                	
                	var name = packetNames.getValue();
                	var code = codeField.getValue();
                	
                	if (code > 0) {	                	
	                	var startDate = startDateField.getRawValue();
	                	var endDate = endDateField.getRawValue();
	                	var rList = replaceCharacters(routeList.getValue());	                		                	
	                	packet_ds_action.load({params: {xml:_donate('delete', 'WRITER', 'Packet', ' ', ' ', " code='"+code+"'")}});
	                		
	        			for (i = 0; i < packet_product.getCount(); i++) {                		                	
	                		var rec = packet_product.getAt(i);
	                		if (rec.get('status')) {
	                			var values = 'i'+code+',s'+name+',d'+startDate+',d'+endDate+',s'+rList+',s'+rec.get('productCode')+',i'+rec.get('quantity')+',i'+rec.get('price');
	                			var where = " code='"+code+"' and productCode='"+rec.get('productCode')+"'";
	                			packet_ds_action.load({params: {xml:_donate('insert', 'WRITER', 'Packet', 'code,name,startDate,endDate,routeList,productCode,quantity,price', values, where)}});	                			
	                		}                		                		
	                	}
	        			
	        			//free product
	        			for (i = 0; i < packet_freeproduct.getCount(); i++) {                		                	
	                		var rec = packet_freeproduct.getAt(i);
	                		if (rec.get('status')) {
	                			var values = 'i'+code+',s'+name+',d'+startDate+',d'+endDate+',s'+rList+',s'+rec.get('productCode')+',i'+rec.get('quantity')+',i0';
	                			var where = " code='"+code+"' and productCode='"+rec.get('productCode')+"'";
	                			packet_ds_action.load({params: {xml:_donate('insert', 'WRITER', 'Packet', 'code,name,startDate,endDate,routeList,productCode,quantity,price', values, where)}});	                				                			
	                		}                		                		
	                	}
	        			
	        			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][557],  function(btn, text){
	        		      if (btn == 'ok'){
	        		    	  packet.load({params:{xml:_donate('Packet', 'SELECT', 'Packet', 'avg(code) as code,name,max(startDate) as startDate,max(endDate) as endDate,max(routeList) as routeList', 'i,s,s,s,s', ' GROUP by name')}});
	        		      }
	        		   });
	        			
                	} else 
                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][588], null);
                }
            }, {
                text: Ext.sfa.translate_arrays[langid][366],
                disabled: hidden_values['accept_edit'],
                handler: function() {
                	var code = codeField.getValue();
                	var name = packetNames.getRawValue();
                	if (code > 0)  {
                		Ext.Msg.confirm('', name+Ext.sfa.translate_arrays[langid][548], function(btn, text){
                			if (btn == 'yes'){
                				packet_ds_action.load({params: {xml:_donate('delete', 'WRITER', 'Packet', ' ', ' ', " code='"+code+"'")},
                					callback: function() {
                						packet.load({params:{xml:_donate('Packet', 'SELECT', 'Packet', 'avg(code) as code,name,max(startDate) as startDate,max(endDate) as endDate,max(routeList) as routeList', 'i,s,s,s,s', ' GROUP by name')}});
                					}});                				
                			} else {
                	
                			}
                		});
                	}                	
                }
            }, {
                text: Ext.sfa.translate_arrays[langid][368],
                handler: function() {
                	winPacketForm.hide();
                }
            }]       
	    });				
		
		winPacketForm = Ext.widget('window', {
			title: Ext.sfa.translate_arrays[langid][273],
			closeAction: 'hide',			
			bodyPadding: 0,
			layout: 'fit',
			border: false,
			width: 650,
			height: 580,			
			items: [formPanel]
		});
	}
	
	winPacketForm.show();
}

function showUserCustomerStat(userCode) {				
		var customer_columns = [{name: 'code', type: 'string', title: Ext.sfa.translate_arrays[langid][369], width: 70},
	                        {name: 'name', type: 'string', title: Ext.sfa.translate_arrays[langid][373], width:130, summaryType:'count'},
	                        {name: 'location', type: 'string', title: Ext.sfa.translate_arrays[langid][372], width:150}];                      
		
		Ext.regModel('customer_columns', {	        
	        fields: customer_columns 
	    });
		
		customer_stat_ds = Ext.create('Ext.data.JsonStore', {
	        model: 'customer_columns',	        
	        proxy: {
				type: 'ajax',
				url: 'httpGW',
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }
			}
	    }); 
		
		customer_stat_ds1 = Ext.create('Ext.data.JsonStore', {
	        model: 'customer_columns',	        
	        proxy: {
				type: 'ajax',
				url: 'httpGW',
	            reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }
			}
	    });
		
		function createHeadersWithNumbers(columns) {	
			var headers = [Ext.create('Ext.grid.RowNumberer')];
			for (i = 0; i < columns.length; i++) {							
					headers[i+1] = {					
							hidden	 : columns[i].hidden,	
							text	 : columns[i].title,
							dataIndex: columns[i].name,
							flex	 : columns[i].flex,					
							width	 : columns[i].width,
							align	 : columns[i].align,				
							renderer : columns[i].renderer,
							summaryType: columns[i].summaryType
					};			
			}
			
			return headers;
		}
		
		var grid = Ext.create('Ext.grid.GridPanel', {
			region: 'center',
			xtype: 'gridpanel',
			border: true,
			flex: 0.5,
			title: Ext.sfa.translate_arrays[langid][321],
			store: customer_stat_ds,								
			columnLines: true,
			features:[
	    	   {	    	      
	    	   	  ftype: 'summary'
	    	   }
	    	],
			columns: createHeadersWithNumbers(customer_columns)			
		});			
		
		grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
	        if (selectedRecord.length) {		        	
	        	showCustomerInfoSpecial(selectedRecord[0].get('code'));
	        }
	    });
		
		var grid1 = Ext.create('Ext.grid.GridPanel', {
			region: 'center',
			xtype: 'gridpanel',
			border: true,
			title: Ext.sfa.translate_arrays[langid][377],
			flex: 0.5,
			store: customer_stat_ds1,
			features:[
	    	   {	    	      
	    	   	  ftype: 'summary'
	    	   }
			],
			columnLines: true,
			columns: createHeadersWithNumbers(customer_columns)			
		});	
		
		grid1.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
	        if (selectedRecord.length) {		        	
	        	showCustomerInfoSpecial(selectedRecord[0].get('code'));
	        }
	    });
		
		var users = generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);		
		users.setValue(userCode);
		users.on('select', function() {		
			customer_stat_ds.load({params:{xml:_donate('_user_customer_list', 'SELECT', 'user_customer_list', ' ', ' ', users.getValue())}});
			customer_stat_ds1.load({params:{xml:_donate('_user_customer_list_notactive', 'SELECT', 'user_customer_list_notactive', ' ', ' ', users.getValue())}});
		}, users);
		
		customer_stat_ds.load({params:{xml:_donate('_user_customer_list', 'SELECT', 'user_customer_list', ' ', ' ', userCode)}});
		customer_stat_ds1.load({params:{xml:_donate('_user_customer_list_notactive', 'SELECT', 'user_customer_list_notactive', ' ', ' ',  userCode)}});
		
		var panel = Ext.create('Ext.Panel', {	         
	        region: 'center',
	        layout: {
	            type: 'hbox',
	            align: 'stretch'
	        },
	        border: false,
	        defaults: {frame:false, width:140, height: 184, margin: '1 1 1 1'},
	        items: [	                        			       
	        	grid,	        		        		        
	        	grid1	        	
	        ],
	        dockedItems: [{
	            xtype: 'toolbar',
	            items: [users]
			}]
		});
		
		winUserCusomterStat = Ext.widget('window', {
			title: Ext.sfa.translate_arrays[langid][615],
			closeAction: 'hide',			
			bodyPadding: 0,		
			layout: {
				type: 'border',
				align: 'stretch'
			},
			width: 800,			
			height: 450,
			minimizable: false,
            maximizable: true,            
			items: [panel]
		});
	
		winUserCusomterStat.show();
}

function showLeaseReturn() {
	var win;
	
	var valueField = Ext.create('Ext.form.NumberField', {
		flex: 1,
        name: 'lease_value',
        fieldLabel: 'Мөнгөн дүн',
        minValue: 0,
        value: 0,
        xtype: 'numberfield'
    });
	
	var datefield = new Ext.form.DateField({
        format: 'Y-m-d', 
        fieldLabel: 'Огноо',
        value: currentDate
    });
	
	var userList = generateRemoteCombo('_remote_user_dealer', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310]);
	userList.hideLabel = false;
	userList.setWidth(300);
	userList.fieldLabel = Ext.sfa.translate_arrays[langid][310];
	var customerList = generateRemoteCombo('_remote_customer_dealer', 'customer_list', 'code', 'name', Ext.sfa.translate_arrays[langid][469]);		
	customerList.hideLabel = false;
	customerList.setWidth(300);
	customerList.fieldLabel = Ext.sfa.translate_arrays[langid][466];
	
	var formPanel = Ext.create('Ext.form.FormPanel', {
		bodyPadding: 10,                			       
        fieldDefaults: {
            labelAlign: 'left',
            labelWidth: 90,
            fieldWidth: 120,
            allowBlank: false,
            anchor: '100%'
        },        
        items: [datefield, userList, customerList, valueField],	                
        buttons: [{
        	  text: 'OK',
        	  disabled: hidden_values['lease_return_edit'],
              handler: function() {
            	  var action = Ext.create('Ext.data.JsonStore', {	    	        	       
          	        proxy: {
          				type: 'ajax',
          				url: 'httpGW',
          				writer: {
          		           type: 'json'
          		        }
          			}
          	      });
            	  
            	  var store = Ext.sfa.stores['customer_list'].queryBy(function fn(record,id) {				 
 				     return record.get('code') == customerList.getValue(); 
            	  }); 
 				  var parentID = 0;
            	  store.each(function(rec){									 					
 					parentID = rec.data['parentID']; 					
            	  });
 				
            	  store = Ext.sfa.stores['user_list'].queryBy(function fn(record,id) {				 
  				     return record.get('code') == userList.getValue(); 
             	  }); 
  				  var userType = 0;
             	  store.each(function(rec){									 					
  					userType = rec.data['_group']; 					
             	  });
             	  
            	  var date = Ext.Date.format(datefield.getValue(), 'Y-m-d');
            	  
            	  var xml = _donate('action_rentpayment', 'WRITER', 'Sales', '_dateStamp,customerCode,userCode,productCode,posX,posY,type,quantity,price,amount,discount,flag', 
						   'd'+date+',s'+customerList.getValue()+',s'+userList.getValue()+',snul,f0,f0,i3,i0,f0,f'+valueField.getValue()+',i'+parentID+',f'+userType, ' ');
				            	  
            	  
            	  Ext.Ajax.request({
	           		   url: 'httpGW?xml='+xml,
	           		   success: function() { 
	           			  Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][557], null);		  
	           		   },
	           		   failure: function() {  
	           			  Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][559], null);
	           		   },
	           		   method: 'GET'           		   
           		  });
            	  
            	  win.hide();
              }
        },{
            text: 'Cancel',            
            handler: function() {                          	                	
            	win.hide();
            }
        }]       
    });
	
	win = Ext.widget('window', {
		title: Ext.sfa.translate_arrays[langid][311],
		closeAction: 'hide',					
		layout: 'fit',
		border: false,
		width: 340,
		height: 220,			
		items: [formPanel]
	});
	
	win.show();
}

function showCustomerInfoSpecial(customerCode) {		
	var mainInfoFields = [         
	      	         {name: 'data', type: 'string'},         
	      	         {name: 'count', type: 'string'},
	      	         {name: 'detail', type: 'string'} 	         
    ];
    
	Ext.regModel('customerinfo', {
        idProperty: 'data',
        fields: mainInfoFields
    });
	
	var mainInfoStore = Ext.create('Ext.data.JsonStore', {
        model: 'customerinfo',     	        
        proxy: {
			type: 'ajax',
			url: 'httpGW',
            reader: {
				type: 'json',
                root:'items',
                totalProperty: 'results'
            }            
		}
    });	 
	      		
	var mainInfo = Ext.create('Ext.grid.GridPanel', {
		region: 'center',
        store: mainInfoStore,	        
		columnLines: true,			
		border: true,		
		flex: 0.36,
		columns: [{			
			text: Ext.sfa.translate_arrays[langid][328],			
	   		dataIndex: 'data',
	   		width: 200		   			   			   
		},{
			text: Ext.sfa.translate_arrays[langid][329], 
	   		dataIndex: 'count',
	   		renderer: renderIsNumber,
	   		flex: 1
		},{
			text: Ext.sfa.translate_arrays[langid][330], 
	   		dataIndex: 'detail', 		   				   		
	   		width: 280	   		   
		}]	
    });									
	
	var productReport_columns = [		      	       
         {name: 'productCode', type: 'string', title: Ext.sfa.translate_arrays[langid][345], filterable: true, width: 120, renderer: Ext.sfa.renderer_arrays['renderProductCode']},
         {name: 'rquantity', type: 'int', title: Ext.sfa.translate_arrays[langid][346], width:75, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber']},
         {name: 'quantity', type: 'int', title: Ext.sfa.translate_arrays[langid][347], width:75, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber']},             
         {name: 'ramount', type: 'int', title: Ext.sfa.translate_arrays[langid][478], width:90, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney']},
         {name: 'amount', type: 'int', title: Ext.sfa.translate_arrays[langid][479], width:90, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney']},
         {name: 'total', type: 'int', title: Ext.sfa.translate_arrays[langid][314], width:90, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney']}];
	
	Ext.regModel('productreport', {	        
        fields: productReport_columns 
    });
	
	productReport_ds = Ext.create('Ext.data.JsonStore', {
        model: 'productreport',	        
        proxy: {
			type: 'ajax',
			url: 'httpGW',
            reader: {
				type: 'json',
                root:'items',
                totalProperty: 'results'
            }
		}
    });  		  		
	
	function createHeadersWithNumbers(columns) {	
		var headers = [Ext.create('Ext.grid.RowNumberer')];
		for (i = 0; i < columns.length; i++) {							
				headers[i+1] = {					
						hidden	 : columns[i].hidden,	
						text	 : columns[i].title,
						dataIndex: columns[i].name,
						flex	 : columns[i].flex,					
						width	 : columns[i].width,
						align	 : columns[i].align,				
						renderer : columns[i].renderer		
				};			
		}
		
		return headers;
	}
	
	var saleGrid = Ext.create('Ext.grid.GridPanel', {			
		xtype: 'gridpanel',
		border: true,
		flex: 0.6,
		split: true,
		store: productReport_ds,								
		columnLines: true,
		columns: createHeadersWithNumbers(productReport_columns)			
	});
	
	var productReport_columns1 = [		      	       
         {name: 'day', type: 'string', title: 'Худалдаа хийсэн ', filterable: true, width: 80},                     
         {name: 'ramount', type: 'int', title: Ext.sfa.translate_arrays[langid][312], width:100, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney']},
         {name: 'amount', type: 'int', title: Ext.sfa.translate_arrays[langid][313], width:100, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney']},
         {name: 'total', type: 'int', title: Ext.sfa.translate_arrays[langid][314], width:100, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney']}];
	
	Ext.regModel('productreport1', {	        
        fields: productReport_columns1 
    });
	
	productReport_ds1 = Ext.create('Ext.data.JsonStore', {
        model: 'productreport1',	        
        proxy: {
			type: 'ajax',
			url: 'httpGW',
            reader: {
				type: 'json',
                root:'items',
                totalProperty: 'results'
            }
		}
    });  		
	
	var saleGrid1 = Ext.create('Ext.grid.GridPanel', {			
		xtype: 'gridpanel',
		border: true,
		flex: 0.4,
		store: productReport_ds1,								
		columnLines: true,
		columns: createHeadersWithNumbers(productReport_columns1),
		listeners: {
			selectionchange: function(model, records) {
                var json, name, i, l, items, series;
                if (records[0]) {
                    rec = records[0];
                    productReport_ds.load({params:{xml:_donate('customer_sale_product_detail', 'SELECT', 'Sales', 'productCode,sum(quantity) as quantity,sum(case type when 1 then 1 else 0 end *quantity) as rquantity,sum(amount)-sum(case type when 1 then 1 else 0 end *amount) as amount, sum(case type when 1 then 1 else 0 end *amount) as ramount,sum(amount) as total', 's,i,i,i,i', " WHERE (type!2 or type@=5) and customerCode='"+customerCode+"' and convert(varchar, _dateStamp, 111)='"+rec.data['day']+"' GROUP by productCode ORDER by sum(amount) desc")}});
                }
            }				
		}
	});	
	
	mainInfoStore.load({params:{xml:_donate('_info_customer_sale', 'SELECT', 'info_customer_sale', ' ', ' ', customerCode)}});
	productReport_ds1.load({params:{xml:_donate('_customer_sale_by_date', 'SELECT', 'Sales', ' ', 's,i,i,i,i,i', customerCode)}});
	
	var panel = Ext.create('Ext.Panel', {        
        region: 'south',
        height: 250,
        layout: {
            type: 'hbox',
            align: 'stretch'
        },
        split: true,
        border: false,	        
        items: [	                
        	saleGrid1,
        	saleGrid	        	
        ]
     });		
	
	winCustomerInfoSpecial = Ext.widget('window', {
		title: 'Харилцагчийн дэлгэрэнгүй',
		closeAction: 'hide',			
		bodyPadding: 0,		
		layout: 'border',				
		minimizable: true,
        maximizable: true,
		width: 850,			
		height: 600,
		items: [mainInfo, panel]
	});	
	
	winCustomerInfoSpecial.show();
}