var windowIndex = 0;

Ext.define('OSS.BogusModule', {
    extend: 'OSS.ExtendModule',

    init : function(){
        this.launcher = {
            text: 'Window '+(++windowIndex),            
            handler : this.createWindow,
            scope: this,
            windowId:windowIndex
        }
    },

    createWindow : function(src){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow('bogus'+src.windowId);
        if(!win){
            win = desktop.createWindow({
                id: 'bogus'+src.windowId,
                title:src.text,
                width:640,
                height:480,
                iconCls: 'bogus',
                animCollapse:false,
                constrainHeader:true
            });
        }
        win.show();
        return win;
    }
});

Ext.define('OSS.MapModulePanel', {
    extend: 'OSS.BogusModule',
    id: 'google-map-win',
    ext: '.jpg',

    init : function(){
    	this.title = Ext.sfa.translate_arrays[langid][514];        
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        var me = this;
        if(!win){
        	this.createMap();        	
            win = desktop.createWindow({
                id: 'google-map-win',
                title:this.title,
                width:850,
                height:550,      
                layout: {
					type: 'border',
					align: 'stretch'
				},
                iconCls: 'user_loc',
                animCollapse:false,                               
                items: [this.createGrid(), this.googleMap],
                dockedItems: this.createToolbar(),
                bbar: [{
     	            id: 'basic-statusbar',
     	            text: '<span style="color:green;">Амжилттай</span>,&nbsp;&nbsp;<span style="color:red;">Захиалга аваагүй</span>,&nbsp;&nbsp;<span style="color:blue;">Эхлэл</span>,&nbsp;&nbsp;<span style="color:brown;">Төгсгөл</span>'
     	        }]
            });
        }
        win.show(); 
        me.win = win;
        
        return win;
    },
	
	createStore: function() {
		var me = this;
		Ext.regModel('user_markers', {		    
    		idProperty: 'code',
    	    fields: [                
    	        {name: 'code', type: 'string'},
    	        {name: 'lat', type: 'float'},
    	        {name: 'lng', type: 'float'},
    	        {name: 'count', type: 'int'},
    	        {name: 'amount', type: 'int'},  
				{name: 'ico', type: 'int'},
    	        {name: 'hhmmss', type: 'string'}
    	    ]
    	});

    	me.store = Ext.create('Ext.data.JsonStore', {
    	    model: 'user_markers',    
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
    	
		me.customer_columns = [{name: 'code', type: 'string', title: Ext.sfa.translate_arrays[langid][369], width: 55, renderer:Ext.sfa.renderer_arrays['renderGPS']},
		                       {name: 'name', type: 'string', title: Ext.sfa.translate_arrays[langid][373], width:110, summaryType:'count'},
		                       {name: 'location', type: 'string', title: Ext.sfa.translate_arrays[langid][372], width:120},
		                       {name: 'subid', type: 'string', title: Ext.sfa.translate_arrays[langid][332], width:180, renderer: Ext.sfa.renderer_arrays['renderRouteID']},
							   {name: 'posx', type: 'float', hidden:true},
							   {name: 'posy', type: 'float', hidden:true}];	
    	
    	Ext.regModel('customer_columns', {
	        fields: me.customer_columns
	    });
    	
    	me.store1 = Ext.create('Ext.data.JsonStore', {
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
	},
    
    createMap: function() {
    	var me = this;
		me.createStore();
    	me.currentDate = currentDate;  

		me.googleMap = Ext.create('Ext.ux.GMapPanel', {
			xtype: 'gmappanel',
			flex: 0.65,
			border: false,
			region:'center',
			center: {
				 geoCodeAddr: '15171, Ulaanbaatar, Mongolia',
				 marker: {title:''}
			},
			markers: []
		});

		me.markerCurrentUsers();		
    	return me.googleMap;
    },

	toggled : false,
    
	markerCurrentUsers: function() {
		var me = this;
		
		me.store.load({params:{xml:_donate('_map_current_users_locations', 'SELECT', ' ', ' ', ' ', me.currentDate+','+me.currentDate)}, 
			 callback: function() {
				me.putMarkers();
			 }
		});
	},
		
	markerSelectedUser: function(userCode) {
		var me = this;
				
		me.store.load({params:{xml:_donate('_map_selected_user_locations', 'SELECT', ' ', ' ', ' ', userCode+','+userCode+','+me.currentDate+','+userCode+','+me.currentDate)}, 
			 callback: function() {
				me.putMarkers();
			 }
		});		
	},
	
	markerSelectedUserStep: function(userCode) {
		var me = this;
		me.store.load({params:{xml:_donate('_map_selected_user_locations', 'SELECT', ' ', ' ', ' ', userCode+','+userCode+','+me.currentDate+','+userCode+','+me.currentDate)}, 
			 callback: function() {		
				me.putMarkersStep();							
			 }
		});				
	},
	
	getIcon: function(data, t, i) {	
		if (i == 0)
			return 'shared/icons/fam/marker_start.png';
		if (t-1 == i)
			return 'shared/icons/fam/marker_end.png';

	

		if (data['ico'] == 3)		
			return 'shared/icons/fam/idle.png';
		if (data['ico'] == 4)
			return 'shared/icons/fam/home.png';
		if (data['amount'] == 0 && data['ico'] > 0)
			return 'shared/icons/fam/marker.png';
		if (data['ico'] == 1)		
			return 'shared/icons/fam/marker_start.png';
		if (data['ico'] == 2)
			return 'shared/icons/fam/marker_g.png';

		return 'shared/img/users/'+data['code']+this.ext;
	},

	getValue: function(data) {
		if (data['code'].length == 3) {
			v = Ext.sfa.renderer_arrays['renderUserCode'](data['code']);
			v = v.substring(11, v.length);
			return v;
		}
		if (data['code'].length > 3)
			return Ext.sfa.renderer_arrays['renderCustomerCode'](data['code'])+' ['+Ext.sfa.renderer_arrays['renderSMoney'](data['amount'])+' ₮]';
	},

	putMarkers: function() {
		var me = this;

		var t = me.store.getCount();
		var i = 0;
		me.store.each(function(rec){
			me.addMarker(rec.data, t, i);
			i++;
		});
	},

	putMarkersStep: function() {
		var me = this;
		
		index = 0;
		me.store.each(function(rec){
			setTimeout(function() {
			  me.addMarker(rec.data);
			}, index * 2000);
			index++;
		});
	},

	polylines: [],	
	hash: [],
	lineCount: 0,
	overlay: [],
	
	addMarker: function(data, t, i) {
		if (data['lat'] == 0) return;
		var me = this;
		if (me.hash[data['lat']] == 1 && me.hash[data['lng']] == 1)
			return;		

		me.hash[data['lat']] = 1;
		me.hash[data['lng']] = 1;

		var draggable = false;
		if (data['draggable']) draggable = true;
		var size = data['ico']==3?16:24;
		var url = me.getIcon(data, t, i);
	    var icon = new google.maps.MarkerImage(	    		
	    		 	url,
		            new google.maps.Size(size, size), //size
		            new google.maps.Point(0,0), //origin
		            new google.maps.Point(size/2, size),
		            new google.maps.Size(size, size)//scale 
		);
			    
		var marker = {
			lat: data['lat'],
			lng: data['lng'],					
			time: data['hhmmss'],
			title: data['hhmmss']+' '+me.getValue(data),			
			icon: icon				
		};
		
		me.polylines.push(new google.maps.LatLng(data['lat'], data['lng']));
		
		if (me.polylines.length == 2) {		
			var lineSymbol = {
			   path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
		    };

			me.flightPath = new google.maps.Polyline({
				path: me.polylines,
				geodesic: true,
				strokeColor: '#ff6633',
				strokeOpacity: 1.0,
				icons: [{
				  icon: lineSymbol,
				  offset: '50%'
				}],
				strokeWeight: 2
			});

			me.overlay.push(me.flightPath);
			me.flightPath.setMap(me.googleMap.gmap);
			me.polylines.splice(0, 1);
			me.lineCount++;
		}

		var marker = me.googleMap.addMarker(marker);
		me.overlay.push(marker);
	},
	
	removeMarkers: function() {
		var me = this;
		if (me.overlay)
		{		
			for (i = 0; i < me.overlay.length; i++) {
				me.overlay.setMap(null);
			}
		}
	},

    createToolbar: function() {
    	var me = this;
    	
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);    	
    	
	    return [{
	            xtype: 'toolbar',
	            items: [{
							text: 'Бүгд',
							iconCls: 'frank', 
							handler: function() {
								me.markerCurrentUsers();
							}
						},'-',{							
		                	id		: 'map-date1',
							text    : me.currentDate,        
						    scope   : this,	            	        
						    iconCls : 'calendar',
						    menu	: Ext.create('Ext.menu.DatePicker', {
						    	text: me.currentDate,
						        handler: function(dp, date){
						        	me.currentDate = Ext.Date.format(date, 'Y-m-d');	     				        	
						        	Ext.getCmp('map-date1').setText(me.currentDate);	            		        		        						        	
						        }
						    })
						},			            									            
						'-',
						me.users,
						{
							iconCls: 'refresh',	
							hidden: false,
							text: Ext.sfa.translate_arrays[langid][326],
							tooltip: '<b>Refresh</b><br/>',
							handler: function() {
								if (!me.users.getValue())
									Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Борлуулагч сонгон уу !', null);
								else 
									me.markerSelectedUser(me.users.getValue());
							}
						},						
						{
							text: 'Алхамаар харах',
							iconCls: 'walk',
							handler: function() {
								if (!me.users.getValue())
									Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Борлуулагч сонгон уу !', null);
								else
									me.markerSelectedUserStep(me.users.getValue());
							}
						},'-',
						{
							iconCls: 'customers',				
							text: 'Харилцагчид',
							enableToggle: true,					
							toggleHandler: function(item, pressed) {							
								if (!me.users.getValue()) {
									Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Борлуулагч сонгон уу !', null);
									return false;
								}
								else {
									me.grid.setVisible(pressed);									
									me.store1.load({params:{xml:_donate('_map_selected_user_customer_locations', 'SELECT', ' ', ' ', ' ',  me.users.getValue())}});
								}
							}
						},'-',
						{
							text: 'Цэвэрлэх',
							iconCls: 'icon-delete',
							handler: function() {
								me.googleMap.removeMarkers();
							}
						}
			    ]}
		    ];
    },

	createGrid: function() {
		var me = this;

		me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {	               
			flex: 0.35,
			region: 'west',				
			split: true,
			store: me.store1,
			columnLines: true,	
			hidden: true,
			border: false,
			columns: me.createHeadersWithNumbers(me.customer_columns),
			viewConfig: {
    			loadMask: true,
                stripeRows: true,
                listeners: {
                	itemclick: function(dv, record, item, index, e) {						
						if (record.get('posx') > 0) {						
							var data = [];
							data['lat'] = record.get('posx');
							data['lng'] = record.get('posy');
							data['code'] = record.get('code');
							data['ico'] = 4;
							data['draggable'] = true;

							me.addMarker(data);
						}
                    }
                }
            }
		});
				
   	    return me.grid;
	}
    
});

Ext.define('OSS.SaleGridWindow', {
    extend: 'OSS.ExtendModule',
    id:'sale-grid-win',
    mainGridType : 'product',    
    productSelection: 'all',
    mainFields : [],
    mainColumns : [],
    mainStores : [],
    mainQuery : [],
    detailQuery: [],
	columned : false,
	teso : false,
    
    init : function() {
    	this.title = Ext.sfa.translate_arrays[langid][614];
    	this.width = 900;
    	this.height = 500;
    	this.currentDate = currentDate;
    	this.nextDate = nextDate;
    	this.sub = '';
    },

    updateSale : function() {
    	var me = this;        	
    	me.salesStore.load({params:{xml:_donate(me.mainQuery[me.mainGridType]+me.sub, 'SELECT', 'Sales', 'productCode,quantity', 's,i', me.currentDate+','+me.nextDate+','+me.productSelection+','+langs[ln]+','+logged+','+mode)}});
    },
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        
        if(!win) {              	
        	this.createGrid();
        	this.updateSale();        	
        	this.createSelectionForm();
            win = desktop.createWindow({
                id: this.id,
                title: this.title,
                width: this.width,
                height: this.height,
                iconCls: 'refresh',
                animCollapse:false,
                border: false,
                constrainHeader:true,
                layout: 'border',
                items: [this.fp, this.grid]
            });            
        }
        win.show();
        
        return win;
    },
    
    createSelectionForm: function() {
    	var me = this;

		me.brands = me.generateLocalComboWithField('brand_list', 'brand_list', 'brand', 'brand', 'Нэр төрөл', 250, '');
		me.brands.on('change', function() {
			me.fillByComboValueToGrid(me.brands, me._store, me.productGrid, 'product_list', 'brand');
		});
		
		me._store = Ext.create('Ext.data.Store', {
            model: 'code_model'
        });
		
		me.sm = Ext.create('Ext.selection.CheckboxModel');

		me.productGrid = Ext.create('Ext.grid.GridPanel', {			    			
    		xtype: 'gridpanel',
    		border: true,	    			
    		columnLines: true,
    		store: me._store,    		
			layout: 'fit',
			flex: 1,
    		selModel: me.sm,
    		columns: [
    			  {
    				  text: Ext.sfa.translate_arrays[langid][477],
    				  dataIndex: 'code',	    					  
    				  flex: 1,
    				  renderer: Ext.sfa.renderer_arrays['renderProductCode']
    		      }
    		]			     			
    	});

		me.fp = Ext.create('Ext.form.Panel', {
            width: 270,
            region: 'east',            
            hidden: true,
            autoScroll:true,
            layout: 'fit',
			items: [
				me.productGrid
			],
			dockedItems: [{
				dock: 'top',
				xtype: 'toolbar',
				items: [me.brands]
			}],           
            buttons: [{
                text: 'Бүгдийг сонгох',
                handler: function(){
                		me.productSelection = 'all';
	                	me.updateSale();	                
                }
            },{
                text: 'Сонгосонг харах',
                handler: function(){
					var records = me.productGrid.getSelectionModel().getSelection();
                	if(me.mainGridType == 'product'){                		
						for (i = 0; i < records.length; i++)						
	                		me.productSelection += ':'+records[i].get('code')+':';

	                	me.updateSale();
	                }
                }
            }]
        });
		
		return me.fp;
    },        
    
    createColumns : function (viewType, mode) {   
    	var me = this;
    	if (me.mainFields[viewType]) return;
    	
    	if (mode == 0) {
	    	me.mainFields[viewType] = [];
	    	me.mainFields[viewType][0] = {name: 'level', type: 'int', title: '!', width: 28, renderer: renderLevel, summaryType: 'count', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
	    	me.mainFields[viewType][1] = {name: 'name', type: 'string', title: Ext.sfa.translate_arrays[langid][310], summaryType: 'count', width: 90, renderer: Ext.sfa.renderer_arrays['renderUserCode'], locked:false, filterable: true, summaryRenderer: function(value){
	    		return 0;// '<span style="font-size:11px">'+value+' ['+Ext.sfa.translate_arrays[langid][321]+']</span>';
	    	}};	
	    	var count = 2;	
			if (me.columned)
			{			
				if (viewType == 'brand') {
					var brands = '';
					for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
						var record = Ext.sfa.stores['product_list'].getAt(i);
						if (me.productAble(record)) {
							if (brands.indexOf(record.data[viewType]) == -1) {
								brands += record.data[viewType] + ',';
								me.mainFields[viewType][count] = {name: record.data['brand'], type: 'int', title: record.data['brand'], width:80, hidden: product_visible[record.data['code']], renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], align: 'center', summaryType: 'sum'};
								count++;
							}
						}
					}
				} else {
					for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
						var record = Ext.sfa.stores['product_list'].getAt(i);
						if (me.productAble(record) && (me.productSelection == '' || me.productSelection.indexOf(record.data['code']) == -1)) {
							me.mainFields[viewType][count] = {name: record.data['code'], type: 'int', title: record.data['name'], width: 80, hidden: product_visible[record.data['code']], renderer: Ext.sfa.renderer_arrays['renderNumber'],  summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], align: 'center'};
							count++;
						}
					}
				}
			}
	    	
	    	var hr = false;	    	
		    me.mainFields[viewType][count] = {name: 'sum_back',hidden: !feature[0], type: 'int', title: 'Буцаалтын дүн', width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+1] = {name: 'sum_promo',hidden: !feature[1], type: 'int', title: Ext.sfa.translate_arrays[langid][658], width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+2] = {name: 'sum_discount',hidden: !feature[1], type: 'int', title: 'Хөнгөлөлт', width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+3] = {name: 'sum_r', type: 'int', title: Ext.sfa.translate_arrays[langid][311], width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+4] = {name: 'sum_ar', type: 'int', title: Ext.sfa.translate_arrays[langid][312], width: 110, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+5] = {name: 'sum_a', type: 'int', title: Ext.sfa.translate_arrays[langid][313], width: 115, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+6] = {name: 'sum_all', type: 'int', title: Ext.sfa.translate_arrays[langid][314], width: 115, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+7] = {name: 'pay_all', type: 'int', title: Ext.sfa.translate_arrays[langid][652], width: 115, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+8] = {name: 'group', type: 'string', title: Ext.sfa.translate_arrays[langid][385], width: 70, hidden: true};			    	
	    	if (me.teso) {
			    me.mainFields[viewType][count+9] = {name: 'uld_all', type: 'int', title: 'Амбаар.үлд', width: 100, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
			    me.mainFields[viewType][count+10] = {name: 'uld_ets', type: 'int', title: 'Эцс.үлд', width: 100, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};			    	
			}
	    	
	    	me.mainColumns[viewType] = [];
	    	
	        for (var i = 0; i < me.mainFields[viewType].length; i++)
	        {       
	           var field = me.mainFields[viewType][i];              
	           me.mainColumns[viewType][i] = {text: field.title, 
	        		   		   	  dataIndex: field.name, 
	        		   		   	  flex: field.flex, 		  
	        		   		   	  width:field.width, 	  	        		   		   	  
	        		   		   	  align: field.align,   			        		   		   	  
	        		   		   	  hidden: field.hidden,
	        		   		   	  filterable: field.filterable,
	        		   		   	  summaryRenderer: field.summaryRenderer,
	        		   		   	  summaryType: field.summaryType,
	        		   		   	  renderer: field.renderer};       
	        }            
    	}
        
        
        //detailPanel
        if (mode == 1) {
	        me.mainFields[viewType+'_detail'] = [{name:'id', type:'int'},
	                             {name: 'customerCode', type: 'string'},
	    	                     {name: 'type', type: 'string'},
	    	                     {name: '_dateStamp', type: 'string'}];				         
	    	
	    	var count = 4;
			if (me.columned)
			{			
				if (viewType == 'brand') {
					brands = '';
					for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
						var record = Ext.sfa.stores['product_list'].getAt(i);
						if (me.productAble(record) && brands.indexOf(record.data[viewType]) == -1) {
							var loan = record.data[viewType]+'R';
							var amount = record.data[viewType]+'A';
							brands += record.data[viewType] + ',';
							me.mainFields[viewType+'_detail'][count] = {name: loan, type: 'int'};
							me.mainFields[viewType+'_detail'][count+1] = {name: amount, type: 'int'};
							me.mainFields[viewType+'_detail'][count+2] = {name: record.data['brand'], type: 'int'};
							count+=3;
						}
					}
				} else {
					for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
						var record = Ext.sfa.stores['product_list'].getAt(i);
						if (me.productAble(record)) {
							var loan = record.data['code']+'R';
							var amount = record.data['code']+'A';				
							me.mainFields[viewType+'_detail'][count] = {name: loan, type: 'int'};
							me.mainFields[viewType+'_detail'][count+1] = {name: amount, type: 'int'};
							me.mainFields[viewType+'_detail'][count+2] = {name: record.data['code'], type: 'int'};
							count+=3;
						}
					}
				}
			}

	    	me.mainFields[viewType+'_detail'][count] = {name: 'sum_z', type: 'int'};					
	    	me.mainFields[viewType+'_detail'][count+1] = {name: 'sum_r', type: 'int'};	
	    	me.mainFields[viewType+'_detail'][count+2] = {name: 'sum_ar', type: 'int'};
	    	me.mainFields[viewType+'_detail'][count+3] = {name: 'sum_a', type: 'int'};
	    	me.mainFields[viewType+'_detail'][count+4] = {name: 'sum_all', type: 'int'};
	    	me.mainFields[viewType+'_detail'][count+5] = {name: 'sum_alls', type: 'int'};
	    		
	    	me.mainColumns[viewType+'_detail'] = [	  
	    	                      new Ext.grid.RowNumberer({width:30}),
	    	                      {dataIndex: 'customerCode',  type:'string', header: Ext.sfa.translate_arrays[langid][441], summaryType: 'count', width: 170, renderer: Ext.sfa.renderer_arrays['renderCustomerCode']},	                      
	    	                      {dataIndex: 'type',  type:'string', header: Ext.sfa.translate_arrays[langid][400], hidden: true},
	    	                      {dataIndex: '_dateStamp',  type:'string', width:60, header: Ext.sfa.translate_arrays[langid][341]}];				         
	    	
	    	var count = 4;
			if (me.columned)
			{			
				if (viewType == 'brand') {
					brands = '';
					for (i = 0; i < Ext.sfa.stores['product_all_list'].getCount(); i++) {
						var record = Ext.sfa.stores['product_all_list'].getAt(i);						
						if (me.productAble(record) && brands.indexOf(record.data[viewType]) == -1) {
							var loan = record.data[viewType]+'R';
							var amount = record.data[viewType]+'A';
							brands += record.data[viewType] + ',';
							me.mainColumns[viewType+'_detail'][count] =  {name: record.data[viewType], header: record.data[viewType], hidden: product_visible[record.data['code']], 
												   dataIndex: record.data[viewType], summaryType: 'sum', width:60, align: 'center', renderer: renderBelenZeel(record.data[viewType]), summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
							me.mainColumns[viewType+'_detail'][count+1] =  {hidden: true, dataIndex: amount};
							me.mainColumns[viewType+'_detail'][count+2] =  {hidden: true, dataIndex: loan};
							count+=3;
						}				
					}
				} else {
					for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
						var record = Ext.sfa.stores['product_list'].getAt(i);
						if (me.productAble(record)) {
							var loan = record.data['code']+'R';
							var amount = record.data['code']+'A';		    			
							me.mainColumns[viewType+'_detail'][count] =  {name: record.data['code'], header: record.data['name'], hidden: product_visible[record.data['code']], 
													   dataIndex: record.data['code'], summaryType: 'sum', width: 80, align: 'center', renderer: renderBelenZeel(record.data['code']), summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
							me.mainColumns[viewType+'_detail'][count+1] =  {hidden: true, dataIndex: amount};
							me.mainColumns[viewType+'_detail'][count+2] =  {hidden: true, dataIndex: loan};
							
							count+=3;
						}
					}
				}
			}

	    	me.mainColumns[viewType+'_detail'][count] = {dataIndex: 'sum_z', type:'int',  header: Ext.sfa.translate_arrays[langid][702], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};
	    	me.mainColumns[viewType+'_detail'][count+1] = {dataIndex: 'sum_r', type:'int',  header: Ext.sfa.translate_arrays[langid][311], width: 95, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
	    	me.mainColumns[viewType+'_detail'][count+2] = {dataIndex: 'sum_ar', type:'int',  header: Ext.sfa.translate_arrays[langid][312], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	    	me.mainColumns[viewType+'_detail'][count+3] = {dataIndex: 'sum_a', type:'int',  header: Ext.sfa.translate_arrays[langid][313], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	    	me.mainColumns[viewType+'_detail'][count+4] = {dataIndex: 'sum_all', type:'int',  header: Ext.sfa.translate_arrays[langid][652], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	    	me.mainColumns[viewType+'_detail'][count+5] = {dataIndex: 'sum_alls', type:'int', header: Ext.sfa.translate_arrays[langid][314], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
        }
    },

	createColumnsPre : function (viewType, mode) {   
    	var me = this;
    	if (me.mainFields[viewType]) return;
    	
    	if (mode == 0) {
	    	me.mainFields[viewType] = [];
	    	me.mainFields[viewType][0] = {name: 'level', type: 'int', title: '!', width: 28, renderer: renderLevel, summaryType: 'count', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
	    	me.mainFields[viewType][1] = {name: 'name', type: 'string', title: Ext.sfa.translate_arrays[langid][345], summaryType: 'count', width: 200, renderer: Ext.sfa.renderer_arrays['renderProductCode'], locked:false, filterable: true, summaryRenderer: function(value){
	    		return '<span style="font-size:11px">'+value+' ['+Ext.sfa.translate_arrays[langid][321]+']</span>';
	    	}};	
	    	var count = 2;	
			for (i = 0; i < Ext.sfa.stores['user_list'].getCount(); i++) {
				var record = Ext.sfa.stores['user_list'].getAt(i);
				{
					me.mainFields[viewType][count] = {name: record.data['code'], type: 'int', title: record.data['firstName'], width: 80, hidden: product_visible[record.data['code']], renderer: Ext.sfa.renderer_arrays['renderNumber'],  summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], align: 'center'};
					count++;
				}
			}	    	
	    	
	    	var hr = false;	    	
			me.mainFields[viewType][count] = {name: 'sum_back', hidden: !feature[0], type: 'int', title: 'Буцаалтын дүн', width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+1] = {name: 'sum_promo', hidden: !feature[1], type: 'int', title: Ext.sfa.translate_arrays[langid][658], width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+2] = {name: 'sum_r', type: 'int', title: Ext.sfa.translate_arrays[langid][311], width: 95, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
		    me.mainFields[viewType][count+3] = {name: 'sum_ar', type: 'int', title: Ext.sfa.translate_arrays[langid][312], width: 110, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+4] = {name: 'sum_a', type: 'int', title: Ext.sfa.translate_arrays[langid][313], width: 115, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+5] = {name: 'sum_all', type: 'int', title: Ext.sfa.translate_arrays[langid][314], width: 115, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+6] = {name: 'pay_all', type: 'int', title: Ext.sfa.translate_arrays[langid][652], width: 115, hidden: hr, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
		    me.mainFields[viewType][count+7] = {name: 'group', type: 'string', title: Ext.sfa.translate_arrays[langid][385], width: 70, hidden: true};			    	
	    	
	    	
	    	me.mainColumns[viewType] = [];
	    	
	        for (var i = 0; i < me.mainFields[viewType].length; i++)
	        {       
	           var field = me.mainFields[viewType][i];              
	           me.mainColumns[viewType][i] = {text: field.title, 
	        		   		   	  dataIndex: field.name, 
	        		   		   	  flex: field.flex, 		  
	        		   		   	  width:field.width, 	  	        		   		   	  
	        		   		   	  align: field.align,   			        		   		   	  
	        		   		   	  hidden: field.hidden,
	        		   		   	  filterable: true,
							      filter: {
						                type: 'string'
						          },
	        		   		   	  summaryRenderer: field.summaryRenderer,
	        		   		   	  summaryType: field.summaryType,
	        		   		   	  renderer: field.renderer};       
	        }            
    	}
        
        
        //detailPanel
        if (mode == 1) {
	        me.mainFields[viewType+'_detail'] = [{name:'id', type:'int'},
	                             {name: 'customerCode', type: 'string'},
	    	                     {name: 'type', type: 'string'},
	    	                     {name: '_dateStamp', type: 'string'}];				         
	    	
	    	var count = 4;	    	
			if (me.columned)
			{
				for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
					var record = Ext.sfa.stores['product_list'].getAt(i);
					if (me.productAble(record)) {
						var loan = record.data['code']+'R';
						var amount = record.data['code']+'A';				
						me.mainFields[viewType+'_detail'][count] = {name: loan, type: 'int'};
						me.mainFields[viewType+'_detail'][count+1] = {name: amount, type: 'int'};
						me.mainFields[viewType+'_detail'][count+2] = {name: record.data['code'], type: 'int'};
						count+=3;
					}
				}   	
			}

	    	me.mainFields[viewType+'_detail'][count] = {name: 'sum_z', type: 'int'};					
	    	me.mainFields[viewType+'_detail'][count+1] = {name: 'sum_r', type: 'int'};	
	    	me.mainFields[viewType+'_detail'][count+2] = {name: 'sum_ar', type: 'int'};
	    	me.mainFields[viewType+'_detail'][count+3] = {name: 'sum_a', type: 'int'};
	    	me.mainFields[viewType+'_detail'][count+4] = {name: 'sum_all', type: 'int'};
	    	me.mainFields[viewType+'_detail'][count+5] = {name: 'sum_alls', type: 'int'};
	    		
	    	me.mainColumns[viewType+'_detail'] = [	  
	    	                      new Ext.grid.RowNumberer({width:30}),
	    	                      {dataIndex: 'customerCode',  type:'string', header: Ext.sfa.translate_arrays[langid][441], summaryType: 'count', width: 250, renderer: Ext.sfa.renderer_arrays['renderCustomerCode']},	                      
	    	                      {dataIndex: 'type',  type:'string',header: Ext.sfa.translate_arrays[langid][400], hidden: true},
	    	                      {dataIndex: '_dateStamp',  type:'string', width:60, header: Ext.sfa.translate_arrays[langid][341]}];				         
	    	
	    	var count = 4;	    	
			if (me.columned)
			{			
				for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
					var record = Ext.sfa.stores['product_list'].getAt(i);
					if (me.productAble(record)) {
						var loan = record.data['code']+'R';
						var amount = record.data['code']+'A';		    			
						me.mainColumns[viewType+'_detail'][count] =  {name: record.data['code'], header: record.data['name'], hidden: product_visible[record.data['code']], 
												   dataIndex: record.data['code'], summaryType: 'sum', width: 80, align: 'center', renderer: renderBelenZeel(record.data['code']), summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']};
						me.mainColumns[viewType+'_detail'][count+1] =  {hidden: true, dataIndex: amount};
						me.mainColumns[viewType+'_detail'][count+2] =  {hidden: true, dataIndex: loan};
						
						count+=3;
					}
				}
			}

	    	me.mainColumns[viewType+'_detail'][count] = {dataIndex: 'sum_z', type:'int', header: Ext.sfa.translate_arrays[langid][702], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
	    	me.mainColumns[viewType+'_detail'][count+1] = {dataIndex: 'sum_r', type:'int', header: Ext.sfa.translate_arrays[langid][311], width: 95, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], summaryType: 'sum', align: 'right'};	
	    	me.mainColumns[viewType+'_detail'][count+2] = {dataIndex: 'sum_ar', type:'int', header: Ext.sfa.translate_arrays[langid][312], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	    	me.mainColumns[viewType+'_detail'][count+3] = {dataIndex: 'sum_a', type:'int', header: Ext.sfa.translate_arrays[langid][313], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	    	me.mainColumns[viewType+'_detail'][count+4] = {dataIndex: 'sum_all', type:'int', header: Ext.sfa.translate_arrays[langid][652], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
	    	me.mainColumns[viewType+'_detail'][count+5] = {dataIndex: 'sum_alls', type:'int', header: Ext.sfa.translate_arrays[langid][314], width: 105, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], align: 'right', summaryType: 'sum'};
        }
    },
    
    createStore : function(viewType, mode) {
    	var me = this;
    	//if (me.mainStores[viewType]) return;
    	
    	if (mode == 0) {
	    	Ext.regModel('sales_'+viewType, {
	    	    fields: me.mainFields[viewType]
	    	});
	    	
	    	me.mainStores[viewType] = Ext.create('Ext.data.JsonStore', {
	            model: 'sales_'+viewType,  
	            groupField: 'group',
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
    	}
    	
    	if (mode == 1) {
	    	Ext.regModel(viewType+'_detail', {	        
	            fields: me.mainFields[viewType+'_detail']
	        });	    			    		        
	    	
	    	me.mainStores[viewType+'_detail'] = Ext.create('Ext.data.JsonStore', {			
	            model: viewType+'_detail',	
	            sortInfo:  {field: "_dateStamp", direction: "ASC"},
	            proxy: {	
	            	type: 'ajax',
	    			url: 'httpGW',	    	
	    			method:'POST',
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
    	}
    },
    
    switchInterface : function (gridType, mode) {
    	var me = this;

    	if (gridType == 'product') {
    		me.mainGridType = 'product';
    		me.createColumns(me.mainGridType, mode);
    		me.createStore(me.mainGridType, mode);
    		
    		if (mode == 0) {
	    		me.salesFields = me.mainFields['product'];
	    		me.salesColumns = me.mainColumns['product'];
	    		me.salesStore = me.mainStores['product'];
	    		me.mainQuery['product'] = '_main_sale_data';
    		}
    		
    		if (mode == 1) {
	    		me.detailFields = me.mainFields['product_detail'];
	    		me.detailColumns = me.mainColumns['product_detail'];
	    		me.detailStore = me.mainStores['product_detail'];	    		
	    		me.detailQuery['product'] = '_user_sale_detail';
    		}
    	} else
    	if (gridType == 'brand') {
    		me.mainGridType = 'brand';
    		me.createColumns(me.mainGridType, mode);
    		me.createStore(me.mainGridType, mode);
    		if (mode == 0) {
	    		me.salesFields = me.mainFields['brand'];
	    		me.salesColumns = me.mainColumns['brand'];
	    		me.salesStore = me.mainStores['brand'];
	    		me.mainQuery['brand'] = '_main_sale_data_brand';
    		}
    		if (mode == 1) {
	    		me.detailFields = me.mainFields['brand_detail'];
	    		me.detailColumns = me.mainColumns['brand_detail'];
	    		me.detailStore = me.mainStores['brand_detail'];	    		
	    		me.detailQuery['brand'] = '_user_sale_detail_brand';
    		}
    	}	
    },

    createGrid : function() {
    	var me = this;
    	
    	me.switchInterface(me.mainGridType, 0);
    	
    	me.grouping = Ext.create('Ext.grid.feature.GroupingSummary',{
			id:'maingrid_group',
		    ftype: 'groupingsummary',
		    groupHdTpl: '{name} ({rows.length} '+Ext.sfa.translate_arrays[langid][310]+')',
		    startCollapsed: hidden_values['main_sale_group_collapsed'],
		    hideGroupedHeader: true
		});
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
			id:'maingrid_sum',
		    ftype: 'summary',
			disabled: true
		});    	    	
    	
		me.filters = Ext.create('Ext.ux.grid.FiltersFeature',{
			ftype: 'filters',
			encode: false, 
			local: true
		});

    	me.createToolbar();
    	
    	me.grid = Ext.create('Ext.grid.Panel', {    		    		
    		region: 'center',
    		columnLines: true,
    		loadMask: true,    		
    		enableColumnHide: false,
    		store: me.salesStore,        	    	
    		columns: me.salesColumns,
			plugins: 'bufferedrenderer',
    		features: [me.grouping, me.summary, me.filters],
    		dockedItems:[me.tb],
    		viewConfig: {
    			loadMask: true,
                stripeRows: true,
                listeners: {
                	itemdblclick: function(dv, record, item, index, e) {                		
                        me.app.callDataModule('', record.get('name'));
                    }
                }
            },
    		bbar: [{
 	            text: '<span style="color:red;">'+Ext.sfa.translate_arrays[langid][610]+'</span>,&nbsp;&nbsp;<span style="color:orange;">'+Ext.sfa.translate_arrays[langid][611]+'</span>,&nbsp;&nbsp;<span style="color:green;">'+Ext.sfa.translate_arrays[langid][612]+'</span>'
 	        }] 
    	});
    	me.grid.setLoading(true, true);

    	return me.grid;
    },
    
    createToolbar: function() {
    	var me = this;
    	
    	me.total = Ext.create('Ext.Button', {    			
		     text: Ext.sfa.translate_arrays[langid][616],
		     id: 'total_sale',
		     iconCls: 'bagts',
			 hidden: true,
		     enableToggle: true,
		     toggleHandler: function(item, pressed) {
		    	 me.swapInterface();
		     }
    	});
    	
	    me.tb = {
	            xtype: 'toolbar',
	            items: [
		            {					
		            id		: 'sale-date1',
		    		text    : me.currentDate,        
			        scope   : this,	            	        
			        iconCls : 'calendar',
			        menu	: Ext.create('Ext.menu.DatePicker', {
				    	text: me.currentDate,
				        handler: function(dp, date){
				        	me.currentDate = Ext.Date.format(date, 'Y-m-d');	     				        	
				        	Ext.getCmp('sale-date1').setText(me.currentDate);	            		        		        	
				        	me.updateSale();	                       
				        }
				    })
					},{						
						id		: 'sale-date2',
			    		text    : me.nextDate,        
				        scope   : this,
				        iconCls : 'calendar',
				        menu	: Ext.create('Ext.menu.DatePicker', {
					    	text: me.nextDate,
					        handler: function(dp, date){
					        	me.nextDate = Ext.Date.format(date, 'Y-m-d');	            		        	
					        	Ext.getCmp('sale-date2').setText(me.nextDate);	            		        	
					        	me.updateSale();	                       
					        }
					    })
					},'-',
					{
						iconCls: 'switch',			
						enableToggle: true,
						hidden: true,
						toggleHandler: function(item, pressed) {
							if (!pressed) 
								me.sub = '';
							else
								me.sub = '_sub';
							me.updateSale();
						}
					},
					{
						iconCls: 'refresh',				
						text: Ext.sfa.translate_arrays[langid][260],
						tooltip: '<b>Харах</b><br/>',
						handler: function() {
							me.updateSale();
						}
					},
					'-',
					{
				    	   text: Ext.sfa.translate_arrays[langid][606],
				    	   iconCls: 'group',
				    	   enableToggle: true,
				    	   pressed: true,
				    	   toggleHandler: function(item, pressed) {
				    		   if (pressed) {
				    			   me.grouping.enable();
				    			   me.summary.disable();
				    		   }
				    		   else {
				    			   me.grouping.disable();
				    			   me.summary.enable();
				    		   }
				    		   
				    		   me.updateSale();
				    	   }
				    },
					{
			    	   text: Ext.sfa.translate_arrays[langid][533],
			    	   iconCls: 'choose',
			    	   enableToggle: true,
					   hidden: true,
			    	   id: 'choose',
			    	   toggleHandler: function(item, pressed) { 	
			    		   me.fp.setVisible(pressed);
			    	   }
			        },
			        '-',
			        me.total
			 ]};
    },
    
	reInterface: function() {
    	var me = this;
 	    me.switchInterface(me.mainGridType, 0); 	        		   
	    me.grid.reconfigure(me.salesStore, me.salesColumns);          	        			   
	    me.updateSale();
    },

    swapInterface: function() {
    	var me = this;
	    if (me.mainGridType == 'product') {	       
		   me.switchInterface('brand', 0); 	        		   
		   me.grid.reconfigure(me.salesStore, me.salesColumns);          	        			   
		   me.updateSale();
	    } else {	       
		   me.switchInterface('product', 0); 	        		   
		   me.grid.reconfigure(me.salesStore, me.salesColumns);   	        			   
		   me.updateSale();
	    }
    }
});

Ext.define('OSS.DetailGridWindow', {
    extend: 'OSS.SaleGridWindow',
    id:'detail-grid-win',
    mainGridType : 'product',    
    mainFields : [],
    mainColumns : [],
    mainStores : [],
    mainQuery : [],
    detailQuery: [],
    
    init : function(){
    	this.title = Ext.sfa.translate_arrays[langid][519];
    	this.width = 980;
    	this.height = 520;
    	this.detailDate = detailDate;
    },
    
    updateSaleParam: function(userCode) {
    	var me = this;
    	me.detailStore.load({params:{xml:_donate(me.detailQuery[me.mainGridType], 'SELECT', ' ', ' ', ' ', me.detailDate+','+userCode+',all,'+entry)},
    						 callback:function(){
    							 
    						 }});
    },
    
    updateSale : function() {
    	var me = this;
    	me.detailStore.load({params:{xml:_donate(me.detailQuery[me.mainGridType], 'SELECT', ' ', ' ', ' ', me.detailDate+','+me.users.getValue()+',all,'+entry)},
    						 callback:function(){
    							 
    						 }});    	    	
    },  
    
    createGrid : function() {
    	var me = this;
    	me.switchInterface(me.mainGridType, 1);
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
			id:'detailgrid_sum',
		    ftype: 'summary'		    		  		    
		});
    	
    	me.grid = Ext.create('Ext.grid.Panel', {
    		id: 'detail-grid',    		
    		border: true,
    		region: 'center',
    		enableColumnHide: false,
    		columnLines: true,
            loadMask: true,
    		store: me.detailStore,    	
    		columns: me.detailColumns,
			plugins: 'bufferedrenderer',
    		features: [me.summary],
    		dockedItems: me.createToolbar(),
			viewConfig: {
    			loadMask: true,
                stripeRows: true,
                listeners: {
                	itemdblclick: function(dv, record, item, index, e) {                		
                        me.app.callDataModule(record.data['customerCode'], me.users.getValue());
                    }
                }
            },
    		bbar: [{
 	            text: '<span style="color:orange;">'+Ext.sfa.translate_arrays[langid][535]+'</span>,&nbsp;&nbsp;<span style="color:green;">'+Ext.sfa.translate_arrays[langid][536]+'</span>,&nbsp;&nbsp;<span style="color:cornflowerblue;">'+Ext.sfa.translate_arrays[langid][537]+'</span>'
 	        }] 
    	});
    	
    	return me.grid;
    },
    
    createToolbar: function() {
    	var me = this;
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);

    	me.users.on('change', function(e) {
    		 me.updateSale();
    	});
    	
    	if (userCode.length > 0)
    		me.users.setValue(userCode);
    		
    	me.total = Ext.create('Ext.Button', {    			
		     text: Ext.sfa.translate_arrays[langid][616],
		     id: 'total_detail',
		     iconCls: 'bagts',
		     enableToggle: true,
		     pressed: false,
		     toggleHandler: function(item, pressed) {
		    	 me.swapInterface();
		     }
    	});
    	
    	return [{
	            xtype: 'toolbar',
	            items: [
			            {
						id		: 'detail-date',
			    		text    : me.detailDate,        
				        scope   : this,	            	        
				        iconCls : 'calendar',
				        menu	: Ext.create('Ext.menu.DatePicker', {
					    	text: me.detailDate,
					        handler: function(dp, date){
					        	me.detailDate = Ext.Date.format(date, 'Y-m-d');	            		        	
					        	Ext.getCmp('detail-date').setText(me.detailDate);	            		        		        	
					        	me.updateSale();
					        }
					    })
					},me.users,{
						text	: 'Харах',
						iconCls : 'refresh',
						handler: function() {
							me.updateSale();
						}
					},'-',
					{
						text: Ext.sfa.translate_arrays[langid][496],
						enableToggle: true,
						iconCls: 'customers',
						handler: function(item, pressed) { 	            		
							if (entry == 'entry') entry = 'noenty';
							else entry = 'entry'; 	            		
							me.detailStore.load({params:{xml:_donate(me.detailQuery[me.mainGridType], 'SELECT', ' ', ' ', ' ', me.detailDate+','+me.users.getValue()+',all,'+entry)}});
						}
					},
					'-',me.total,'-',
					{
						text: Ext.sfa.translate_arrays[langid][624],	            	
						iconCls: 'scustomer',
						handler: function(item) {
							userCode = me.users.getValue();
							var nodes = ['Top_Customer', '_report_by_customer', Ext.sfa.translate_arrays[langid][624], 'customerCode', 950, 600, 'customer-top-module']
							me.createModule(nodes, 'Top_Customer', me.users.getValue(), 1);	            			            		
						}
					}]
	        }];
    },
    
    createModule: function(nodes, name, param, c) {    	
	    var	module = new OSS.KernelPanel();
		module.id = name;
		module.appType = name;
		this.app.addModule(module);
		module.disableAutoLoad();
		module.createWindow(nodes[0], nodes[1], nodes[3], nodes[2], nodes[4], nodes[5], nodes[6]);
		module.loadStoreParameterCombo(param, c);
		module.loadStore();
    },
    
    swapInterface: function() {
    	var me = this;
	    if (me.mainGridType == 'product') {
		   me.switchInterface('brand', 1); 	        		   
		   me.grid.reconfigure(me.detailStore, me.detailColumns);          	        			   
		   me.updateSale();
	    } else {
		   me.switchInterface('product', 1);	   
		   me.grid.reconfigure(me.detailStore, me.detailColumns);   	        			   
		   me.updateSale();
	    }
    }
});

Ext.define('OSS.SaleGraphWindow', {
    extend: 'OSS.SaleGridWindow',
    id:'sale-graph-win',        
    
    init : function(){
    	this.title = Ext.sfa.translate_arrays[langid][605];
    	this.width = 900;
    	this.height = 600;
    	
    	this.currentDate = firstDay;
    	this.nextDate = nextDate;
    },            
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        
        if(!win){
        	this.createChart();        	
            win = desktop.createWindow({
                id: this.id,
                title: this.title,
                width: this.width,
                height: this.height,
                iconCls: 'refresh',
                animCollapse:false,
                border: true,
                frame: false,
                autoscroll : true,
                constrainHeader:true,
                layout: 'fit',
                items: [
                    this.panel
                ]                
            });            
        }
        win.show();
        
        return win;
    },
    
    createChart: function() {    	
    	var me = this;
	    me.panel = Ext.create('widget.panel', {
	    	autoScroll: true,
	    	applyTo: 'panel',
	    	border: false,
	    	split: true,	    	
	    	layout: {
	            type: 'table',
	            columns: 2
	        }, 
	        layoutConfig: {columns:2},
	        defaults: {
	            frame:true,	            
	            width:600,
	            height: 500,
	            autoScroll: true,
	            style: 'margin: 10px 0 0 10px'
	        },
	        items:[{
		        	buttons: [{
		                text: 'Нэмэх',		               
		                handler: function() {
		                	me.createWizardChart();
		                }
		            }]	                
	            }
	        ]
	    });
	    
    },
    
    stores: [],    
    charts: [],
    index : 0,
    
	createCustomChartPromotion: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model_plan',          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            animate: false,
            store: me.stores[id],
            insetPadding: 10,
            width: 700,
            height: 400,           
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['data1', 'data2'],
                title: false,
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '8.5px Arial',
                    degree: 135
                }
            }, {
                type: 'Category',
                position: 'left',
                fields: ['name'],
                title: false,
                grid: true,
                label: {
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render]                            	
                }
            }],
            series: [{
                type: 'bar',
                axis: 'left',
                xField: 'name',
	            label: {
					display: 'outside',
			        field: ['data1', 'data2'],
//                    contrast: true,           
                    renderer: Ext.util.Format.numberRenderer('0,0₮'),
                    'text-anchor': 'middle',
                    font: '8.5px Arial'
	            },
                yField: ['data1','data2']                
            }]
        }); 
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,    		
    		id : 'b'+id,
    		items: me.charts[id],
    		layout: 'hbox',
    		autoScroll: true,
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },

    createCustomChartPoint: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model_plan',          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            animate: false,
            store: me.stores[id],
            insetPadding: 10,
            width: 700,
            height: 400,           
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['data1', 'data2'],
                title: false,
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '8.5px Arial',
                    degree: 135
                }
            }, {
                type: 'Category',
                position: 'left',
                fields: ['name'],
                title: false,
                grid: true,
                label: {
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render]                            	
                }
            }],
            series: [{
                type: 'bar',
                axis: 'left',
                xField: 'name',
	            label: {
					display: 'outside',
			        field: ['data1', 'data2'],
                    contrast: true,                    
                    renderer: Ext.util.Format.numberRenderer('0'),
                    'text-anchor': 'middle',
                    font: '8.5px Arial'
	            },
                yField: ['data1','data2']                
            }]
        }); 
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,    		
    		id : 'b'+id,
    		items: me.charts[id],
    		layout: 'hbox',
    		autoScroll: true,
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },
    
    createCustomChartPlan: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model_plan',          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            animate: false,
            store: me.stores[id],
            insetPadding: 10,
            width: 700,
            height: 600,
            legend: {
            	labelFont : '8.5px Arial',
            	itemSpacing : 6
            },
            gradients: [{
              angle: 90,
              id: 'bar-gradient',
              stops: {
                  0: {
                      color: '#99BBE8'
                  },
                  70: {
                      color: '#77AECE'
                  },
                  100: {
                      color: '#77AECE'
                  }
              }
            }],
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['data1'],
                title: false,
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '8.5px Arial',
                    degree: 135
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: false,
                grid: true,
                label: {
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render],            
                	rotate: {
                		degrees: 90
                	}
                }
            }],
            series: [{
                type: 'column',
                axis: 'left',
                xField: 'name',
                yField: 'data2',
                style: {
                    fill: 'url(#bar-gradient)',
                    'stroke-width': 3
                },                
                renderer: function(sprite, record, attr, index, store) {
                    var fieldValue = Math.random() * 20 + 10;
                    var value = index+1;
                    var color = ['rgb(213, 70, 121)', 
                                 'rgb(44, 153, 201)', 
                                 'rgb(146, 6, 157)', 
                                 'rgb(49, 149, 0)',
                                 'rgb(149, 109, 0)',
                                 'rgb(49, 49, 149)',
                                 'rgb(9, 80, 180)',
                                 'rgb(199, 0, 180)',
                                 'rgb(25, 0, 200)',
                                 'rgb(200, 10, 0)',
                                 'rgb(239, 0, 110)',
                                 'rgb(34, 220, 10)',
                                 'rgb(78, 120, 120)',
                                 'rgb(9, 80, 180)',
                                 'rgb(249, 153, 0)'][value];
                    return Ext.apply(attr, {
                        fill: color
                    });
                },
                markerConfig: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0,
                    fill: '#38B8BF',
                    stroke: '#38B8BF'
                }
            }, {
                type: 'line',
                axis: 'left',
                xField: 'name',
                yField: 'data1',
                tips: {
                    trackMouse: true,
                    width: 300,
                    height: 32,
                    renderer: function(storeItem, item) { 
                        this.setTitle('Төлөвлөгөө : '+renderMoneyValue(parseFloat(storeItem.get('data2'))) + ' , Гүйцэтгэл : ' + Ext.sfa.renderer_arrays['renderTPrecent'](storeItem.get('data1')*100/storeItem.get('data2')));
                    }
                },
                style: {
                    fill: '#18428E',
                    stroke: '#18428E',
                    'stroke-width': 3
                },
                markerConfig: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0,
                    fill: '#18428E',
                    stroke: '#18428E'
                }
            }]
        }); 
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,    		
    		id : 'b'+id,
    		items: me.charts[id],
    		layout: 'hbox',
    		autoScroll: true,
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },
    
    createCustomChartArea: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	var fd = [], titles = [];
    	fd[0] = {name: 'name', type: 'string'};
    	
    	for (i = 0; i < fields.length; i++) { 
    		fd[i+1] = {name: fields[i], type: 'int'};
    		
    		titles[i] = Ext.sfa.renderer_arrays[render](fields[i].substring(4, 8));
    	}
    	
    	Ext.regModel('graph_model'+id, {        
    		idProperty: 'name',
    	    fields: fd
    	});
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model'+id,          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {          
            xtype: 'chart',            
            style: 'background:#fff',
            animate: true,
            store: me.stores[id],
            width: 800,
            height: 600,
            legend: {
                position: 'right',
                labelFont : '8.5px Arial',
                itemSpacing : 6                
            },
            axes: [{
                type: 'Numeric',
                grid: true,
                position: 'left',
                fields: fields,
                title: 'Дүн',
                label: {
	                font: '8.5px Arial',
					color: '#fffffff',					
					renderer: Ext.util.Format.numberRenderer('00,00,000')						
	            },		        
                grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 1
                    }
                },
                minimum: 0,
                adjustMinimumByMajorUnit: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: 'Хугацааны интервал',
                grid: true,
                label: {
                	font: '8.5px Arial',
                    rotate: {
                        degrees: 315
                    }
                }
            }],
            series: [{
                type: 'area',
                highlight: false,
                showInLegend: true,
                axis: 'left',
                xField: 'name',
                yField: fields,
                title: titles,
                
                style: {
                    opacity: 0.93,
                    font: '8.5px Arial'
                }                               
            }]
        });
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,
    		layout: 'hbox',
    		autoScroll: true,
    		id : 'b'+id,
    		items: me.charts[id],    		
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },
    
    createCustomChart: function(type, query, where, render, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	var wh = where.split(',');
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model',          
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
    	
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',            
            animate: true,
            store: me.stores[id],
            shadow: false,
            height: 400,
            width: 560,            
            insetPadding: 10,
            theme: 'Base:gradients',
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['data'],
                label: {
                   renderer: wh[0]=='count'?Ext.util.Format.numberRenderer('0,0'):renderMoneyValue,
                   font: '8.5px Arial',
                   rotate: {
                   	degrees: 305
                   }
                },
                title: 'Дүн',
                minimum: 0
            }, {
                type: 'Category',
                position: 'left',
                fields: ['name'],                
                label: {                    
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render]
                }
            }],
            series: [{
            	type: 'bar',
                axis: 'bottom',                                                                                
                label: {
                    field: 'data',
                    display: 'insideEnd',
                    contrast: true,                    
                    renderer: wh[0]=='count'?Ext.util.Format.numberRenderer('0,0'):renderMoneyValue,
                    'text-anchor': 'middle',
                    font: '8.5px Arial'
                },
                xField: 'name',
                yField: ['data'],
                renderer: function(sprite, record, attr, index, store) {
                    var fieldValue = Math.random() * 20 + 10;
                    var value = (record.get('data') >> 0) % 5;
                    var color = ['rgb(213, 70, 121)', 
                                 'rgb(44, 153, 201)', 
                                 'rgb(146, 6, 157)', 
                                 'rgb(49, 149, 0)', 
                                 'rgb(249, 153, 0)'][value];
                    return Ext.apply(attr, {
                        fill: color
                    });
                }
            }]
        });
    	
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,
    		layout: 'hbox',
    		autoScroll: true,
    		id : 'b'+id,
    		items: me.charts[id],    		
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
	    			id: id,    			
	                text: 'Устгах',		               
	                handler: function(b, e) {                               	
	                	me.panel.items.each(function(c){
	                		if (c.id == 'b'+b.id)
	                			me.panel.remove(c)
	                	});                	
	                }
            }]
    	});
    	me.panel.doLayout();
    },

    createProductForm: function() {
    	var me = this;
    	var brands = this.generateRemoteComboWithFilter('_remote_brand_names', 'brand_list', 'brand', 'brand', Ext.sfa.translate_arrays[langid][616], mode);    	
    	brands.on('change', function(e) {
    		me.fillByComboValueToGrid(brands, _store, productGrid, 'product_list', 'brand');
    	});
    	
    	var sm = Ext.create('Ext.selection.CheckboxModel');
    	
    		        		        
    	var _store = Ext.create('Ext.data.Store', {
            model: 'code_model'
        });
    	
    	var productGrid = Ext.create('Ext.grid.GridPanel', {			    			
    		xtype: 'gridpanel',
    		border: true,	    			
    		columnLines: true,
    		store: _store,    		
            height: 180,
            width: 270,
            margins: '0 0 0 5',
    		selModel: sm,
    		columns: [
    			  {
    				  text: Ext.sfa.translate_arrays[langid][477],
    				  dataIndex: 'code',	    					  
    				  flex: 1,
    				  renderer: Ext.sfa.renderer_arrays['renderProductCode']
    		      }
    		]			     			
    	});
    	
    	var report_view = me.generateLocalComboWithField('report_view', 'report_view', 'view', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Хэлбэр');
    	report_view.setValue('count');
    	
    	var graph = me.generateLocalComboWithField('local_graph_combo1', 'graph', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Төрөл');
    	graph.setValue(0);
    	graph.on('change', function(e) {
    		if (e.getValue() >= 3)
				graph.setValue(0);
    	});
    	
    	var interval = me.generateLocalComboWithField('local_interval_combo', 'interval', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100, 'Интервал');
    	interval.setValue(0);
    	
    	interval.on('change', function(e) {
    		if (interval.getValue() == 0) {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').hide();
    		} else 
    		if (interval.getValue() == 1) {
    			form.getForm().findField('season').show();
    			form.getForm().findField('month').hide();
    		} else {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').show();
    		}
    	});
    	
    	function getTitle() {
    		var title = '';
    		if (interval.getValue() == 0)
    			title=form.getForm().findField('year').getValue()+' он, '+brands.getValue()+', '+graph.getRawValue();
    		if (interval.getValue() == 1)
    			title=form.getForm().findField('year').getValue()+' '+form.getForm().findField('season').getValue()+'-р улирал, '+brands.getValue()+', '+graph.getRawValue();
    		if (interval.getValue() == 2)
    			title=form.getForm().findField('year').getValue()+'/'+form.getForm().findField('month').getValue()+'-р сар, '+brands.getValue()+', '+graph.getRawValue();
    		
    		return title;
    		
    	}
    	var form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bodyPadding: 6,
            bodyBorder: 0,            

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },

            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Хугацааны сонголт',
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 60
                },

                items: [graph, report_view, interval, {
                    xtype: 'numberfield',
                    fieldLabel: 'Жил',
                    name: 'year',
                    value: 2012,
                    minValue: 2012,
                    maxValue: 2030,
                    width: 80,
                    margins: '0 0 0 5'
                },{
                    xtype: 'numberfield',
                    fieldLabel: 'Улирал',
                    name: 'season',
                    minValue: 1,
                    maxValue: 4,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1
                },{
                    xtype: 'numberfield',                    
                    fieldLabel: 'Сар',
                    name: 'month',
                	minValue: 1,
                    maxValue: 12,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1	
                }]
            },{
            	xtype: 'fieldcontainer',
                fieldLabel: Ext.sfa.translate_arrays[langid][477],
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',	                    
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top'
                },
                items: [brands, productGrid]
            }],
            buttons: [{
                text: Ext.sfa.translate_arrays[langid][417],
                handler: function() {
                	var fields = [];
                	var data = '';
                	var records = productGrid.getSelectionModel().getSelection();
                	var i = 0;
                	Ext.each(records, function(record){
                		fields[i] = 'data'+record.get('code');
                		data += record.get('code')+':';
                		i++;
                    });
                	
                	if (data != '') {
	                	var where = report_view.getValue()+','+interval.getValue()+','+form.getForm().findField('year').getValue()+','+form.getForm().findField('season').getValue()+','+form.getForm().findField('month').getValue()+','+data;
	                	if (graph.getValue() == 2)
	                		me.createCustomChartPlan('_graphic_product_plan', fields, 'renderProductCode', where, getTitle());
	                	else
	                	if (graph.getValue() == 1)
	                		me.createCustomChartArea('_graphic_product_interval', fields, 'renderProductCode', where, getTitle());
	                	else                		                		
	                		me.createCustomChart('pie', '_graphic_product_total', where,  'renderProductCode', getTitle());                			                	
                	} else {
                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Бараанууд сонгон уу !', null);
                	}
                }
            }]
    	 });
    	
    	return form;
    },
    
    createUserForm: function() {
    	var me = this;    	
    	
    	var sm = Ext.create('Ext.selection.CheckboxModel');
    	    		        		        
    	var _store = Ext.create('Ext.data.Store', {
            model: 'code_model'
        });
    	
    	var userGrid = Ext.create('Ext.grid.GridPanel', {			    			
    		xtype: 'gridpanel',
    		border: true,	    			
    		columnLines: true,
    		store: _store,    		
            height: 180,
            width: 270,
            margins: '0 0 0 5',
    		selModel: sm,
    		columns: [
    			  {
    				  text: Ext.sfa.translate_arrays[langid][310],
    				  dataIndex: 'code',	    					  
    				  flex: 1,
    				  renderer: Ext.sfa.renderer_arrays['renderUserCode']
    		      }
    		]			     			
    	});
    	
    	me.fillByValueToGrid(mode, _store, userGrid, 'user_list', 'section');
    	
    	var report_view = me.generateLocalComboWithField('report_view', 'report_view', 'view', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Хэлбэр');
    	report_view.setValue('count');
    	
    	
    	var graph = me.generateLocalComboWithField('local_graph_combo', 'graph', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Төрөл');
    	graph.setValue(0);
    	
    	
    	var interval = me.generateLocalComboWithField('local_interval_combo', 'interval', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100, 'Интервал');
    	interval.setValue(0);
    	
    	interval.on('change', function(e) {
    		if (interval.getValue() == 0) {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').hide();
    		} else 
    		if (interval.getValue() == 1) {
    			form.getForm().findField('season').show();
    			form.getForm().findField('month').hide();
    		} else {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').show();
    		}
    	});
    	
    	function getTitle() {
    		var title = '';
    		if (interval.getValue() == 0)
    			title='Борлуулагчаар :'+form.getForm().findField('year').getValue()+' он, '+graph.getRawValue();
    		if (interval.getValue() == 1)
    			title='Борлуулагчаар :'+form.getForm().findField('year').getValue()+' '+form.getForm().findField('season').getValue()+'-р улирал, '+graph.getRawValue();
    		if (interval.getValue() == 2)
    			title='Борлуулагчаар :'+form.getForm().findField('year').getValue()+'/'+form.getForm().findField('month').getValue()+'-р сар, '+graph.getRawValue();
    		
    		return title;
    		
    	}
    	var form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bodyPadding: 6,
            bodyBorder: 0,            

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },

            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Хугацааны сонголт',
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 60
                },

                items: [graph, report_view, interval, {
                    xtype: 'numberfield',
                    fieldLabel: 'Жил',
                    name: 'year',
                    value: 2012,
                    minValue: 2012,
                    maxValue: 2030,
                    width: 80,
                    margins: '0 0 0 5'
                },{
                    xtype: 'numberfield',
                    fieldLabel: 'Улирал',
                    name: 'season',
                    minValue: 1,
                    maxValue: 4,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1
                },{
                    xtype: 'numberfield',                    
                    fieldLabel: 'Сар',
                    name: 'month',
                	minValue: 1,
                    maxValue: 12,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1	
                }]
            },{
            	xtype: 'fieldcontainer',
                fieldLabel: Ext.sfa.translate_arrays[langid][310],
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',	                    
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top'
                },
                items: [userGrid]
            }],
            buttons: [{
                text: Ext.sfa.translate_arrays[langid][417],
                handler: function() {
                	var fields = [];
                	var data = '';
                	var records = userGrid.getSelectionModel().getSelection();
                	var i = 0;
                	Ext.each(records, function(record){
                		fields[i] = 'data'+record.get('code');
                		data += record.get('code')+':';
                		i++;
                    });
                	
                	if (data != '') {
	                	var where = report_view.getValue()+','+interval.getValue()+','+form.getForm().findField('year').getValue()+','+form.getForm().findField('season').getValue()+','+form.getForm().findField('month').getValue()+','+data;
	                	if (graph.getValue() == 4)
	                		me.createCustomChartPromotion('_graphic_user_promotion', fields, 'renderUserCode', where, getTitle());
						else
						if (graph.getValue() == 3)
	                		me.createCustomChartPoint('_graphic_user_point', fields, 'renderUserCode', where, getTitle());
	                	else
	                	if (graph.getValue() == 2)
	                		me.createCustomChartPlan('_graphic_user_plan', fields, 'renderUserCode', where, getTitle());
	                	else
	                	if (graph.getValue() == 1)
	                		me.createCustomChartArea('_graphic_user_interval', fields, 'renderUserCode', where, getTitle());
	                	else                		                		
	                		me.createCustomChart('pie', '_graphic_user_total', where,  'renderUserCode', getTitle());                			                	
                	} else {
                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Бараанууд сонгон уу !', null);
                	}
                }
            }]
    	 });
    	
    	return form;
    },
    
    createWizardChart: function() {
    	 var me = this;      
	     win = Ext.create('widget.window', {
              title: 'График нэмэх',
              closable: true,
              closeAction: 'hide',                            
              layout: 'fit',
              items: [{				    
				    xtype: 'tabpanel',
				    border: false,
				    items: [{
				        title: 'Бараа бүтээгдэхүүн',
				        items: [me.createProductForm()]
				    }, {
				        title: 'Борлуулагчаар',
				        items: [me.createUserForm()]
				    }]
				}
              ]
	      });
	      win.show();
    }   
});
 
