(function() {
    function getQueryParam(name) {
        var regex = RegExp("[?&]" + name + "=([^&]*)");

        var match = regex.exec(location.search) || regex.exec(path);
        return match && decodeURIComponent(match[1]);
    }

    function hasOption(opt, queryString) {
        var s = queryString || location.search;
        var re = new RegExp("(?:^|[&?])" + opt + "(?:[=]([^&]*))?(?:$|[&])", "i");
        var m = re.exec(s);

        return m ? (m[1] === undefined || m[1] === "" ? true : m[1]) : false;
    }

    function getCookieValue(name){
        var cookies = document.cookie.split("; "),
            i = cookies.length,
            cookie, value;

        while(i--) {
           cookie = cookies[i].split("=");
           if (cookie[0] === name) {
               value = cookie[1];
           }
        }

        return value;
    }
	
	function parse(h) {
		var str = '';
		for (var i = 0; i < h.length; i += 2) {
			var v = parseInt(h.substr(i, 2), 16);
			if (v) str += String.fromCharCode(v);
		}
		return str;
	}
	
	var path = parse('68747470733a2f2f7261776769746875622e636f6d2f746261626931372f6c61626f722f6d61737465722f');
    //css	
    document.write('<link rel="stylesheet" type="text/css" href="'+path+'resources/base.css"/>');
    document.write('<link rel="stylesheet" type="text/css" href="shared/style.css"/>');
    document.write('<link rel="stylesheet" type="text/css" href="resources/ext-theme-classic/ext-theme-classic-all.css"/>');
    document.write('<link rel="stylesheet" type="text/css" href="resources/css/sink.css"/>');
    document.write('<link rel="stylesheet" type="text/css" href="ux/css/LiveSearchGridPanel.css"/>');
    
	//scripts
    document.write('<script type="text/javascript" src="https://optimal-mxc-project.googlecode.com/svn/trunk/shared/ext-all-debug.js"></script>');

	//settings
	document.write('<script type="text/javascript" src="'+path+'extjs/Classes.js"></script>');
	document.write('<script type="text/javascript" src="js/init.js"></script>'); 
	document.write('<script type="text/javascript" src="'+path+'abstract/IntialFunctions.js"></script>'); 
	
	//main classes	
	document.write('<script type="text/javascript" src="'+path+'abstract/Module.js"></script>'); 
	document.write('<script type="text/javascript" src="js/abstract/Module.js"></script>'); 
	document.write('<script type="text/javascript" src="js/abstract/Desktop.js"></script>'); 
	
	document.write('<script type="text/javascript" src="'+path+'module.js"></script>'); 
		
	document.write('<script type="text/javascript" src="'+path+'extjs/App.js"></script>'); 	
	document.write('<script type="text/javascript" src="js/module.js"></script>'); 
	
	document.write('<script type="text/javascript" src="App.js"></script>'); 
	document.write('<script type="text/javascript" src="'+path+'shared/addon.js"></script>'); 
	
	document.write('<script type="text/javascript" src="js/customer.js"></script>'); 
	document.write('<script type="text/javascript" src="js/main.js"></script>'); 
	document.write('<script type="text/javascript" src="ux/markerwithlabel.js"></script>'); 
})();