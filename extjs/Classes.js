Ext.define('Ext.ux.desktop.StartMenu',{extend:'Ext.panel.Panel',requires:['Ext.menu.Menu','Ext.toolbar.Toolbar'],ariaRole:'menu',cls:'x-menu ux-start-menu',defaultAlign:'bl-tl',iconCls:'user',floating:true,shadow:true,width:300,initComponent:function(){var me=this,menu=me.menu;me.menu=new Ext.menu.Menu({cls:'ux-start-menu-body',border:false,floating:false,items:menu});me.menu.layout.align='stretch';me.items=[me.menu];me.layout='fit';Ext.menu.Manager.register(me);me.callParent();me.toolbar=new Ext.toolbar.Toolbar(Ext.apply({dock:'right',cls:'ux-start-menu-toolbar',vertical:true,width:100},me.toolConfig));me.toolbar.layout.align='stretch';me.addDocked(me.toolbar);delete me.toolItems;me.on('deactivate',function(){me.hide()})},addMenuItem:function(){var cmp=this.menu;cmp.add.apply(cmp,arguments)},addToolItem:function(){var cmp=this.toolbar;cmp.add.apply(cmp,arguments)},showBy:function(cmp,pos,off){var me=this;if(me.floating&&cmp){me.layout.autoSize=true;me.show();cmp=cmp.el||cmp;var xy=me.el.getAlignToXY(cmp,pos||me.defaultAlign,off);if(me.floatParent){var r=me.floatParent.getTargetEl().getViewRegion();xy[0]-=r.x;xy[1]-=r.y}me.showAt(xy);me.doConstrain()}return me}});
Ext.define('Ext.ux.desktop.Wallpaper',{extend:'Ext.Component',alias:'widget.wallpaper',cls:'ux-wallpaper',html:'<img src="'+Ext.BLANK_IMAGE_URL+'">',stretch:false,wallpaper:null,afterRender:function(){var me=this;me.callParent();me.setWallpaper(me.wallpaper,me.stretch)},applyState:function(){var me=this,old=me.wallpaper;me.callParent(arguments);if(old!=me.wallpaper){me.setWallpaper(me.wallpaper)}},getState:function(){return this.wallpaper&&{wallpaper:this.wallpaper}},setWallpaper:function(wallpaper,stretch){var me=this,imgEl,bkgnd;me.stretch=(stretch!==false);me.wallpaper=wallpaper;if(me.rendered){imgEl=me.el.dom.firstChild;if(!wallpaper||wallpaper==Ext.BLANK_IMAGE_URL){Ext.fly(imgEl).hide()}else if(me.stretch){imgEl.src=wallpaper;me.el.removeCls('ux-wallpaper-tiled');Ext.fly(imgEl).setStyle({width:'100%',height:'100%'}).show()}else{Ext.fly(imgEl).hide();bkgnd='url('+wallpaper+')';me.el.addCls('ux-wallpaper-tiled')}me.el.setStyle({backgroundImage:bkgnd||''})}return me}});
Ext.define('OSS.Settings',{extend:'Ext.window.Window',uses:['Ext.tree.Panel','Ext.tree.View','Ext.form.field.Checkbox','Ext.layout.container.Anchor','Ext.layout.container.Border','Ext.ux.desktop.Wallpaper','OSS.WallpaperModel'],layout:'anchor',title:'Wallpaper',modal:true,width:640,height:480,border:false,initComponent:function(){var me=this;me.selected=me.desktop.getWallpaper();me.stretch=me.desktop.wallpaper.stretch;me.preview=Ext.create('widget.wallpaper');me.preview.setWallpaper(me.selected);me.tree=me.createTree();me.buttons=[{text:'OK',handler:me.onOK,scope:me},{text:'Cancel',handler:me.close,scope:me}];me.items=[{anchor:'0 -30',border:false,layout:'border',items:[me.tree,{xtype:'panel',title:'Preview',region:'center',layout:'fit',items:[me.preview]}]},{xtype:'checkbox',boxLabel:'Stretch to fit',checked:me.stretch,listeners:{change:function(comp){me.stretch=comp.checked}}}];me.callParent()},createTree:function(){var me=this;function child(img){return{img:img,text:me.getTextOfWallpaper(img),iconCls:'',leaf:true}}var tree=new Ext.tree.Panel({title:'Desktop Background',rootVisible:false,lines:false,autoScroll:true,width:150,region:'west',split:true,minWidth:100,listeners:{afterrender:{fn:this.setInitialSelection,delay:100},select:this.onSelect,scope:this},store:new Ext.data.TreeStore({model:'OSS.WallpaperModel',root:{text:'Wallpaper',expanded:true,children:[{text:"None",iconCls:'',leaf:true},child('blue_sparks.jpg'),child('blue_horizon.jpg'),child('matrix.jpg'),child('merry.jpg'),child('pw_maze_black.png'),child('pw_maze_gray.png')]}})});return tree},getTextOfWallpaper:function(path){var text=path,slash=path.lastIndexOf('/');if(slash>=0){text=text.substring(slash+1)}var dot=text.lastIndexOf('.');text=Ext.String.capitalize(text.substring(0,dot));text=text.replace(/[-]/g,' ');return text},onOK:function(){var me=this;if(me.selected){me.desktop.setWallpaper(me.selected,me.stretch)}me.destroy()},onSelect:function(tree,record){var me=this;if(record.data.img){me.selected='images/wallpapers/'+record.data.img}else{me.selected=Ext.BLANK_IMAGE_URL}me.preview.setWallpaper(me.selected)},setInitialSelection:function(){var s=this.desktop.getWallpaper();if(s){var path='/Wallpaper/'+this.getTextOfWallpaper(s);this.tree.selectPath(path,'text')}}});

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
   	            '<div id=\"tip\" style="width:50px; float:left"><a href=\'javascript:ossApp.callDetailModule(\"{userCode}\")\'><img width=48 height=48 src=\'shared/img/users/{userCode}.png\'></img></a></div>',
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
   	        		if (hidden_values['show_money_value'])
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
                pressed: (me.widgetType_ == '_orders_man'),
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