Ext.define('OSS.LeaseGridWindow', {
    extend: 'OSS.ExtendModule',
    id:'lease-grid-win',        
    
    init : function(){  	
    	this.title = 'Зээл төлөлтийг оруулах';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('lease-grid-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'lease-grid-win',
                title:this.title,
                width:800,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
				border: false,
                items: [this.createGrid()]
            });
        }
        win.show();
        return win;               
    },   
    
    createStore : function() {
    	var me = this;
    	
    	me.columns = [
           {name: 'discount', type: 'int', width: 80, hidden: true, title: ''},
           {name: 'customerCode', type: 'string', width: 100, flex: 1, title: 'Харилцагч', renderer: Ext.sfa.renderer_arrays['renderCustomerCode']},
           {name: 'lease', type: 'int', title: 'Зээлийн хэмжээ', align: 'right', width: 120, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType:'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},            
           {name: 'payed', type: 'int', title: 'Төлсөн', align: 'right', width: 120, summaryType:'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], renderer: Ext.sfa.renderer_arrays['renderMoney']},
           {name: 'flag', type: 'int', title: 'Үлдэгдэл', align: 'right', width: 120, summaryType:'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], renderer: Ext.sfa.renderer_arrays['renderMoney']},
           {name: 'payin', type: 'int', title: 'Төлж байгаа дүн', align: 'right', width: 120, renderer: Ext.sfa.renderer_arrays['renderMoney'],  field: {xtype: 'field-money', decimalPrecision:2}},
           {name: '_date', type: 'date', title: 'Огноо', align: 'center', width: 80, renderer: Ext.sfa.renderer_arrays['renderDate'],  field: {xtype: 'datefield'}}
        ];
    	
    	Ext.regModel('lease', {	        
            fields: me.columns
        });
    	
    	me.store = Ext.create('Ext.data.JsonStore', {
            model: 'lease',	        
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
    	
    	me.store_action = Ext.create('Ext.data.JsonStore', {
            model: 'lease',	        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
			id:'lease_sum1',
		    ftype: 'summary'		    		  		    
		});
    	
    	me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {    		
    		xtype: 'grid',    		
    		columnLines: true,
    		store: me.store,
    		features: [me.summary],
    		plugins: [new Ext.grid.plugin.CellEditing({
				id: 'lease_grid_win_celledit',
    	        clicksToEdit: 1,
				pluginId: 'cellplugin',
				listeners: {
					'afteredit': function(editor, e) {
						
					}
				}
    	    })],
    		columns: me.createHeaders(me.columns),
    		dockedItems: me.createToolbar()
    	});
    	
    	return me.grid;
    },
    
    loadStore: function() {
    	var me = this;
    	me.store.load({params:{xml:_donate('_rent_by_user', 'SELECT', ' ', ' ', ' ', me.users.getValue())}, 
    		callback: function(){    			

    		}});
    },
    
    createToolbar : function() {
    	var me = this;
    	    	
    	me.users = this.generateRemoteComboWithFilter('_remote_section_lease_user', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], logged);
    	me.users.on('change', function(e) {
    		me.loadStore();
    	});
    	
		me.buttons = [me.users, {
				text: 'Харах',
				iconCls: 'refresh',
				handler: function() {	
					if (me.users.getValue() > '')
						me.loadStore();
					 else 
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][539], null);
				}
			},'-',{
				text: 'Зээл төлөлтүүдийг оруулах',
				iconCls: 'icon-apply',
				handler: function() {	
					Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][541], function(btn, text){	                		
						if (btn == 'yes'){	
							var p = 0;
							for (i = 0; i < me.store.getCount(); i++) {
								var rec = me.store.getAt(i);           			
								var ticketID = getTicketId();
								if (rec.get('payin') > 0) {
									var date = Ext.Date.format(rec.get('_date'), 'Y-m-d');
									var v = 'd'+date+',s'+rec.get('customerCode')+',s'+me.users.getValue()+',snul,f0,f0,i3,i0,f0,f'+rec.get('payin')+',i'+rec.get('discount')+',f0,i'+ticketID;									
									//alert(_donate('action_rentpayment', 'WRITER', 'Sales','_dateStamp,customerCode,userCode,productCode,posX,posY,type,quantity,price,amount,discount,flag,ticketID', v, ' '));
									me.store_action.load({params:{xml:_donate('action_rentpayment', 'WRITER', 'Sales',
										'_dateStamp,customerCode,userCode,productCode,posX,posY,type,quantity,price,amount,discount,flag,ticketID', v, ' ')}});
									p = 1;
								}	                	
							}

							if (p == 1) {
								Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
									me.loadStore();	    	                	
								});
							}
							else
								Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
						} else {
				
						}
					});	                		                
				}
			}
        ];

    	me.addStandardButtons();
		
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});

