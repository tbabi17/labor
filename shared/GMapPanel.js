function ELabel(point, html, classname, pixelOffset, percentOpacity, overlap) {
	// Mandatory parameters
	this.point = point;
	this.html = html;

	// Optional parameters
	this.classname = classname||"";
	this.pixelOffset = pixelOffset||new GSize(0,0);
	if (percentOpacity) {
	  if(percentOpacity<0){percentOpacity=0;}
	  if(percentOpacity>100){percentOpacity=100;}
	}        
	this.percentOpacity = percentOpacity;
	this.overlap=overlap||false;
	this.hidden = false;
} 
  
ELabel.prototype = new GOverlay();

ELabel.prototype.initialize = function(map) {
	var div = document.createElement("div");
	div.style.position = "absolute";
	div.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
	map.getPane(G_MAP_FLOAT_SHADOW_PANE).appendChild(div);
	this.map_ = map;
	this.div_ = div;
	if (this.percentOpacity) {        
	  if(typeof(div.style.filter)=='string'){div.style.filter='alpha(opacity:'+this.percentOpacity+')';}
	  if(typeof(div.style.KHTMLOpacity)=='string'){div.style.KHTMLOpacity=this.percentOpacity/100;}
	  if(typeof(div.style.MozOpacity)=='string'){div.style.MozOpacity=this.percentOpacity/100;}
	  if(typeof(div.style.opacity)=='string'){div.style.opacity=this.percentOpacity/100;}
	}
	if (this.overlap) {
	  var z = GOverlay.getZIndex(this.point.lat());
	  this.div_.style.zIndex = z;
	}
	if (this.hidden) {
	  this.hide();
	}
}

ELabel.prototype.remove = function() {
	this.div_.parentNode.removeChild(this.div_);
}

ELabel.prototype.copy = function() {
	return new ELabel(this.point, this.html, this.classname, this.pixelOffset, this.percentOpacity, this.overlap);
}

ELabel.prototype.redraw = function(force) {
	var p = this.map_.fromLatLngToDivPixel(this.point);
	var h = parseInt(this.div_.clientHeight);
	this.div_.style.left = (p.x + this.pixelOffset.width) + "px";
	this.div_.style.top = (p.y +this.pixelOffset.height - h) + "px";
}

ELabel.prototype.show = function() {
	if (this.div_) {
	  this.div_.style.display="";
	  this.redraw();
	}
	this.hidden = false;
}

ELabel.prototype.hide = function() {
	if (this.div_) {
	  this.div_.style.display="none";
	}
	this.hidden = true;
}

ELabel.prototype.isHidden = function() {
	return this.hidden;
}

ELabel.prototype.supportsHide = function() {
	return true;
}

ELabel.prototype.setContents = function(html) {
	this.html = html;
	this.div_.innerHTML = '<div class="' + this.classname + '">' + this.html + '</div>' ;
	this.redraw(true);
}

ELabel.prototype.setPoint = function(point) {
	this.point = point;
	if (this.overlap) {
	  var z = GOverlay.getZIndex(this.point.lat());
	  this.div_.style.zIndex = z;
	}
	this.redraw(true);
}

ELabel.prototype.setOpacity = function(percentOpacity) {
	if (percentOpacity) {
	  if(percentOpacity<0){percentOpacity=0;}
	  if(percentOpacity>100){percentOpacity=100;}
	}        
	this.percentOpacity = percentOpacity;
	if (this.percentOpacity) {        
	  if(typeof(this.div_.style.filter)=='string'){this.div_.style.filter='alpha(opacity:'+this.percentOpacity+')';}
	  if(typeof(this.div_.style.KHTMLOpacity)=='string'){this.div_.style.KHTMLOpacity=this.percentOpacity/100;}
	  if(typeof(this.div_.style.MozOpacity)=='string'){this.div_.style.MozOpacity=this.percentOpacity/100;}
	  if(typeof(this.div_.style.opacity)=='string'){this.div_.style.opacity=this.percentOpacity/100;}
	}
}

ELabel.prototype.getPoint = function() {
	return this.point;
}

