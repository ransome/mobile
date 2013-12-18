
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