Ext.define('OSS.OrderGridWindow', {
    extend: 'OSS.ExtendModule',
    id:'order-grid-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][278];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('order-grid-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'order-grid-win',
                title:this.title,
                width:960,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
				border: false,
                items: [this.createGrid()]
            });
        }
        win.show();
        return win;               
    },   
    
    createStore : function() {
    	var me = this;
    	
    	me.columns = [
           {name: 'id', type: 'int', width: 0, title: 'Дд', hidden: true},
           {name: '_date', type: 'datetime', width: 120, title: Ext.sfa.translate_arrays[langid][341], renderer:Ext.util.Format.dateRenderer('Y-m-d h:i:s')},
           {name: 'userCode', type: 'string', width: 100, flex: 1, hidden:true, title: Ext.sfa.translate_arrays[langid][310], renderer: Ext.sfa.renderer_arrays['renderUserCode'], hidden: true},
           {name: 'productCode', type: 'string', width: 150, title: Ext.sfa.translate_arrays[langid][345], renderer: Ext.sfa.renderer_arrays['renderProductCode']},            
           {name: 'storageCount', type: 'int', title: Ext.sfa.translate_arrays[langid][424], align: 'right', width: 100, renderer: Ext.sfa.renderer_arrays['renderStorageNumber']},
           {name: 'availCount', type: 'int', title: Ext.sfa.translate_arrays[langid][425], align: 'right', width: 100, renderer: Ext.sfa.renderer_arrays['renderStorageNumber']},
           {name: 'requestCount', type: 'int', title: Ext.sfa.translate_arrays[langid][426], align: 'right', width: 75, summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},           
           {name: 'confirmedCount', type: 'int', title: Ext.sfa.translate_arrays[langid][421], align: 'right', width: 75, field: {xtype: 'numberfield'}},
           {name: 'price', type: 'float', title: Ext.sfa.translate_arrays[langid][414], align: 'right', width: 70, renderer: Ext.sfa.renderer_arrays['renderMoney']},
           {name: 'amount', type: 'float', title: Ext.sfa.translate_arrays[langid][455], align: 'right', width: 110, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
           {name: 'wareHouseID', type: 'int', title: Ext.sfa.translate_arrays[langid][375], width: 100, renderer: Ext.sfa.renderer_arrays['renderWareHouseID']},
           {name: 'agree', type: 'bool', title: 'OK', align: 'right', width: 50, xtype: 'checkcolumn', field: {xtype: 'checkbox'}}                        
        ];
    	
    	Ext.regModel('order', {	        
            fields: me.columns
        });
    	
    	me.store = Ext.create('Ext.data.JsonStore', {
            model: 'order',	        
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
    	
    	me.store_action = Ext.create('Ext.data.JsonStore', {
            model: 'order',	        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
			id:'maingrid_sum1',
		    ftype: 'summary'		    		  		    
		});
    	
    	me.grid = Ext.create('Ext.grid.Panel', {    		
    		xtype: 'grid',    		
    		columnLines: true,
    		store: me.store,
    		features: [me.summary],
    		plugins: [new Ext.grid.plugin.CellEditing({
    	        clicksToEdit: 1,
				pluginId: 'cellplugin',
				listeners: {
					'afteredit': function(e) {
						for (i = 0; i < me.store.getCount(); i++) {
							var rec = me.store.getAt(i);
							if (rec.get('confirmedCount') > 0) {
								me.store.getAt(i).set('amount', rec.get('confirmedCount') * rec.get('price'));
							}
						}
					}
				}
    	    })],
    		columns: me.createHeaders(me.columns),
    		dockedItems: me.createToolbar()
    	});
    	
    	return me.grid;
    },
    
    loadStore: function() {
    	var me = this;
    	me.store.load({params:{xml:_donate('Orders', 'SELECT', 'Orders as b', 'id,_date,userCode,productCode,storageCount,availCount,requestCount,confirmedCount,price,requestCount*price as amount,b.wareHouseID', 'i,s,s,i,i,f,f,i', " WHERE requestCount@0 and confirmedCount=0 and userCode='"+me.users.getValue()+"' and userCode=customerCode and flag=0 ORDER by _date desc,confirmedCount asc")}, 
    		callback: function(){    			
    			me.store.each(function(rec){ rec.set('agree', true) })    			
    		}});
    },
    
    createToolbar : function() {
    	var me = this;
    	
    	me.wareHouse = this.generateLocalCombo('local_ware_house', 'ware_house', 'wareHouseID', 'name', Ext.sfa.translate_arrays[langid][509], 160);
    	me.users = this.generateRemoteComboWithFilter('_remote_ordered_user_names', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], logged);
    	me.users.on('change', function(e) {
    		me.loadStore();
    	});
    	
		me.buttons = [me.users, 
		{
			text: Ext.sfa.translate_arrays[langid][420],
			iconCls: 'refresh',
			handler: function() {	
				if (me.users.getValue() > '')
					me.loadStore();
				 else 
					Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][539], null);
			}
		},'-',
		{
			text: Ext.sfa.translate_arrays[langid][421],
			iconCls: 'icon-apply',
			disabled: hidden_values['order_accept_edit'],
			handler: function() {
				Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][541], function(btn, text){	                		
					if (btn == 'yes'){
						var p = 0;
						for (i = 0; i < me.store.getCount(); i++) {
							var rec = me.store.getAt(i); {
								if (rec.get('confirmedCount') > 0 && rec.get('wareHouseID') && rec.get('availCount') >= rec.get('confirmedCount')) {
									var v = 's'+rec.get('userCode')+',s'+rec.get('userCode')+',s'+rec.get('productCode')+',i'+rec.get('confirmedCount')+',i'+rec.get('wareHouseID')+',f'+rec.get('price');
									
									me.store_action.load({params:{xml:_donate('update', 'WRITER', 'Orders', 'userCode,customerCode,productCode,confirmedCount,wareHouseID,price', v, ' id='+rec.get('id'))}});        	                				        	                				
									p = 1;
								} else
								if (rec.get('agree') && rec.get('wareHouseID') && rec.get('availCount') >= rec.get('requestCount')) {
									var v = 's'+rec.get('userCode')+',s'+rec.get('userCode')+',s'+rec.get('productCode')+',i'+rec.get('requestCount')+',i'+rec.get('wareHouseID')+',f'+rec.get('price');
									me.store_action.load({params:{xml:_donate('update', 'WRITER', 'Orders', 'userCode,customerCode,productCode,confirmedCount,wareHouseID,price', v, ' id='+rec.get('id'))}});
									p = 1;
								}
							}
						}

						if (p == 1) {
							Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
								me.loadStore();   	                	
							});
						}
						else
							Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
					} else {
			
					}
				});	                		                
			}
		},{
			text: Ext.sfa.translate_arrays[langid][366],
			iconCls: 'icon-delete',
			disabled: hidden_values['order_accept_edit'],
			handler: function() {
				if (me.users.getValue() > '') {
					Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][548], function(btn, text){	                		
						if (btn == 'yes'){
							for (i = 0; i < me.store.getCount(); i++) {
								var rec = me.store.getAt(i); {
									if (rec.get('agree')) {
										me.store_action.load({params:{xml:_donate('delete', 'WRITER', 'Orders', ' ', ' ', " userCode='"+me.users.getValue()+"' and requestCount>0 and confirmedCount=0 and flag=0 and id="+rec.get('id'))}});
									}
								}
							}

							me.loadStore();
						} else {
				
						}
					});	                		
				} else 
					Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][539], null);	                	
			}
		}];

		me.addStandardButtons();
		
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];    	
    }
});

Ext.define('OSS.CompleteOrderGridWindow', {
    extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],

    id:'complete-order-grid-win',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][279];         
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();    	
        var win = desktop.getWindow('complete-order-grid-win');        
        if(!win){                	
        	this.createGrid();
            win = desktop.createWindow({
                id: 'complete-order-grid-win',
                title: this.title,
                width:720,
                height:450,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'border',
                items: [this.grid],
                dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },  
    
    loadStore: function() {    	
    	var me = this;    	    	    	
    	me.store.load({params:{xml:_donate('_user_order_complete', 'SELECT', 'Orders', 'productCode,requestCount,confirmedCount,wareHouseID', 's,i,i,i', me.users.getValue())},
    		callback:function(){    			
    			me.grid.getView().getSelectionModel().selectAll();    			
    		}});    	
    },
    
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('Complete_Order', 'complete-order');
    	me.store_action = me.model['writeStore'];
    	me.store = me.model['readStore'];
    	me.columns = me.model['columns'];
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();

    	me.grid = Ext.create('Ext.grid.Panel', {    		
    		xtype: 'grid',
    		border: false,
    		columnLines: true,
    		store: me.store,    
    		region: 'center',
    		selModel: Ext.create('Ext.selection.CheckboxModel', {
		        listeners: {
		            selectionchange: function(sm, selections) {
		                
		            }
		        }
		    }),
		    features : [{
				id: 'corder_summary',
				ftype: 'summary'
		    }],
    		columns: this.createHeaders(me.columns)    		
    	});    	    	
    },
    
    createToolbar: function() {
    	var me = this;
    	me.users = me.generateRemoteComboWithFilter('_remote_complete_order_user_names', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], logged);        	
    	
    	me.users.on('change', function(e) {
    		if (me.users.getValue() != '')
    			me.loadStore();
    	});
    	
    	return [{
            xtype: 'toolbar',            
            items: [me.users, '-',{
            	text: Ext.sfa.translate_arrays[langid][420],
                iconCls: 'refresh',
                handler: function() {	
                	if (me.users.getValue() > '')
                		me.loadStore();
                	 else 
	                	Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][539], null);
                }
            },'-',         
            {
            	text: Ext.sfa.translate_arrays[langid][427],
            	disabled: hidden_values['order_complete_accept_edit'],
                iconCls: 'icon-apply',
                handler: function() {
                	var records = me.grid.getView().getSelectionModel().getSelection();                	
                	var userCode = me.users.getValue();
                	
                	if (records.length > 0 && userCode) {
	                	Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][549], function(btn, text){	                		
                			if (btn == 'yes'){
                				var p = 0;
                				for (i = 0; i < records.length; i++) {                					
                					me.store_action.load(
                							{params:{xml:_donate('update', 'WRITER', 'Orders', 'flag,userCode', 'i0,s'+userCode, "userCode='"+me.users.getValue()+"' and productCode='"+records[i].data['productCode']+"' and flag=1")},
                						 	 callback: function() {                						 		 
                						 		p = 1;	
                							}});
                					
                					p = 1;
                				}

                				if (p == 1) {
        	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
        	                			me.loadStore();	    	                	
        	                		});
        	                	}
        	                	else
        	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
                				
                			} else {
                	
                			}
                		});	                	
                	}             	                	
                }
            },
            {
            	text: 'Буцаах',//Ext.sfa.translate_arrays[langid][366],
            	disabled: hidden_values['order_complete_accept_edit'],
                iconCls: 'icon-delete',
                handler: function() {
                	var records = me.grid.getView().getSelectionModel().getSelection();                	
                	
                	if (records.length > 0) {
	                	Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], 'Буцаалт хийхүү !', function(btn, text){	                		
                			if (btn == 'yes'){
                				var userCode = me.users.getValue();                				
                				var p = 0;
                				for (i = 0; i < records.length; i++) {                					                					                					                					
                					me.store_action.load({
            							 params:{xml:_donate('action_back_storage', 'WRITER', 'Storage', ' ', ' ', records[i].data['wareHouseID']+','+me.users.getValue()+','+records[i].data['productCode']+','+records[i].data['confirmedCount'])},
            						 	 callback: function() {
            						 		 p = 1;
            						 	 }
                					});
                					p = 1;
                				}

                				if (p == 1) {
        	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
        	                			me.loadStore();	    	                	
        	                		});
        	                	}
        	                	else
        	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
                				
                			} else {
                	
                			}
                		});	                	
                	}
                }
			},
            '-',	            
			{			
				iconCls: 'icon-print',		
				handler: function() {                     	
					Ext.ux.grid.Printer.printAutomatically = true;
					Ext.ux.grid.Printer.print(me.grid);
				}
			},
            {
            	text: 'Бараа олголтын тайлан',
                iconCls: 'icon-xls',
                handler: function() {
                	var nodes = ['Storage_Out_Report', '_storage_out_q', Ext.sfa.translate_arrays[langid][655], 'id', 850, 550, 'storage-out-product'];
            		me.createModule(nodes, 'Storage_Out_Report', '', 1);            		            		
                }	                
            },
			'-',			
            {
            	text: Ext.sfa.translate_arrays[langid][305],
                iconCls: 'help',
                handler: function() {
                	showHelpWindow('order_complete');
                }	                
            }]
        }];
    }
});

Ext.define('OSS.KernelPanel', {
	extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],
    
    init : function(){  	    	
    	this.title = '';    	
    	staticInterface();
		initStaticModels();
    },

    createWindow : function(name, model, id, title, w, h, icon){
    	var desktop = this.app.getDesktop();    	
        win = desktop.getWindow(icon);                
        if(!win){        	
        	win = desktop.createWindow({
                id: icon,
                title: title,
                width:w,
                height:h,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createPanel(name, model, id)]
            });
        }
        win.show();
        return win;               
    }     
});


Ext.define('OSS.ControlPanel', {
    extend: 'OSS.KernelPanel',
    id:'control-panel',
	called: false,
	grouped: false,

    init : function(){  	    	
    	this.title = Ext.sfa.translate_arrays[langid][521];
    	this.width = 660;
    	this.height = 310;
        this.launcher = {
            text: this.title,            
            handler : this.createWindow,
            disabled: hidden_values['control-panel'],
            scope: this,
            windowId:(++windowIndex)
        };
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();    	
        var win = desktop.getWindow(this.id);        
        if(!win){                		    	
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:this.width,
                height:this.height,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'border',
                items: [this.createTreePanel(), this.createPanel()]
            });
        }
        win.show();
        return win;
    },
    
    createStore: function() {
    	var me = this;    

        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [ 
                   ['Users', 'users', Ext.sfa.translate_arrays[langid][264], 'userID', 830, 500, 'user-module'],
                   ['Customer', '_customer_list', Ext.sfa.translate_arrays[langid][265], 'customerID', 980, 580, 'customer-module'],
                   ['Product', 'product', Ext.sfa.translate_arrays[langid][270], 'productID', 960, 550, 'product-module'],
                   ['Price', '_price_list', Ext.sfa.translate_arrays[langid][272], 'id', 650, 450, 'price-module'],                   
                   ['ItemsTransaction', 'items_transaction', Ext.sfa.translate_arrays[langid][649], 'itemID', 650, 465, 'item-module'],
                   ['Cars', 'cars', Ext.sfa.translate_arrays[langid][643], 'id', 500, 350, 'cars-module'],
                   ['Route', 'routes', Ext.sfa.translate_arrays[langid][267], 'routeID', 450, 500, 'route-module'],                   
                   ['route-changer-data', 'module', Ext.sfa.translate_arrays[langid][700], 'id', 980, 550, 'route-changer-module'],
                   ['Route_User', 'route_user', Ext.sfa.translate_arrays[langid][288], 'id', 980, 550, 'route-user-module'],
                   ['AllDays', 'calendar', Ext.sfa.translate_arrays[langid][269], 'id', 300, 450, 'calendar-module'],
                   ['Message', 'message', 'Мессеж', 'id', 500, 350, 'message-module'],
                   ['Parent_Names', 'parent_list', 'Сүлжээ дэлгүүр', 'id', 400, 585, 'info-module'],
                   ['Promotion', 'promotion', 'Урамшуулал', 'id', 850, 450, 'promo-module'],
                   ['Packet', 'packet', Ext.sfa.translate_arrays[langid][273], '_group', 400, 400, 'info-module'],
                   ['User_Type', 'user_type', Ext.sfa.translate_arrays[langid][274], '_group', 400, 400, 'info-module'],
                   ['Ware_House', 'ware_house', Ext.sfa.translate_arrays[langid][275], 'wareHouseID', 400, 400, 'info-module'],
            ]
        });						
    },
    
    createPanel: function() {
    	var me = this;
    	me.createStore();

    	var stateTpl =['<tpl for=".">',
               '<div class="thumb-wrap" id="{name}">',
               '<div class="thumb"><img src="https://optimal-mxc-project.googlecode.com/svn/trunk/resources/modules/{icon}.png" title="{title}"></div>',
               '<span>{title}</span></div>',
           '</tpl>',
           '<div class="x-clear"></div>'
        ];
    	
    	me.panel = Ext.create('Ext.Panel', {
            id: getImagesViewId(this.id),            
            xtype: 'panel',
            border: false,
			region: 'center',
            bodyPadding: 10,
            collapsible: false,        
            items: Ext.create('Ext.DataView', {
                store: me.store,
                tpl: stateTpl,
                multiSelect: false,
                region:'center',
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: 'No images to display',
                plugins: [
                    Ext.create('Ext.ux.DataView.DragSelector', {}),
                    Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name'})
                ],
                prepareData: function(data) {
                    Ext.apply(data, {
                        shortName: Ext.util.Format.ellipsis(data.name, 15)                    
                    });
                    return data;
                },
                listeners: {
                    selectionchange: function(dv, nodes){
                    	if (nodes[0]) {
                    		Ext.getBody().mask('Loading...', 'x-mask-loading', true);                        	
                    		
                        	if (nodes[0].get('name') == 'module')
                        		me.callModule(nodes[0].get('module'));
                        	else 
                        	if (!me.app.getDesktop().getWindow(nodes[0].get('icon')))                        	                        
                        		me.createModule(nodes, nodes[0].get('module'));
                            Ext.getBody().unmask();                            							
                    	}
                    },
					itemclick: function(dv, node) {
						if (node) {
                    		Ext.getBody().mask('Loading...', 'x-mask-loading', true);                        	
                    		
                        	if (node.get('name') == 'module')
                        		me.callModule(node.get('module'));
                        	else 
                        	if (!me.app.getDesktop().getWindow(node.get('icon'))) {
								var nodes = [];
								nodes[0] = node;
                        		me.createModule(nodes, node.get('module'));
							}
                            Ext.getBody().unmask();                            							
                    	}
			    	}
                }            
            })            
        });
    	
		if (me.grouped)		
			me.store.filter('filter', '2');

    	return me.panel;
    },        
	
	createTreeStore: function() {
		var me = this;

		me.treeStore = Ext.create('Ext.data.TreeStore', {
			root: {				
			}
		});
	},
    
	createTreePanel: function() {
		var me = this;		    	
		me.createTreeStore();

		me.tree = Ext.create('Ext.tree.Panel', {
			store: me.treeStore,
			hideHeaders: true,
			rootVisible: true,
			hidden: !me.grouped,
			width: 170,
			region: 'west',
			border: false,
			split: true,
			listeners: {
				itemclick: function(view, node) {
					if(node.isLeaf()) {
						me.store.clearFilter();
						if (node.get('id') > 0)						
							me.store.filter('filter', node.get('id'));
					} else if(node.isExpanded()) {
						node.collapse();
					} else {
						node.expand();
					}
				}
			}
		});
		
		var record = me.treeStore.getNodeById(2);
		me.tree.getSelectionModel().select(record);

		return me.tree;
	},

    callModule: function(name) {    	
    	var module = this.app.getModule(name),                        		                        		
		win = module && module.createWindow();

        if (win)
        	this.app.getDesktop().restoreWindow(win);
    },
	
	createModule: function(nodes, name) {
		if (this.called == false)
		{		
			var	module = new OSS.KernelPanel();
			module.id = name;
			module.appType = name;
			this.app.addModule(module);     
			module.createWindow(nodes[0].get('module'), nodes[0].get('name'), nodes[0].get('id'), nodes[0].get('title'), nodes[0].get('width'), nodes[0].get('height'),  nodes[0].get('icon'));    			
		}
    }
});

Ext.define('OSS.ModulePanel', {
    extend: 'OSS.ControlPanel',
    id:'module-win',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][522];
    	this.width = 500;
    	this.height = 220;
        this.launcher = {
            text: this.title,            
            handler : this.createWindow,
            scope: this,
            windowId:(++windowIndex)
        };
    },
    
    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [                                     
                   ['Plan', '_plan_data', Ext.sfa.translate_arrays[langid][551], 'id', 1100, 600, 'plan-module'],
                   ['user-plan-insert-win', 'module', Ext.sfa.translate_arrays[langid][449], 'id', 800, 500, 'plan-module-add'],
                   ['user-plan-delete-win', 'module', Ext.sfa.translate_arrays[langid][450], 'id', 300, 500, 'plan-module-delete'],                   
                   ['user-plan-complete-win', 'module', Ext.sfa.translate_arrays[langid][552], 'id', 1100, 650, 'plan-complete-module']
            ]
        });
    }   
});