Ext.define('Ext.ux.GMapPanel', {
    extend: 'Ext.Panel',
    
    alias: 'widget.gmappanel',
    
    requires: ['Ext.window.MessageBox'],
    
    initComponent : function(){
        
        var defConfig = {
            plain: true,
            zoomLevel: 13,
            yaw: 180,
            pitch: 0,
            zoom: 0,
            gmapType: 'map',
            border: false
        };
        
        Ext.applyIf(this,defConfig);
        
        this.callParent();        
    },
    
    afterRender : function(){        
        var wh = this.ownerCt.getSize(),
            point;
            
        Ext.applyIf(this, wh);
        
        this.callParent();     
        
        if (this.gmapType === 'map'){
            this.gmap = new GMap2(this.body.dom);//.firstChild, { size: new GSize(wh.width, wh.height) } );            
        }

        if (this.gmapType === 'panorama'){
            this.gmap = new GStreetviewPanorama(this.body.dom);
        }
        
        if (typeof this.addControl == 'object' && this.gmapType === 'map') {
            this.gmap.addControl(this.addControl);
        }
        
        if (typeof this.setCenter === 'object') {
            if (typeof this.setCenter.geoCodeAddr === 'string'){
                this.geoCodeLookup(this.setCenter.geoCodeAddr);
            }else{
                if (this.gmapType === 'map'){
                    point = new GLatLng(this.setCenter.lat,this.setCenter.lng);
                    this.gmap.setCenter(point, this.zoomLevel);    
                }
                if (typeof this.setCenter.marker === 'object' && typeof point === 'object'){
                    this.addMarker(point,this.setCenter.marker,this.setCenter.marker.clear);
                }
            }
            if (this.gmapType === 'panorama'){
                this.gmap.setLocationAndPOV(new GLatLng(this.setCenter.lat,this.setCenter.lng), {yaw: this.yaw, pitch: this.pitch, zoom: this.zoom});
            }
        }

        GEvent.bind(this.gmap, 'load', this, function(){
            this.onMapReady();
        });               

    },
    onMapReady : function(){
        this.addMarkers(this.markers);
        this.addMapControls();
        this.addOptions();  
    },
    onResize : function(w, h){    	
        if (typeof this.getMap() == 'object') {
            this.gmap.checkResize();
        }                
        
        this.callParent(arguments);

    },
    setSize : function(width, height, animate){
        
        if (typeof this.getMap() == 'object') {
            this.gmap.checkResize();            
        }                
        
        this.callParent(arguments);
        
    },
    getMap : function(){
        
        return this.gmap;
        
    },
    getCenter : function(){
        
        return this.getMap().getCenter();
        
    },
    getCenterLatLng : function(){
        
        var ll = this.getCenter();
        return {lat: ll.lat(), lng: ll.lng()};
        
    },
    
    addMarkers : function(markers) {
        
        if (Ext.isArray(markers)){
            for (var i = 0; i < markers.length; i++) {
                var mkr_point = new GLatLng(markers[i].lat,markers[i].lng);
                this.addMarker(mkr_point,markers[i].marker,false,markers[i].setCenter, markers[i].listeners);
            }
        }
        
    },

	
    removeMarkers : function() {                
        markers = [];
        this.getMap().clearOverlays();
    },
	
	addMarkerN: function(marker) {
		var mkr_point = new GLatLng(marker.lat,marker.lng);
		this.addMarker(mkr_point,marker,false,marker.setCenter, marker.listeners);
	},

    addMarker : function(point, marker, clear, center, listeners){
        var evt;
        var icon = new GIcon(G_DEFAULT_ICON);
        icon.image = marker.url;
		icon.iconSize = new GSize(32, 32);
        icon.shadowSize = new GSize(1, 1);		
        
        Ext.applyIf(marker, icon);
        marker.icon = icon;
        //marker.label = marker.time;

        if (clear === true){
            this.getMap().clearOverlays();
        }
        if (center === true) {
            this.getMap().setCenter(point, this.zoomLevel);
        }

        var mark = new GMarker(point,marker);
        if (typeof listeners === 'object'){
            for (evt in listeners) {
                if (!listeners.hasOwnProperty(evt)) {
                    continue;
                }
                GEvent.bind(mark, evt, this, listeners[evt]);
            }
        }       
        
        this.getMap().addOverlay(mark);

        var label=new ELabel(point, '<b style="font-size:8px; background: white;">'+marker.time+'</b>', null, new GSize(-8,4), 100, 1);
        this.getMap().addOverlay(label);
    },

    addMapControls : function(){
        
        if (this.gmapType === 'map') {
            if (Ext.isArray(this.mapControls)) {
                for(var i=0;i<this.mapControls.length;i++){
                    this.addMapControl(this.mapControls[i]);
                }
            }else if(typeof this.mapControls === 'string'){
                this.addMapControl(this.mapControls);
            }else if(typeof this.mapControls === 'object'){
                this.getMap().addControl(this.mapControls);
            }
        }
        
    },
    addMapControl : function(mc){
        
        var mcf = window[mc];
        if (typeof mcf === 'function') {
            this.getMap().addControl(new mcf());
        }    
        
    },
    addOverlay : function(param){             	
        this.getMap().addOverlay(param);      
    },
    addOptions : function(){
        
        if (Ext.isArray(this.mapConfOpts)) {
            for(var i=0;i<this.mapConfOpts.length;i++){
                this.addOption(this.mapConfOpts[i]);
            }
        }else if(typeof this.mapConfOpts === 'string'){
            this.addOption(this.mapConfOpts);
        }        
        
    },
    addOption : function(mc){
        
        var mcf = this.getMap()[mc];
        if (typeof mcf === 'function') {
            this.getMap()[mc]();
        }    
        
    },
    geoCodeLookup : function(addr) {
        
        this.geocoder = new GClientGeocoder();
        this.geocoder.getLocations(addr, Ext.Function.bind(this.addAddressToMap, this));
        
    },
    addAddressToMap : function(response) {
        var place, addressinfo, accuracy, point;
        if (!response || response.Status.code != 200) {
            Ext.MessageBox.alert('Error', 'Code '+response.Status.code+' Error Returned');
        }else{
            place = response.Placemark[0];
            addressinfo = place.AddressDetails;
            accuracy = addressinfo.Accuracy;
            if (accuracy === 0) {
                Ext.MessageBox.alert('Unable to Locate Address', 'Unable to Locate the Address you provided');
            }else{
                if (accuracy < 7) {
                    Ext.MessageBox.alert('Address Accuracy', 'The address provided has a low accuracy.<br><br>Level '+accuracy+' Accuracy (8 = Exact Match, 1 = Vague Match)');
                }else{
                    point = new GLatLng(place.Point.coordinates[1], place.Point.coordinates[0]);
                    if (typeof this.setCenter.marker === 'object' && typeof point === 'object'){
                        this.addMarker(point,this.setCenter.marker,this.setCenter.marker.clear,true, this.setCenter.listeners);
                    }
                }
            }
        }
        
    }
 
});
