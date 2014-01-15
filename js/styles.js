var click = document.ontouchstart === undefined ? 'click' : 'touchstart';

function Track(src, spriteLength, audioLead) {
  var track = this,
      audio = document.createElement('audio');
  audio.src = src;
  audio.autobuffer = true;
  audio.load();
  audio.muted = true; // makes no difference on iOS :(
  
  /* This is the magic. Since we can't preload, and loading requires a user's 
     input. So we bind a touch event to the body, and fingers crossed, the 
     user taps. This means we can call play() and immediate pause - which will
     start the download process - so it's effectively preloaded.
     
     This logic is pretty insane, but forces iOS devices to successfully 
     skip an unload audio to a specific point in time.
     first we play, when the play event fires we pause, allowing the asset
     to be downloaded, once the progress event fires, we should have enough
     to skip the currentTime head to a specific point. */
     
  var force = function () {
    audio.pause();
    audio.removeEventListener('play', force, false);
  };
  
  var progress = function () {
    audio.removeEventListener('progress', progress, false);
    if (track.updateCallback !== null) track.updateCallback();
  };
  
  audio.addEventListener('play', force, false);
  audio.addEventListener('progress', progress, false);
  
  var kickoff = function () {
    audio.play();
    document.documentElement.removeEventListener(click, kickoff, true);
  };
  
  document.documentElement.addEventListener(click, kickoff, true);
  
  this.updateCallback = null;
  this.audio = audio;
  this.playing = false;
  this.lastUsed = 0;
  this.spriteLength = spriteLength;
  this.audioLead = audioLead;
}
 
Track.prototype.play = function (position) {
  var track = this,
      audio = this.audio,
      lead = this.audioLead,
      length = this.spriteLength,
      time = lead + position * length,
      nextTime = time + length;
      
  clearInterval(track.timer);
  track.playing = true;
  track.lastUsed = +new Date;
  
  audio.muted = false;
  audio.pause();
  try {
    if (time == 0) time = 0.01; // yay hacks. Sometimes setting time to 0 doesn't play back
    audio.currentTime = time;
    audio.play();
  } catch (e) {
    this.updateCallback = function () {
      track.updateCallback = null;
      //audio.currentTime = time;
      audio.play();
    };
    audio.play();
  }
 
  track.timer = setInterval(function () {
    if (audio.currentTime >= nextTime) {
      audio.pause();
      audio.muted = true;
      clearInterval(track.timer);
      player.playing = false;
    }
  }, 10);
};

var player = (function (src, n, spriteLength, audioLead) {
    console.log("message",src, n, spriteLength, audioLead);
  var tracks = [],
      total = n,
      i;
  
  while (n--) {
    tracks.push(new Track(src, spriteLength, audioLead));
  }
  
  return {
    tracks: tracks,
    play: function (position) {
      var i = total,
          track = null;
          
      while (i--) {
        if (tracks[i].playing === false) {
          track = tracks[i];
          break;
        } else if (track === null || tracks[i].lastUsed < track.lastUsed) {
          track = tracks[i];
        }
      }
      
      if (track) {
        track.play(position);
      } else {
        // console.log('could not find a track to play :(');
      }
    }
  };
})('../css/sounds/bell.mp3', 1, 1, 0.1);

// myaudiosprite.mp3 is the complete audio sprite
// 1 = the number of tracks, increase this for the desktop
// 1 = the length of the individual audio clip
// 0.25 = the lead on the audio - hopefully zero, but in case any junk is added


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

