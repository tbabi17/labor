Ext.define('Ext.ux.desktop.App', {
	mixins:{observable:'Ext.util.Observable'},

	requires: [
		'Ext.container.Viewport',
        'Ext.window.MessageBox',
        'Ext.ux.desktop.ShortcutModel',

        'OSS.Desktop',       
        'OSS.SaleGridWindow',        
        'OSS.DetailGridWindow',
        'OSS.SaleGraphWindow',
        'OSS.OrderGridWindow',
        'OSS.OrderGridWindowPre',        
        'OSS.CompleteOrderGridWindow',
        'OSS.CompleteOrderGridWindowPre',       
        'OSS.LeaseModulePanel',        
        'OSS.Settings',
        'OSS.ControlPanel',    
		'OSS.SaleModulePanel',
		'OSS.StorageModulePanel',
        'OSS.ManualModulePanel',
        'OSS.MapModulePanel',
        'OSS.ReportModulePanel',
		'OSS.SpecialWorkPanel',
        'OSS.KernelPanel',
        'OSS.StorageInsert',
        'OSS.ImageWindow',
        'OSS.UpdateSalesData',        
        'OSS.UserPlanComplete',                
        'OSS.PadaanSalesData',
        'OSS.UserStatWindow',
        'OSS.LeaseGridWindow',
        'OSS.RouteChanger',
		'OSS.UserCurrentStorage',
		'OSS.SearchInfoWindow',
		'OSS.PlanInsertWindow',
		'OSS.PlanDeleteWindow',
		'OSS.LeaseCustomerMonthly',
		'OSS.CustomerSalesReport',
		'OSS.StorageToStorage'
    ],

	isReady:false,
	modules:null,
	useQuickTips:true,
	constructor:function(config){
		var me=this;
		me.addEvents('ready','beforeunload');
		me.mixins.observable.constructor.call(this,config);
		if(Ext.isReady){
			Ext.Function.defer(me.init,10,me)
		}else{
			Ext.onReady(me.init,me)
		}
	},
	
	init:function(){
		var me=this,desktopCfg;
		if(me.useQuickTips){
			Ext.QuickTips.init()
		}
		
		me.modules=me.getModules();
		me.extend=me.getExtendModules();
		me.modules=me.modules.concat(me.extend);
		if(me.modules){
			me.initModules(me.modules)
		}
		desktopCfg=me.getDesktopConfig();
		me.desktop=new OSS.Desktop(desktopCfg);
		me.viewport=new Ext.container.Viewport({layout:'fit',items:[me.desktop]});
		Ext.EventManager.on(window,'beforeunload',me.onUnload,me);
		me.isReady=true;
		me.fireEvent('ready',me);

		me.desktop.createMainSaleWindow();
        me.desktop.createSalesManWindow();   
	},
	
	getDesktopConfig:function(){
		var me=this,cfg={app:me,taskbarConfig:me.getTaskbarConfig()};
		Ext.apply(cfg,me.desktopConfig);
		return cfg
	},
	
	//getModules:Ext.emptyFn,
	
	getModules : function(){
        return [            
            new OSS.SaleGridWindow(),            
            new OSS.DetailGridWindow(),
            new OSS.SaleGraphWindow(),
            new OSS.OrderGridWindow(),
            new OSS.OrderGridWindowPre(),            
            new OSS.CompleteOrderGridWindow(),
            new OSS.CompleteOrderGridWindowPre(),
            new OSS.LeaseModulePanel(),
            new OSS.ControlPanel(),
            new OSS.SaleModulePanel(),
			new OSS.StorageModulePanel(),
            new OSS.ModulePanel(),
            new OSS.ManualModulePanel(),
            new OSS.MapModulePanel(),
            new OSS.ReportModulePanel(),
			new OSS.SpecialWorkPanel(),
            new OSS.KernelPanel(),
            new OSS.StorageInsert(),            
            new OSS.ImageWindow(),
            new OSS.UpdateSalesData(),            
            new OSS.UserPlanComplete(),                        
            new OSS.RouteCustomerSalesData(),
            new OSS.PadaanSalesData(),
            new OSS.UserStatWindow(),
            new OSS.LeaseGridWindow(),
			new OSS.RouteChanger(),
			new OSS.UserCurrentStorage(),
			new OSS.SearchInfoWindow(),
			new OSS.PlanInsertWindow(),
			new OSS.PlanDeleteWindow(),
			new OSS.LeaseCustomerMonthly(),
			new OSS.CustomerSalesReport(),
			new OSS.StorageToStorage()
        ];
    },

	getExtendModules : function() {
		return [];
	},

	getStartConfig:function(){
		var me=this,cfg={app:me,menu:[]};
		Ext.apply(cfg,me.startConfig);
		Ext.each(me.modules,function(module){
			if(module.launcher){
				cfg.menu.push(module.launcher)
		}});
		return cfg
	},
	
	getTaskbarConfig:function(){
		var me=this,cfg={app:me,startConfig:me.getStartConfig()};
		Ext.apply(cfg,me.taskbarConfig);
		return cfg
	},
	
	initModules:function(modules){
		var me=this;
		Ext.each(modules,function(module){
			module.app=me
		})
	},
	
	addModule:function(module){
		var ms=this.modules;
		module.app=this;
//		this.removeModule(module.id);
		ms.push(module)
	},
	
	removeModule:function(name){
		var ms=this.modules;
		for(var i=0,len=ms.length;i<len;i++){
			var m=ms[i];
			if(m.id==name||m.appType==name)
				{ms.splice(i,1)}
			}
	},
	
	getModule:function(name){
		var ms=this.modules;
		for(var i=0,len=ms.length;i<len;i++){
			var m=ms[i];
			if(m.id==name||m.appType==name)
				return m;
		}
		return null;
	},
			
	onReady:function(fn,scope){if(this.isReady){fn.call(scope,this)}else{this.on({ready:fn,scope:scope,single:true})}},
	
	getDesktop:function(){
		return this.desktop;
	},
			
	onBoxMode: function () {
      	box = !box;
    },
    
    onLogout: function () {
        Ext.Msg.confirm(Ext.sfa.translate_arrays[langid][308], Ext.sfa.translate_arrays[langid][594], function(btn) {
        	if (btn == 'yes') {
        		document.location.href = '?action=logout';
        	}
        });                
    },

    onSettings: function () {    	    	
        var dlg = new OSS.Settings({
            desktop: this.desktop
        });
        dlg.show();
    },
    
    onAbout: function () {    	    	
    	Ext.create('Ext.Window', {
            title: 'Програмын тухай',
            width: 380,
            height: 150,                        
            modal: true,            
            layout: 'fit',
            items: {
                border: false,
                html: '<html><head><style>body {background-image:url(\'images/mxc.jpg\');}</style></head>'+
                	 	'<body><p align="center" style="background-image:url(\'images/mxc.jpg\'); padding:30px; line-height: 18px">'+
      	  						'Optimal Sales System (4.0.31013)<br>'+
      	  						'&copy 2011-2013 MXC LLC. All rights reserved (Монгол Улс)'+
      	  				'</p></body>'+
      	  			  '</html>'
            }
        }).show();
    },
		
	startBarCfg : function() {
		var me = this;
		return {
			title: Ext.sfa.translate_arrays[langid][520] + ' : ' + logged,
			iconCls: 'user',
			height: 300,
			toolConfig: {
				width: 100,
				items: [					
					{
						text:Ext.sfa.translate_arrays[langid][525],
						iconCls:'settings',
						handler: me.onSettings,
						scope: me
					},
					{
						text: 'Хувилбар',
						iconCls:'about',
						handler: me.onAbout,
						scope: me
					},
					'-',
					{
						text:Ext.sfa.translate_arrays[langid][308],
						iconCls:'logout',
						handler: me.onLogout,
						scope: me
					}
				]
			}
		};
	},

	taskBarCfg: function() {
		var me = this;
		return {
            quickStart: [
                    { name: Ext.sfa.translate_arrays[langid][260], iconCls: 'refresh', text: '<b>'+mode+'</b>', module: 'sale-view-mode', disabled: (module!=15)},                	
                    { name: Ext.sfa.translate_arrays[langid][263], iconCls: 'lavlagaa', module: 'control-panel' },
                    { name: Ext.sfa.translate_arrays[langid][308], iconCls: 'logout', module: 'logout' }
            ],
            notify: [
               { name: 'Notification', iconCls: 'notify', id: 'notify'},
               { name: 'Language', iconCls: langid, id: 'language'}
            ],
            trayItems: [
                { xtype: 'trayclock', flex: 1 }
            ]
        };
	},

	desktopCfg: function() {
		var me = this;
		return { 
            contextMenuItems: [
                { text: 'Wallpaper', handler: me.onSettings, scope: me }
            ],
            shortcuts: Ext.create('Ext.data.Store', {
                model: 'Ext.ux.desktop.ShortcutModel',
                data: [                       
                    { name: Ext.sfa.translate_arrays[langid][501], iconCls: 'grid-shortcut', hidden: hidden_values['sale-module-win'], module: 'sale-module-win' },                    
                    { name: Ext.sfa.translate_arrays[langid][507], iconCls: 'lease_desktop', hidden: hidden_values['lease-module-win'], module: 'lease-module-win' },
                    { name: Ext.sfa.translate_arrays[langid][509], iconCls: 'storage_desktop', hidden: hidden_values['storage-module-win'], module: 'storage-module-win' },                    
                    { name: Ext.sfa.translate_arrays[langid][514], iconCls:'map-shortcut', hidden: hidden_values['google-map-win'], module:'google-map-win'},              
                    { name: Ext.sfa.translate_arrays[langid][524], iconCls:'report-shortcut', hidden: hidden_values['report-module-win'], module:'report-module-win'}                                       
                ]
            }),
            wallpaper: 'images/wallpapers/ios_7_galaxy-wide.jpg',
            wallpaperStretch: true
        };
	},
	
	createModule: function(nodes, name, param, c) {    	
	    var	module = new OSS.KernelPanel();
		module.id = name;
		module.appType = name;
		ossApp.addModule(module);
		module.disableAutoLoad();
		module.createWindow(nodes[0], nodes[1], nodes[3], nodes[2], nodes[4], nodes[5], nodes[6]);
		if (param != '') {
			module.loadStorParameterCombo(param, c);
			module.loadStore();
		}
    },

	callDetailModule: function(code) {    	
    	var me = this;
    	userCode = code;
		me.callModule('detail-grid-win');
    },
    
	callSearchModule: function(code) {    	
    	var me = this;
    	userCode = code;
		me.callModule('search-info-win');
    },

    callImageModule: function(code) {    	
    	var me = this;
    	customerCode = code;
		me.callModule('special-work-image-win');
    },

	callDataModule: function(code,uCode) {    	
    	var me = this;
    	customerCode = code;
    	userCode = uCode;
		me.callModule('padaan-sales-data-win');
    },

	callUserInfoModule: function(uCode) {    	
    	var me = this;
    	userCode = uCode;
		me.callModule('search-info-win');
    },
    
    callModule: function(name) {    	
    	var module = this.getModule(name),                        		                        		
		win = module && module.createWindow();
    	
    	if (win)
        	ossApp.getDesktop().restoreWindow(win);  
    },

	callPromoModule: function() {
    	var me = this;
    	var nodes = ['Promotion_Accept', '_promotion_accept', Ext.sfa.translate_arrays[langid][659], ' ', 600, 400, 'promo-grid-module'];
    	
    	var	module = new OSS.KernelPanel();
		module.id = '_promotion_accept';
		module.appType = '_promotion_accept';
		ossApp.addModule(module);
		module.disableAutoLoad();
		module.createWindow(nodes[0], nodes[1], nodes[3], nodes[2], nodes[4], nodes[5], nodes[6]);
		module.loadStore();
    },        
    
    callSpecModule: function(name, param) {    	
    	if (name == 'LeaseReturn') {
    		showLeaseReturn();
    	} else
    	if (name == 'Spec_user') {
    		userCode = param;
    		showUserInfoSpecial();
    	} else
    	if (name == 'Hand_order') {
    		showOrderHandImportWindow();
    	} else 
		if (name == 'Hand_sale') {
			showSaleHandImportWindow();
    	} else 
    	if (name == 'Packet') {
    		showPacketForm();
    	}  
    },

	onUnload:function(e){if(this.fireEvent('beforeunload',this)===false){e.stopEvent()}}});