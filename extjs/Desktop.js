Ext.define('Ext.ux.desktop.Desktop', {
    extend: 'Ext.panel.Panel',

    alias: 'widget.desktop',

    uses: [
        'Ext.util.MixedCollection',
        'Ext.menu.Menu',
        'Ext.view.View', // dataview
        'Ext.window.Window',
        
        'Ext.ux.Ticker',
        'OSS.TaskBar',
        'Ext.ux.desktop.Wallpaper'        
    ],

    activeWindowCls: 'ux-desktop-active-win',
    inactiveWindowCls: 'ux-desktop-inactive-win',
    lastActiveWindow: null,

    loadMask: true,
    border: false,
    html: '&#160;',
    layout: 'fit',

    xTickSize: 1,
    yTickSize: 1,

    app: null,

    /**
     * @cfg {Array|Store} shortcuts
     * The items to add to the DataView. This can be a {@link Ext.data.Store Store} or a
     * simple array. Items should minimally provide the fields in the
     * {@link Ext.ux.desktop.ShorcutModel ShortcutModel}.
     */
    shortcuts: null,

    /**
     * @cfg {String} shortcutItemSelector
     * This property is passed to the DataView for the desktop to select shortcut items.
     * If the {@link #shortcutTpl} is modified, this will probably need to be modified as
     * well.
     */
    shortcutItemSelector: 'div.ux-desktop-shortcut',

    /**
     * @cfg {String} shortcutTpl
     * This XTemplate is used to render items in the DataView. If this is changed, the
     * {@link shortcutItemSelect} will probably also need to changed.
     */
    shortcutTpl: [
        '<tpl for=".">',
            '<div class="ux-desktop-shortcut" id="{name}-shortcut" style="display: {hidden}">',
                '<div class="ux-desktop-shortcut-icon {iconCls}">',
                    '<img src="',Ext.BLANK_IMAGE_URL,'" title="{name}">',
                '</div>',
                '<span class="ux-desktop-shortcut-text">{name}</span>',
            '</div>',
        '</tpl>',
        '<div class="x-clear"></div>'
    ],
	
	tplData : new Ext.XTemplate(
   	        '<tpl for=".">',
   	            '<div id=\"tip\" style="width:50px; float:left"><a href=\'javascript:ossApp.callDetailModule(\"{userCode}\")\'><img width=48 height=48 src=\'shared/img/users/{userCode}.jpg\'></img></a></div>',
   	            '<div style="float:left;background: {[this.retColor(values)]}; overflow: hidden; display:inline;padding-left:5px"><table height="50px" width="195px" cellspacing=0><tr><td><b style="font-size:11px">{[this.renderUserCode(values)]}</b> <span style="font-size:9px; color:gray">|{utype}</span></td></tr><tr><td style="font-size:11px; color:green">₮&nbsp;{[this.renderMoneyValue(values)]}</span></td></tr><tr><td style="font-size:11px"><span style="color:gray">{[this.renderLastMod(values)]}</span><img src="images/space.png"/>{[this.renderBatteryLevel(values)]}<img src="images/space.png"/><a style="color:#3B5998; text-decoration: none;" href=\'javascript:ossApp.callDetailModule(\"{userCode}\")\'>{entry} цэг</a><img src="images/space.png"/><a style="color:#3B5998; text-decoration: none;" href=\'javascript:ossApp.callUserInfoModule(\"{userCode}\")\'>Илүү</a></td></tr></table></div>',
   	        '</tpl>',
   	        '<div class="x-clear"></div>',
   	        {
   	        	compiled:true,
   	        	retColor: function(v) {
   	        		if (v.row % 2 == 1) return "#EDEFF4";
   	        		else return "#FFFFFF";
   	        	},
   	        	renderUserCode: function(data) {
   	        		return Ext.sfa.renderer_arrays['renderUserCode'](data.userCode);
   	        	},
   	        	renderMoneyValue: function (v) {
   	        		if (hidden_values['show_money_value'] == 'off')
   	        			return '-.--';
   	        		
   	        		return Ext.util.Format.number(v.amount, '00,00,000.00');
   	        	},
   	        	renderLastMod: function(v) {
   	        		if (v.lastmod >= 60) return ((v.lastmod/60)|0) + ' цаг өмнө';
   	        		
   	        		return (v.lastmod + ' минут өмнө');
   	        	},
				renderBatteryLevel: function(v) {   	        		
   	        		return '<span class="battery"/>'+(v.batteryLevel + '%')+'</span>';
   	        	}
   	        }
   	 ),

    /**
     * @cfg {Object} taskbarConfig
     * The config object for the TaskBar.
     */
    taskbarConfig: null,

    windowMenu: null,
    
    id: 'my-desktop',    
    
    widgetType : '_infosale',
    widgetType_: '_sales_man',
	vanpre	   : false,

    initComponent: function () {    	
        var me = this;
        
        me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());

        me.bbar = me.taskbar = new OSS.TaskBar(me.taskbarConfig);
        me.taskbar.windowMenu = me.windowMenu;
        
        me.windows = new Ext.util.MixedCollection();

        me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());

        me.items = [
            { xtype: 'wallpaper', id: me.id+'_wallpaper' },
            me.createDataView()                    
        ];

        me.callParent();

        me.shortcutsView = me.items.getAt(1);
        me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);

        var wallpaper = me.wallpaper;
        me.wallpaper = me.items.getAt(0);
        if (wallpaper) {
            me.setWallpaper(wallpaper, me.wallpaperStretch);
        }   
        
        me.runTask();
    },        
    
    afterRender: function () {
        var me = this;
        me.callParent();
        me.el.on('contextmenu', me.onDesktopMenu, me);
    },        
        
    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',            
            overItemCls: 'x-view-over',
            trackOver: true,            
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            x: 0, y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },

    createDesktopMenu: function () {
        var me = this, ret = {
            items: me.contextMenuItems || []
        };

        if (ret.items.length) {
            ret.items.push('-');
        }

        ret.items.push(
                { text: 'Tile', handler: me.tileWindows, scope: me, minWindows: 1 },
                { text: 'Cascade', handler: me.cascadeWindows, scope: me, minWindows: 1 })

        return ret;
    },

    createWindowMenu: function () {
        var me = this;
        return {
            defaultAlign: 'br-tr',
            items: [
                { text: 'Restore', handler: me.onWindowMenuRestore, scope: me },
                { text: 'Minimize', handler: me.onWindowMenuMinimize, scope: me },
                { text: 'Maximize', handler: me.onWindowMenuMaximize, scope: me },
                '-',
                { text: 'Close', handler: me.onWindowMenuClose, scope: me }
            ],
            listeners: {
                beforeshow: me.onWindowMenuBeforeShow,
                hide: me.onWindowMenuHide,
                scope: me
            }
        };
    },

    //------------------------------------------------------
    // Event handler methods

    onDesktopMenu: function (e) {
        var me = this, menu = me.contextMenu;
        e.stopEvent();
        if (!menu.rendered) {
            menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
        }
        menu.showAt(e.getXY());
        menu.doConstrain();
    },

    onDesktopMenuBeforeShow: function (menu) {
        var me = this, count = me.windows.getCount();

        menu.items.each(function (item) {
            var min = item.minWindows || 0;
            item.setDisabled(count < min);
        });
    },

    onShortcutItemClick: function (dataView, record) {
    	var moduleId  = record.data.module;
    	if (hidden_values[moduleId]) {
    		Ext.MessageBox.alert('warning', 'Хандалтыг зөвшөөрөхгүй !', function() {
    			
    		});
    		return;
    	}
    	
        var me = this, module = me.app.getModule(record.data.module),
            win = module && module.createWindow();

        if (win) {
            me.restoreWindow(win);
        }
    },

    onWindowClose: function(win) {
        var me = this;        
        me.windows.remove(win);
        me.taskbar.removeTaskButton(win.taskButton);
        me.updateActiveWindow();
    },

    //------------------------------------------------------
    // Window context menu handlers

    onWindowMenuBeforeShow: function (menu) {
        var items = menu.items.items, win = menu.theWin;
        items[0].setDisabled(win.maximized !== true && win.hidden !== true); // Restore
        items[1].setDisabled(win.minimized === true); // Minimize
        items[2].setDisabled(win.maximized === true || win.hidden === true); // Maximize
    },

    onWindowMenuClose: function () {    	
        var me = this, win = me.windowMenu.theWin;        
        win.close();
    },

    onWindowMenuHide: function (menu) {
        menu.theWin = null;
    },

    onWindowMenuMaximize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.maximize();
    },

    onWindowMenuMinimize: function () {
        var me = this, win = me.windowMenu.theWin;

        win.minimize();
    },

    onWindowMenuRestore: function () {
        var me = this, win = me.windowMenu.theWin;

        me.restoreWindow(win);
    },

    //------------------------------------------------------
    // Dynamic (re)configuration methods

    getWallpaper: function () {
        return this.wallpaper.wallpaper;
    },

    setTickSize: function(xTickSize, yTickSize) {
        var me = this,
            xt = me.xTickSize = xTickSize,
            yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;

        me.windows.each(function(win) {
            var dd = win.dd, resizer = win.resizer;
            dd.xTickSize = xt;
            dd.yTickSize = yt;
            resizer.widthIncrement = xt;
            resizer.heightIncrement = yt;
        });
    },

    setWallpaper: function (wallpaper, stretch) {
        this.wallpaper.setWallpaper(wallpaper, stretch);
        return this;
    },

    //------------------------------------------------------
    // Window management methods

    cascadeWindows: function() {
        var x = 0, y = 0,
            zmgr = this.getDesktopZIndexManager();

        zmgr.eachBottomUp(function(win) {
            if (win.isWindow && win.isVisible() && !win.maximized) {
                win.setPosition(x, y);
                x += 20;
                y += 20;
            }
        });
    },    
    
    createWindow: function(config, cls) {    	    	
        var me = this, win, cfg = Ext.applyIf(config || {}, {
                stateful: false,
                isWindow: true,
                constrainHeader: true,
                minimizable: true,
                maximizable: true,
                defaultScaleCfg: {
                    duration: 0,
                    easing: 'easeNone'
                }
            });

        cls = cls || Ext.window.Window;
        win = me.add(new cls(cfg));        
        me.windows.add(win);

        win.taskButton = me.taskbar.addTaskButton(win);
        win.animateTarget = win.taskButton.el;

        win.on({
            activate: me.updateActiveWindow,
            beforeshow: me.updateActiveWindow,
            deactivate: me.updateActiveWindow,
            minimize: me.minimizeWindow,
            destroy: me.onWindowClose,
            scope: me
        });

        win.on({
            boxready: function () {
                win.dd.xTickSize = me.xTickSize;
                win.dd.yTickSize = me.yTickSize;

                if (win.resizer) {
                    win.resizer.widthIncrement = me.xTickSize;
                    win.resizer.heightIncrement = me.yTickSize;
                }
            },
            single: true
        });

        // replace normal window close w/fadeOut animation:
        win.doClose = function ()  {
            win.doClose = Ext.emptyFn; // dblclick can call again...
            win.el.disableShadow();
            win.el.fadeOut({
                listeners: {
                    afteranimate: function () {
                        win.destroy();
                    }
                }
            });
        };
                       
        return win;
    },

    getActiveWindow: function () {
        var win = null,
            zmgr = this.getDesktopZIndexManager();

        if (zmgr) {
            // We cannot rely on activate/deactive because that fires against non-Window
            // components in the stack.

            zmgr.eachTopDown(function (comp) {
                if (comp.isWindow && !comp.hidden) {
                    win = comp;
                    return false;
                }
                return true;
            });
        }

        return win;
    },

    getDesktopZIndexManager: function () {
        var windows = this.windows;
        // TODO - there has to be a better way to get this...
        return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
    },

    getWindow: function(id) {    	
        return this.windows.get(id);
    },

    minimizeWindow: function(win) {
        win.minimized = true;
        win.hide();
    },

    restoreWindow: function (win) {
        if (win.isVisible()) {
            win.restore();
            win.toFront();
        } else {
            win.show();
        }
        return win;
    },

    tileWindows: function() {
        var me = this, availWidth = me.body.getWidth(true);
        var x = me.xTickSize, y = me.yTickSize, nextY = y;

        me.windows.each(function(win) {
            if (win.isVisible() && !win.maximized) {
                var w = win.el.getWidth();

                // Wrap to next row if we are not at the line start and this Window will
                // go off the end
                if (x > me.xTickSize && x + w > availWidth) {
                    x = me.xTickSize;
                    y = nextY;
                }

                win.setPosition(x, y);
                x += w + me.xTickSize;
                nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
            }
        });
    },

    updateActiveWindow: function () {
        var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
        if (activeWindow === last) {
            return;
        }

        if (last) {
            if (last.el.dom) {
                last.addCls(me.inactiveWindowCls);
                last.removeCls(me.activeWindowCls);
            }
            last.active = false;
        }

        me.lastActiveWindow = activeWindow;

        if (activeWindow) {
            activeWindow.addCls(me.activeWindowCls);
            activeWindow.removeCls(me.inactiveWindowCls);
            activeWindow.minimized = false;
            activeWindow.active = true;
        }

        me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
    },
	
	createMainSaleWindow: function() {
    	 var me = this;
    	 me.infoFields = [         
    	       	         {name: 'data', type: 'string'},         
    	       	         {name: 'count', type: 'float'},
    	       	         {name: 'detail', type: 'string'},
    	       	         {name: 'render', type: 'string'}
    	 ];

    	 Ext.regModel('infosale', {
    	     idProperty: 'data',
    	     fields: me.infoFields
    	 });

    	 me.infoStore = Ext.create('Ext.data.JsonStore', {
    	     model: 'infosale',     	        
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
    	 
    	function renderTopic(value, p, record) {
    		if (me.widgetType == '_infolease') {
		        return Ext.String.format(
		            '<b>{0}</b><br>{1}',
		            value,
		            record.data.detail
		        );
    		} else
    		if (me.widgetType == '_infosale') {
		        return Ext.String.format(
		            '<b>{0}</b><br>{1}',
		            rendererLanguage(value),
		            record.data.detail
		        );
    		} else
    		if (me.widgetType == '_info_product_count') {
    			return Ext.String.format(
    		            '<b>{0}</b><br>{1}',
    		            value,
    		            Ext.sfa.renderer_arrays['renderStorageNumber'](record.data.detail, ' ', record.data)	          
    		    );
    		}
    		else
			if (me.widgetType == '_info_users_sale') {
    			return Ext.String.format(
    		            '<b>{0}</b><br>{1}',
    		            value,
    		            record.data.detail	            
    		    );
    		}	
	    }    	    	
		
		Ext.define("google", {
			extend: 'Ext.data.Model',
			proxy: {
				type: 'ajax',
				url : 'httpGW',
				reader: {
					type: 'json',
	                root:'items',
	                totalProperty: 'results'
	            }
			},

			fields: [
				{name: 'code', type: 'string'},
				{name: 'name', type: 'string'},
				{name: 'type', type: 'string'},
			    {name: 'lastPost', type: 'date', dateFormat: 'timestamp'},
				{name: 'descr', type: 'string'}
			]
		});

		me.ds = Ext.create('Ext.data.Store', {
			model: 'google'
		});

    	me.infoPanel = Ext.create('Ext.grid.GridPanel', {	        
	        xtype: 'grid',
	        store: me.infoStore,	        
	        region: 'center',
			columnLines: true,					
			border: true,			
			columns: [{			
				text: '',			
		   		dataIndex: 'data',
		   		renderer: renderTopic,
		   		flex: 1
			},{
				text: '', 
		   		dataIndex: 'count',
		   		align: 'right',
		   		renderer: renderFind,
		   		width:140
			}],
			bbar: [{
                   	text: '',
                   	iconCls: 'refresh',
                   	handler: function() {
                   		me.loadStore();
                   	}
                   },{
						xtype: 'combo',
						store: me.ds,
						displayField: 'title',
						typeAhead: false,
						hideLabel: true,
						hideTrigger:true,
						flex: 1,
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
				   },
				   {
						text: '',
						iconCls: 'search_icon',						
						handler: function() {

						}
				   },
				  '-',
                   {
	               	text: '',
	               	iconCls: 'updown',
	               	handler: function() {
	               		var win = me.getWindow('info-grid-win');
	               		if (win.y == -450)
	               			win.setPosition(me.getWidth() - 362, -48);
	               		else
	               			win.setPosition(me.getWidth() - 362, -450);
	               	}
            }]
	    });
    	me.loadStore();    	
    	    	
    	                  
        var win = me.getWindow('info-grid-win');        
        if(!win){                	
            win = me.createGadget({
                id: 'info-grid-win',                
                width:410,
                height:480,//530,
                maxWidth: 410,
                maxHeight: 480,
            	draggable: false,            	
                x : me.getWidth() - 412,
                y : -48,// -60, 
                iconCls: 'icon-grid',
                animCollapse:false,                
                closeable: false,
                resizeable: false,
                frame: false,
                constrainHeader: false,
                minimizable: false,
                maximizable: false,
                border: false,
                layout: 'border',
                listeners: {
                    afterrender: {
                        fn: me.runTask,
                        delay: 1000
                    },
                    destroy: function () {
                        clearTimeout(me.updateTimer);
                        me.updateTimer = null;
                    },
                    scope: me
                },
                items: [me.infoPanel]                      
            });
                       
        }
        win.show();
                
        return win;   
    },

	createSalesManWindow: function() {
    	var me = this;    	    	    
    	
    	me.manFields = [         
	         {name: 'userCode', type: 'string'},
	         {name: 'lastmod', type: 'int'},
	         {name: 'utype', type: 'string'},
	         {name: 'amount', type: 'float'},
	         {name: 'entry', type: 'int'},
	         {name: 'noentry', type: 'int'},
	         {name: 'batteryLevel', type: 'int'},
	         {name: 'row', type: 'int'}
    	];
    	
    	Ext.regModel('mansale', {
	   	     idProperty: 'data',
	   	     fields: me.manFields
   	 	});

	   	me.manStore = Ext.create('Ext.data.JsonStore', {
	   	     model: 'mansale',     	        
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

   	    var dataV = new Ext.DataView({   	    	
   	        autoScroll: true,
   	        store: me.manStore,
   	        tpl: me.tplData,   	        
   	        autoHeight: true,	
   	        autoWidth: true,
			height: 400,
   	        itemSelector: 'div.thumb-wrap',
   	        emptyText: 'No data to display',
   	        loadingText: 'Please Wait...',
   	        style: 'border:0px solid #99BBE8; padding: 5px;'
   	    });
	   		   	    	 
	   	me.manPanel = Ext.create('Ext.panel.Panel', {
	   		id: 'sales_mans',
	   		region: 'center',	 
	   		border: true,
	        items: [dataV],
	        bbar: [{
            	text: 'Захиалгаар',
                iconCls: 'leasing',
                enableToggle: true,
				hidden: me.vanpre,
                pressed: me.vanpre,
                toggleHandler: function(item, pressed) {
                	if (pressed) {                		
                		me.widgetType_ = '_orders_man';
                		me.loadStore();
                	} else {                		
                		me.widgetType_ = '_sales_man';
                		me.loadStore();
                	}
                }  
            }]
	   	});
			
	   	Ext.create('Ext.tip.ToolTip', {
	         target: 'sales_mans',
	         title: 'My Tip Title',
	         html: 'Click the X to close me',
	         autoHide : false,
	         closable : true,
	         draggable: true
	     });
	   	
	   	me.loadStore();
        var win = me.getWindow('sales-man-grid-win');        
        if(!win){                	
            win = me.createGadget({
                id: 'sales-man-grid-win',                
                width:290,
                height:460,//530,    
                maxHeight: 460,
                maxWidth: 310,
            	draggable: false,            	
                x : me.getWidth() - 382 - 322,
                y : -28,// -60, 
                animCollapse:false,                
                closeable: false,
                frame: false,
                border: false,
                resizeable: false,
                constrainHeader: false,
                minimizable: false,
                maximizable: false,
                layout: 'border',                
                listeners: {
                    afterrender: {
                        fn: me.runTask,
                        delay: 1000
                    },
                    destroy: function () {
                        clearTimeout(me.updateTimer);
                        me.updateTimer = null;
                    },
                    scope: me
                },
                items: [me.manPanel]                               
            });
        }
        win.show();
                
        return win;   
    },

	loadStore: function() {    	
    	var me = this;    	
    	if (me.infoStore) {     		
    		me.infoStore.load({params:{xml:_donate(me.widgetType, 'SELECT', 'infosale', ' ', ' ', currentDate+','+nextDate+','+productSelection+','+logged+','+mode)}, callback: function() {    			
			    	var store = me.infoStore.queryBy(function fn(record,id) {			    			
						    return record.get('data') == 353; 
					}); 
						
					store.each(function(rec){
						me.sum_total = Ext.sfa.translate_arrays[langid][309]+' = ' + renderMoneyValue(rec.data['count'])+' төгрөг';						
					});	    				    
    		}});
    	}
    	
    	if (me.manStore) {
    		me.manStore.load({params:{xml:_donate(me.widgetType_, 'SELECT', 'sales_man', ' ',' ', logged+','+mode)}});
    	}
    },
    
    createDataView: function () {
        var me = this;
        return {
            xtype: 'dataview',            
            overItemCls: 'x-view-over',
            trackOver: true,            
            itemSelector: me.shortcutItemSelector,
            store: me.shortcuts,
            style: {
                position: 'absolute'
            },
            x: 0, y: 0,
            tpl: new Ext.XTemplate(me.shortcutTpl)
        };
    },   
    
    createGadget: function(config, cls) {
        var me = this, win, cfg = Ext.applyIf(config || {}, {
                stateful: false,
                isWindow: false,
                closeable: false,
                constrainHeader: false,
                minimizable: false,
                maximizable: false
        });

        cls = cls || Ext.window.Window;
        win = me.add(new cls(cfg));
        
        me.windows.add(win);        

        return win;
    }   
});