Ext.define('OSS.TaskBar', {
    extend: 'Ext.toolbar.Toolbar', // TODO - make this a basic hbox panel...

    requires: [
        'Ext.button.Button',
        'Ext.resizer.Splitter',
        'Ext.menu.Menu',        
        'Ext.ux.desktop.StartMenu'
    ],

    alias: 'widget.taskbar',

    cls: 'ux-taskbar',

    /**
     * @cfg {String} startBtnText
     * The text for the Start Button.
     */
    startBtnText: 'OSS',

    initComponent: function () {
        var me = this;

        me.startMenu = new Ext.ux.desktop.StartMenu(me.startConfig);

        me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());

        me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());

        me.notifybar = new Ext.toolbar.Toolbar(me.getNotification());                
        
        me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());

        me.items = [
            {
                xtype: 'button',
                cls: 'ux-start-button',
                iconCls: 'ux-start-button-icon',
                menu: me.startMenu,
                menuAlign: 'bl-tl',
                text: me.startBtnText
            },
            me.quickStart,
            {
                xtype: 'splitter', html: '&#160;',
                height: 14, width: 2, // TODO - there should be a CSS way here
                cls: 'x-toolbar-separator x-toolbar-separator-horizontal'
            },
            //'-',
            me.windowBar,
            '-',
            me.notifybar,            
            me.tray
        ];

    	me.checkNotify();
        me.callParent();                            
    },

    afterLayout: function () {
        var me = this;
        me.callParent();
        me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);
    },
    
    getQuickStart: function () {
        var me = this, ret = {
            minWidth: 20,
            items: [],
            enableOverflow: true
        };

        Ext.each(this.quickStart, function (item) {
            ret.items.push({            	
                tooltip: { text: item.name, align: 'bl-tl' },
                text: item.text,
                menu: item.menu,
                //tooltip: item.name,
                enableToggle: item.enableToggle,
                disabled: item.disabled,
                overflowText: item.name,
                iconCls: item.iconCls,
                module: item.module,
                handler: me.onQuickStartClick,
                scope: me
            });
        });

        return ret;
    },

    /**
     * This method returns the configuration object for the Tray toolbar. A derived
     * class can override this method, call the base version to build the config and
     * then modify the returned object before returning it.
     */
    getTrayConfig: function () {
        var ret = {
            width: 64,
            items: this.trayItems
        };
        delete this.trayItems;
        return ret;
    },

    getWindowBarConfig: function () {
        return {
            flex: 1,
            cls: 'ux-desktop-windowbar',
            items: [ '&#160;' ],
            layout: { overflowHandler: 'Scroller' }
        };
    },

    getWindowBtnFromEl: function (el) {
        var c = this.windowBar.getChildByElement(el);
        return c || null;
    },
    
    onQuickStartClick: function (btn) {    	
    	
    },
    
    onButtonContextMenu: function (e) {
        var me = this, t = e.getTarget(), btn = me.getWindowBtnFromEl(t);
        if (btn) {
            e.stopEvent();
            me.windowMenu.theWin = btn.win;
            me.windowMenu.showBy(t);
        }
    },

    onWindowBtnClick: function (btn) {
        var win = btn.win;

        if (win.minimized || win.hidden) {
            win.show();
        } else if (win.active) {
            win.minimize();
        } else {
            win.toFront();
        }
    },

    addTaskButton: function(win) {
        var config = {
            iconCls: win.iconCls,
            enableToggle: true,
            toggleGroup: 'all',
            width: 140,
            text: Ext.util.Format.ellipsis(win.title, 20),
            listeners: {
                click: this.onWindowBtnClick,
                scope: this
            },
            win: win
        };

        var cmp = this.windowBar.add(config);
        cmp.toggle(true);
        return cmp;
    },

    removeTaskButton: function (btn) {
        var found, me = this;
        me.windowBar.items.each(function (item) {
            if (item === btn) {
                found = item;
            }
            return !found;
        });
        if (found) {
            me.windowBar.remove(found);
        }
        return found;
    },

    setActiveButton: function(btn) {
        if (btn) {
            btn.toggle(true);
        } else {
            this.windowBar.items.each(function (item) {
                if (item.isButton) {
                    item.toggle(false);
                }
            });
        }
    },
	
	onQuickStartClick: function (btn) {    	
    	if (btn.module == 'box-module') {    		
    		ossApp.onBoxMode();
    	} else
    	if (btn.module == 'logout') {
    		ossApp.onLogout();    		
    	} else {
    		var module = this.app.getModule(btn.module);
    		if (module) {
    			module.createWindow();
    		}
    	}
    }, 
	
	getNotification: function() {        
    	var me = this, ret = {
            minWidth: 20,
            width: 80,
            items: [],
            enableOverflow: true
        };    	    	
    	
    	me.createGrid();
    	
    	Ext.each(this.notify, function (item) {
    		if (item.id == 'notify') { 
	            ret.items.push({
	            	id: item.id,            	
	                tooltip: { text: item.name, align: 'bl-tl' },
	                overflowText: item.name,
	                iconCls: item.iconCls,	                
	                handler: function() {       	                	
                		me.checkNotify();          
                		me.createNotifyWindow();	                	
	                },
	                scope: me
	            });
    		} else {    			    			    			
    			ret.items.push({
	            	id: item.id,            	
	                tooltip: { text: item.name, align: 'bl-tl' },
	                overflowText: item.name,
	                iconCls: item.iconCls,
	                menu: Ext.create('Ext.menu.Menu', {
	                	items: [
	                	        {
	                	        	text: 'Монгол',
	                	        	handler: function() {		                	        		
	                	        		Ext.MessageBox.confirm('Хэл сонгох', 'Монгол хэлийг сонгох уу?', function (btn){
	                	        			if (btn == 'yes')
	                	        	        document.location.href = '?l=0';
	                	        	    });
	                	        	}
	                	        }, 
	                	        {
	                	        	text: 'Русский',
	                	        	handler: function() {		                	        		
	                	        		Ext.MessageBox.confirm('Выберите язык', 'Выберите русский язык?', function (btn){
	                	        			if (btn == 'yes')
	                	        	        document.location.href = '?l=1';
	                	        	    });
	                	        	}
	                	        },
	                	        {
	                	        	text: 'English',
	                	        	handler: function() {	                	        			                	        		
	                	        		Ext.MessageBox.confirm('Select language', 'Select english?', function (btn){
	                	        			if (btn == 'yes')
	                	        	        document.location.href = '?l=2';
	                	        	    });
	                	        	}
	                	        }
	                	]
	                }),
	                scope: me
	            });
    		}
        });

        return ret;
    },
    
    createNotifyWindow: function() {
    	var me = this;    	    	       
        
    	var desktop = this.app.getDesktop();
        me.win = desktop.getWindow('notify-grid-win');
                       
        if(!me.win){        	
        	me.win = desktop.createGadget({
                id: 'notify-grid-win',                
                width:450,
                height:195,                
            	draggable: false,            	
                x : me.getWidth() - 450,
                y : desktop.getHeight() - me.getHeight() - 195,                 
                animCollapse:false,                
                closeable: false,
                frame: false,
                border: false,
                constrainHeader: false,
                minimizable: false,
                maximizable: false,
                closeable: false,        
                closeAction: 'hide',
                layout: 'fit',
                items: [me.grid]                               
            });
        	me.win.show();
        } else {
        	if (me.win.isVisible())
        		me.win.hide();
        	else
        		me.win.show();
        }
    },

	createGrid : function() {
    	var me = this;
    	me.createStore();
    	
    	me.grid = Ext.create('Ext.grid.GridPanel', {			
		    width:450,
		    height:155,
		    collapsible:false,		    
		    store: me.store,		    
		    viewConfig: {
	            id: 'gv',
	            emptyText: 'No notification',
	            trackOver: false,
	            stripeRows: false	            
	        },
		    
		    columns: [{
		        text: '',
		        width: 24,   
		        dataIndex: 'content',
		        renderer: renderIcon
		    },{
		        text: 'Notifications',
		        flex: 1,		        
		        dataIndex: 'content',
		        renderer: renderTopic
		    }],
		    
		    listeners: {
		    	render: function() {
		    		me.store.load({params:{xml:_donate('_notification', 'SELECT', 'notification', ' ', ' ', logged)},
		    			callback: function(){    				
		    				if (me.store.getCount() > 0) {
		    					
		    				}
		    				else {
		    					
		    				}
		    			}});
		    	},
		    	itemclick: function(grid, record, item, index, e) {
		    		me.callRowModule(record);
		    	},
		    	selectionchange: function(model, records) {
		    		me.callRowModule(records[0]);
	            }
		    }
		});		
    	
    	return me.grid;
    },
		
	createStore : function() {
    	var me = this;
    	
    	Ext.regModel('notify', {
    	    idProperty: 'content',
    	    fields: [{name: 'content', type:'string'},{name: 'text', type:'string'}]
    	});	

    	me.store = Ext.create('Ext.data.JsonStore', {
    	    model: 'notify', 
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
    },

	checkNotify: function() {
    	var me = this;
    	me.store.load({params:{xml:_donate('_notification', 'SELECT', 'notification', ' ', ' ', logged)},
			callback: function(){
				if (me.store.getCount() > 0) {    		   
					if (me.win && !me.win.isVisible())		        	
		        		me.win.show();
					//me.items.get('notify').enable();    		
					me.notifybar.items.get('notify').setIconCls('notify_on');
				}
				else {
					me.notifybar.items.get('notify').setIconCls('notify');
					//me.items.get('notify').disable();
				}				
			}});    	    	
    },                                    
    
    callRowModule: function(record) {    	
    	if (record) {
            rec = record;	                    	                    
            if (rec.data['content'] == Ext.sfa.translate_arrays[langid][258]) {
            	var module = ossApp.getModule('order-grid-win'),
                win = module && module.createWindow();

                if (win) {
                	ossApp.getDesktop().restoreWindow(win);
                }
            } 	                    	
            else
            if (rec.data['content'] == 'Бараа олголт') {
            	var module = ossApp.getModule('complete-order-grid-win'),
                win = module && module.createWindow();

                if (win) {
                	ossApp.getDesktop().restoreWindow(win);
                }
            }
            else
            if (rec.data['content'] == 'Аюулгүйн нөөц') {
            	var nodes = ['Storage', '_storage', Ext.sfa.translate_arrays[langid][510], 'id', 500, 550, 'storage-module'];    			    			
    			ossApp.createModule(nodes, 'Storage', '', '');
            }
        }
    }
});

