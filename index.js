console.log("Hello World");

// Create the paths to Brian's oggs
var sampleIndex = 0;
var currentSampler = null;
var samplePaths = [];
for (var i = 0; i < 6; i ++) {
  var path = "audio/" + ("000" + i).slice(-3) + ".wav";
  samplePaths.push(path);
}


var createNewSampler = function(samplePaths, sampleIndex) {
  var path = samplePaths[sampleIndex];
  console.log(path);
  var currentSampler = new Tone.Sampler(path, function() {
    currentSampler.volume.value = 6;
  }).toMaster();

  return currentSampler;
}

WebMidi.enable(function (err) {
  if (err) {
	console.log("WebMidi could not be enabled.", err);
  } else {
	console.log("WebMidi enabled!");

    // Can we just put jQuery here?
    $("#1").click(function() {
        console.log("one!");
    });

    currentSampler = createNewSampler(samplePaths, sampleIndex);
	// var input = WebMidi.inputs[0];
    var input = WebMidi.getInputById("1751963343");

	console.log(input);
	console.log(input.state);

	input.addListener('noteon', "all", function (e) {
	  console.log("Received 'noteon' message (" + e.note.name + e.note.octave + ").");
      currentSampler.triggerAttackRelease(e.note.number, 1);
      console.log(sampleIndex);
	});

	input.addListener('noteoff', "all", function (e) {
	  console.log("Received 'noteoff' message (" + e.note.name + e.note.octave + ").");
	});

    document.onkeypress = function (e) {
      e = e || window.event;
      console.log(e.keyCode);
      if (e.keyCode == 61) {
          sampleIndex = sampleIndex + 1;
          if (sampleIndex > samplePaths.length - 1) {
              sampleIndex = samplePaths.length - 1;
          }
          currentSampler = createNewSampler(samplePaths, sampleIndex);
      } else if (e.keyCode == 45) {
          sampleIndex = sampleIndex - 1;
          if (sampleIndex < 0) {
              sampleIndex = 0;
          }
          currentSampler = createNewSampler(samplePaths, sampleIndex);
      }
      console.log(sampleIndex);
    };

  }
});