Ext.define('OSS.SpecialWorkPanel', {
    extend: 'OSS.ControlPanel',
    id:'special-work-win',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][530];
    	this.width = 360;
    	this.height = 200;
    	this.launcher = {
            text: this.title,            
            handler : this.createWindow,
            scope: this,
            windowId:(++windowIndex)
        };
    },    
    
    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ], 
            data: [                   
                   ['Plan_Execute', '_plan_execute', Ext.sfa.translate_arrays[langid][553], 'id', 700, 450, 'swork-add-module'],                   
                   ['Product_count', '_product_count', Ext.sfa.translate_arrays[langid][554], 'customerCode', 850, 500, 'swork-count-module'],
                   ['special-work-image-win', 'module', Ext.sfa.translate_arrays[langid][555], 'id', 800, 450, 'swork-image-module']
            ]
        });
    }
});

Ext.define('OSS.ManualModulePanel', {
    extend: 'OSS.ControlPanel',
    id:'manual-module-win',

    init : function(){  	
    	var me = this;
    	me.title = Ext.sfa.translate_arrays[langid][523]; 
    	this.width = 250;
    	this.height = 360;
    	this.launcher = {
            text: this.title,            
            handler : this.createWindow,
            scope: this,
            windowId:(++windowIndex)
        };    	    	
    },
    
    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [
                   ['order-import-manual', 'module', Ext.sfa.translate_arrays[langid][293], 'id', 700, 450, 'hand-order-module'],                   
                   ['Hand_sale', 'Product_count', Ext.sfa.translate_arrays[langid][294], 'id', 700, 500, 'hand-sale-module'],
                   ['back-order-grid-win-pre', 'module', Ext.sfa.translate_arrays[langid][295], 'id', 800, 450, 'update-sale-module']
//                   ['update-orders-data-win', 'module', Ext.sfa.translate_arrays[langid][618], 'id', 800, 450, 'update-sale-module']
            ]
        });
    }
});

Ext.define('OSS.StorageModulePanel', {
    extend: 'OSS.ControlPanel',
    id:'storage-module-win',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][509];
    	this.width = 440;
    	this.height = 250;
    },
          
    createStaticWindow : function(){                  
        var win = Ext.widget('window', {
            id: this.id,
            title:this.title,
            width:this.width,
            height:this.height,
            iconCls: 'icon-grid',
            animCollapse:false,
            constrainHeader:true,
            layout: 'fit',
            items: [this.createStaticPanel()]
        });
        
        win.show();          
    },           
    
    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [                                      
                   ['Storage', '_storage', Ext.sfa.translate_arrays[langid][510], 'id', 500, 550, 'storage-module'],
                   ['User_Products', '_product_user_data_detail', Ext.sfa.translate_arrays[langid][280], 'userCode', 960, 600, 'user-product-module'],                                     
                   ['complete-order-grid-win', 'module', Ext.sfa.translate_arrays[langid][511], '', 0, 0, 'storage-out-module'],                   
                   ['storage-insert-win', 'module', Ext.sfa.translate_arrays[langid][512], 'id', 500, 450, 'storage-in-module'],
                   ['orders-report-win', 'module', Ext.sfa.translate_arrays[langid][639], 'id', 700, 450, 'storage-report-module'],
                   ['Storage_Out_Report', '_storage_out_q', Ext.sfa.translate_arrays[langid][655], 'id', 850, 550, 'storage-out-product']
            ]
        });
    }   
});

Ext.define('OSS.SaleModulePanel', {
    extend: 'OSS.ControlPanel',
    id:'sale-module-win',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][501];
    	this.width = 550;
    	this.height = 240;
    },
    
    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [
                   ['sale-grid-win', 'module', Ext.sfa.translate_arrays[langid][614], ' ', 0, 0, 'main-sale-module'],      
                   ['orders-packet-win', 'module', 'Захиалгын мэдээ', ' ', 0, 0, 'xt-order-module'],
                   ['sale-graph-win', 'module', Ext.sfa.translate_arrays[langid][605], ' ', 0, 0, 'sale-pack-module'],
                   ['detail-grid-win', 'module', Ext.sfa.translate_arrays[langid][519], ' ', 0, 0, 'detail-user-sale'],
                   ['Promotion_Accept', '_promotion_accept', Ext.sfa.translate_arrays[langid][659], ' ', 600, 400, 'promo-grid-module'],                                     
                   ['order-grid-win', 'module', Ext.sfa.translate_arrays[langid][278], 'userCode', 900, 500, 'order-module'],                   
                   ['padaan-sales-data-win', 'module', Ext.sfa.translate_arrays[langid][680], '_dateStamp', 700, 400, 'invoice-module'],
                   ['Spec_user', 'spec_user', Ext.sfa.translate_arrays[langid][604], ' ', 0, 0, 'user-sale-info'],                   
                   ['User_Route_Entry', '_user_route_entry', Ext.sfa.translate_arrays[langid][505], 'id', 900, 500, 'user-entry-module']                                                        
            ]
        });
    }   
});

Ext.define('OSS.LeaseModulePanel', {
    extend: 'OSS.ControlPanel',
    id:'lease-module-win',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][508];
    	this.width = 450;
    	this.height = 225;
    },
    
    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [
                   ['lease-customer-monthly-data', 'module', 'Зээлийн мэдээ', 'discount', 1000, 650, 'customer-rent-module'],
                   ['lease-grid-win', 'module', Ext.sfa.translate_arrays[langid][311], 'discount', 800, 500, 'customer-lease-module']
            ]
        });
    }   
});

Ext.define('OSS.StorageInsert', {
    extend: 'OSS.ExtendModule',
    id:'storage-insert-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][512];        
		//bat
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('storage-insert-win');        
		var me = this;
        if(!win){     
			me.createGrid();
            win = desktop.createWindow({
                id: 'storage-insert-win',
                title:this.title,
                width:750,
                height:600,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
				dockedItems: me.createToolbar(),
                items: [me.grid1, me.grid]
            });
        }
        win.show();
        return win;               
    },
    
    clearData : function() {
    	var me = this;
  		var t = 0;
		me.storage_temp_data = [];
		me.storage_row_ds.loadData(me.storage_temp_data);    	    
	},
	
    createStore : function() {
    	var me = this;
    	
    	me.storage_temp_data = [];
    	
    	me.storage_row_ds = Ext.create('Ext.data.JsonStore', {
            fields: [
                {name: 'productCode'},
                {name: 'requestCount',  type: 'int'},
                {name: 'from',  type: 'int'},
                {name: 'to',  type: 'int'}
            ]
        });

		
		me.model = me.generateModel('Price', 'Price');
    	me.store = me.model['readStore'];

		me.xml = _donate('_custom_price_list', 'SELECT', ' ', ' ', ' ', '1,battrade');
		me.store.getProxy().extraParams = {xml:_donate('_custom_price_list', 'SELECT', ' ', ' ', ' ', '1,battrade')};
		me.store.loadPage(1);
    },        
    
	_to: 1,
	_from: 1,

    createGrid : function() {
    	var me = this;
    	me.createStore();
    	me.clearData();

    	me.group1 = 'ts_group1';
    	me.group2 = 'ts_group2';

		me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'north',
    		columnLines: true,
			flex: 1,
    		columns: me.createHeadersWithNumbers(me.model['columns']),			
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group1,
                    dropGroup: me.group2
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {                    	
                    	              	
                    }
                }
            },
			bbar: Ext.create('Ext.PagingToolbar', {
				store: me.store,
				displayInfo: true,
				displayMsg: '{0}-{1} of {2}',
				emptyMsg: "Empty !",
				items: [{
						text: 'Хайлт : '				
					},{
						xtype: 'textfield',
						width: 150,
						readOnly: false,
						listeners: {
							 change: {
								 fn: me.onTextFieldChange_,
								 scope: this,
								 buffer: 200
							 }
						}
					},'->'
				]
			})
    	});
				
    	me.grid1 = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',			    		
    		store: me.storage_row_ds,			
    		columnLines: true,		
			border: false,
			split: true,
			region: 'center',
			flex: 0.6,
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group2,
                    dropGroup: me.group1
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                    	var rec = data.records[0];				   
						if (1==1) {
							var productCode = rec.data['productCode'];										
												
							var requestCount = Ext.create('Ext.form.NumberField', {
								xtype: 'numberfield',
								fieldLabel: 'Шилжүүлэх тоо',
								name: 'requestCount',
								minValue: 0,
								maxValue: 900000,
								value: rec.data['requestCount'],
								align: 'right',
								allowBlank: false,
								allowDecimals: true,
								decimalPrecision: 2
							});																		
							
							var wareFrom = me.generateLocalComboWithField('local_ware_house', 'ware_house', 'wareHouseID', 'name', 'Агуулахаас', 100, 'Агуулахаас');
							var wareTo = me.generateLocalComboWithField('local_ware_house', 'ware_house', 'wareHouseID', 'name', 'Агуулахруу', 100, 'Агуулахруу');
							wareFrom.width = 300;
							wareTo.width = 300;
							wareFrom.setValue(me._from);
							wareTo.setValue(me._to);
						
							var storage_row = Ext.createWidget('form', {			        			        
								bodyPadding: 5,
								width: 320,
								height: 240,
								border: false,		        
								fieldDefaults: {
									labelAlign: 'left',
									labelWidth: 130,
									fieldWidth: 80,
									allowBlank: false    				            
								},
								items: [wareFrom, wareTo, requestCount],
								buttons: [{
										text: 'OK',
										handler: function() {			
											me._to = wareTo.getValue();
											me._from = wareFrom.getValue();
											
											rec.set('requestCount', requestCount.getValue());
											rec.set('from', wareFrom.getValue());
											rec.set('to', wareTo.getValue());
																																						
											win_row.hide();
										}
									},
									{
										text: Ext.sfa.translate_arrays[langid][327],
										handler: function() {
											win_row.hide();
										}
									}
								]
							});
											
							
							var win_row = Ext.widget('window', {
								title: Ext.sfa.renderer_arrays['renderProductCode'](productCode),			
								bodyPadding: 0,
								layout: 'fit',
								width: 320,
								height: 240,
								items: [storage_row]
							});
							
							win_row.show();
						}
                    }
                }
            },
			columns: [ 
				new Ext.grid.RowNumberer({width:30}),
    		    {			
    				text: Ext.sfa.translate_arrays[langid][345],			
    	   			dataIndex: 'productCode',
    	   			flex: 1,
    	   			renderer: Ext.sfa.renderer_arrays['renderProductCode']	   			   	
    			},
    			{			
    				text: Ext.sfa.translate_arrays[langid][434],			
    	   			dataIndex: 'requestCount',
    	   			renderer: Ext.sfa.renderer_arrays['renderNumber'],
    	   			summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'],
    	   			align: 'right',
    	   			summaryType: 'sum',
    	   			width: 60	   			   	
    			},
    			{			
    				text: Ext.sfa.translate_arrays[langid][509],			
    	   			dataIndex: 'from',    	
    	   			renderer: Ext.sfa.renderer_arrays['renderWareHouseID'],
    	   			width: 100	   			   	
    			},
    			{			
    				text: Ext.sfa.translate_arrays[langid][509],			
    	   			dataIndex: 'to',    
    	   			renderer: Ext.sfa.renderer_arrays['renderWareHouseID'],
    	   			width: 100 			   	
    			}
    		], 
			flex: 0.5,
    		features:[
    	          {
    	        	  id: 'summary_storage_temp',
    	        	  ftype: 'summary'
    	          }
    		]
    	});    	
    },
    
    createToolbar : function() {
    	var me = this;
    	
    	return [{
            xtype: 'toolbar',
            items: [{
                text: Ext.sfa.translate_arrays[langid][490],
                iconCls: 'icon-add',                
                disabled: hidden_values['storage_accept_edit'],
                handler: function(){     
                	Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][556], function(btn, text){	                		
            			if (btn == 'yes') {	
		                	var action_order_temp = Ext.create('Ext.data.JsonStore', {                 	                         	        
		             	        proxy: {
		             				type: 'ajax',
		             				url: 'httpGW',
		             	            writer: {
		             					type: 'json'                 	                
		             	            }	            
		             			}
		             	    });	
		            				                	
		            		for (i = 0; i < me.storage_row_ds.getCount(); i++) {
		            			var rec = me.storage_row_ds.getAt(i);
		            			
		            			if (rec.data['requestCount'] > 0) {		            				
		            				action_order_temp.load({params:{xml:_donate('action_storage', 'WRITER', 'Storage', '_count', 'i'+rec.data['requestCount'], rec.data['from']+','+rec.data['to']+','+rec.data['productCode']+','+logged)}});
		            			}
		            		}
		            		

		            		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {
		            			me.clearData();
		            		});
            			}
                	});
                }
            },'-',
            {
                text: Ext.sfa.translate_arrays[langid][471],
                iconCls: 'icon-delete',
                disabled: hidden_values['storage_accept_edit'],
                handler: function(){                	        	    	
                	me.clearData();
                }
            }]
        }];
    }
});

Ext.define('OSS.ImageWindow', {
    extend: 'OSS.ExtendModule',
    id:'special-work-image-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][292];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('special-work-image-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'special-work-image-win',
                title:this.title,
                width:800,
                height:600,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createPanel()]
            });
        }
        win.show();
        return win;               
    },
        
    createStore : function() {
    	var me = this;
    	
    	ImageModel = Ext.define('ImageModel', {
            extend: 'Ext.data.Model',
            fields: [
               {name: 'name'},
               {name: 'url'},      
               {name: 'customerCode'},
               {name:'lastmod', type:'string'}
            ]
        });

        me.store = Ext.create('Ext.data.Store', {
            model: 'ImageModel',
            groupField: 'customerCode',
            proxy: {
                type: 'ajax',
                url: 'images',       
                method: 'POST',
                reader: {
                    type: 'json',
                    root: 'images'
                },
    	        actionMethods: {                    
                    read: 'POST'                   
                }
            }
        });
        
        me.store.load({params:{p:'r', c: customerCode}});
    }, 
    
    createGridPanel : function() {
    	
    },
    
    createPanel : function() {
    	var me = this;
    	me.createStore();    	    	
    	
    	me.stateTpl =['<tpl for=".">',
    	               '<div class="thumb-wrap" id="{name}">',
    	               '<div class="thumb"><img style="width:40px; height:40px;" src="images?p={url}" title="{name}"></div>',
    	               '<span class="x-editable">{lastmod}</span></div>',
    	           '</tpl>',
    	           '<div class="x-clear"></div>'
    	];
    	
    	me.panel = Ext.create('Ext.Panel', {
    		id: 'images-view',
            frame: false,
            collapsible: false,        
            border: false,
            items: Ext.create('Ext.DataView', {
                store: me.store,
                tpl: me.stateTpl,
                multiSelect: true,
                region:'center',
                trackOver: true,
                overItemCls: 'x-item-over',
                itemSelector: 'div.thumb-wrap',
                emptyText: 'No images to display',
                plugins: [
                    Ext.create('Ext.ux.DataView.DragSelector', {}),
                    Ext.create('Ext.ux.DataView.LabelEditor', {dataIndex: 'name', renderer: Ext.sfa.renderer_arrays['renderCustomerCode']})
                ],
                prepareData: function(data) {
                    Ext.apply(data, {
                        shortName: Ext.util.Format.ellipsis(data.name, 15)                    
                    });
                    return data;
                },
                listeners: {
                    selectionchange: function(dv, nodes ){                    
                        window.open ("images?p="+nodes[0].get('url'),"image");
                    }
                }            
            }),    		
    		dockedItems: this.createToolbar()    		
    	});
    	
    	return me.panel;
    },
    
    createToolbar : function() {
    	var me = this;
    	me.customerList = me.generateRemoteCombo('_remote_customer_image_work', 'customer_list', 'code', 'name', Ext.sfa.translate_arrays[langid][466]);
    	me.customerList.width = 250;
    	return [{        	
            xtype: 'toolbar',
            items: [me.customerList, {
                text: Ext.sfa.translate_arrays[langid][326],
                iconCls: 'refresh',
                handler: function(){                	        	    	
                	me.store.load({params:{p:'r', c: me.customerList.getValue()}});
                }
            }]
        }];
    }
});

Ext.define('OSS.UpdateSalesData', {
    extend: 'OSS.ExtendModule',
    id:'update-sales-data-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][295];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('update-sales-data-win');        
        if(!win){        	        	
			var me = this;
            win = desktop.createWindow({
                id: 'update-sales-data-win',
                title:this.title,
                width:890,
                height:540,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createGrid()],
	    		dockedItems: me.createToolbar()
            });
        }
        win.show();
        return win;               
    },
        
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('Sales', 'sales');
    	me.store_action = me.model['writeStore'];
    	me.store = me.model['readStore'];
    },
    
    createGrid : function() {
    	var me = this;
    	me.createStore();
    	me.sdate1 = currentDate;
    	me.sdate2 = nextDate;
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		});
    	
    	me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		store: me.store,
    		features: [me.summary],
    		plugins: me.model['rowEditor'],
    		columnLines: true,
			border: false,
    		columns: me.createHeaders(me.model['columns'])
    	});
    	
    	return me.grid;
    },
    
    createToolbar : function() {
    	var me = this;
    	me.dateMenu1 = Ext.create('Ext.menu.DatePicker', {
    	    handler: function(dp, date){
    	    	var date = new Date(date);
    	    	
    	    	me.sdate1 = Ext.Date.format(date, 'Y-m-d');
    	    	Ext.getCmp('start_sale_update').setText(me.sdate1);        	    	    	
            	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});            
    	    }
    	});
    	
    	me.dateMenu2 = Ext.create('Ext.menu.DatePicker', {
    	    handler: function(dp, date){
    	    	var date = new Date(date);
    	    	me.sdate2 = Ext.Date.format(date, 'Y-m-d');	    	
            	Ext.getCmp('end_sale_update').setText(me.sdate2);
    	    	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});            
    	    }
    	});
    	
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);
    	me.products = me.generateLocalCombo('local_product_list', 'product_list', 'code', 'name', Ext.sfa.translate_arrays[langid][345], 150);
    	
    	return [{
            xtype: 'toolbar',
            items: [
                Ext.create('Ext.button.Button', {
                	id : 'start_sale_update',
                    text    : currentDate,        
                    scope   : this,
                    iconCls: 'calendar',
                    menu	: me.dateMenu1
            	}),
            	Ext.create('Ext.button.Button', {
            		id : 'end_sale_update',
                    text    : nextDate,        
                    scope   : this,
                    iconCls: 'calendar',
                    menu	: me.dateMenu2
            	}),
            	me.users,me.products,{
                	text: Ext.sfa.translate_arrays[langid][326],
                	iconCls: 'refresh',
                	handler: function(){
                		if (me.products.getValue() != '')
                			me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE productCode='"+me.products.getValue()+"' and userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});
                		else
                			me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});
                	}
                },
				{
					text: 'Буцаалт',
					iconCls: 'icon-delete',
					handler: function() {
						
					}
				}
            ]
        }];
    }
});

Ext.define('OSS.PadaanSalesData', {
    extend: 'OSS.UpdateSalesData',
    id:'padaan-sales-data-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][680];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('padaan-sales-data-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'padaan-sales-data-win',
                title:this.title,
                width:890,
                height:540,
				border: false,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createGrid()]
            });
        }
        win.show();
        return win;               
    },          
    
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('Sales', 'sales');    	
    	me.store = me.model['readStore'];		
    },
    
	loadStore : function() {
		var me = this;
		if (customerCode)
			me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' and customerCode='"+customerCode+"' ORDER by _dateStamp")}});
		else
			me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});
	},

    createGrid : function() {
    	var me = this;
    	me.createStore();
    	me.sdate1 = currentDate;
    	me.sdate2 = nextDate;
    	me.groupingsummary = Ext.create('Ext.grid.feature.GroupingSummary',{
		    ftype: 'groupingsummary',
		    groupHdTpl: '{name}',
		    hideGroupedHeader: true		    
		});
    	    	
    	
    	me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		store: me.store,
    		features: [me.groupingsummary],    		
    		columnLines: true,
    		columns: me.createHeaders(me.model['columns']),			
    		dockedItems: me.createToolbar()
    	});
    	
		me.loadStore();

    	return me.grid;
    },
    
    createToolbar : function() {
    	var me = this;
    	me.dateMenu1 = Ext.create('Ext.menu.DatePicker', {
    	    handler: function(dp, date){
    	    	var date = new Date(date);
    	    	
    	    	me.sdate1 = Ext.Date.format(date, 'Y-m-d');
    	    	Ext.getCmp('padaan_start_update').setText(me.sdate1);        	    	    	
            	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});            
    	    }
    	});
    	
    	me.dateMenu2 = Ext.create('Ext.menu.DatePicker', {
    	    handler: function(dp, date){
    	    	var date = new Date(date);
    	    	me.sdate2 = Ext.Date.format(date, 'Y-m-d');	    	
            	Ext.getCmp('padaan_end_update').setText(me.sdate2);
    	    	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});            
    	    }
    	});
    	    	
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);    	
    	if (userCode)
			me.users.setValue(userCode);
		
    	return [{
            xtype: 'toolbar',
            items: [
                Ext.create('Ext.button.Button', {
                	id : 'padaan_start_update',
                    text    : currentDate,        
                    scope   : this,
                    iconCls: 'calendar',
                    menu	: me.dateMenu1
            	}),
            	Ext.create('Ext.button.Button', {
            		id : 'padaan_end_update',
                    text    : nextDate,        
                    scope   : this,
                    iconCls: 'calendar',
                    menu	: me.dateMenu2
            	}),
            	me.users,{
                	text: Ext.sfa.translate_arrays[langid][326],
                	iconCls: 'refresh',
                	handler: function(){                		
						me.loadStore();
                	}
                },'-',
                {			                 
                    iconCls: 'icon-xls',		
                    handler: function() {                     	
                    	doXls(me.model, 'Sales,sales');
                    }	                
        		}
            ]
        }];
    }
});


Ext.define('OSS.UpdateOrdersData', {
    extend: 'OSS.ExtendModule',
    id:'update-orders-data-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][618];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('update-orders-data-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'update-orders-data-win',
                title:this.title,
                width:670,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createGrid()]
            });
        }
        win.show();
        return win;               
    },
        
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('Orders', 'orders');		    				    	 			
    	me.store_action = me.model['writeStore'];
    	me.store = me.model['readStore'];   
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();    	
    	me.sdate1 = currentDate;
    	me.sdate2 = nextDate;
		me.sm = Ext.create('Ext.selection.CheckboxModel');
		me.grouping = Ext.create('Ext.grid.feature.Grouping',{
			id:'order_grid_group',
		    ftype: 'grouping',
		    hideGroupedHeader: true
		});

    	me.grid = Ext.create('Ext.grid.Panel', {			
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			selModel: me.sm,
			features: [me.grouping],
    		plugins: me.model['rowEditor'],		
    		columnLines: true,
    		columns: me.createHeaders(me.model['columns']),			
    		dockedItems: me.createToolbar()
    	});

    	return me.grid;
    },
    	
	loadStore: function() {
		var me = this;
		me.store.load({params:{xml:_donate('Orders', 'SELECT', 'Orders', 'id,_date,userCode,productCode,requestCount,confirmedCount,ticketID', 'i,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and DATEADD(dd, 0, DATEDIFF(dd, 0, _date))='"+me._date+"' and requestCount@0 and confirmedCount@0 ORDER by _date desc")}});	
	},

    createToolbar : function() {
    	var me = this;    	    	
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);    	

    	me._date = currentDate;
    	return [{
            xtype: 'toolbar',
            items: [     
				{
						id		: 'order-up-date',
			    		text    : currentDate,        
				        scope   : this,	            	        
				        iconCls : 'calendar',
				        menu	: Ext.create('Ext.menu.DatePicker', {
					    	text: me.detailDate,
					        handler: function(dp, date){
					        	me._date = Ext.Date.format(date, 'Y-m-d');	            		        	
					        	Ext.getCmp('order-up-date').setText(me._date);	            		        		        	
					        }
					    })
				},
            	me.users,{
	                text: Ext.sfa.translate_arrays[langid][326],
		            iconCls: 'refresh',
			        handler: function(){                                	
						me.loadStore();
	                }		
	            },
				{
					text: 'Устгах',
					iconCls: 'icon-delete',
					handler: function() {
						var records = me.grid.getView().getSelectionModel().getSelection();          
						if (records.length > 0)
						{						
							Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], 'Устгахдаа итгэлтэй байна уу !', function(btn, text){	                		
								if (btn == 'yes'){
									var p = 0;
									for (i = 0; i < records.length; i++)
									{
										var rec = records[i];
										me.store_action.load({params:{xml:_donate('back_order_action', 'WRITER', 'Orders', ' ', ' ', rec.data['id'])},
												 callback: function() {                						 		 
													p = 1;	
												}
										});
									}										

									if (p == 1)
										me.loadStore();									
								}
							});
						}
					}
				}
			]
        }];
    }
});

Ext.define('OSS.RouteCustomerSalesData', {
    extend: 'OSS.ExtendModule',
    id:'route-customer-sales-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][618];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('route-customer-sales-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'route-customer-sales-win',
                title:this.title,
                width:670,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createGrid()]
            });
        }
        win.show();
        return win;               
    },
        
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('Top_Customer', 'top_customer');		    				    	 			
    	me.store_action = me.model['writeStore'];
    	me.store = me.model['readStore'];    	
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();    	
    	me.sdate1 = currentDate;
    	me.sdate2 = nextDate;
    	me.grid = Ext.create('Ext.grid.Panel', {			
    		xtype: 'grid',
    		border: false,
    		store: me.store,
    		plugins: me.model['rowEditor'],		
    		columnLines: true,
    		columns: me.createHeaders(me.model['columns']),			
    		dockedItems: me.createToolbar()
    	});
    	
    	return me.grid;
    },
    
    createToolbar : function() {
    	var me = this;    	    	
    	me.users = me.generateLocalCombo('local_user_combo', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], 150);    	
    	me.route = me.generateLocalCombo('local_route_combo', 'route_list', 'routeID', 'routeName', Ext.sfa.translate_arrays[langid][411], 180);
    	
    	return [{
            xtype: 'toolbar',
            items: [                
            	me.users,me.route,{
                text: Ext.sfa.translate_arrays[langid][326],
                iconCls: 'refresh',
                handler: function(){                                	
                	
                }
            }]
        }];
    }
});