/**
 * @class Ext.ux.desktop.TrayClock
 * @extends Ext.toolbar.TextItem
 * This class displays a clock on the toolbar.
 */
Ext.define('Ext.ux.desktop.TrayClock', {
    extend: 'Ext.toolbar.TextItem',

    alias: 'widget.trayclock',

    cls: 'ux-desktop-trayclock',

    html: '&#160;',

    timeFormat: 'g:i A',

    tpl: '{time}',

    initComponent: function () {
        var me = this;

        me.callParent();

        if (typeof(me.tpl) == 'string') {
            me.tpl = new Ext.XTemplate(me.tpl);
        }
    },

    afterRender: function () {
        var me = this;
        Ext.Function.defer(me.updateTime, 100, me);
        me.callParent();
    },

    onDestroy: function () {
        var me = this;

        if (me.timer) {
            window.clearTimeout(me.timer);
            me.timer = null;
        }

        me.callParent();
    },

    updateTime: function () {
        var me = this, time = Ext.Date.format(new Date(), me.timeFormat),
            text = me.tpl.apply({ time: time });
        if (me.lastText != text) {
            me.setText(text);
            me.lastText = text;
        }
        me.timer = Ext.Function.defer(me.updateTime, 10000, me);
    }
});


Date.prototype.getWeek = function() {
    var determinedate = new Date();
    determinedate.setFullYear(this.getFullYear(), this.getMonth(), this.getDate());
    var D = determinedate.getDay();
    if(D == 0) D = 7;
    determinedate.setDate(determinedate.getDate() + (4 - D));
    var YN = determinedate.getFullYear();
    var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
    var WN = 1 + Math.floor(ZBDoCY / 7);
    return WN;
}

