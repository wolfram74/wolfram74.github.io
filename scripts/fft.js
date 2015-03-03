var FFTJS = function() {

    var API = {};

    var ctx; //audio context
    var buf; //audio buffer
    var fft; //fft audio node
    var samples;
    var isSetup = false; //indicate if audio is set up yet

    API.mappings = [];

    API.setup = function() {
      return isSetup;
    };

    API.init = function(s) {
        samples = s;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        navigator.getUserMedia({
                audio: true
            },
            gotStream, error
        );
    };

    API.fft = function() {
      if (API.setup()) {
        var data = new Uint8Array(fft.frequencyBinCount);
        fft.getByteFrequencyData(data);
        return data;
      } else {
        return [];
      }
    };


    function initAudioContext() {
        console.log("in init");
        try {
            ctx = new webkitAudioContext(); //is there a better API for this?
        } catch (e) {
            alert('you need webaudio support' + e);
        }
    }


    // success callback when requesting audio input stream
    function gotStream(stream) {
        initAudioContext();

        // Create an AudioNode from the stream.
        var mediaStreamSource = ctx.createMediaStreamSource(stream);

        //create fft
        fft = ctx.createAnalyser();
        fft.fftSize = samples;

        mediaStreamSource.connect(fft);
        isSetup = true;
    }

    var error = function(err) {
        console.log("The following error occured: " + err);
    };

    return API;
};