Ext.define('OSS.UserPlanComplete', {
    extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.Panel',
        'Ext.DataView'
    ],

    id:'user-plan-complete-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][451];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('user-plan-complete-win');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'user-plan-complete-win',
                title:this.title,
                width:1100,
                height:600,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createGrid()]
            });
        }
        win.show();
        return win;               
    },            
    
    createGrid : function() {
    	var me = this;    					
		
		var users = this.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);						
		var planName = this.generateRemoteComboWithFilter('_remote_plan_names', 'plan_name', 'name', 'name', Ext.sfa.translate_arrays[langid][448], mode);		
								
		var u_fields2 = [];		
		u_fields2[0] = {name: 'data', type: 'string', title: '', width: 75};
		
		count = 1;
		for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);					
			if (me.productAble(record)) {
				u_fields2[count] = {name: record.data['code'],								
									title: record.data['name'],						  													
						  			type: 'float',
						  			renderer: renderDynamicNumber,
						  			width: 80,						  				 										  	
						  			align: 'right'					  			
							  		};										  		
				count++;
			}
		}								
		u_fields2[count] = {name: 'totalCount',								
							title: Ext.sfa.translate_arrays[langid][344],						  													
				  			type: 'float',					  			
				  			width: 80,
				  			renderer: renderDynamicNumber,
				  			align: 'right', 
				  			summaryType: 'sum'};
		
		u_fields2[count+1] = {name: 'totalAmount',								
				title: Ext.sfa.translate_arrays[langid][447],						  													
	  			type: 'float',					  			
	  			width: 85,
	  			renderer: renderDynamicNumberTotal,//Ext.util.Format.numberRenderer('00,00,000'),								  			
	  			align: 'right', 
	  			summaryType: 'sum'};
		
		Ext.regModel('uplan2', { 
	        fields: u_fields2 
	    });
		
		var u_columns2 = [];        
	    for (var i = 0; i < u_fields2.length; i++)
	    {       
	       var field = u_fields2[i];
	       u_columns2[i] = {header: field.title, 
	    		   		   	  dataIndex: field.name, 
	    		   		   	  width: field.width,
	    		   		   	  renderer: field.renderer, 
	    		   		   	  align: field.align,	   		   	  
	    		   		   	  summaryType: field.summaryType};       
	    }
	    
		
		u2_ds = Ext.create('Ext.data.JsonStore', {
	        model: 'uplan2',	        
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
		
		var gridPanel2 = Ext.create('Ext.grid.Panel', {			
			xtype: 'gridpanel',
			border: true,			
			hidden: false,
			columnLines: true,
			flex: 1,
			store: u2_ds,							
			columns: u_columns2
		});
				
		//total
		
		var total_fields = [];		
		total_fields[0] = {name: 'userCode', type: 'string', title: Ext.sfa.translate_arrays[langid][310], width:90, renderer: Ext.sfa.renderer_arrays['renderUserCode']};
		
		count = 1;
		for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);			
			if (me.productAble(record)) {
				total_fields[count] = {name: record.data['code'],								
									title: record.data['name'],						  													
						  			type: 'float',
						  			summaryType: 'sum',
						  			width: 80,
						  			renderer: Ext.sfa.renderer_arrays['renderNumber'],
						  			summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'],						  										  	
						  			align: 'right'					  			
							  		};										  		
				count++;
			}
		}								
		total_fields[count] = {name: 'totalAmount',								
							title: Ext.sfa.translate_arrays[langid][454],						  													
				  			type: 'long',					  			
				  			width: 105,
				  			renderer: Ext.sfa.renderer_arrays['renderMoney'],
				  			summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'],
				  			align: 'right', 
				  			summaryType: 'sum'};
		
		total_fields[count+1] = {name: 'sku',								
				title: 'SKU',						  													
	  			type: 'float',					  			
	  			width: 50,	            	  											  			
	  			align: 'right', 
	  			summaryType: 'average'};
		
		total_fields[count+2] = {name: 'amountIn',								
				title: 'Amount In%',						  													
	  			type: 'float',					  			
	  			width: 60,	            	  											  			
	  			align: 'right', 	  			
	  			renderer: Ext.sfa.renderer_arrays['renderPrecent'],
	  			summaryRenderer: Ext.sfa.renderer_arrays['renderTPrecent'],
	  			summaryType: 'average'};
		
		Ext.regModel('totalplan', {	        
	        fields: total_fields 
	    });
		
		me.totalPlan_ds = Ext.create('Ext.data.JsonStore', {
	        model: 'totalplan',	     
	        pageSize: 10,
	        mode: 'remote',
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
		
		me.totalGrid = Ext.create('Ext.grid.Panel', {
			flex: 1,
			xtype: 'gridpanel',
			border: true,		
			hidden: true,
			columnLines: true,
			store: me.totalPlan_ds,							
			columns: me.createHeaders(total_fields),
			features: [{
				ftype: 'summary'					       
	        }]	            	        
		});
				
		
		me.grid = Ext.create('Ext.Panel', {								
			border: false,												
			layout: {
				type: 'vbox',
				align: 'stretch'
			},
			dockedItems: [{
	            xtype: 'toolbar',
	            items: [
					planName,
	                users, {		            
	                text: Ext.sfa.translate_arrays[langid][326],
	                iconCls: 'refresh',
	                handler: function(){		                	           
	                	//userPlan_ds.load({params:{xml:_donate('_user_saledata_for_plan', 'SELECT', 'Sales', ' ', ' ', users.getValue()+','+planName.getValue())}});
	                	u2_ds.load({params:{xml:_donate('_user_saledata_for_plan_plan', 'SELECT', ' ', ' ', ' ', users.getValue()+','+planName.getValue())}});	                	
	                }
	            },
	          /*  '-',
	            {
	            	text: Ext.sfa.translate_arrays[langid][558],
	            	enableToggle: true,
	            	iconCls: 'calendar',
	            	toggleHandler : function(item, pressed) {
	            		//gridPanel.setVisible(pressed);
	            		gridPanel2.setVisible(!pressed);
	            	}
	            },*/
	            {
	            	text: Ext.sfa.translate_arrays[langid][452],
	            	iconCls: 'report',
	            	enableToggle: true,
	            	toggleHandler: function(item, pressed) {
	            		if (!pressed) {
	            			gridPanel2.setVisible(true);
	            		//	gridPanel.setVisible(false);
	            		}
	            		me.totalGrid.setVisible(pressed);
	            		me.totalPlan_ds.load({params:{xml:_donate('_user_saledata_for_plan_summary', 'SELECT', ' ', ' ', ' ', planName.getValue())}});
	            	}
	            },	            
	            '-',
	            {
	            	 text: Ext.sfa.translate_arrays[langid][486],
		             iconCls: 'icon-xls',
		             handler: function() {		            	 
		            	 doXls(userPlan_fieldsOriginal, "uplan", users.getValue()+','+year+','+months[month-1]);
		             }
	            }	            	           
	            ]
	        }],			
			items: [/*gridPanel, */gridPanel2, me.totalGrid]
		}); 
		
    	return me.grid;
    },
    
    createToolbar : function() {
    	var me = this;
    	me.dateMenu1 = Ext.create('Ext.menu.DatePicker', {
    	    handler: function(dp, date){
    	    	var date = new Date(date);
    	    	
    	    	me.sdate1 = Ext.Date.format(date, 'Y-m-d');
    	    	Ext.getCmp('start_sale_update').setText(me.sdate1);        	    	    	
            	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});            
    	    }
    	});
    	
    	me.dateMenu2 = Ext.create('Ext.menu.DatePicker', {
    	    handler: function(dp, date){
    	    	var date = new Date(date);
    	    	me.sdate2 = Ext.Date.format(date, 'Y-m-d');	    	
            	Ext.getCmp('end_sale_update').setText(me.sdate2);
    	    	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});            
    	    }
    	});
    	
    	me.users = me.generateLocalCombo('local_user_combo', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], 150);
    	me.customerList = me.generateRemoteCombo('_remote_customer_image_work', 'customer_list', 'code', 'name', Ext.sfa.translate_arrays[langid][466]);
    	
    	return [{
            xtype: 'toolbar',
            items: [
                Ext.create('Ext.button.Button', {
                	id : 'start_sale_update',
                    text    : currentDate,        
                    scope   : this,
                    iconCls: 'calendar',
                    menu	: me.dateMenu1
            	}),
            	Ext.create('Ext.button.Button', {
            		id : 'end_sale_update',
                    text    : nextDate,        
                    scope   : this,
                    iconCls: 'calendar',
                    menu	: me.dateMenu2
            	}),
            	me.users,{
                text: Ext.sfa.translate_arrays[langid][326],
                iconCls: 'refresh',
                handler: function(){                                	
                	me.store.load({params:{xml:_donate('Sales', 'SELECT', 'Sales', me.model['fields'], 's,s,s,s,i,i,i', " WHERE userCode='"+me.users.getValue()+"' and _dateStamp@='"+me.sdate1+"' and _dateStamp!'"+me.sdate2+"' ORDER by _dateStamp")}});
                }
            }]
        }];
    }
});

Ext.define('OSS.OrderGridWindowPre', {
    extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],

    id:'order-grid-win-pre',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][278];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('order-grid-win-pre');        
        if(!win){        	        	
        	this.createGrid();
        	
            win = desktop.createWindow({
                id: 'order-grid-win-pre',
                title:this.title,
                width:1100,
                height:620,
                border: true,
                iconCls: 'icon-grid',
                animCollapse:false,
                layout: 'border',
                items: [this.grid1, 
				{
					region: 'center',
					xtype: 'panel',
					layout: 'border',
					border: false,
					items: [this.grid2, this.grid]
				}],
                dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },  
    
    loadStore: function() {
    	var me = this;     	
    	
		if (me.users.getValue() != '')
    		me.cstore.load({params:{xml:_donate('_order_customer_list', 'SELECT', ' ', ' ', ' ', me.users.getValue()+','+me.start.getText())}});
    },

	loadStore1: function() {
    	var me = this;     	
    	
		me.store1.load({params:{xml:_donate('_cars_space', 'SELECT', ' ', ' ', ' ', ' ')}, callback:function(data){    		
    		me.store1.each(function(rec){							
				if (rec.data['userCode'] == me.driver)
					me.grid2.getView().getSelectionModel().select(rec, true, false);								
	        });    		    		
    	}});

    	if (me.customerCode) 
    		me.store.load({params:{xml:_donate('Orders', 'SELECT', 'Orders as b JOIN Product on productCode=code', 'id,_date,userCode,customerCode,productCode,storageCount,availCount,requestCount,confirmedCount,price,orderAmount,b.wareHouseID as wareHouseID', 'i,s,s,s,i,i,f,f,i', " WHERE requestCount@0 and confirmedCount=0 and userCode='"+me.users.getValue()+"' and customerCode='"+me.customerCode+"' and ticketID="+me.ticketID+" and DATEADD(dd, 0, DATEDIFF(dd, 0, _date))='"+me.start.getText()+"' and flag=0 ORDER by class asc,_date desc,confirmedCount asc")},
    			callback: function() {
    				me.store.each(function(rec){ rec.set('agree', true) })
    			}});
    },
   
	loadStore2 : function() {
    	var me = this;     	
    	
		if (me.users.getValue() != '')
   			me.cstore.load({params:{xml:_donate('_order_customer_list', 'SELECT', ' ', ' ', ' ', me.users.getValue()+','+me.start.getText())}});

		me.store1.load({params:{xml:_donate('_cars_space', 'SELECT', ' ', ' ', ' ', ' ')}, callback:function(data){    		
    		me.store1.each(function(rec){							
				if (rec.data['userCode'] == me.driver)
					me.grid2.getView().getSelectionModel().select(rec, true, false);								
	        });    		    		
    	}});

		me.store.load({params:{xml:_donate('Orders', 'SELECT', 'Orders as b JOIN Product on productCode=code', 'id,_date,userCode,customerCode,productCode,storageCount,availCount,requestCount,confirmedCount,price,orderAmount,b.wareHouseID as wareHouseID', 'i,s,s,s,i,i,f,f,i', " WHERE requestCount@0 and confirmedCount=0 and userCode='"+me.users.getValue()+"' and DATEADD(dd, 0, DATEDIFF(dd, 0, _date))='"+me.start.getText()+"' and flag=0 ORDER by class asc,_date desc,confirmedCount asc")},
			callback: function() {
				me.store.each(function(rec){ rec.set('agree', true) })
			}});
    },
	
    createStore : function() {
    	var me = this;
    	
		me.model1 = me.generateModel('Cars_Space', 'cars-space');    	
    	me.store1 = me.model1['readStore'];
    	me.columns1 = me.model1['columns'];

    	me.columns = [
           {name: 'id', type: 'int', width: 50, title: 'Дд', hidden: true},
//           {name: 'agree', type: 'bool', title: 'OK', align: 'right', width: 50, xtype: 'checkcolumn', field: {xtype: 'checkbox'}},
           {name: '_date', type: 'datetime', width: 115, title: Ext.sfa.translate_arrays[langid][341], renderer:Ext.util.Format.dateRenderer('Y-m-d h:i:s'), hidden: true},
           {name: 'userCode', type: 'string', width: 100, flex: 1, title: Ext.sfa.translate_arrays[langid][310], renderer: Ext.sfa.renderer_arrays['renderUserCode'], hidden:true},
           {name: 'customerCode', type: 'string', width: 100, flex: 1, title: Ext.sfa.translate_arrays[langid][310], renderer: Ext.sfa.renderer_arrays['renderCustomerCode'], hidden:true},
           {name: 'productCode', type: 'string', width: 240, title: Ext.sfa.translate_arrays[langid][345], renderer: Ext.sfa.renderer_arrays['renderProductCode']},            
           {name: 'storageCount', type: 'int', title: Ext.sfa.translate_arrays[langid][424], align: 'right', width: 80, renderer: Ext.sfa.renderer_arrays['renderStorageNumber']},
           {name: 'availCount', type: 'int', title: Ext.sfa.translate_arrays[langid][425], align: 'right', width: 95, renderer: Ext.sfa.renderer_arrays['renderStorageNumber']},
           {name: 'requestCount', type: 'int', title: Ext.sfa.translate_arrays[langid][426], align: 'right', width: 70, summaryType: 'sum'},            
           {name: 'confirmedCount', type: 'int', title: Ext.sfa.translate_arrays[langid][421], align: 'right', width: 70, field: {xtype: 'numberfield'}, summaryType: 'sum'},
           {name: 'price', type: 'int', title: Ext.sfa.translate_arrays[langid][414], align: 'right', width: 70, field: {xtype: 'numberfield'}, renderer: Ext.sfa.renderer_arrays['renderMoney']},
           {name: 'orderAmount', type: 'int', title: Ext.sfa.translate_arrays[langid][455], align: 'right', width: 100, field: {xtype: 'numberfield'}, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
           {name: 'wareHouseID', type: 'int', title: Ext.sfa.translate_arrays[langid][375], width: 85, renderer: Ext.sfa.renderer_arrays['renderWareHouseID']}                                 
        ];
    	
    	Ext.regModel('order', {	        
            fields: me.columns
        });
    	
    	me.store = Ext.create('Ext.data.JsonStore', {
            model: 'order',	        
			pageSize: 100,
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
    	
    	me.store_action = Ext.create('Ext.data.JsonStore', {
            model: 'order',	        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();
    	
    	me.cstore = Ext.create('Ext.data.JsonStore', {
    		fields: [        
    		    {name: '_date', type: 'string'},
    		    {name: 'customerCode', type: 'string'},
    		    {name: 'ticketID', type: 'int'},
    		    {name: 'amount', type: 'int'},
    		    {name: 'flag', type: 'int'}
    	    ],	        
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
    	
    	me.summary1 = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		});
    	
    	me.grid1 = Ext.create('Ext.grid.GridPanel', {    		
    		xtype: 'grid',
    		border: false,
    		columnLines: true,
    		width: 400,
    		split: true,
    		region: 'west',
    		features: [me.summary1],
    		store: me.cstore,    		
    		columns: [new Ext.grid.RowNumberer({width:30}), {
                text     : 'Огноо',
                width	 : 100,
                sortable : true,
                align	 : 'center',                               
                dataIndex: '_date'                
            },{
                text     : Ext.sfa.translate_arrays[langid][466],
                flex	 : 1,
                sortable : true,                
                dataIndex: 'customerCode',
                renderer : Ext.sfa.renderer_arrays['renderCustomerCode']
            },{
                text     : Ext.sfa.translate_arrays[langid][455],
                width	 : 100,
                sortable : true,
                align	 : 'right',
                summaryType: 'sum',
                renderer: Ext.sfa.renderer_arrays['renderMoney'],
                summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], 
                dataIndex: 'amount'                
            },{
                text     : '№',
                width	 : 60,
                sortable : true,
                hidden   : true,
                align	 : 'right',                               
                dataIndex: 'ticketID'                
            },{
                text     : '',
                width	 : 32,
                hidden   : true,
                sortable : true,                
                dataIndex: 'flag',
                renderer : function(v) {
                	if (v == 1) return 'VIP';
                	return '';
                }
            }]            
    	});   

    	me.grid1.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                var rec = selectedRecord[0];
                me.customerCode = rec.data['customerCode'];
                me.ticketID = rec.data['ticketID'];
                me.loadStore1();
            }
        });    
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		});
    	
    	me.grid = Ext.create('Ext.grid.Panel', {    		
    		xtype: 'grid',
    		columnLines: true,
			split: true,
			region: 'center',
			border: false,
    		store: me.store,		
			selModel: Ext.create('Ext.selection.CheckboxModel', {
				listeners: {
					selectionchange: function(sm, selections) {
						
					}
				}
			}),
    		plugins: [new Ext.grid.plugin.CellEditing({
    	        clicksToEdit: 1
    	    })],
    	    features: [me.summary],  
    		columns: me.createHeaders(me.columns)    		
    	});    	    


		me.grid2 = Ext.create('Ext.grid.Panel', {    		
    		xtype: 'grid',
			region: 'north',				
    		border: false,
			height: 200,
			split: true,
    		columnLines: true,    		
    		store: me.store1,    		
			selModel: Ext.create('Ext.selection.CheckboxModel', {
				listeners: {
					selectionchange: function(sm, selections) {
						
					}
				}
			}),	
    		columns: me.createHeaders(me.columns1)            
    	});
    },
    
    createToolbar : function() {
    	var me = this;
    	
		me.start = me.generateDateField('ts_date1',currentDate);
    	me.wareHouse = this.generateLocalCombo('local_ware_house', 'ware_house', 'wareHouseID', 'name', Ext.sfa.translate_arrays[langid][509], 160);
    	me.users = this.generateRemoteCombo('_remote_ordered_user_names_pre', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310]);    	    	
    	
    	me.users.on('change', function(e) {
    		me.loadStore();
    	});
    	
		me.buttons = [me.start, me.users, 
			{
				text: 'Харах',
				iconCls: 'refresh',
				handler: function() {
					me.loadStore();
				}
			},
			{
				text: 'Бүгдийг харах',
				iconCls: 'refresh',
				handler: function() {
					me.loadStore2();
				}
			},'-',{
			text: Ext.sfa.translate_arrays[langid][421],
			iconCls: 'icon-apply',
			disabled: hidden_values['order_accept_edit'],
			handler: function() {	
				var records = me.grid.getView().getSelectionModel().getSelection();
				var drivers = me.grid2.getView().getSelectionModel().getSelection();
				me.acceptOrders(records, drivers);
			}
		},{
			text: Ext.sfa.translate_arrays[langid][366],
			iconCls: 'icon-delete',
			disabled: hidden_values['order_accept_edit'],
			handler: function() {
				var records = me.grid.getView().getSelectionModel().getSelection();
				if (records.length == 0) 
					Ext.MessageBox.alert('Error','Сонгогдоогүй байна', null);
				if (me.users.getValue() > '') {
					Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][548], function(btn, text){	                		
						if (btn == 'yes'){
							for (i = 0; i < records.length; i++) {                					
								var rec = records[i]; {        	                			
									me.store_action.load({params:{xml:_donate('delete', 'WRITER', 'Orders', ' ', ' ', " userCode='"+me.users.getValue()+"' and requestCount>0 and confirmedCount=0 and flag=0 and id="+rec.get('id'))},
														  callback: function(){
																
														  }});                										
								}
							}
							me.loadStore();
							
						} else {
				
						}
					});	                		
				} else 
					Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][539], null);	                	
			}
		}];

		me.addStandardButtons();
		
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    },

	acceptOrders: function(records, drivers) {
		var me = this;
		
		if (drivers.length == 0) {
			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Ачих жолоочийг сонгоно уу !', null);
			return;
		}

		if (records.length > 0) {
			Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][541], function(btn, text){	                		
				if (btn == 'yes'){	
					var p = 0;
					for (i = 0; i < records.length; i++) {
						var rec = records[i];
						var userCode = rec.get('userCode');    	                			    	                		
						var driver = drivers[0].get('userCode') 
						{									
							if (rec.get('confirmedCount') > 0 && rec.get('wareHouseID') && rec.get('availCount') >= rec.get('confirmedCount')) {
								var v = 's'+userCode+',s'+rec.get('customerCode')+',s'+rec.get('productCode')+',i'+rec.get('confirmedCount')+',i'+rec.get('wareHouseID')+',f'+rec.get('price')+',s'+driver;
								me.store_action.load({params:{xml:_donate('update', 'WRITER', 'Orders', 'userCode,customerCode,productCode,confirmedCount,wareHouseID,price,driver', v, ' id='+rec.get('id'))}});
								p = 1;
							} else
							if (rec.get('wareHouseID') && rec.get('availCount') >= rec.get('requestCount')) {
								var v = 's'+userCode+',s'+rec.get('customerCode')+',s'+rec.get('productCode')+',i'+rec.get('requestCount')+',i'+rec.get('wareHouseID')+',f'+rec.get('price')+',s'+driver;
								me.store_action.load({params:{xml:_donate('update', 'WRITER', 'Orders', 'userCode,customerCode,productCode,confirmedCount,wareHouseID,price,driver', v, ' id='+rec.get('id'))}});
								p = 1;
							}
						}
					}

					if (p == 1) {
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
							me.loadStore();	 
							me.loadStore1();
							me.cstore.load({params:{xml:_donate('_order_customer_list', 'SELECT', ' ', ' ', ' ', me.users.getValue())}});
						});
					}
					else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
				} else {
		
				}
			});
		} else
			Ext.MessageBox.alert('Error','Сонгогдоогүй байна', null);
	}
});

Ext.define('OSS.CompleteOrderGridWindowPre', {
    extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],

    id:'complete-order-grid-win-pre',
	width: 700,
	height: 580,

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][279];         
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();    	
        var win = desktop.getWindow('complete-order-grid-win-pre');        
        if(!win){                	
        	this.createGrid();
            win = desktop.createWindow({
                id: 'complete-order-grid-win-pre',
                title: this.title,
                width:this.width,
                height:this.height,
                iconCls: 'icon-grid',
                animCollapse:false,
                border: true,                
                constrainHeader:true,
                layout: 'border',
                items: [{
                    region: 'center',
                    layout: 'border',
                    border: false,
                    items:[this.grid,this.grid2]
                }],
                dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },  
    
    loadStore: function() {    	
    	var me = this;    	    	    	
    	    	    	    	
    	me.store.load({params:{xml:_donate('_user_order_complete1', 'SELECT', 'Orders', ' ', ' ', me.users.getValue())},
    			callback:function(){
    				me.grid.getView().getSelectionModel().selectAll();
    	}});    	
    },
    
    createStore : function() {
    	var me = this;    	
    	me.model = me.generateModel('Complete_Order', 'complete_order');		    				    	 			
    	me.store_action = me.model['writeStore'];
    	me.store = me.model['readStore'];    	
    	me.columns = me.model['columns'];    	    	
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();    	    	

    	me.cstore = Ext.create('Ext.data.JsonStore', {
    		fields: [        
    		    {name: 'customerCode', type: 'string'},
    		    {name: 'amount', type: 'int'},
    		    {name: 'ticketID', type: 'int'},    		    
    		    {name: 'driver', type: 'int'},
    		    {name: 'flag', type: 'int'}
    	    ],	        
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
    		 
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{			
		    ftype: 'summary'
		});     	
    	    	      	    	    	
    	me.grid = Ext.create('Ext.grid.GridPanel', {    		
    		xtype: 'grid',
    		border: false,
    		columnLines: true,
    		store: me.store,    
			loadMask: true,
    		region: 'center',
    		features: [me.summary],
    		selModel: Ext.create('Ext.selection.CheckboxModel', {
		        listeners: {
		            selectionchange: function(sm, selections) {
		                
		            }
		        }
		    }),		    
    		columns: this.createHeaders(me.columns)    		
    	});
    	
    	//me.store1.load({params:{xml:_donate('_cars_space', 'SELECT', ' ', ' ', ' ', ' ')}});
    },
    
    createToolbar: function() {
    	var me = this;
    	me.users = me.generateRemoteCombo('_remote_complete_order_user_names', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310]);        	
    	
    	me.users.on('change', function(e) {
    		if (me.users.getValue() != '') {    			    		    			
    			me.loadStore();
    		}
    	});
    	
    	return [{
            xtype: 'toolbar',            
            items: [me.users, '-',         
            {
            	text: Ext.sfa.translate_arrays[langid][427],
            	disabled: hidden_values['order_complete_accept_edit'],
                iconCls: 'icon-apply',
                handler: function() {
                	var records = me.grid.getView().getSelectionModel().getSelection();

                	if (records.length > 0) {
	                	Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][549], function(btn, text){	                		
                			if (btn == 'yes'){                		
                				Ext.getBody().mask('Ачилт хийж байна ...', 'x-mask-loading', false);
                				var userCode = me.users.getValue();                				
                				var p = 0;                				                				
            					me.store_action.load({params:{xml:_donate('_action_order_complete1', 'SELECT', ' ', ' ', ' ', me.users.getValue())},
            								callback: function(data) {     
												me.users.setValue('');
												me.users.store.load();
												me.loadStore();
            									Ext.getBody().unmask();            									
            								}});
            					            					
                			} else {
                	
                			}
                		});	                	
                	} else {
                		
                	}               	                	
                }
            },            
            {
            	text: 'Буцаах',//Ext.sfa.translate_arrays[langid][366],
            	disabled: hidden_values['order_complete_accept_edit'],
                iconCls: 'icon-delete',
                handler: function() {
                	var records = me.grid.getView().getSelectionModel().getSelection();                	
                	
                	if (records.length > 0) {
	                	Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], 'Буцаалт хийхүү !', function(btn, text){	                		
                			if (btn == 'yes'){
                				var userCode = me.users.getValue();                				
                				var p = 0;
                				for (i = 0; i < records.length; i++) {                					                					                					                					
                					me.store_action.load({
            							 params:{xml:_donate('action_back_pre_storage', 'WRITER', 'Storage', ' ', ' ', records[i].data['wareHouseID']+','+records[i].data['customerCode']+','+me.users.getValue()+','+records[i].data['productCode']+','+records[i].data['confirmedCount'])},
            						 	 callback: function() {
            						 		 p = 1;
            						 	 }
                					});
                					p = 1;
                				}

                				if (p == 1) {
        	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
        	                			me.loadStore();	    	                	
        	                		});
        	                	}
        	                	else
        	                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
                				
                			} else {
                	
                			}
                		});	                	
                	}
                }
			},
			'-',	 
            {
            	text: Ext.sfa.translate_arrays[langid][305],
                iconCls: 'help',
                handler: function() {
                	showHelpWindow('order_complete');
                }	                
            }]
        }];
    }
});

Ext.define('OSS.UserStatWindow', {
    extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],

    id:'user-stat-window',

    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][604];         
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();    	
        var win = desktop.getWindow('user-stat-window');        
        if(!win){                	
        	this.createGrid();
            win = desktop.createWindow({
                id: 'user-stat-window',
                title: this.title,
                width:680,
                height:580,
                iconCls: 'icon-grid',
                animCollapse:false,
                border: true,                
                constrainHeader:true,
                layout: {
					type: 'vbox',
					align: 'stretch'
				},
                items: [                        
					this.mainInfo,		        
					this.saleGrid1,	        		        		        
					this.saleGrid	        	
                ],
                dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },  
    
    loadStore: function() {    	
    	var me = this;    	    	    	
    	    	    	    	
    	me.mainInfoStore.load({params:{xml:_donate('_info_user_sale', 'SELECT', 'info_user_sale', ' ', ' ', userCode)}});
		me.productReport_ds1.load({params:{xml:_donate('_user_sale_by_date', 'SELECT', 'Sales', ' ', 's,i,i,i,i,i', userCode)}});
    },
    
    createStore : function() {
    	var me = this;    	
    	me.mainInfoStore = Ext.create('Ext.data.JsonStore', {
			model: 'user_stat_model',     	        
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
		
		me.productReport_ds = Ext.create('Ext.data.JsonStore', {
			model: 'user_stat_model_1',	        
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

		me.productReport_ds1 = Ext.create('Ext.data.JsonStore', {
			model: 'user_stat_model_2',	        
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
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();    	    	
			 	      		
		me.mainInfo = Ext.create('Ext.grid.GridPanel', {	               
			store: me.mainInfoStore,	        
			columnLines: true,			
			border: false,		
			flex: 0.36,
			columns: [{			
				text: Ext.sfa.translate_arrays[langid][328],			
				dataIndex: 'data',
				width: 150		   			   			   
			},{
				text: Ext.sfa.translate_arrays[langid][329], 
				dataIndex: 'count',	
				renderer: renderIsNumber,
				flex: 1
			},{
				text: Ext.sfa.translate_arrays[langid][330], 
				dataIndex: 'detail', 		   				   		
				width: 160	   		   
			}]	
		});									
	
		me.productReport_columns = [		      	       
			 {name: 'productCode', type: 'string', title: Ext.sfa.translate_arrays[langid][345], filterable: true, flex: 1, renderer: Ext.sfa.renderer_arrays['renderProductCode']},
			 {name: 'rquantity', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][346], width:75, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},
			 {name: 'quantity', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][347], width:75, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},             
			 {name: 'ramount', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][478], width:90, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'amount', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][479], width:90, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'total', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][314], width:90, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']}];
						  				
	
		me.saleGrid = Ext.create('Ext.grid.GridPanel', {			
			xtype: 'gridpanel',
			border: false,
			flex: 0.32,
			style: 'border-top: solid #ccc 1px',
			split: true,
			features: [{			
				ftype: 'summary'					       
			}],
			store: me.productReport_ds,								
			columnLines: true,
			columns: me.createHeaders(me.productReport_columns)
		});
		
		me.productReport_columns1 = [		      	       
			 {name: 'day', type: 'string', title: Ext.sfa.translate_arrays[langid][341], filterable: true, flex: 1},
			 {name: 'entered', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][342], width:75, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},
			 {name: 'saled', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][343], width:75, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},             
			 {name: 'ramount', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][312], width:100, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'amount', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][313], width:100, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'total', type: 'int', summaryType: 'sum', title: Ext.sfa.translate_arrays[langid][314], width:100, align : 'right', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']}];
	

			
		me.saleGrid1 = Ext.create('Ext.grid.GridPanel', {			
			xtype: 'gridpanel',
			border: false,
			split: true,
			style: 'border-top: solid #ccc 1px',
			flex: 0.33,
			features: [{			
				ftype: 'summary'					       
			}],
			store: me.productReport_ds1,								
			columnLines: true,
			columns: me.createHeaders(me.productReport_columns1),
			listeners: {
				selectionchange: function(model, records) {
					var json, name, i, l, items, series;
					if (records[0]) {
						rec = records[0];	                    	                    
						me.productReport_ds.load({params:{xml:_donate('user_sale_product_detail', 'SELECT', 'Sales', 'productCode,sum(quantity) as quantity,sum(case type when 1 then 1 else 0 end *quantity) as rquantity,sum(amount)-sum(case type when 1 then 1 else 0 end *amount) as amount, sum(case type when 1 then 1 else 0 end *amount) as ramount,sum(amount) as total', 's,i,i,i,i', " WHERE (type!2 or type@=5) and userCode='"+me.users.getValue()+"' and convert(varchar, _dateStamp, 111)='"+rec.data['day']+"' GROUP by productCode ORDER by sum(amount) desc")}});
					}
				}				
			}
		});
    },
    
    createToolbar: function() {
    	var me = this;
    	me.users = generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);
	
		me.users.on('change', function() {
			me.loadStore();
		}, me.users);
		
		me.users.setValue(userCode);
		
    	
    	return [{
            xtype: 'toolbar',            
            items: [me.users, '-',         
            {
				iconCls: 'refresh',	
				hidden: false,
				text: Ext.sfa.translate_arrays[langid][326],					
				handler: function() {
					me.mainInfoStore.load({params:{xml:_donate('_info_user_sale', 'SELECT', 'info_user_sale', ' ', ' ', me.users.getValue())}});
		      		me.productReport_ds1.load({params:{xml:_donate('_user_sale_by_date', 'SELECT', 'Sales', ' ', 's,i,i,i,i,i', me.users.getValue())}});
				}
			},'-', {
				iconCls: 'maininfo',	
				hidden: false,
				text: Ext.sfa.translate_arrays[langid][552],					
				handler: function() {
					ossApp.callModule('user-plan-complete-win');
				}
			},{
				iconCls: 'lease',	
				hidden: false,
				text: Ext.sfa.translate_arrays[langid][282],					
				handler: function() {
					userCode = users.getValue();
					var nodes = ['Lease_Main', '_lease_main', Ext.sfa.translate_arrays[langid][282], 'ltype', 820, 480, 'lease-module'];
            		ossApp.createModule(nodes, 'Lease_Main', userCode, 3);
				}
			},
			'-',	 
            {
            	text: Ext.sfa.translate_arrays[langid][305],
                iconCls: 'help',
                handler: function() {
                	showHelpWindow('order_complete');
                }	                
            }]
        }];
    }
});

