var __t, __d, __id, __localCookie, increment;
var __speed = 50;
tdata = {};
var numOfQuestions = 0;
var selectedColor = "#f96802";
var defaultColor = "#dcd2ba";
var colorArray = []; 
var plotItems = []; 
var plotResults = [];

var audioArr = new Array("audio/ogg","audio/mp3");
var codType = new Array("vorbis","mp3");
var sounds = { 
	bell: {
		mp3: "../css/sounds/bell.mp3",
		ogg: "../css/sounds/bell.ogg"
	},
	applause: {
		mp3: "../css/sounds/applause.mp3",
		m4a: "../css/sounds/applause.m4a",
		wav: "../css/sounds/applause.wav",
		ogg: "../css/sounds/applause.ogg"
	}
	
};



var folderJSON;
var resizeContentContainer = function (){
	var thisContent = $("[data-role='content']");
	if ($(window).height() > 321 ) {
		var gsize = $(window).height() - ($("#ftr").height() + $("#hdr").height());
		var gpadding = parseInt(thisContent.css("padding-top"), 10) + parseInt(thisContent.css("padding-bottom"), 10)
		$("[data-role='content']").height( (gsize - gpadding) - 10 )
	};
}

$(window).resize(function() {
	resizeContentContainer();
});

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

$( document ).on( "pageinit", "[data-role='page'].app-page", function() {
	   var page = "#" + $( this ).attr( "id" ),
		// Get the filename of the next page that we stored in the data-next attribute
		nextpage = $( this ).jqmData( "next" );
    //console.log(page, nextpage);
	
	// Check if we did set the data-next attribute
	if ( nextpage ) {
         
		// Prefetch the next page
		//$.mobile.loadPage( next + ".html", {prefetch:"true"} );
		// Navigate to next page on swipe left
		$( document ).on( "swipeleft", page, function() {
			$.mobile.changePage( nextpage + ".html", { transition: "none" }, true, true);
		});
		// Navigate to next page when the "next" button is clicked
		$( ".control .next", page ).on( "click", function(event) {
			event.preventDefault()
			$.mobile.changePage( nextpage + ".html", { transition: "none" }, true, true );
		});
	}
	// Disable the "next" button if there is no next page
	else {
		$( ".control .next", page ).addClass( "ui-disabled" );
	}
    if (page == "#main"){
        var cookies = $.cookie();
        for(var cookie in cookies) {
           $.removeCookie(cookie);
        }
        $('.info_banner span.question').empty();
		$('.info_banner span.score').empty();
		$('.info_banner span.rank').empty();
    }
    
	//footer
	$( "[data-role='footer']#ftr #ISI" ).load( "isi.html", function() {
		$(this).scrollTop(0);
		var div = $(this);
		setInterval(function (argument) {
			var pos = div.scrollTop(); 
			div.scrollTop(++pos);
		}, 50);
	});
});

$(document).on('pageshow', "[data-role='page'].app-page", function(event, ui) {
   resizeContentContainer();

	__id = $(this)

	if ($(this).find('last')) {
		renderJSONContent.lastPage();
	}

	$("#ISI").scrollTop(0);

	//use cookie to store values
	$.cookie('__segment', $(this).jqmData( "segment" ));
	var __segment = $.cookie('__segment');

	__d = $(this).jqmData( "selectdata" );

	if(typeof(__d)!=="undefined"){
		getPageParam(); //get JSON demo folder

		$.getJSON("json/"+folderJSON+"/"+__d+'.json', function(json, textStatus) {
			var __pages, __score, __rank;
			var count = Object.keys(json).length;
			$.cookie("__pages", count); 

			__score = $.cookie('__score');
			__rank = $.cookie('__rank');
			__pages = $.cookie('__pages');

			if ( __segment != 0) {
				$('.info_banner span.question').empty().append(__segment +" of "+ __pages);
				$('.info_banner span.score').empty().append(__score);
				$('.info_banner span.rank').empty().append(__rank);
			}
			
			if (textStatus == "success") {
				$.extend(tdata, json);
				__localCookie = "question"+__segment;
				$.each(tdata, function(index, val) {
                    //localStorage.setItem("json", json);
                    //console.log("2", json.question2);
					if (index == __localCookie){
		 				tdata = val
		 				if (__d == "question") {
		 					renderJSONContent.questionJSON();
                            getBubbleView(json.question2);
		 				}
                        if(__localCookie == "question2"){
                            //getBubbleView(json.question2);
                        }
		 				if (__d == "scores") {
		 					//use cookie to store values
		 					$.cookie('__rank', tdata.rank);
		 					renderJSONContent.scoreJSON();
		 				}
		 				if (__d == "ad") {
		 					$(__id).data('segment', numOfQuestions)
		 					renderJSONContent.adJSON();
		 				}

		 			}
		 		}); //each
			};
		}); //getJSON
	}


}); //pageshow

