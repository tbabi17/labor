Ext.define('Ext.ux.desktop.StartMenu',{extend:'Ext.panel.Panel',requires:['Ext.menu.Menu','Ext.toolbar.Toolbar'],ariaRole:'menu',cls:'x-menu ux-start-menu',defaultAlign:'bl-tl',iconCls:'user',floating:true,shadow:true,width:300,initComponent:function(){var me=this,menu=me.menu;me.menu=new Ext.menu.Menu({cls:'ux-start-menu-body',border:false,floating:false,items:menu});me.menu.layout.align='stretch';me.items=[me.menu];me.layout='fit';Ext.menu.Manager.register(me);me.callParent();me.toolbar=new Ext.toolbar.Toolbar(Ext.apply({dock:'right',cls:'ux-start-menu-toolbar',vertical:true,width:100},me.toolConfig));me.toolbar.layout.align='stretch';me.addDocked(me.toolbar);delete me.toolItems;me.on('deactivate',function(){me.hide()})},addMenuItem:function(){var cmp=this.menu;cmp.add.apply(cmp,arguments)},addToolItem:function(){var cmp=this.toolbar;cmp.add.apply(cmp,arguments)},showBy:function(cmp,pos,off){var me=this;if(me.floating&&cmp){me.layout.autoSize=true;me.show();cmp=cmp.el||cmp;var xy=me.el.getAlignToXY(cmp,pos||me.defaultAlign,off);if(me.floatParent){var r=me.floatParent.getTargetEl().getViewRegion();xy[0]-=r.x;xy[1]-=r.y}me.showAt(xy);me.doConstrain()}return me}});
Ext.define('Ext.ux.desktop.Wallpaper',{extend:'Ext.Component',alias:'widget.wallpaper',cls:'ux-wallpaper',html:'<img src="'+Ext.BLANK_IMAGE_URL+'">',stretch:false,wallpaper:null,afterRender:function(){var me=this;me.callParent();me.setWallpaper(me.wallpaper,me.stretch)},applyState:function(){var me=this,old=me.wallpaper;me.callParent(arguments);if(old!=me.wallpaper){me.setWallpaper(me.wallpaper)}},getState:function(){return this.wallpaper&&{wallpaper:this.wallpaper}},setWallpaper:function(wallpaper,stretch){var me=this,imgEl,bkgnd;me.stretch=(stretch!==false);me.wallpaper=wallpaper;if(me.rendered){imgEl=me.el.dom.firstChild;if(!wallpaper||wallpaper==Ext.BLANK_IMAGE_URL){Ext.fly(imgEl).hide()}else if(me.stretch){imgEl.src=wallpaper;me.el.removeCls('ux-wallpaper-tiled');Ext.fly(imgEl).setStyle({width:'100%',height:'100%'}).show()}else{Ext.fly(imgEl).hide();bkgnd='url('+wallpaper+')';me.el.addCls('ux-wallpaper-tiled')}me.el.setStyle({backgroundImage:bkgnd||''})}return me}});
Ext.define('OSS.Settings',{extend:'Ext.window.Window',uses:['Ext.tree.Panel','Ext.tree.View','Ext.form.field.Checkbox','Ext.layout.container.Anchor','Ext.layout.container.Border','Ext.ux.desktop.Wallpaper','OSS.WallpaperModel'],layout:'anchor',title:'Wallpaper',modal:true,width:640,height:480,border:false,initComponent:function(){var me=this;me.selected=me.desktop.getWallpaper();me.stretch=me.desktop.wallpaper.stretch;me.preview=Ext.create('widget.wallpaper');me.preview.setWallpaper(me.selected);me.tree=me.createTree();me.buttons=[{text:'OK',handler:me.onOK,scope:me},{text:'Cancel',handler:me.close,scope:me}];me.items=[{anchor:'0 -30',border:false,layout:'border',items:[me.tree,{xtype:'panel',title:'Preview',region:'center',layout:'fit',items:[me.preview]}]},{xtype:'checkbox',boxLabel:'Stretch to fit',checked:me.stretch,listeners:{change:function(comp){me.stretch=comp.checked}}}];me.callParent()},createTree:function(){var me=this;function child(img){return{img:img,text:me.getTextOfWallpaper(img),iconCls:'',leaf:true}}var tree=new Ext.tree.Panel({title:'Desktop Background',rootVisible:false,lines:false,autoScroll:true,width:150,region:'west',split:true,minWidth:100,listeners:{afterrender:{fn:this.setInitialSelection,delay:100},select:this.onSelect,scope:this},store:new Ext.data.TreeStore({model:'OSS.WallpaperModel',root:{text:'Wallpaper',expanded:true,children:[{text:"None",iconCls:'',leaf:true},child('blue_sparks.jpg'),child('blue_horizon.jpg'),child('matrix.jpg'),child('merry.jpg'),child('pw_maze_black.png'),child('pw_maze_gray.png')]}})});return tree},getTextOfWallpaper:function(path){var text=path,slash=path.lastIndexOf('/');if(slash>=0){text=text.substring(slash+1)}var dot=text.lastIndexOf('.');text=Ext.String.capitalize(text.substring(0,dot));text=text.replace(/[-]/g,' ');return text},onOK:function(){var me=this;if(me.selected){me.desktop.setWallpaper(me.selected,me.stretch)}me.destroy()},onSelect:function(tree,record){var me=this;if(record.data.img){me.selected='images/wallpapers/'+record.data.img}else{me.selected=Ext.BLANK_IMAGE_URL}me.preview.setWallpaper(me.selected)},setInitialSelection:function(){var s=this.desktop.getWallpaper();if(s){var path='/Wallpaper/'+this.getTextOfWallpaper(s);this.tree.selectPath(path,'text')}}});

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