Ext.define('OSS.RouteChanger', {
    extend: 'OSS.ExtendModule',
    id:'route-changer-data',
    
    init : function() {
    	this.title = Ext.sfa.translate_arrays[langid][615];        
    },

    createWindow : function(){
    	var me = this;
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('route-changer-data');        
        if(!win){        	        	
        	this.createGrid();
            win = desktop.createWindow({
                id: 'route-changer-data',
                title:this.title,
                width:1000,
                height:600,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},				
                border: true,
                items: [{        			
        			border: false,
        			layout: 'border',
					region: 'north',
					height: 300,
					split: true,
        			items: [me.gridA,me.gridB]
	        	}, me.gridC],
	        	dockedItems: me.createToolbar()
            });
        }
        this.loadStore();        
        win.show();
        return win;
    },
    
    loadStore: function () {    
    	var me = this;        	
    	me.store.load({params:{xml:_donate('_user_customer_list', 'SELECT', 'user_customer_list', ' ', ' ', me.users.getValue())}});
		me.store1.load({params:{xml:_donate('_user_customer_list_notactive', 'SELECT', 'user_customer_list_notactive', ' ', ' ',  me.users.getValue())}});
    },
    
    createStore : function() {
    	var me = this;

    	me.customer_columns = [{name: 'code', type: 'string', title: Ext.sfa.translate_arrays[langid][369], width: 50},
		                       {name: 'name', type: 'string', title: Ext.sfa.translate_arrays[langid][373], width:110, summaryType:'count'},
		                       {name: 'location', type: 'string', title: Ext.sfa.translate_arrays[langid][372], width:120},
		                       {name: 'subid', type: 'string', title: Ext.sfa.translate_arrays[langid][332], width:180, renderer: Ext.sfa.renderer_arrays['renderRouteID']}];
    	
    	Ext.regModel('customer_columns', {
	        fields: me.customer_columns
	    });
    	
    	me.store = Ext.create('Ext.data.JsonStore', {
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
		
		me.model = [];
		me.model['columns'] = me.customer_columns;
    	me.name = '_user_customer_list';
		me.modelName = '_user_customer_list';

    	me.store1 = Ext.create('Ext.data.JsonStore', {
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
    	
    	me.store2 = Ext.create('Ext.data.JsonStore', {
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
    	
    	me.store_action = Ext.create('Ext.data.JsonStore', {                        	        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },                
	
    createGrid : function() {
    	var me = this;
    	me.createStore();    	    	
    	me.group1 = 't_group1';
    	me.group2 = 't_group2';
    	me.group3 = 't_group3';
    	me.activeCustoms = [];
    	me.noActiveCustoms = [];
    	me.moveCustoms = [];
        
    	me.gridA = Ext.create('Ext.ux.LiveSearchGridPanel', {
			region: 'west',
			xtype: 'gridpanel',
			border: false,
			flex: 0.5,			
			title: Ext.sfa.translate_arrays[langid][321],
			store: me.store,		
			stripeRows: true,
			columnLines: true,
			multiSelect: true,
			split: true,
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group1,
                    dropGroup: me.group2
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {                    	
                    	me.activeCustoms.push(data.records[0].data['code']);
                    	me.noActiveCustoms.pop(data.records[0].data['code']);                    	
                    }
                }
            },
			features:[{	    	      
	    	   	  ftype: 'summary'
	    	}],
			columns: me.createHeadersWithNumbers(me.customer_columns)			
		});	
    	    	
    	me.gridB = Ext.create('Ext.ux.LiveSearchGridPanel', {
			region: 'center',
			xtype: 'gridpanel',
			border: false,
			title: Ext.sfa.translate_arrays[langid][377],
			flex: 0.5,
			stripeRows: true,
			split: true,
			store: me.store1,
			multiSelect: true,
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group2,
                    dropGroup: me.group1
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {
                    	me.noActiveCustoms.push(data.records[0].data['code']);
                    	me.activeCustoms.pop(data.records[0].data['code']);
                    }
                }
            },
			features:[{	    	      
	    	   	  ftype: 'summary'
	    	}],
			columnLines: true,
			columns: me.createHeadersWithNumbers(me.customer_columns)			
		});  
    	
    	me.route = me.generateLocalCombo('local_route_combo', 'route_list', 'routeID', 'routeName', Ext.sfa.translate_arrays[langid][411], 280);
    	me.gridC = Ext.create('Ext.ux.LiveSearchGridPanel', {
			region: 'center',
			xtype: 'gridpanel',
			border: false,
			title: 'Зөөх чиглэл',
			flex: 0.5,
			stripeRows: true,
			split: true,
			store: me.store2,
			multiSelect: true,
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group3,
                    dropGroup: me.group1
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {                    	
                    	me.moveCustoms.push(data.records[0].data['code']);
                    }
                }
            },
			features:[{	    	      
	    	   	  ftype: 'summary'
	    	}],
			columnLines: true,
			columns: me.createHeadersWithNumbers(me.customer_columns),
			dockedItems:[
				{
				    xtype: 'toolbar',
				    items: [me.route, {
				        text: Ext.sfa.translate_arrays[langid][326],
				        iconCls: 'refresh',
				        handler: function(){     
				        	me.moveCustoms = [];
				        	me.store2.load({params:{xml:_donate('_user_route_customer_list', 'SELECT', 'user_route_customer_list', ' ', ' ',  me.route.getValue())}});
				        }
				    },{
				    	text: Ext.sfa.translate_arrays[langid][491],
				    	iconCls: 'icon-apply',
				    	handler: function() {
				    		Ext.Msg.confirm('Та '+me.moveCustoms.length+' цэгийн чиглэл солих солих гэж байна !', message, function(btn, text){	                		
		            			if (btn == 'yes'){      
						    		for (i = 0; i < me.moveCustoms.length; i++) {
						    			//alert(me.moveCustoms[i]+' '+me.route.getValue());
						    			me.store_action.load({params:{xml:_donate('_update_customer_routeid', 'SELECT', ' ', ' ', ' ', me.moveCustoms[i] +','+me.route.getValue())}});
						    		}
		            			}
				    		});
				    	}
				    }]
				}
			]
		}); 
    },
    
    createToolbar : function() {
    	var me = this;    	    	    	
    	me.users = generateLocalCombo('local_user_combo', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], 150);

		me.buttons = [{
            xtype: 'toolbar',
            items: [me.users, {
                text: Ext.sfa.translate_arrays[langid][326],
                iconCls: 'refresh',
                handler: function(){                                	
                	me.loadStore();
                }
            },{
		    	text: Ext.sfa.translate_arrays[langid][491],
		    	iconCls: 'icon-apply',
		    	handler: function() {
		    		Ext.Msg.confirm('Та идэвхтэй,идэвхгүй үйлдлийг хийх гэж байна !', message, function(btn, text) {
			    		for (i = 0; i < me.activeCustoms.length; i++) {
			    		//	alert('active'+me.activeCustoms[i]);
			    			me.store_action.load({params:{xml:_donate('_update_customer_status', 'SELECT', ' ', ' ', ' ', me.activeCustoms[i] +',0')}});
			    		}
			    		console.log(me.noActiveCustoms);
			    		for (i = 0; i < me.noActiveCustoms.length; i++) {
			    			//alert('noactive'+me.noActiveCustoms[i]);
			    			me.store_action.load({params:{xml:_donate('_update_customer_status', 'SELECT', ' ', ' ', ' ', me.noActiveCustoms[i] +',1')}});
			    		}
		    		});
		    	}
		    }]
        }];

    	me.addStandardButtons();

		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});

Ext.define('OSS.ReportModulePanel', {
    extend: 'OSS.ControlPanel',
    id:'report-module-win',
    width: 550,
	height: 250, 
	init: function() {
		this.title = Ext.sfa.translate_arrays[langid][524]; 
	},

    createStore: function() {
    	var me = this;    
        me.store = Ext.create('Ext.data.ArrayStore', {
        	fields: [
                     {name: 'module'},
                     {name: 'name'},      
                     {name: 'title'},
                     {name: 'id'},
                     {name: 'width', type: 'int'},
                     {name: 'height', type: 'int'},
                     {name: 'icon'}
            ],
            data: [                 		 
				 ['report-sales-data-win', 'module', Ext.sfa.translate_arrays[langid][299], 'id', 700, 500, 'report-module'],
  				 ['Filter_Customer', '_filter_by_customer', 'Харилцагчдын нэгдсэн тайлан', 'id', 900, 600, 'report-module'],
  				 ['Top_Customer', '_report_by_customer', Ext.sfa.translate_arrays[langid][624], 'customerCode', 950, 600, 'customer-top-module']
			]
        });
    }    
});

Ext.define('OSS.SaleGraphWindow', {
    extend: 'OSS.SaleGridWindow',
    id:'sale-graph-win',        
    
    init : function(){
    	this.title = Ext.sfa.translate_arrays[langid][605];
    	this.width = 900;
    	this.height = 600;
    	
    	this.currentDate = firstDay;
    	this.nextDate = nextDate;
    },            
    
    createWindow : function(){
        var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);
        
        if(!win){
        	this.createChart();        	
            win = desktop.createWindow({
                id: this.id,
                title: this.title,
                width: this.width,
                height: this.height,
                iconCls: 'refresh',
                animCollapse:false,
                border: true,
                frame: false,
                autoscroll : true,
                constrainHeader:true,
                layout: 'fit',
                items: [
                    this.panel
                ]                
            });            
        }
        win.show();
        
        return win;
    },
    
    createChart: function() {    	
    	var me = this;
	    me.panel = Ext.create('widget.panel', {
	    	autoScroll: true,
	    	applyTo: 'panel',
	    	border: false,
	    	split: true,	    	
	    	layout: {
	            type: 'table',
	            columns: 2
	        }, 
	        layoutConfig: {columns:2},
	        defaults: {
	            frame:true,	            
	            width:600,
	            height: 500,
	            autoScroll: true,
	            style: 'margin: 10px 0 0 10px'
	        },
	        items:[{
		        	buttons: [{
		                text: 'Нэмэх',		               
		                handler: function() {
		                	me.createWizardChart();
		                }
		            }]	                
	            }
	        ]
	    });
	    
    },
    
    stores: [],    
    charts: [],
    index : 0,
    
    createCustomChartPoint: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model_plan',          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            animate: false,
            store: me.stores[id],
            insetPadding: 10,
            width: 700,
            height: 400,           
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['data1', 'data2'],
                title: false,
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '8.5px Arial',
                    degree: 135
                }
            }, {
                type: 'Category',
                position: 'left',
                fields: ['name'],
                title: false,
                grid: true,
                label: {
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render]                            	
                }
            }],
            series: [{
                type: 'bar',
                axis: 'left',
                xField: 'name',
	            label: {
	            	display: 'insideEnd',
                    contrast: true,                    
                    renderer: Ext.util.Format.numberRenderer('0'),
                    'text-anchor': 'middle',
                    font: '8.5px Arial'
	            },
                yField: ['data1','data2']                
            }]
        }); 
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,    		
    		id : 'b'+id,
    		items: me.charts[id],
    		layout: 'hbox',
    		autoScroll: true,
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },
    
    createCustomChartPlan: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model_plan',          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',
            animate: false,
            store: me.stores[id],
            insetPadding: 10,
            width: 700,
            height: 600,
            legend: {
            	labelFont : '8.5px Arial',
            	itemSpacing : 6
            },
            gradients: [{
              angle: 90,
              id: 'bar-gradient',
              stops: {
                  0: {
                      color: '#99BBE8'
                  },
                  70: {
                      color: '#77AECE'
                  },
                  100: {
                      color: '#77AECE'
                  }
              }
            }],
            axes: [{
                type: 'Numeric',
                position: 'left',
                fields: ['data1'],
                title: false,
                grid: true,
                label: {
                    renderer: Ext.util.Format.numberRenderer('0,0'),
                    font: '8.5px Arial',
                    degree: 135
                }
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: false,
                grid: true,
                label: {
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render],            
                	rotate: {
                		degrees: 90
                	}
                }
            }],
            series: [{
                type: 'column',
                axis: 'left',
                xField: 'name',
                yField: 'data2',
                style: {
                    fill: 'url(#bar-gradient)',
                    'stroke-width': 3
                },                
                renderer: function(sprite, record, attr, index, store) {
                    var fieldValue = Math.random() * 20 + 10;
                    var value = index+1;
                    var color = ['rgb(213, 70, 121)', 
                                 'rgb(44, 153, 201)', 
                                 'rgb(146, 6, 157)', 
                                 'rgb(49, 149, 0)',
                                 'rgb(149, 109, 0)',
                                 'rgb(49, 49, 149)',
                                 'rgb(9, 80, 180)',
                                 'rgb(199, 0, 180)',
                                 'rgb(25, 0, 200)',
                                 'rgb(200, 10, 0)',
                                 'rgb(239, 0, 110)',
                                 'rgb(34, 220, 10)',
                                 'rgb(78, 120, 120)',
                                 'rgb(9, 80, 180)',
                                 'rgb(249, 153, 0)'][value];
                    return Ext.apply(attr, {
                        fill: color
                    });
                },
                markerConfig: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0,
                    fill: '#38B8BF',
                    stroke: '#38B8BF'
                }
            }, {
                type: 'line',
                axis: 'left',
                xField: 'name',
                yField: 'data1',
                tips: {
                    trackMouse: true,
                    width: 300,
                    height: 32,
                    renderer: function(storeItem, item) { 
                        this.setTitle('Төлөвлөгөө : '+renderMoneyValue(parseFloat(storeItem.get('data2'))) + ' , Гүйцэтгэл : ' + Ext.sfa.renderer_arrays['renderTPrecent'](storeItem.get('data1')*100/storeItem.get('data2')));
                    }
                },
                style: {
                    fill: '#18428E',
                    stroke: '#18428E',
                    'stroke-width': 3
                },
                markerConfig: {
                    type: 'circle',
                    size: 4,
                    radius: 4,
                    'stroke-width': 0,
                    fill: '#18428E',
                    stroke: '#18428E'
                }
            }]
        }); 
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,    		
    		id : 'b'+id,
    		items: me.charts[id],
    		layout: 'hbox',
    		autoScroll: true,
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },
    
    createCustomChartArea: function(query, fields, render, where, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	var fd = [], titles = [];
    	fd[0] = {name: 'name', type: 'string'};
    	
    	for (i = 0; i < fields.length; i++) { 
    		fd[i+1] = {name: fields[i], type: 'int'};
    		
    		titles[i] = Ext.sfa.renderer_arrays[render](fields[i].substring(4, 8));
    	}
    	
    	Ext.regModel('graph_model'+id, {        
    		idProperty: 'name',
    	    fields: fd
    	});
    	
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model'+id,          
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
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {          
            xtype: 'chart',            
            style: 'background:#fff',
            animate: true,
            store: me.stores[id],
            width: 800,
            height: 600,
            legend: {
                position: 'right',
                labelFont : '8.5px Arial',
                itemSpacing : 6                
            },
            axes: [{
                type: 'Numeric',
                grid: true,
                position: 'left',
                fields: fields,
                title: 'Дүн',
                label: {
	                font: '8.5px Arial',
					color: '#fffffff',					
					renderer: Ext.util.Format.numberRenderer('00,00,000')						
	            },		        
                grid: {
                    odd: {
                        opacity: 1,
                        fill: '#ddd',
                        stroke: '#bbb',
                        'stroke-width': 1
                    }
                },
                minimum: 0,
                adjustMinimumByMajorUnit: 0
            }, {
                type: 'Category',
                position: 'bottom',
                fields: ['name'],
                title: 'Хугацааны интервал',
                grid: true,
                label: {
                	font: '8.5px Arial',
                    rotate: {
                        degrees: 315
                    }
                }
            }],
            series: [{
                type: 'area',
                highlight: false,
                showInLegend: true,
                axis: 'left',
                xField: 'name',
                yField: fields,
                title: titles,
                
                style: {
                    opacity: 0.93,
                    font: '8.5px Arial'
                }                               
            }]
        });
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,
    		layout: 'hbox',
    		autoScroll: true,
    		id : 'b'+id,
    		items: me.charts[id],    		
    		width: 800,
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
    			id: id,    			
                text: 'Устгах',		               
                handler: function(b, e) {                               	
                	me.panel.items.each(function(c){
                		if (c.id == 'b'+b.id)
                			me.panel.remove(c);
                	});                	
                }
            }]
    	});
    	me.panel.doLayout();
    },
    
    createCustomChart: function(type, query, where, render, title) {
    	var me = this;
    	var id = 'chart'+(me.index);
    	me.index++;
    	var wh = where.split(',');
    	me.stores[id] = Ext.create('Ext.data.Store', {
  	        model: 'graph_model',          
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
    	
    	
    	me.charts[id] = Ext.create('Ext.chart.Chart', {
            xtype: 'chart',            
            animate: true,
            store: me.stores[id],
            shadow: false,
            height: 400,
            width: 560,            
            insetPadding: 10,
            theme: 'Base:gradients',
            axes: [{
                type: 'Numeric',
                position: 'bottom',
                fields: ['data'],
                label: {
                   renderer: wh[0]=='count'?Ext.util.Format.numberRenderer('0,0'):renderMoneyValue,
                   font: '8.5px Arial',
                   rotate: {
                   	degrees: 305
                   }
                },
                title: 'Дүн',
                minimum: 0
            }, {
                type: 'Category',
                position: 'left',
                fields: ['name'],                
                label: {                    
                    font: '8.5px Arial',
                    renderer: Ext.sfa.renderer_arrays[render]
                }
            }],
            series: [{
            	type: 'bar',
                axis: 'bottom',                                                                                
                label: {
                    field: 'data',
                    display: 'insideEnd',
                    contrast: true,                    
                    renderer: wh[0]=='count'?Ext.util.Format.numberRenderer('0,0'):renderMoneyValue,
                    'text-anchor': 'middle',
                    font: '8.5px Arial'
                },
                xField: 'name',
                yField: ['data'],
                renderer: function(sprite, record, attr, index, store) {
                    var fieldValue = Math.random() * 20 + 10;
                    var value = (record.get('data') >> 0) % 5;
                    var color = ['rgb(213, 70, 121)', 
                                 'rgb(44, 153, 201)', 
                                 'rgb(146, 6, 157)', 
                                 'rgb(49, 149, 0)', 
                                 'rgb(249, 153, 0)'][value];
                    return Ext.apply(attr, {
                        fill: color
                    });
                }
            }]
        });
    	
    	me.id = id;
    	me.stores[id].load({params:{xml:_donate(query, 'SELECT', ' ', ' ', ' ', where)}});
    	me.panel.insert(0, {
    		title: title,
    		layout: 'hbox',
    		autoScroll: true,
    		id : 'b'+id,
    		items: me.charts[id],    		
    		buttons: [{
                text: 'Хадгалах',
                handler: function() {
                    Ext.MessageBox.confirm('Зураг болгох', 'Хадгалах уу?', function(choice){
                        if(choice == 'yes'){
                            me.charts[me.id].save({
                                type: 'image/png'
                            });
                        }
                    });
                }
            },{
	    			id: id,    			
	                text: 'Устгах',		               
	                handler: function(b, e) {                               	
	                	me.panel.items.each(function(c){
	                		if (c.id == 'b'+b.id)
	                			me.panel.remove(c)
	                	});                	
	                }
            }]
    	});
    	me.panel.doLayout();
    },

    createProductForm: function() {
    	var me = this;
    	var brands = this.generateRemoteComboWithFilter('_remote_brand_names', 'brand_list', 'brand', 'brand', Ext.sfa.translate_arrays[langid][616], mode);    	
    	brands.on('change', function(e) {
    		me.fillByComboValueToGrid(brands, _store, productGrid, 'product_list', 'brand');
    	});
    	
    	var sm = Ext.create('Ext.selection.CheckboxModel');
    	
    		        		        
    	var _store = Ext.create('Ext.data.Store', {
            model: 'code_model'
        });
    	
    	var productGrid = Ext.create('Ext.grid.GridPanel', {			    			
    		xtype: 'gridpanel',
    		border: true,	    			
    		columnLines: true,
    		store: _store,    		
            height: 180,
            width: 270,
            margins: '0 0 0 5',
    		selModel: sm,
    		columns: [
    			  {
    				  text: Ext.sfa.translate_arrays[langid][477],
    				  dataIndex: 'code',	    					  
    				  flex: 1,
    				  renderer: Ext.sfa.renderer_arrays['renderProductCode']
    		      }
    		]			     			
    	});
    	
    	var report_view = me.generateLocalComboWithField('report_view', 'report_view', 'view', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Хэлбэр');
    	report_view.setValue('count');
    	
    	var graph = me.generateLocalComboWithField('local_graph_combo', 'graph', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Төрөл');
    	graph.setValue(0);
    	
    	
    	var interval = me.generateLocalComboWithField('local_interval_combo', 'interval', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100, 'Интервал');
    	interval.setValue(0);
    	
    	interval.on('change', function(e) {
    		if (interval.getValue() == 0) {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').hide();
    		} else 
    		if (interval.getValue() == 1) {
    			form.getForm().findField('season').show();
    			form.getForm().findField('month').hide();
    		} else {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').show();
    		}
    	});
    	
    	function getTitle() {
    		var title = '';
    		if (interval.getValue() == 0)
    			title=form.getForm().findField('year').getValue()+' он, '+brands.getValue()+', '+graph.getRawValue();
    		if (interval.getValue() == 1)
    			title=form.getForm().findField('season').getValue()+'-р улирал, '+brands.getValue()+', '+graph.getRawValue();
    		if (interval.getValue() == 2)
    			title=form.getForm().findField('month').getValue()+'-р сар, '+brands.getValue()+', '+graph.getRawValue();
    		
    		return title;
    		
    	}
    	var form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bodyPadding: 6,
            bodyBorder: 0,            

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },

            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Хугацааны сонголт',
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 60
                },

                items: [graph, report_view, interval, {
                    xtype: 'numberfield',
                    fieldLabel: 'Жил',
                    name: 'year',
                    value: 2012,
                    minValue: 2012,
                    maxValue: 2030,
                    width: 80,
                    margins: '0 0 0 5'
                },{
                    xtype: 'numberfield',
                    fieldLabel: 'Улирал',
                    name: 'season',
                    minValue: 1,
                    maxValue: 4,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1
                },{
                    xtype: 'numberfield',                    
                    fieldLabel: 'Сар',
                    name: 'month',
                	minValue: 1,
                    maxValue: 12,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1	
                }]
            },{
            	xtype: 'fieldcontainer',
                fieldLabel: Ext.sfa.translate_arrays[langid][477],
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',	                    
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top'
                },
                items: [brands, productGrid]
            }],
            buttons: [{
                text: Ext.sfa.translate_arrays[langid][417],
                handler: function() {
                	var fields = [];
                	var data = '';
                	var records = productGrid.getSelectionModel().getSelection();
                	var i = 0;
                	Ext.each(records, function(record){
                		fields[i] = 'data'+record.get('code');
                		data += record.get('code')+':';
                		i++;
                    });
                	
                	if (data != '') {
	                	var where = report_view.getValue()+','+interval.getValue()+','+form.getForm().findField('year').getValue()+','+form.getForm().findField('season').getValue()+','+form.getForm().findField('month').getValue()+','+data;
	                	if (graph.getValue() == 2)
	                		me.createCustomChartPlan('_graphic_product_plan', fields, 'renderProductCode', where, getTitle());
	                	else
	                	if (graph.getValue() == 1)
	                		me.createCustomChartArea('_graphic_product_interval', fields, 'renderProductCode', where, getTitle());
	                	else                		                		
	                		me.createCustomChart('pie', '_graphic_product_total', where,  'renderProductCode', getTitle());                			                	
                	} else {
                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Бараанууд сонгон уу !', null);
                	}
                }
            }]
    	 });
    	
    	return form;
    },
    
    createUserForm: function() {
    	var me = this;    	
    	
    	var sm = Ext.create('Ext.selection.CheckboxModel');
    	    		        		        
    	var _store = Ext.create('Ext.data.Store', {
            model: 'code_model'
        });
    	
    	var userGrid = Ext.create('Ext.grid.GridPanel', {			    			
    		xtype: 'gridpanel',
    		border: true,	    			
    		columnLines: true,
    		store: _store,    		
            height: 180,
            width: 270,
            margins: '0 0 0 5',
    		selModel: sm,
    		columns: [
    			  {
    				  text: Ext.sfa.translate_arrays[langid][310],
    				  dataIndex: 'code',	    					  
    				  flex: 1,
    				  renderer: Ext.sfa.renderer_arrays['renderUserCode']
    		      }
    		]			     			
    	});
    	
    	me.fillByValueToGrid(mode, _store, userGrid, 'user_list', 'section');
    	
    	var report_view = me.generateLocalComboWithField('report_view', 'report_view', 'view', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Хэлбэр');
    	report_view.setValue('count');
    	
    	
    	var graph = me.generateLocalComboWithField('local_graph_combo', 'graph', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 150, 'Төрөл');
    	graph.setValue(0);
    	
    	
    	var interval = me.generateLocalComboWithField('local_interval_combo', 'interval', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100, 'Интервал');
    	interval.setValue(0);
    	
    	interval.on('change', function(e) {
    		if (interval.getValue() == 0) {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').hide();
    		} else 
    		if (interval.getValue() == 1) {
    			form.getForm().findField('season').show();
    			form.getForm().findField('month').hide();
    		} else {
    			form.getForm().findField('season').hide();
    			form.getForm().findField('month').show();
    		}
    	});
    	
    	function getTitle() {
    		var title = '';
    		if (interval.getValue() == 0)
    			title='Борлуулагчаар :'+form.getForm().findField('year').getValue()+' он, '+graph.getRawValue();
    		if (interval.getValue() == 1)
    			title='Борлуулагчаар :'+form.getForm().findField('season').getValue()+'-р улирал, '+graph.getRawValue();
    		if (interval.getValue() == 2)
    			title='Борлуулагчаар :'+form.getForm().findField('month').getValue()+'-р сар, '+graph.getRawValue();
    		
    		return title;
    		
    	}
    	var form = Ext.widget('form', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            bodyPadding: 6,
            bodyBorder: 0,            

            fieldDefaults: {
                labelAlign: 'top',
                labelWidth: 80,
                labelStyle: 'font-weight:bold'
            },
            defaults: {
                margins: '0 0 10 0'
            },

            items: [{
                xtype: 'fieldcontainer',
                fieldLabel: 'Хугацааны сонголт',
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top',
                    labelWidth: 60
                },

                items: [graph, report_view, interval, {
                    xtype: 'numberfield',
                    fieldLabel: 'Жил',
                    name: 'year',
                    value: 2012,
                    minValue: 2012,
                    maxValue: 2030,
                    width: 80,
                    margins: '0 0 0 5'
                },{
                    xtype: 'numberfield',
                    fieldLabel: 'Улирал',
                    name: 'season',
                    minValue: 1,
                    maxValue: 4,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1
                },{
                    xtype: 'numberfield',                    
                    fieldLabel: 'Сар',
                    name: 'month',
                	minValue: 1,
                    maxValue: 12,
                    width: 80,
                    value: 1,
                    hidden: true,
                    margins: '0 0 0 5',
                    step: 1	
                }]
            },{
            	xtype: 'fieldcontainer',
                fieldLabel: Ext.sfa.translate_arrays[langid][310],
                labelStyle: 'font-weight:bold;padding:0',
                layout: 'hbox',	                    
                defaultType: 'textfield',

                fieldDefaults: {
                    labelAlign: 'top'
                },
                items: [userGrid]
            }],
            buttons: [{
                text: Ext.sfa.translate_arrays[langid][417],
                handler: function() {
                	var fields = [];
                	var data = '';
                	var records = userGrid.getSelectionModel().getSelection();
                	var i = 0;
                	Ext.each(records, function(record){
                		fields[i] = 'data'+record.get('code');
                		data += record.get('code')+':';
                		i++;
                    });
                	
                	if (data != '') {
	                	var where = report_view.getValue()+','+interval.getValue()+','+form.getForm().findField('year').getValue()+','+form.getForm().findField('season').getValue()+','+form.getForm().findField('month').getValue()+','+data;
	                	if (graph.getValue() == 3)
	                		me.createCustomChartPoint('_graphic_user_point', fields, 'renderUserCode', where, getTitle());
	                	else
	                	if (graph.getValue() == 2)
	                		me.createCustomChartPlan('_graphic_user_plan', fields, 'renderUserCode', where, getTitle());
	                	else
	                	if (graph.getValue() == 1)
	                		me.createCustomChartArea('_graphic_user_interval', fields, 'renderUserCode', where, getTitle());
	                	else                		                		
	                		me.createCustomChart('pie', '_graphic_user_total', where,  'renderUserCode', getTitle());                			                	
                	} else {
                		Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Бараанууд сонгон уу !', null);
                	}
                }
            }]
    	 });
    	
    	return form;
    },
    
    createWizardChart: function() {
    	 var me = this;      
	     win = Ext.create('widget.window', {
              title: 'Бараа бүтээгдэхүүнээр харах',
              closable: true,
              closeAction: 'hide',                            
              layout: 'fit',
              items: [{				    
				    xtype: 'tabpanel',
				    border: false,
				    items: [{
				        title: 'Бараа бүтээгдэхүүн',
				        items: [me.createProductForm()]
				    }, {
				        title: 'Борлуулагчаар',
				        items: [me.createUserForm()]
				    }]
				}
              ]
	      });
	      win.show();
    }   
});