var renderJSONContent = {
	questionJSON: function(){
		//console.log("questionJSON: ", __localCookie, __d, __id, tdata)
		var snd = new Audio(sounds.bell.ogg);
		snd.play();

		var questionContent = $(__id).find('#question_content').html();
		var questionHTML = Mustache.to_html(questionContent, tdata);
		$(__id).find('#question_content').show().html(questionHTML);
		if (__localCookie == "question1") {
			getListView();
		};
        
	},
	scoreJSON: function(){
		//console.log("scoreJSON: ", __localCookie, __d, __id, tdata)
		if ($.cookie('__score') == null) { $.cookie('__score', 0); };

		increment = tdata.score > parseInt($.cookie('__score')) ? 1 : -1;
		setScore.timerCounter(parseInt($.cookie('__score')), tdata.score)

		var scoreContent = $(__id).find('#score_content').html();
		var scoreHTML = Mustache.to_html(scoreContent, tdata);
		$(__id).find('#score_content').empty().show().html(scoreHTML);
	},
	adJSON: function(){
		//console.log("adJSON: ", __localCookie, __d, __id, tdata, numOfQuestions)
		var adContent = '<div id="ad_space" class="ui-grid-solo"><div class="ui-block-a"><img src="{{image_url}}" id="ad_space" /></div></div>';
		var adHTML = Mustache.to_html(adContent, tdata);
		$(__id).find('#ad_content').show().html(adHTML);
	},
	lastPage: function(){
		//console.log("lastPage: ", __localCookie, __d, __id, tdata, numOfQuestions)
		$('.info_banner span.question').empty().append("&nbsp;");
		$('.info_banner span.score').empty().append($.cookie('__score'));
		$('.info_banner span.rank').empty().append($.cookie('__rank'));
		$('a#return').attr('href', window.location.href.match(/^.*\//)[0]+"mobile.html");
	}
}

var setScore = {
	timerCounter: function (oldScore, newScore) {
		var current = oldScore;
		if (oldScore != tdata.score){
			var timer = setInterval(function () {
				current += increment;
				$('.info_banner span.score').empty().append(current)
				if (current == newScore) { clearInterval(timer); setScore.settingVal(); }
			}, 5);
		}
		if (increment) {
			//play sound applause
			/*var snd = new Audio(sounds.applause.mp3);
			snd.play();*/
			var applause_audio = document.getElementById('applause');
			applause_audio.play();
		};
	},	
	settingVal: function () {
		$.cookie('__score', tdata.score);
		$('.info_banner span.rank').empty().append(tdata.rank);
	}
}
/*
function playSnd (sndType) {
	audioType = 'audio/ogg';
	codType = 'vorbis'
	myaudio = document.createElement('audio');
	isSupp=myaudio.canPlayType(audioType+';codecs="'+codType+'"');
	if (isSupp=="")
	{
	isSupp="No";
	}
	console.log(isSupp)
}
*/
function getBubbleView(d){
    //console.log("init bubble data");
    var answers = d.answers
    colorArray = [];
   for( i in answers){
        //console.log(answers[i].answer, answers[i].score);
        var ans = answers[i].answer.replace(' ', '<br>')
        plotResults[i]=[answers[i].score,answers[i].answer];
        plotItems.push(answers[i].answer);
        colorArray.push(defaultColor);
    }

	//use cookie to store data plots
	$.removeCookie('__plotResults');
	$.removeCookie('__plotItems');
	$.removeCookie('__colorArray');

	$.cookie("__plotResults", plotResults); 
	$.cookie("__plotItems", plotItems); 
	$.cookie("__colorArray", colorArray); 
}

function getListView(){
    var plot1= [], plot2=[];
    $('#sortable').find("li").each(function(i, e){
        var s = $(e).html().replace(' ', '<br>');
        plot1.push([i+1, s]);
        plot2.push([parseFloat($(e).jqmData( "avg" )), s]);
    });

    plot1.reverse();
    plot2.reverse();

    //use cookie to store data plots
    $.removeCookie('__plot1');
    $.removeCookie('__plot2');

    $.cookie("__plot1", plot1); 
    $.cookie("__plot2", plot2); 
    $("#q1 .control .next").removeClass( "ui-disabled" );
    
    $('#sortable')
        .sortable({
            'containment': 'parent',
            'opacity': 0.6,
            update: function(event, ui) {
                plot1= [], plot2=[];
                $('#sortable').find("li").each(function(i, e){
                	var s = $(e).html().replace(' ', '<br>');
                	plot1.push([i+1, s]);
                	plot2.push([parseFloat($(e).jqmData( "avg" )), s]);
                });

                plot1.reverse();
                plot2.reverse();

	            //use cookie to store data plots
	            $.removeCookie('__plot1');
	            $.removeCookie('__plot2');

	            $.cookie("__plot1", plot1); 
	            $.cookie("__plot2", plot2); 

                $("#q1 .control .next").removeClass( "ui-disabled" );
            }
        })
        .disableSelection()
        .listview().listview('refresh');
};

$( window ).orientationchange();

