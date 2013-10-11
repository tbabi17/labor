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
	metaData.tdAttr = 'data-qtip="Double click : Дэлгэрэнгүй харах"';
	
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