Ext.define('OSS.SearchInfoWindow', {
    extend: 'OSS.ExtendModule',
    id:'search-info-win',        
	width: 980,
	height: 550,
	init: function() {
		this.title = Ext.sfa.translate_arrays[langid][2];
	},				
	
	createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('user-sale-info');        
        if(!win){        	        	
			this.createStore();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:this.width,
                height:this.height,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
				border: true,
                items: [this.createGrid()],
                dockedItems: this.createToolbar(),
            });
        }
        win.show();
        return win;               
    },  
	
	createStore: function() {
		var me = this;

		Ext.regModel('user_maininfo', {
			idProperty: 'data',
			fields: [			 
				{name: 'data', type: 'string'},         
				{name: 'attr', type: 'string'},
				{name: 'detail', type: 'string'}, 	         
			]
		});


		me.store = Ext.create('Ext.data.JsonStore', {
			model: 'user_maininfo',     	        
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


		me.columns1 = [		      	       
			 {name: 'productCode', type: 'string', title: Ext.sfa.translate_arrays[langid][345], filterable: true, width: 180, renderer: Ext.sfa.renderer_arrays['renderProductCode']},
			 {name: 'rquantity', type: 'int', title: Ext.sfa.translate_arrays[langid][346], width:80, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},
			 {name: 'quantity', type: 'int', title: Ext.sfa.translate_arrays[langid][347], width:80, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},             
			 {name: 'ramount', type: 'int', title: Ext.sfa.translate_arrays[langid][478], width:90, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'amount', type: 'int', title: Ext.sfa.translate_arrays[langid][479], width:90, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'total', type: 'int', title: Ext.sfa.translate_arrays[langid][314], width:90, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']}];
		
		Ext.regModel('user_saleinfo', {	        
			fields: me.columns1 
		});

		me.store1 = Ext.create('Ext.data.JsonStore', {
			model: 'user_saleinfo',	        
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
		

		me.columns2 = [		      	       
			 {name: 'day', type: 'string', title: Ext.sfa.translate_arrays[langid][341], filterable: true, width: 80},
			 {name: 'entered', type: 'int', title: Ext.sfa.translate_arrays[langid][342], width:80, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},
			 {name: 'saled', type: 'int', title: Ext.sfa.translate_arrays[langid][343], width:80, align : 'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber']},             
			 {name: 'ramount', type: 'int', title: Ext.sfa.translate_arrays[langid][312], width:100, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'amount', type: 'int', title: Ext.sfa.translate_arrays[langid][313], width:100, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
			 {name: 'total', type: 'int', title: Ext.sfa.translate_arrays[langid][314], width:100, align : 'right', summaryType:'sum', renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']}
		];
	
		Ext.regModel('user_routeinfo', {	        
	        fields: me.columns2 
	    });
	
		me.store2 = Ext.create('Ext.data.JsonStore', {
			model: 'user_routeinfo',	        
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
	},

	createGrid: function() {
		var me = this;

		me.grid = Ext.create('Ext.grid.GridPanel', {	               
			store: me.store,	        
			columnLines: true,			
			border: false,		
			region: 'west',
			split: true,
			width: 350,
			columns: [Ext.create('Ext.grid.RowNumberer', {width: 30}),{			
				text: Ext.sfa.translate_arrays[langid][328],			
				dataIndex: 'data',
				width: 150		   			   			   
			},
			{
				text: Ext.sfa.translate_arrays[langid][330], 
				dataIndex: 'detail', 		   				   		
				width: 160,
				renderer: Ext.sfa.renderer_arrays['renderDynamic']
			}]	
		});

		me.grid1 = Ext.create('Ext.grid.GridPanel', {			
			xtype: 'gridpanel',
			region: 'center',			
			split: true,
			store: me.store1,								
			columnLines: true,
			border: false,
	    	features: [Ext.create('Ext.grid.feature.Summary',{
			    ftype: 'summary',
				disabled: true
			})],
			columns: me.createHeadersWithNumbers(me.columns1)			
		});
		
		me.grid2 = Ext.create('Ext.grid.GridPanel', {			
			xtype: 'gridpanel',
			region: 'north',
			height: 270,
			store: me.store2,								
			columnLines: true,
			border: false,
			split: true,
			features: [Ext.create('Ext.grid.feature.Summary',{
			    ftype: 'summary',
				disabled: true
			})],
			columns: me.createHeadersWithNumbers(me.columns2),
			listeners: {
				selectionchange: function(model, records) {
					var json, name, i, l, items, series;
					if (records[0]) {
						rec = records[0];	                    	                    
						if (userCode.length > 3)
							me.store1.load({params:{xml:_donate('user_sale_product_detail', 'SELECT', 'Sales', 'productCode,sum(quantity) as quantity,sum(case type when 1 then 1 else 0 end *quantity) as rquantity,sum(amount)-sum(case type when 1 then 1 else 0 end *amount) as amount, sum(case type when 1 then 1 else 0 end *amount) as ramount,sum(amount) as total', 's,i,i,i,i', " WHERE (type!2 or type@=5) and customerCode='"+userCode+"' and convert(varchar, _dateStamp, 111)='"+rec.data['day']+"' GROUP by productCode ORDER by sum(amount) desc")}});
						else
							me.store1.load({params:{xml:_donate('user_sale_product_detail', 'SELECT', 'Sales', 'productCode,sum(quantity) as quantity,sum(case type when 1 then 1 else 0 end *quantity) as rquantity,sum(amount)-sum(case type when 1 then 1 else 0 end *amount) as amount, sum(case type when 1 then 1 else 0 end *amount) as ramount,sum(amount) as total', 's,i,i,i,i', " WHERE (type!2 or type@=5) and userCode='"+userCode+"' and convert(varchar, _dateStamp, 111)='"+rec.data['day']+"' GROUP by productCode ORDER by sum(amount) desc")}});
					}
				}				
			}
		});

		me.panel = Ext.create('Ext.Panel', {        
			region: 'center',
			layout: 'border',		
			border: false,
			items: [	                
				me.grid,
			    {
					region: 'center',
					split: true,
					xtype: 'panel',
					border: false,
					layout: 'border',
					items: [me.grid2,me.grid1]
				}				
			]
		 });
				
		 return me.panel;
	},

	createToolbar: function() {
    	var me = this;		
		me.store.load({params:{xml:_donate('_live_detail', 'SELECT', '_live_detail', ' ', ' ', userCode+',User')}});

		if (userCode.length > 3)
			me.store2.load({params:{xml:_donate('_customer_sale_by_date', 'SELECT', 'Sales', ' ', 's,i,i,i,i,i', userCode)}});
		else
			me.store2.load({params:{xml:_donate('_user_sale_by_date', 'SELECT', 'Sales', ' ', 's,i,i,i,i,i', userCode)}});

		return [{
					xtype: 'toolbar',
					items: [{
						xtype: 'combo',
						store: me.ds,
						displayField: 'title',
						typeAhead: false,
						hideLabel: true,
						hideTrigger:true,
						width: 250,
						minChars: 2,
						emptyText: 'Хайх зүйлээ оруулна уу !',
						anchor: '100%',
						listConfig: {
							loadingText: 'Хайж байна...',
							emptyText: 'Илэрц байхгүй.',
							getInnerTpl: function() {
								return '<a class="search-item" href=\'javascript:ossApp.callSearchModule(\"{code}\")\'>' +
									'<h3><span>{[Ext.Date.format(values.lastPost, "M j, Y")]}<br />{type}</span>{name}</h3>' +
									'{descr}' +
								'</a>';
							}
						}
				   },{
						text: '',
						iconCls: 'search_icon',						
						handler: function() {

						}
				   }]
		}];
	}
});


Ext.define('OSS.UserCurrentStorage', {
    extend: 'OSS.ExtendModule',
    id:'user-storage-info',        

	init: function() {
		this.title = Ext.sfa.translate_arrays[langid][280];
	},

	createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('user-storage-info');        
        if(!win){        	        	
			this.createStore();
            win = desktop.createWindow({
                id: 'user-storage-info',
                title:this.title,
                width:800,
                height:600,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
				border: true,
                items: [this.createGrid()],
                dockedItems: this.createToolbar(),
            });
        }
        win.show();
        return win;               
    },  
	
	createStore: function() {
		var me = this;
		Ext.regModel('user_storageinfo', {
			fields: [			 
					{name: 'code', type: 'string'},                                       
					{name: 'get', type: 'int'},
					{name: 'sold', type: 'int'},
					{name: 'last', type: 'int'},       
					{name: 'ehlel', type: 'float'}
			]
		});


		me.store = Ext.create('Ext.data.JsonStore', {
			model: 'user_storageinfo',     	        
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
	},

	createGrid: function() {
		var me = this;

		me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {	               
			store: me.store,	        
			columnLines: true,			
			border: false,
			features: [{
				id: 'current_user_storage_summary',
   				ftype: 'summary'
			}],
			columns: [new Ext.grid.RowNumberer({width:30}),                 	                   
				 {dataIndex: 'code', flex: 1, header: Ext.sfa.translate_arrays[langid][345], renderer: Ext.sfa.renderer_arrays['renderProductCode']},
				 {header: Ext.sfa.translate_arrays[langid][428],dataIndex: 'ehlel', align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 120},
				 {header: Ext.sfa.translate_arrays[langid][429],dataIndex: 'get', align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 120},
				 {header: Ext.sfa.translate_arrays[langid][343],dataIndex: 'sold', align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 120},
				 {header: Ext.sfa.translate_arrays[langid][432],dataIndex: 'last', align:'right', renderer: Ext.sfa.renderer_arrays['renderNumber'], summaryRenderer: Ext.sfa.renderer_arrays['renderTNumber'], summaryType:'sum', width: 120}
			]
		});
				
   	    return me.grid;
	},	

	createToolbar: function() {
    	var me = this;
		me.users = me.generateLocalCombo('local_user_combo', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], 150);    	
		me.users.on('select', function() {
			me.store.load({params:{xml:_donate('_current_user_storage', 'SELECT', 'info_user_storage', ' ', ' ', me.users.getValue())}});
		}, me.users);		
		
		me.buttons = [me.users, {
				iconCls: 'refresh',	
				text: Ext.sfa.translate_arrays[langid][326],					
				handler: function() {
					me.store.load({params:{xml:_donate('_current_user_storage', 'SELECT', 'info_user_storage', ' ', ' ', me.users.getValue())}});
				}
			},'-',
			{
				iconCls: 'switch',	
				text: Ext.sfa.translate_arrays[langid][703],	
				enableToggle: true,
				toggleHandler: function(item, pressed) {
					if (pressed)					
						me.store.load({params:{xml:_donate('_current_user_storage', 'SELECT', 'info_user_storage', ' ', ' ', me.users.getValue()+',amount')}});
					else
						me.store.load({params:{xml:_donate('_current_user_storage', 'SELECT', 'info_user_storage', ' ', ' ', me.users.getValue()+',quantity')}});
			}
		}];

		me.addStandardButtons();
		
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
	}
});


Ext.define('OSS.PlanInsertWindow', {
    extend: 'OSS.ExtendModule',
    id:'user-plan-insert-win',        
	width: 800,
	height: 500,
	init: function() {
		this.title = Ext.sfa.translate_arrays[langid][449];
	},

	createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createStore();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width: this.width,
                height: this.height,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
				border: true,
                items: [this.createGrid()],
                dockedItems: this.createToolbar(),
            });
        }
        win.show();
        return win;               
    },  

	initmans: function() {
		var me = this;
		me.store1.removeAll();	          		
    	for (i = 0; i < Ext.sfa.stores['user_list'].getCount(); i++) {
			var record = Ext.sfa.stores['user_list'].getAt(i);						
			if (record.data['_group'] == me.suvag.getValue()) {
				me.store1.add({code: record.data['code']});		    					     		    				
    		}
    	}
		me.grid1.getView().refresh();
	},

	initbase: function () {
		var me = this;
    	me.store2.removeAll();
    	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);
			if (record.data['vendor'] == section) {
				var ptag = me.priceTag.getValue();
				var price = Ext.sfa.renderer_arrays['renderPriceList'](record.get('code')+ptag);
				me.store2.add({code: record.data['code'], count: 0, price: price, amount: 0});	    				
			}
    	}    			
    	me.grid2.getView().refresh();
	},
	
	createStore: function() {
		var me = this;
		me.store1 = Ext.create('Ext.data.Store', {
			model: 'code_model'
		});		

		me.action_store = Ext.create('Ext.data.JsonStore', {	    	        	       
			proxy: {
				type: 'ajax',
				url: 'httpGW',	    			
				writer: {
				   type: 'json'
				}
			}
		});

		Ext.regModel('plan_grid', { 
			fields: [
				{name: 'code', type: 'string'}, 
				{name: 'price', type:'int'}, 
				{name: 'count', type: 'int'},
				{name: 'amount', type: 'int'}	                 
			]
		});

		me.store2 = Ext.create('Ext.data.Store', {
			model: 'plan_grid',
			data: []
		});
	},

	createGrid: function() {
		var me = this;
		me.sm = Ext.create('Ext.selection.CheckboxModel');
		me.grid1 = Ext.create('Ext.grid.GridPanel', {			    			
			xtype: 'gridpanel',
			border: false,	    			
			columnLines: true,
			width: 200,
			split: true,
			region: 'west',
			store: me.store1,	    		
			selModel: me.sm,
			columns: [
				  {
					  text: Ext.sfa.translate_arrays[langid][310],
					  dataIndex: 'code',	    					  
					  flex: 1,
					  renderer: Ext.sfa.renderer_arrays['renderUserCode']
				  }
			]			     			
		});
		
		me.grid2 = Ext.create('Ext.ux.LiveSearchGridPanel', {			    			
			xtype: 'gridpanel',
			border: false,	    			
			columnLines: true,
			split: true,
			region: 'center',
			store: me.store2,
			plugins: [new Ext.grid.plugin.CellEditing({
    	        clicksToEdit: 1,
				pluginId: 'cellplugin',
				listeners: {
					'afteredit': function(e) {
						
					}
				}
    	    })],
			features: [{
				id: 'plan_product_insert',
				ftype: 'summary'
			}],
			columns: [
 				  new Ext.grid.RowNumberer({width:30}),
				  {
					  text: Ext.sfa.translate_arrays[langid][345],
					  dataIndex: 'code',
					  width: 200,
					  renderer: Ext.sfa.renderer_arrays['renderProductCode']
				  },
				  {
					  text: 'Үнэ',
					  dataIndex: 'price',
					  align:'right',
					  width: 80,
					  renderer: Ext.sfa.renderer_arrays['renderMoney']
				  },
				  {
					  text: Ext.sfa.translate_arrays[langid][6],
					  dataIndex: 'count',
					  align:'right',
					  summaryType: 'sum',	     
					  field: { 
						  xtype: 'numberfield'
					  },
					  width: 90,
					  renderer: Ext.sfa.renderer_arrays['renderNumber']
				  }, 
				  {
					  text: Ext.sfa.translate_arrays[langid][5],
					  dataIndex: 'amount',
					  align:'right',
					  width: 120,					  
					  summaryType: function(records){
						  var i = 0,
							  length = records.length,
							  total = 0,
							  record;

						  for (; i < length; ++i) {
							  record = records[i];
							  total += record.get('count') * record.get('price');
						  }
						  return total;
					  },
					  renderer: Ext.sfa.renderer_arrays['renderPriceMoney'],
					  summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']
				  }
			]
		});	
				
		me.panel = Ext.widget('form', {
			border: false,
			layout: {
				type: 'border',
				align: 'stretch'
			},
			items: [me.grid1, me.grid2]
		});

   	    return me.panel;
	},	

	createToolbar: function() {
    	var me = this;
		me.priceTag = Ext.create('Ext.form.ComboBox', {	        		
			width: 120,
			name: 'priceTag',        
			margins: '0 0 0 5',
			xtype: 'combo',
			emptyText: Ext.sfa.translate_arrays[langid][419],
			store: Ext.sfa.stores['price_types'],
			displayField: 'descr',
			valueField: 'id',
			queryMode: 'local',
			triggerAction: 'all'
		});	
		
		me.priceTag.on('change', function(e) {		
			me.initbase();
			me.grid2.getView().refresh();
		});
		me.priceTag.setValue(1);

		me.suvag = Ext.create('Ext.form.ComboBox', {	        		
			width: 120,
			name: '_group',        
			margins: '0 0 0 5',
			xtype: 'combo',
			store: Ext.sfa.stores['user_type'],
			displayField: 'descr',
			valueField: '_group',
			value: mode,
			queryMode: 'local',
			triggerAction: 'all',
			emptyText: Ext.sfa.translate_arrays[langid][592]
		});	 
		me.suvag.on('change', function(e) {
			me.initmans();
			me.grid1.getView().refresh();
		});		
		me.suvag.setValue(1);

		me.dateMenu = Ext.create('Ext.menu.DatePicker', {
			text: currentDate,
			handler: function(dp, date){	    	        	
				me.startBtn.setText(Ext.Date.format(date, 'Y-m-d'));	    	        		                      
			}
		});
			
		me.dateMenu1 = Ext.create('Ext.menu.DatePicker', {
			text: nextDate,
			handler: function(dp, date){	    	        	
				me.endBtn.setText(Ext.Date.format(date, 'Y-m-d'));	    	        	         
			}
		});
		
		me.startBtn = Ext.create('Ext.button.Button', {
			fieldLabel: Ext.sfa.translate_arrays[langid][481],
			text    : firstDay,        
			scope   : this,
			name	: 'startDate',
			iconCls: 'calendar',
			menu	: me.dateMenu
		});
		me.endBtn = Ext.create('Ext.button.Button', {
			fieldLabel: Ext.sfa.translate_arrays[langid][410],
			text    : lastDay, 
			margins : '0 0 0 5',
			name	: 'endDate',
			scope   : this,
			iconCls: 'calendar',
			menu	: me.dateMenu1
		});
		
		me.planName = Ext.create('Ext.form.ComboBox', {			
			store: Ext.create('Ext.data.JsonStore', {
				model: 'plan_name',	     	   
				mode: 'remote',
				autoLoad: true,
				proxy: {
					type: 'ajax',
					url: 'httpGW?xml='+_donate('_remote_plan_names', 'SELECT', ' ', ' ', ' '),
					reader: {
						type: 'json',
						root:'items',
						totalProperty: 'results'
					}	            
				}
			}),
			xtype: 'combo',
			name: 'name',
			displayField: 'name',
			valueField: 'name',
			typeAhead: true,        
			allowBlank: false,
			queryMode: 'remote',
			mode: 'remote',
			triggerAction: 'all',
			margins: '0 0 0 5', 
			emptyText: Ext.sfa.translate_arrays[langid][448],
			selectOnFocus: true,
			width: 150
		}); 

		me.buttons = [me.startBtn,me.endBtn,me.suvag,me.planName,me.priceTag,
			{
				text: Ext.sfa.translate_arrays[langid][417],
				iconCls: 'icon-add',
				handler: function() {               
					var users = '';
					var records = me.grid1.getSelectionModel().getSelection();
					var params = 'planName='+me.planName.getValue()+'&_group='+me.suvag.getValue()+'&startDate='+me.startBtn.getText()+'&endDate='+me.endBtn.getText();
					
					Ext.each(records, function(record){
						users += record.get('code')+',';		                    		
					});
													
					var pro = '';
					for (i = 0; i < me.store2.getCount(); i++) {	                    		
						var rec = me.store2.getAt(i);
						if (rec.data['count'] > 0)
							pro = pro + ('productCode='+rec.data['code']+'&count='+rec.data['count']+'&price='+me.priceTag.getValue()+',');	                    		
					}	                    		                    	                    
									
					alert(pro+' '+me.planName.getValue()+' '+users);
					if (pro != '' && me.planName.getValue() != '' && users != '') {
						me.action_store.load({params:{xml:_donate('business_plan', 'WRITER', 'B_Plan', pro, params, users)}, 
							callback: function() {
							}});
										
						
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][584], null);
										
						me.store2.removeAll();
						for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
							var record = Ext.sfa.stores['product_list'].getAt(i);
							if (record.data['vendor'] == section) {
								me.store2.add({code: record.data['code'], count: 0, price: 0, amount: 0});	    				
							}
						}
					} else 
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], 'Хоосон байна !', null);
				}
			}, 
			{
				text: Ext.sfa.translate_arrays[langid][471],
                iconCls: 'icon-delete',
				handler: function() {
					me.initbase();
				}
			}];		
		me.addHelpButtons();
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
	}
});


Ext.define('OSS.PlanDeleteWindow', {
    extend: 'OSS.PlanInsertWindow',
    id:'user-plan-delete-win',        
	width: 300,
	height: 500,
	init: function() {
		this.title = Ext.sfa.translate_arrays[langid][450];
	},	

	createStore: function() {
		var me = this;
		me.store = Ext.create('Ext.data.Store', {
			model: 'code_model'
		});		

		me.action_store = Ext.create('Ext.data.JsonStore', {	    	        	       
			proxy: {
				type: 'ajax',
				url: 'httpGW',
				writer: {
				   type: 'json'
				}
			}
		});
	},

	initbase: function() {
		var me = this;
		me.store.removeAll();
		for (i = 0; i < Ext.sfa.stores['user_list'].getCount(); i++) {
			var record = Ext.sfa.stores['user_list'].getAt(i);
			
			if (record.data['manager'] == logged) {
				me.store.add({code: record.data['code']});		    					     		    				
			}
		}
	},

	createGrid: function() {
		var me = this;
		me.sm = Ext.create('Ext.selection.CheckboxModel');
		me.grid = Ext.create('Ext.grid.GridPanel', {			    			
			xtype: 'gridpanel',
			border: false,	    			
			columnLines: true,        		
			store: me.store,
			layout: 'fit',
			selModel: me.sm,
			columns: [
				  {
					  text: Ext.sfa.translate_arrays[langid][310],
					  dataIndex: 'code',	    					  
					  flex: 1,
					  renderer: Ext.sfa.renderer_arrays['renderUserCode']
				  }
			]			     			
		});
   	    return me.grid;
	},	

	createToolbar: function() {
    	var me = this;
       	me.planName = me.generateRemoteCombo('_remote_plan_names', 'plan_name', 'name', 'name', Ext.sfa.translate_arrays[langid][448], 150);

		me.buttons = [me.planName,{
			text: Ext.sfa.translate_arrays[langid][366],
			iconCls: 'icon-delete',
			handler: function() {
				var records = me.grid.getSelectionModel().getSelection();
				if (me.planName.getValue()) {
					Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][548], function(btn, text){	                		
						if (btn == 'yes'){
							Ext.each(records, function(record){                					
								me.action_store.load({params:{xml:_donate('business_plan_delete', 'WRITER', 'B_Plan', ' ', 'name='+me.planName.getValue()+';userCode='+record.data['code'], ' ')}});
							});							
						} else {
				
						}
					});		                    	
				} else
					Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Төлөвлөгөөний нэр сонгон уу !', null);
			}
		}];	
		me.addHelpButtons();
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
	}
});


Ext.define('OSS.LeaseCustomerMonthly', {
    extend: 'OSS.ExtendModule',
    id:'lease-customer-monthly-data',        
    
    init : function(){  	
    	this.title = 'Зээлийн тайлан';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('lease-customer-monthly-data');        
        if(!win){        	        	
            win = desktop.createWindow({
                id: 'lease-customer-monthly-data',
                title:this.title,
                width:800,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: 'fit',
                items: [this.createGrid()]
            });
        }
        this.loadStore();
        win.show();
        return win;               
    },
    
    loadStore: function () {    
    	var me = this;    
    	me.store.load({params:{xml:_donate('_lease-customer-monthly-data', 'SELECT', ' ', ' ', ' ', me.users.getValue())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
    	me.model = Ext.sfa.staticModels['ZeelMiniCustomer'];    	
    	me.store = me.model['readStore'];
    },        
    
	restoreView : function() {
    	var me = this;
    	me.model = Ext.sfa.staticModels['ZeelMiniCustomer'];   	
    	me.store = me.model['readStore'];

		me.grid.reconfigure(me.store, me.createHeaders(me.model['columns']));
		me.loadStore();
    },

	switchView : function() {
    	var me = this;
    	me.model = Ext.sfa.staticModels['ZeelCustomer'];   	
    	me.store = me.model['readStore'];

		me.grid.reconfigure(me.store, me.createHeaders(me.model['columns']));
		me.loadStore();
    },

    createGrid : function() {
    	var me = this;
    	me.createStore();    	
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary',
			disabled: true
		}); 
    	me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
    		columnLines: true,
			features: [me.summary],
    		columns: me.createHeaders(me.model['columns']),
    		dockedItems: me.createToolbar()
    	});
    	
    	return me.grid;
    },
    
    createToolbar : function() {
    	var me = this;    	    	    	
    	me.users = this.generateLocalCombo('Users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310]);
    	
		me.buttons = [me.users,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.users.getValue()) {
						me.restoreView();
						me.loadStore();                    	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Борлуулагч сонгон уу !', null);
				}
			},
			{
				text: Ext.sfa.translate_arrays[langid][3],
				iconCls: 'switch',
				handler: function() {
					me.switchView();
				}
			}
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});

Ext.define('OSS.StorageToStorage', {
    extend: 'OSS.ExtendModule',
    id:'storage-to-storage-win',        
    
    init : function(){  	
    	this.title = 'Агуулах хоорондын шилжилт';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:850,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid],
	    		dockedItems: this.createToolbar()
            });
        }
        this.loadStore();
        win.show();
        return win;               
    },

    loadStore: function () {    
    	var me = this;    

		me.store.load({params:{xml:_donate('_storage_to_storage', 'SELECT', ' ', ' ', ' ', me.start.getText()+','+me.end.getText()+','+me.ware.getValue())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
    	me.model = Ext.sfa.staticModels['Storage_To_Storage'];    	
    	me.store = me.model['readStore'];

		me.store_action = Ext.create('Ext.data.JsonStore', {        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary',
			disabled: true
		}); 
    	me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'center',
    		columnLines: true,
			split: true,
			features: [me.summary],
    		columns: me.createHeadersWithNumbers(me.model['columns'])
    	});    			
    },
    
    createToolbar : function() {
    	var me = this;    	    	    	
    	me.ware = me.generateRemoteComboWithFilter('_remote_ware_house', 'ware_house', 'wareHouseID', 'name', Ext.sfa.translate_arrays[langid][509], mode); 
    	me.start = me.generateDateField('ts_date1',firstDay);
    	me.end = me.generateDateField('ts_date2',nextDate);

		me.buttons = [me.start, me.end, me.ware,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.ware.getValue() != 'null') {
						me.loadStore();            	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Агуулах сонгон уу !', null);
				}
			}			
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});

Ext.define('OSS.CustomerSalesReport', {
    extend: 'OSS.ExtendModule',
    id:'customer-sales-report-win',        
    
    init : function(){  	
    	this.title = 'Харилцагчийн худалдан авалт';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:900,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid],
	    		dockedItems: this.createToolbar()
            });
        }
        this.loadStore();
        win.show();
        return win;               
    },

    loadStore: function () {    
    	var me = this;    

		me.store.load({params:{xml:_donate('_report_by_customer', 'SELECT', ' ', ' ', ' ', me.start.getText()+','+me.end.getText()+','+me.users.getValue())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
    	me.model = Ext.sfa.staticModels['Top_Customer'];    	
    	me.store = me.model['readStore'];

		me.store_action = Ext.create('Ext.data.JsonStore', {        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary',
			disabled: true
		}); 
    	me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'center',
    		columnLines: true,
			split: true,
			features: [me.summary],
    		columns: me.createHeadersWithNumbers(me.model['columns']),
			plugins: [new Ext.grid.plugin.CellEditing({
    	        clicksToEdit: 1,
				pluginId: 'cellplugin'				
    	    })],
			viewConfig: {
				stripeRows: true,
				trackOver: false,
				listeners: {
					itemdblclick: function(dv, record, item, index, e) {
						ossApp.callSearchModule(record.get('customerCode'));
					}
				}
			}
    	});    			
    },
    
    createToolbar : function() {
    	var me = this;    	    	    	
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode); 
    	me.start = me.generateDateField('ts_date1',firstDay);
    	me.end = me.generateDateField('ts_date2',nextDate);

		me.buttons = [me.start, me.end, me.users,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.users.getValue() != 'null') {
						me.loadStore();            	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Борлуулагч сонгон уу !', null);
				}
			},
			{
				text: Ext.sfa.translate_arrays[langid][491],
				iconCls: 'icon-apply',
				handler: function() {
					var params = '';
					var params1 = '';
					for (i = 0; i < me.store.getCount(); i++) {
						var rec = me.store.getAt(i);
						if (rec.get('rank') > 0)
							params += rec.get('customerCode')+':'+rec.get('rank')+',';
						
						if (rec.get('plan') > 0)						
							params1 += rec.get('customerCode')+':'+rec.get('plan')+',';						
					}
					
					params = params+';'+params1;

					if (params.length > 0) {
						me.store_action.load({params:{xml:_donate('_update_customer_rank_plan', 'SELECT', ' ', ' ', ' ', params)},
							callback: function(data) {
								Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Амжилттай !', null);
							}
						});
					}
				}
			}
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});