function daysInMonth(month,year) {
	var m = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (month != 2) return m[month - 1];
	if (year%4 != 0) return m[1];
	if (year%100 == 0 && year%400 != 0) return m[1];
	return m[1] + 1;
}

function getNextDate()
{ 
 var today = new Date();
 var d = today.getDate();
 var m = today.getMonth();
 var y = today.getFullYear();

 var NextDate= new Date(y, m, d+1);
 var Ndate=Ext.Date.format(NextDate, 'Y-m-d');
 return Ndate;
}


    /**
 * Copyright(c) 2011
 *
 * Licensed under the terms of the Open Source LGPL 3.0
 * http://www.gnu.org/licenses/lgpl.html
 * @author Greivin Britton, brittongr@gmail.com
 *     
 * @changes
 * No currency symbol by default    
 * No decimalPrecision in config
 * Supporting any character as thousand separator
 * Improved getFormattedValue
 * Removed unnecessary code to create format template, now using float.toFixed(this.decimalPrecission)    
 */

Ext.ux.NumericField = function(config){
    var defaultConfig = 
    {
        style: 'text-align:right;'
    };

    Ext.ux.NumericField.superclass.constructor.call(this, Ext.apply(defaultConfig, config));

    //Only if thousandSeparator doesn't exists is assigned when using decimalSeparator as the same as thousandSeparator
    if(this.useThousandSeparator && this.decimalSeparator == ',' && Ext.isEmpty(config.thousandSeparator))
        this.thousandSeparator = '.';
    else
        if(this.allowDecimals && this.thousandSeparator == '.' && Ext.isEmpty(config.decimalSeparator))
            this.decimalSeparator = ',';

    this.onFocus = this.onFocus.createSequence(this.onFocus);
};

