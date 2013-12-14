var folderJSON;
function getPageParam() {

    __param = $.mobile.path.parseUrl(window.location);
    __p = __param.search.split("?")
    var b = {};
    if(__p.length > 1){

	    getParam = __p[1].split('&')
	    for (var i = 0; i < getParam.length; ++i)
        {
            var p=getParam[i].split('=');
            if (p.length != 2) continue;
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
        }
        for(folder in b){
        	if ( folder == "demo") {
        		folderJSON = b.demo
        	} else { 
        		folderJSON = "demo1"; 
        	}
        }
    } else {
    	folderJSON = "demo1"
    }

}
var filePathJSON = {
    ifFileExists: function(url){
        $.getJSON(url, function(qdata, textStatus) {})
        .success(function(qdata, textStatus) {
            filePathJSON.ifFileSuccess(qdata)
        })
        .error(function(qdata, textStatus) { 
            if(qdata.status == "404"){
                    filePathJSON.ifFileError()
            } 
            return false
        })                        
    },
    ifFileSuccess: function(data){
        var q = Object.keys(data).length
        $.each(data, function(i, ele) {
                q--
            for(a in ele.answers){
                plot[q].push([ele.answers[a].score,ele.answers[a].answer])
            }
        });
        plot1 = plot[0];
        plot2 = plot[1];
        createBarRenderer()
    },
    ifFileError: function(){
        filePath = "json/demo1/"+__g+".json";
        filePathJSON.ifFileExists(filePath)
    }
}

function createBarRenderer () {
    
}//createBarRenderer