Ext.define('OSS.PromotionCustomer', {
    extend: 'OSS.ExtendModule',
    id:'promotion-customer-win',        
    
    init : function(){  	
    	this.title = 'Харилцагчидын урамшуулал';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:850,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid,this.grid1],
	    		dockedItems: this.createToolbar()
            });
        }
        this.loadStore();
        win.show();
        return win;               
    },
    
	initbase: function () {
		var me = this;
    	me.store1.removeAll();
    	for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);
			if (record.data['brand'] == 'uramshuulal') {		
				var c = 0;
				var store = me.store2.queryBy(function fn(record,id) {				 
					 return record.get('productCode') == record.data['code']; 
				}); 
				store.each(function(rec){									
					c = rec.data['count'];					
				});
				me.store1.add({code: record.data['code'], count: c});	    							
			}
    	}
    	
    	me.grid1.getView().refresh();
	},
	

    loadStore: function () {    
    	var me = this;    

		me.initbase();

		me.store.load({params:{xml:_donate('_customer_list_by_type', 'SELECT', ' ', ' ', ' ', me.usertype.getValue())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
    	me.model = Ext.sfa.staticModels['Promotion_Customer'];    	
    	me.store = me.model['readStore'];

		me.store1 = Ext.create('Ext.data.Store', {
			model: 'set_model'
		});	

		Ext.regModel('customer_promotion_product', {		    
    		idProperty: 'product',
    	    fields: [                
    	        {name: 'productCode', type: 'string'},
    	        {name: 'count', type: 'int'}
    	    ]
    	});

    	me.store2 = Ext.create('Ext.data.JsonStore', {
    	    model: 'customer_promotion_product',    
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

		me.store_action = Ext.create('Ext.data.JsonStore', {        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary',
			disabled: true
		}); 
    	me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'center',
    		columnLines: true,
			split: true,
			features: [me.summary],
    		columns: me.createHeadersWithNumbers(me.model['columns']),
			viewConfig: {
    			loadMask: true,
                stripeRows: true,
                listeners: {
                	itemclick: function(dv, record, item, index, e) {						
						me.customerCode = record.get('code');
						me.store2.load({params:{xml:_donate('_customer_promotion_product_list', 'SELECT', ' ', ' ', ' ', record.get('code'))}, 
							 callback: function() {
								me.initbase();
							 }
						});
                    }
                }
            }
    	});
    	
		me.grid1 = Ext.create('Ext.grid.GridPanel', {			    			
			xtype: 'gridpanel',
			border: false,	    			
			columnLines: true,		
			region: 'east',
			width: 280,
			split: true,
			store: me.store1,	    		
			plugins: [new Ext.grid.plugin.CellEditing({
    			id: 'promotion_customer_product',
    			clicksToEdit: 1		
    		})],
			columns: [Ext.create('Ext.grid.RowNumberer', {width: 35}),
				  {
					  text: Ext.sfa.translate_arrays[langid][345],
					  dataIndex: 'code',	    					  
					  flex: 1,
					  renderer: Ext.sfa.renderer_arrays['renderProductCode']
				  },{
					  text: Ext.sfa.translate_arrays[langid][413],
					  dataIndex: 'count',	    					  
					  width: 80,
					  align: 'right',
					  field: {
						  xtype : 'numberfield'
					  },
					  renderer: Ext.sfa.renderer_arrays['renderNumber']
				  }
			],
			listeners: {
				edit: function(editor, e) {
					var record = e.record;
					alert(record.get('count'));	
					
					me.store_action.load({params:{xml:_donate('_customer_promotion_product_list', 'SELECT', ' ', ' ', ' ', record.get('code'))}, 
						 callback: function() {
							me.initbase();
						 }
					});
				}
			}
		});
    },
    
    createToolbar : function() {
    	var me = this;    	    	    	
    	me.usertype = this.generateLocalCombo('User_Type', 'user_type', '_group', 'descr', Ext.sfa.translate_arrays[langid][592]);
    	
		me.buttons = [me.usertype,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.usertype.getValue() != 'null') {
						me.loadStore();            	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Суваг сонгон уу !', null);
				}
			}
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});


Ext.define('OSS.OrdersReport', {
    extend: 'OSS.ExtendModule',
    id:'orders-report-win',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][639];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:850,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid],
	    		dockedItems: this.createToolbar()
            });
        }
 //       this.loadStore();
        win.show();
        return win;               
    },   

    loadStore: function () {    
    	var me = this;    

		me.store.load({params:{xml:_donate('_user_orders', 'SELECT', ' ', ' ', ' ', me.users.getValue()+','+me.start.getText()+','+me.end.getText())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('User_Orders', 'user_orders');
    	me.store = me.model['readStore'];

    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary',
			disabled: true
		}); 
    	me.grid = Ext.create('Ext.ux.LiveSearchGridPanel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'center',
    		columnLines: true,
			split: true,
			features: [me.summary],
    		columns: me.createHeadersWithNumbers(me.model['columns'])
    	});    			
    },
    
    createToolbar : function() {
    	var me = this;    	    	    	
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);
    	me.start = me.generateDateField('uo_date1',currentDate);
    	me.end = me.generateDateField('uo_date2',nextDate);
    	
		me.buttons = [me.users, me.start, me.end, {
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.users.getValue() != 'null') {
						me.loadStore();            	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Суваг сонгон уу !', null);
				}
			}
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});


Ext.define('OSS.CustomPriceWindow', {
    extend: 'OSS.ExtendModule',
    id:'custom-price-window',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][272];        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:650,
                height:500,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid],
	    		dockedItems: this.createToolbar()
            });
        }
 //       this.loadStore();
        win.show();
        return win;               
    },   

    loadStore: function () {    
    	var me = this;    
		me.name = 'Price';
		me.xml = _donate('_custom_price_list', 'SELECT', ' ', ' ', ' ', me.price_types.getValue()+','+mode);
		me.store.getProxy().extraParams = {xml:_donate('_custom_price_list', 'SELECT', ' ', ' ', ' ', me.price_types.getValue()+','+mode)};
		me.store.loadPage(1);
    },
    
    createStore : function() {
    	var me = this;
    	me.model = me.generateModel('Price', 'Price');
    	me.store = me.model['readStore'];

    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	
		
    	me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'center',
    		columnLines: true,
			split: true,
			plugins: [new Ext.grid.plugin.CellEditing({
    	        clicksToEdit: 1,
				pluginId: 'cellplugin',
				listeners: {
					'afteredit': function(editor, e) {
						var record = e.record;
						record.set("price", e.record.get("unit_price")*e.record.get("unit")); 

						var auth = make_base_auth();
						var params = "id="+record.get("id")+",productCode="+record.get("productCode")+",customerType="+record.get("customerType")+",unit="+record.get("unit")+",unit_price="+record.get("unit_price")+",price="+record.get("price");
						Ext.Ajax.request({
						   url:'httpGW?xml='+_donate('form_action','WRITER','Price',' ',' ',params),    // where you wanna post
						   success: function() { 
							  Ext.MessageBox.alert('Ажмилттай', 'Changes saved successfully.', null); 			   
						   },
						   failure: function() {  
							  Ext.MessageBox.alert('Амжилтгүй', 'Not success !', null);
						   },
						 //  headers : { Authorization : auth },
						   method: 'GET'
						});
					}
				}
    	    })],
    		columns: me.createHeadersWithNumbers(me.model['columns']),			
			bbar: Ext.create('Ext.PagingToolbar', {
				store: me.store,
				displayInfo: true,
				displayMsg: '{0}-{1} of {2}',
				emptyMsg: "Empty !",
				items: [{
						text: 'Хайлт : '				
					},{
						xtype: 'textfield',
						width: 150,
						readOnly: false,
						listeners: {
							 change: {
								 fn: me.onTextFieldChange_,
								 scope: this,
								 buffer: 200
							 }
						}
					},'->'
				]
			})
    	});    			
    },
    
    createToolbar : function() {
    	var me = this;    	 
    	me.price_types = me.generateLocalCombo('local_customerType_combo', 'price_types', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100);
    	
		me.buttons = [me.price_types,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.price_types.getValue() != 'null') {
						me.loadStore();            	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Суваг сонгон уу !', null);
				}
			}
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});



Ext.define('OSS.ReportVersion_1', {
    extend: 'OSS.ExtendModule',
    id:'report-version-one',        
    
    init : function(){  	
    	this.title = 'Харилцагчдын нэгдсэн тайлан';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:950,
                height:550,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid],
	    		dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },   

    loadStore: function () {    
    	var me = this;    
		me.store.load({params:{xml:_donate('_report_version_1', 'SELECT', ' ', ' ', ' ', me.users.getValue()+','+me.start.getText()+','+me.end.getText())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
		me.name = 'Report_Version_1';
		me.modelName = '_report_version_1';
    	me.model = Ext.sfa.staticModels['Report_Version_1'];    	
    	me.store = me.model['readStore'];
    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	

		me.grouping = Ext.create('Ext.grid.feature.GroupingSummary',{
		    ftype: 'groupingsummary',
		    groupHdTpl: '{name} ({rows.length} '+Ext.sfa.translate_arrays[langid][310]+')',
		    hideGroupedHeader: true
		});
		
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		}); 

    	me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		border: false,
    		store: me.store,
			region: 'center',
    		columnLines: true,
			features: [me.grouping, me.summary],
			split: true,			
    		columns: me.createHeadersWithNumbers(me.model['columns'])			
    	});    			
    },
    
    createToolbar : function() {
    	var me = this;    	 
    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);    	
    	me.start = me.generateDateField('rv1_date1',firstDay);
    	me.end = me.generateDateField('rv1_date2',nextDate);

		me.buttons = [me.users,me.start,me.end,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					if (me.users.getValue() != 'null') {
						me.loadStore();            	
					} else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Борлуулагч сонгоно уу !', null);
				}
			}
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});



Ext.define('OSS.OrderImportManual', {
    extend: 'OSS.ExtendModule',
    id:'order-import-manual',        
    
    init : function(){  	
    	this.title = Ext.sfa.translate_arrays[langid][293];        
    },
	
	initStore: function() {
		var me = this;
		me.order_temp_data = [];
		var t = 0;
		me.ow = '';
		me.op = '';
		for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);
			me.order_temp_data[t] = {'brand':record.data['vendor'],'productCode':record.data['code'], 'requestCount':0, 'price': 0, 'amount': 0, 'wareHouseID': 0, 'pr': 0};
			t++;			
		}
		
		me.order_row_ds = Ext.create('Ext.data.JsonStore', {
			fields: [
				{name: 'brand'},
				{name: 'productCode'},
				{name: 'requestCount',  type: 'int'},
				{name: 'wareHouseID',  type: 'int'},
				{name: 'price',  type: 'int'},
				{name: 'amount', type: 'float'},
				{name: 'pr', type: 'int'}
			]
		});
	},
	
	clearData : function(b) {		
		var me = this;
		var t = 0;
		me.order_temp_data = [];
		for (i = 0; i < Ext.sfa.stores['product_list'].getCount(); i++) {
			var record = Ext.sfa.stores['product_list'].getAt(i);			
			me.order_temp_data[t] = {'brand':record.data['vendor'],'productCode':record.data['code'], 'requestCount':0, 'price': 0, 'amount': 0, 'wareHouseID': 0, pr: 0};
			t++;		
		}                	                	
    	
    	me.order_row_ds.loadData(me.order_temp_data);
    	
    	if (b)
    		me.users.setValue('');    	
	},

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow(this.id);        
        if(!win){        	        	
			this.createGrid();
            win = desktop.createWindow({
                id: this.id,
                title:this.title,
                width:900,
                height:550,
                iconCls: 'icon-grid',
                animCollapse:false,
                constrainHeader:true,
                layout: {
					type: 'border',
					align: 'stretch'
				},
                items: [this.grid1, this.grid],
	    		dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },   

    loadStore: function () {    
    	var me = this;    
		me.cstore.load({params:{xml:_donate('_user_customer_list1', 'SELECT', ' ', ' ', ' ', me.users.getValue())},
    		callback: function(data) {
    			
    		}});
    },
    
    createStore : function() {
    	var me = this;
		me.initStore();
		me.cstore = Ext.create('Ext.data.JsonStore', {
    		fields: [        
    		    {name: 'code', type: 'string'},
    		    {name: 'customerName', type: 'string'}
    	    ],	        
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
    },    	

    createGrid : function() {
    	var me = this;
    	me.createStore();    	

		me.grouping = Ext.create('Ext.grid.feature.GroupingSummary',{
		    ftype: 'groupingsummary',
		    groupHdTpl: '{name} ({rows.length} '+Ext.sfa.translate_arrays[langid][310]+')',
		    hideGroupedHeader: true
		});
		
		me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		}); 

    	me.grid = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		border: false,
    		store: me.order_row_ds,
			region: 'center',
    		columnLines: true,
			features: [me.grouping, me.summary],
			split: true,			
    		columns: [new Ext.grid.RowNumberer({width:30}), 
				{			
					text: 'Төрөл',			
					dataIndex: 'brand',
					width: 60
				},
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
			listeners: {
				itemclick: function(grid, record, item, index, e) {        
					var rec = record;
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
						
						if (me.ow != 0)
							wareHouse.setValue(me.ow);
						
						wareHouse.allowBlank = false;
						var price_list = generateLocalComboWithCaption('local_customerType_combo', 'price_types', 'id', 'descr', Ext.sfa.translate_arrays[langid][392], 100);
						if (rec.data['pr'] != 0)
							price_list.setValue(rec.data['pr']);
						price_list.allowBlank = false;
						if (me.op != 0)
							price_list.setValue(me.op);
						
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
											me.ow = wareHouse.getValue();
											me.op = price_list.getValue();
											for (i = 0; i < me.order_temp_data.length; i++) {
												var record = me.order_temp_data[i];
												if (record['productCode'] == productCode)		                				
													me.order_temp_data[i] = {'brand':record['vendor'], 'productCode':productCode, 'requestCount':requestCount.getValue(), 'price': price.getValue(), 'amount': (requestCount.getValue()*price.getValue()), 'wareHouseID': wareHouse.getValue(), 'pr': price_list.getValue()};	
											}
																											
											me.order_row_ds.loadData(me.order_temp_data);
											
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
							bodyPadding: 0,
							border: false,
							layout: 'fit',
							modal: true,
							width: 300,
							height: 210,
							items: [order_row]
						});
						win_row.show();
					}
				}
			}
    	}); 
			
		me.grid1 = Ext.create('Ext.grid.Panel', {
    		xtype: 'grid',
    		border: false,
    		store: me.cstore,
			region: 'west',
			width: 300,
    		columnLines: true,
			split: true,			
    		columns: [new Ext.grid.RowNumberer({width:30}), 
				{			
					text: 'Код',			
					dataIndex: 'code',
					width: 60
				},
				{			
					text: Ext.sfa.translate_arrays[langid][441],			
					dataIndex: 'customerName',
					flex: 1
				}
			]			
    	});  

		me.grid1.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                me.selectedCustomer = selectedRecord[0];
                me.clearData(false);
            }
        });    
    },
    
    createToolbar : function() {
    	var me = this;    	 

    	me.users = me.generateRemoteComboWithFilter('_remote_section_users', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310], mode);    	
    	me.ognoo = me.generateDateField('order_import_date',firstDay);

		me.buttons = [me.ognoo,me.users,{
				text: Ext.sfa.translate_arrays[langid][326],
				iconCls: 'refresh',
				handler: function() {
					me.loadStore();
				}
			}, {
				text: Ext.sfa.translate_arrays[langid][417],
				iconCls: 'icon-apply',
				handler: function() {
					var userCode = me.users.getValue();
                	
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
			                		var date = me.ognoo.getText();
			                		var sent = false;			                		
			                		for (i = 0; i < me.order_row_ds.getCount(); i++) {
			                			var rec = me.order_row_ds.getAt(i);
			                			
			                			if (rec.data['requestCount'] > 0) {
			                				sent = true;
			                				action_order_temp.load({params:{xml:_donate('insert', 'WRITER', 'Orders', '_date,userCode,customerCode,productCode,requestCount,price,wareHouseID,ticketID', 
													   'd'+date+',s'+userCode+',s'+me.selectedCustomer.get('code')+',s'+rec.data['productCode']+',i'+rec.data['requestCount']+',f'+rec.data['price']+',i'+rec.data['wareHouseID']+',i'+ticketID, ' ')}});
			                			}
			                		}
			                		
			                		if (!sent)
			                			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], 'Амжилгүй ! Захиалга оруулаагүй байна !', null);
			                		else
			                			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][328], Ext.sfa.translate_arrays[langid][557], function() {
			                				me.clearData(true);
			                			});			                	
                			}
                			else {
                		
                			}
                		});
                	} else {
	                	Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][588], Ext.sfa.translate_arrays[langid][470], null);
	                }
				}
			},
			{
                text: Ext.sfa.translate_arrays[langid][471],
                iconCls: 'icon-delete',
                handler: function(){                	        	    	
                	me.clearData(true);
                }
            }
		];	
		me.addStandardButtons();

    	return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    }
});


Ext.define('OSS.BackOrderGridWindowPre', {
    extend: 'OSS.ExtendModule',

    requires: [
        'Ext.data.Store',
        'Ext.util.Format',
        'Ext.grid.Panel',
        'Ext.grid.RowNumberer'        
    ],

    id:'back-order-grid-win-pre',        
    
    init : function(){  	
    	this.title = 'Борлуулалтын буцаалт1';        
    },

    createWindow : function(){
    	var desktop = this.app.getDesktop();
        var win = desktop.getWindow('back-order-grid-win-pre');        
        if(!win){        	        	
        	this.createGrid();
        	
            win = desktop.createWindow({
                id: 'back-order-grid-win-pre',
                title:this.title,
                width:1100,
                height:620,
                border: true,
                iconCls: 'icon-grid',
                animCollapse:false,
                layout: 'border',
                items: [this.grid1, 
				{
					region: 'center',
					xtype: 'panel',
					layout: 'border',
					border: false,
					items: [this.grid, this.grid2]
				}],
                dockedItems: this.createToolbar()
            });
        }
        win.show();
        return win;               
    },  
    
    loadStore: function() {
    	var me = this;     	
    	
		if (me.users.getValue() != '')
    		me.cstore.load({params:{xml:_donate('_completed_order_customer_list', 'SELECT', ' ', ' ', ' ', me.users.getValue()+','+me.start.getText())}});
    },

	loadStore1: function() {
    	var me = this;     	
    	
    	if (me.customerCode) 
    		me.store.load({params:{xml:_donate('Orders', 'SELECT', 'Orders as b JOIN Product on productCode=code', 'id,_date,userCode,customerCode,productCode,requestCount,confirmedCount,price,orderAmount,b.wareHouseID as wareHouseID,driver', 'i,s,s,s,f,f,i,s', " WHERE requestCount@0 and confirmedCount@0 and userCode='"+me.users.getValue()+"' and customerCode='"+me.customerCode+"' and ticketID="+me.ticketID+" and DATEADD(dd, 0, DATEDIFF(dd, 0, _date))='"+me.start.getText()+"' and flag=0 ORDER by class asc,_date desc,confirmedCount asc")},
    			callback: function() {
    				
    			}});
    },
   
	loadStore2 : function() {
    	var me = this;     	
    	
		if (me.users.getValue() != '')
   			me.cstore.load({params:{xml:_donate('_completed_order_customer_list', 'SELECT', ' ', ' ', ' ', me.users.getValue()+','+me.start.getText())}});

		me.store.load({params:{xml:_donate('Orders', 'SELECT', 'Orders as b JOIN Product on productCode=code', 'id,_date,userCode,customerCode,productCode,requestCount,confirmedCount,price,orderAmount,b.wareHouseID as wareHouseID,driver', 'i,s,s,s,f,f,i,s', " WHERE requestCount@0 and confirmedCount@0 and userCode='"+me.users.getValue()+"' and DATEADD(dd, 0, DATEDIFF(dd, 0, _date))='"+me.start.getText()+"' and flag=0 ORDER by class asc,_date desc,confirmedCount asc")},
			callback: function() {

			}});
    },
	
    createStore : function() {
    	var me = this;    
		
		me.cstore = Ext.create('Ext.data.JsonStore', {
    		fields: [        
    		    {name: '_date', type: 'string'},
    		    {name: 'customerCode', type: 'string'},
    		    {name: 'ticketID', type: 'int'},
    		    {name: 'amount', type: 'int'},
    		    {name: 'flag', type: 'int'}
    	    ],	        
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

		me.store1 = Ext.create('Ext.data.JsonStore', {
            fields: [
                {name: 'productCode'},
                {name: 'quantity'}
            ]
        });

    	me.columns = [
           {name: 'id', type: 'int', width: 50, title: 'Дд', hidden: true},
           {name: '_date', type: 'datetime', width: 115, title: Ext.sfa.translate_arrays[langid][341], renderer:Ext.util.Format.dateRenderer('Y-m-d h:i:s'), hidden: true},
           {name: 'userCode', type: 'string', width: 100, flex: 1, title: Ext.sfa.translate_arrays[langid][310], renderer: Ext.sfa.renderer_arrays['renderUserCode'], hidden:true},
           {name: 'customerCode', type: 'string', width: 100, flex: 1, title: Ext.sfa.translate_arrays[langid][310], renderer: Ext.sfa.renderer_arrays['renderCustomerCode'], hidden:true},
           {name: 'productCode', type: 'string', width: 240, title: Ext.sfa.translate_arrays[langid][345], renderer: Ext.sfa.renderer_arrays['renderProductCode']},            
           {name: 'requestCount', type: 'int', title: Ext.sfa.translate_arrays[langid][426], align: 'right', width: 70, summaryType: 'sum'},     
           {name: 'confirmedCount', type: 'int', title: Ext.sfa.translate_arrays[langid][421], align: 'right', width: 70, field: {xtype: 'numberfield'}, summaryType: 'sum'},
           {name: 'price', type: 'int', title: Ext.sfa.translate_arrays[langid][414], align: 'right', width: 70, field: {xtype: 'numberfield'}, renderer: Ext.sfa.renderer_arrays['renderMoney']},
           {name: 'orderAmount', type: 'int', title: Ext.sfa.translate_arrays[langid][455], align: 'right', width: 100, field: {xtype: 'numberfield'}, renderer: Ext.sfa.renderer_arrays['renderMoney'], summaryType: 'sum', summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney']},
           {name: 'wareHouseID', type: 'int', title: Ext.sfa.translate_arrays[langid][375], width: 85, renderer: Ext.sfa.renderer_arrays['renderWareHouseID']}                                 
        ];
    	
    	Ext.regModel('order', {	        
            fields: me.columns
        });
    	
    	me.store = Ext.create('Ext.data.JsonStore', {
            model: 'order',	        
			pageSize: 100,
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
    	
    	me.store_action = Ext.create('Ext.data.JsonStore', {
            model: 'order',	        
            proxy: {
    			type: 'ajax',
    			url: 'httpGW',
    			writer: {
    	           type: 'json'
    	        }
    		}
        });
    },        
    
    createGrid : function() {
    	var me = this;
    	me.createStore();    	    	
    	
    	me.summary1 = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		});

		me.group1 = 'back_group1';
		me.group2 = 'back_group2';
    	
    	me.grid1 = Ext.create('Ext.grid.GridPanel', {    		
    		xtype: 'grid',
    		border: false,
    		columnLines: true,
    		width: 400,
    		split: true,
    		region: 'west',
    		features: [me.summary1],
    		store: me.cstore,    				
    		columns: [new Ext.grid.RowNumberer({width:30}), {
                text     : 'Огноо',
                width	 : 100,
                sortable : true,
                align	 : 'center',                               
                dataIndex: '_date'                
            },{
                text     : Ext.sfa.translate_arrays[langid][466],
                flex	 : 1,
                sortable : true,                
                dataIndex: 'customerCode',
                renderer : Ext.sfa.renderer_arrays['renderCustomerCode']
            },{
                text     : Ext.sfa.translate_arrays[langid][455],
                width	 : 100,
                sortable : true,
                align	 : 'right',
                summaryType: 'sum',
                renderer: Ext.sfa.renderer_arrays['renderMoney'],
                summaryRenderer: Ext.sfa.renderer_arrays['renderTMoney'], 
                dataIndex: 'amount'                
            },{
                text     : '№',
                width	 : 60,
                sortable : true,
                hidden   : true,
                align	 : 'right',                               
                dataIndex: 'ticketID'                
            },{
                text     : '',
                width	 : 32,
                hidden   : true,
                sortable : true,                
                dataIndex: 'flag',
                renderer : function(v) {
                	if (v == 1) return 'VIP';
                	return '';
                }
            }]            
    	});   

    	me.grid1.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
            if (selectedRecord.length) {
                var rec = selectedRecord[0];
                me.customerCode = rec.data['customerCode'];
                me.ticketID = rec.data['ticketID'];
                me.loadStore1();
            }
        });    
    	
    	me.summary = Ext.create('Ext.grid.feature.Summary',{
		    ftype: 'summary'
		});
    	
    	me.grid = Ext.create('Ext.grid.Panel', {    		
    		xtype: 'grid',
    		columnLines: true,
			split: true,
			region: 'center',
			border: false,
    		store: me.store,		
			selModel: Ext.create('Ext.selection.CheckboxModel', {
				listeners: {
					selectionchange: function(sm, selections) {
						
					}
				}
			}),
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group1,
                    dropGroup: me.group2
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {                    	
						
                    }
                }
            },
    	    features: [me.summary],  
    		columns: me.createHeaders(me.columns)    		
    	});    	    


		me.grid2 = Ext.create('Ext.grid.Panel', {    		
    		xtype: 'grid',
			region: 'north',				
    		border: false,
			height: 200,
			split: true,
    		columnLines: true,
    		store: me.store1,
			viewConfig: {
                plugins: {
                    ptype: 'gridviewdragdrop',
                    dragGroup: me.group2,
                    dropGroup: me.group1
                },
                listeners: {
                    drop: function(node, data, dropRec, dropPosition) {                    	
                    	              	
                    }
                }
            },
    		columns: [new Ext.grid.RowNumberer({width:30}), {
                text     : 'Бараа',
                flex	 : 1,
                sortable : true,                            
                dataIndex: 'productCode'                
            },{
                text     : 'Буцаах тоо',
				width	 : 100,
                sortable : true,
                dataIndex: 'quantity',
				align    : 'right',
                renderer : Ext.sfa.renderer_arrays['renderNumber']
            }]              
    	});
    },
    
    createToolbar : function() {
    	var me = this;
    	
		me.start = me.generateDateField('ts_date1',currentDate);
    	me.wareHouse = this.generateLocalCombo('local_ware_house', 'ware_house', 'wareHouseID', 'name', Ext.sfa.translate_arrays[langid][509], 160);
    	me.users = this.generateRemoteCombo('_remote_ordered_user_names_pre', 'user_list', 'code', 'firstName', Ext.sfa.translate_arrays[langid][310]);    	    	    
    	
		me.buttons = [me.start, me.users, {
				text: 'Харах',
				iconCls: 'refresh',
				handler: function() {
					me.loadStore();
				}
			},
			{
				text: 'Бүгдийг харах',
				iconCls: 'refresh',
				handler: function() {
					me.loadStore2();
				}
			},'-',{
			text: Ext.sfa.translate_arrays[langid][421],
			iconCls: 'icon-apply',
			disabled: hidden_values['order_accept_edit'],
			handler: function() {	
				var records = me.grid.getView().getSelectionModel().getSelection();
				var drivers = me.grid2.getView().getSelectionModel().getSelection();
				me.acceptOrders(records, drivers);
			}
		},{
			text: Ext.sfa.translate_arrays[langid][366],
			iconCls: 'icon-delete',
			disabled: hidden_values['order_accept_edit'],
			handler: function() {
				var records = me.grid.getView().getSelectionModel().getSelection();
				if (records.length == 0) 
					Ext.MessageBox.alert('Error','Сонгогдоогүй байна', null);
				if (me.users.getValue() > '') {
					Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][548], function(btn, text){	                		
						if (btn == 'yes'){
							for (i = 0; i < records.length; i++) {                					
								var rec = records[i]; {        	                			
									me.store_action.load({params:{xml:_donate('delete', 'WRITER', 'Orders', ' ', ' ', " userCode='"+me.users.getValue()+"' and requestCount>0 and confirmedCount=0 and flag=0 and id="+rec.get('id'))},
														  callback: function(){
																
														  }});                										
								}
							}
							me.loadStore();
							
						} else {
				
						}
					});	                		
				} else 
					Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][539], null);	                	
			}
		}];

		me.addStandardButtons();
		
		return [{
			xtype: 'toolbar',
			items: me.buttons
		}];
    },

	acceptOrders: function(records, drivers) {
		var me = this;
		
		if (drivers.length == 0) {
			Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], 'Ачих жолоочийг сонгоно уу !', null);
			return;
		}

		if (records.length > 0) {
			Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][540], Ext.sfa.translate_arrays[langid][541], function(btn, text){	                		
				if (btn == 'yes'){	
					var p = 0;
					for (i = 0; i < records.length; i++) {
						var rec = records[i];
						var userCode = rec.get('userCode');    	                			    	                		
						var driver = drivers[0].get('userCode') 
						{									
							if (rec.get('confirmedCount') > 0 && rec.get('wareHouseID') && rec.get('availCount') >= rec.get('confirmedCount')) {
								var v = 's'+userCode+',s'+rec.get('customerCode')+',s'+rec.get('productCode')+',i'+rec.get('confirmedCount')+',i'+rec.get('wareHouseID')+',f'+rec.get('price')+',s'+driver;
								me.store_action.load({params:{xml:_donate('update', 'WRITER', 'Orders', 'userCode,customerCode,productCode,confirmedCount,wareHouseID,price,driver', v, ' id='+rec.get('id'))}});
								p = 1;
							} else
							if (rec.get('wareHouseID') && rec.get('availCount') >= rec.get('requestCount')) {
								var v = 's'+userCode+',s'+rec.get('customerCode')+',s'+rec.get('productCode')+',i'+rec.get('requestCount')+',i'+rec.get('wareHouseID')+',f'+rec.get('price')+',s'+driver;
								me.store_action.load({params:{xml:_donate('update', 'WRITER', 'Orders', 'userCode,customerCode,productCode,confirmedCount,wareHouseID,price,driver', v, ' id='+rec.get('id'))}});
								p = 1;
							}
						}
					}

					if (p == 1) {
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][557], function() {	                				                				                			
							me.loadStore();	 
							me.loadStore1();
							me.cstore.load({params:{xml:_donate('_order_customer_list', 'SELECT', ' ', ' ', ' ', me.users.getValue())}});
						});
					}
					else
						Ext.MessageBox.alert(Ext.sfa.translate_arrays[langid][538], Ext.sfa.translate_arrays[langid][547], null);
				} else {
		
				}
			});
		} else
			Ext.MessageBox.alert('Error','Сонгогдоогүй байна', null);
	}
});