Ext.define('Ext.ux.form.FieldMoney', {

   extend : 'Ext.form.field.Text',
   alias : 'widget.field-money',
   symbol : 'US$ ',
   showSymbol : false,
   symbolStay : false,
   thousands : ',',
   decimal : '.',
   precision : 0,
   defaultZero : true,
   allowZero : false,
   allowNegative : false,

   onRender : function() {
       this.callParent(arguments);
       var name = this.name || this.inputEl.dom.name;
       this.hiddenField = this.inputEl.insertSibling({
           tag : 'input',
           type : 'hidden',
           name : name,
           value : this._parseValue(this.value)
       });
       this.hiddenName = name;

       this.inputEl.dom.removeAttribute('name');
       this.inputEl.on({
           keyup : {
               scope : this,
               fn : this._onUpdateHidden
           },
           blur : {
               scope : this,
               fn : this._onUpdateHidden
           }
       }, Ext.isIE ? 'after' : 'before');
       this.setValue = Ext.Function.createSequence(this.setValue, this._onUpdateHidden, this);
   },
   _parseValue : function(v) {

       var v = this.getValue();

       v = v.replace(/\D/g, "");
       if(v.length==0){
           return 0;
       }
       if(this.precision > 0) {
           return parseFloat(v.substr(0, (v.length - this.precision)) + "." + v.substr((v.length - this.precision)));
       } else {
           return parseFloat(v);
       }

   },
   _onUpdateHidden : function() {
       this.hiddenField.dom.value = this._parseValue(this.getValue());
   },
   initEvents : function() {

       var input = this.inputEl;

       input.on('keypress', this._onKeypress, this);
       input.on('keydown', this._onKeydown, this);
       input.on('blur', this._onBlur, this);
       input.on('focus', this._onFocus, this);

       this.callParent();
   },

   _onFocus : function(e) {
       var input = this.inputEl;

       var mask = this._getDefaultMask();
       if(input.getValue() == mask) {
           input.getValue('');
       } else if(input.getValue() == '' && this.defaultZero) {
           input.dom.value = (this._setSymbol(mask));
       } else {
           input.dom.value = (this._setSymbol(input.getValue()));
       }
       if(this.createTextRange) {
           var textRange = this.createTextRange();
           textRange.collapse(false);
           // set the cursor at the end of the input
           textRange.select();
       }
   },
   _onBlur : function(e) {
       if(Ext.isIE) {
           this._onKeypress(e);
       }

       var input = this.inputEl;

       if(input.getValue() == '' || input.getValue() == this._setSymbol(this._getDefaultMask()) || input.getValue() == this.symbol) {
           if(!this.allowZero)
               input.dom.value = '';
           else if(!this.symbolStay)
               input.dom.value = (this._getDefaultMask());
           else
               input.dom.value = (this._setSymbol(this._getDefaultMask()));
       } else {
           if(!this.symbolStay)
               input.dom.value = (input.getValue().replace(this.symbol, ''));
           else if(this.symbolStay && input.getValue() == this.symbol)
               input.dom.value = (this._setSymbol(this._getDefaultMask()));
       }
   },
   _onKeydown : function(e) {
       e = e || window.event;
       var k = e.getCharCode() || e.getKey() || e.which, input = this.inputEl;
       if(k == undefined)
           return false;
       //needed to handle an IE "special" event
       if(input.getAttribute('readonly') && (k != 13 && k != 9))
           return false;
       // don't allow editing of readonly fields but allow tab/enter

       var x = input.dom;
       var selection = this._getInputSelection(x);
       var startPos = selection.start;
       var endPos = selection.end;

       if(k == 8) {// backspace key
           e.preventDefault();

           if(startPos == endPos) {
               // Remove single character
               x.value = x.value.substring(0, startPos - 1) + x.value.substring(endPos, x.value.length);
               startPos = startPos - 1;
           } else {
               // Remove multiple characters
               x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);
           }
           this._maskAndPosition(x, startPos);
           return false;
       } else if(k == 9) {// tab key
           return true;
       } else if(k == 46 || k == 63272) {// delete key (with special case for safari)
           preventDefault(e);
           if(x.selectionStart == x.selectionEnd) {
               // Remove single character
               x.value = x.value.substring(0, startPos) + x.value.substring(endPos + 1, x.value.length);
           } else {
               //Remove multiple characters
               x.value = x.value.substring(0, startPos) + x.value.substring(endPos, x.value.length);
           }
           this._maskAndPosition(x, startPos);
           return false;
       } else {// any other key
           return true;
       }
   },
   _onKeypress : function(e) {
       e = e || window.event;
       var k = e.getCharCode() || e.getKey() || e.which, input = this.inputEl;
       if(k == undefined)
           return false;
       //needed to handle an IE "special" event
       if(input.getAttribute('readonly') && (k != 13 && k != 9))
           return false;
       // don't allow editing of readonly fields but allow tab/enter

       if(k < 48 || k > 57) {// any key except the numbers 0-9
           if(k == 45) {// -(minus) key
               this.setValue(this._changeSign(input));
               return false;
           }
           if(k == 43) {// +(plus) key
               input.val(input.getValue().replace('-', ''));
               return false;
           } else if(k == 13 || k == 9) {// enter key or tab key
               return true;
           } else if(k == 37 || k == 39) {// left arrow key or right arrow key
               return true;
           } else {// any other key with keycode less than 48 and greater than 57
               e.preventDefault();
               return true;
           }
       } else if(input.getValue().length == input.getAttribute('maxlength')) {
           return false;
       } else {
           e.preventDefault();

           var key = String.fromCharCode(k);
           var x = input.dom;

           var selection = this._getInputSelection(x);
           var startPos = selection.start;
           var endPos = selection.end;
           x.value = x.value.substring(0, startPos) + key + x.value.substring(endPos, x.value.length);
           this._maskAndPosition(x, startPos + 1);
           return false;
       }
   },
   _getDefaultMask : function() {
       var n = parseFloat('0') / Math.pow(10, this.precision);
       return (n.toFixed(this.precision)).replace(new RegExp('\\.', 'g'), this.decimal);
   },
   _maskValue : function(v) {
       var input = this.inputEl;
       v = v.replace(this.symbol, '');

       var strCheck = '0123456789';
       var len = v.length;
       var a = '', t = '', neg = '';

       if(len != 0 && v.charAt(0) == '-') {
           v = v.replace('-', '');
           if(this.allowNegative) {
               neg = '-';
           }
       }

       if(len == 0) {
           if(!this.defaultZero)
               return t;
           t = '0.00';
       }

       for(var i = 0; i < len; i++) {
           if((v.charAt(i) != '0') && (v.charAt(i) != this.decimal))
               break;
       }

       for(; i < len; i++) {
           if(strCheck.indexOf(v.charAt(i)) != -1)
               a += v.charAt(i);
       }

       var n = parseFloat(a);
       n = isNaN(n) ? 0 : n / Math.pow(10, this.precision);
       t = n.toFixed(this.precision);
       i = this.precision == 0 ? 0 : 1;
       var p, d = (t=t.split('.'))[i].substr(0, this.precision);
       for( p = ( t = t[0]).length; (p -= 3) >= 1; ) {
           t = t.substr(0, p) + this.thousands + t.substr(p);
       }

       return (this.precision > 0) ? this._setSymbol(neg + t + this.decimal + d + Array((this.precision + 1) - d.length).join(0)) : this._setSymbol(neg + t);
   },
   _setSymbol : function(v) {
       if(this.showSymbol) {
           if(v.substr(0, this.symbol.length) != this.symbol)
               return this.symbol + v;
       }
       return v;
   },
   _maskAndPosition : function(x, startPos) {
       var input = this.inputEl, originalLen = input.getValue().length;

       input.dom.value = this._maskValue(x.value);
       var newLen = input.getValue().length;
       startPos = startPos - (originalLen - newLen);
       this._setCursorPosition(startPos);
   },
   _changeSign : function(i) {
       if(this.allowNegative) {
           var vic = i.getValue();
           if(i.getValue() != '' && i.getValue().charAt(0) == '-') {
               return i.getValue().replace('-', '');
           } else {
               return '-' + i.getValue();
           }
       } else {
           return i.getValue();
       }
   },
   _getInputSelection : function(el) {
       var start = 0, end = 0, normalizedValue, range, textInputRange, len, endRange;

       if( typeof el.selectionStart == "number" && typeof el.selectionEnd == "number") {
           start = el.selectionStart;
           end = el.selectionEnd;
       } else {
           range = document.selection.createRange();

           if(range && range.parentElement() == el) {
               len = el.value.length;
               normalizedValue = el.value.replace(/\r\n/g, "\n");

               // Create a working TextRange that lives only in the input
               textInputRange = el.createTextRange();
               textInputRange.moveToBookmark(range.getBookmark());

               // Check if the start and end of the selection are at the very end
               // of the input, since moveStart/moveEnd doesn't return what we want
               // in those cases
               endRange = el.createTextRange();
               endRange.collapse(false);

               if(textInputRange.compareEndPoints("StartToEnd", endRange) > -1) {
                   start = end = len;
               } else {
                   start = -textInputRange.moveStart("character", -len);
                   start += normalizedValue.slice(0, start).split("\n").length - 1;

                   if(textInputRange.compareEndPoints("EndToEnd", endRange) > -1) {
                       end = len;
                   } else {
                       end = -textInputRange.moveEnd("character", -len);
                       end += normalizedValue.slice(0, end).split("\n").length - 1;
                   }
               }
           }
       }

       return {
           start : start,
           end : end
       };
   },
   _setCursorPosition : function(pos) {
       var elem = this.inputEl;
       if(elem.setSelectionRange) {
           elem.focus();
           elem.setSelectionRange(pos, pos);
       } else if(elem.createTextRange) {
           var range = elem.createTextRange();
           range.collapse(true);
           range.moveEnd('character', pos);
           range.moveStart('character', pos);
           range.select();
       }
   }
});