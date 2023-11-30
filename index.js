
//import { jsPsychModule, ParameterType } from "jspsych";
import { PitchShifter } from "/plugin-tempochanger/shifter.js";

export var jsPsychTempoChanger = (function (jspsych) { // will need an export thnig if you go that route
  "use strict";

  const info = {
    name: "Tempo-Changer",
    parameters: {
      // The audio file for the specific trial

      // stimulus: {
      //   type: jspsych.ParameterType.HTML_STRING,
      //   default: undefined,
      // },

      stimulus: {
        type: jspsych.ParameterType.AUDIO,
        default: undefined,
      },
      // Start tempo (in ms)
      startTempo: {
        type: jspsych.ParameterType.INT,
        default: 800, // 75 bpm
      },
      // The factor at which the tempo changes
      changeRate : {
        type: jspsych.ParameterType.INT,
        default: 0.02,
      },
      // Margin for the start tempo
      jitter: {
        type: jspsych.ParameterType.INT,
        default: 10,
      }
      // maybe add something for experiment block, trial, id, etc so that the output file looks like how it does before
    },
  };

  /**
   * **PLUGIN-NAME**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author HASAN NAZIR
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class TempoChangerPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      // Set up the experiment controls
      var html = 
        '<div id="experimentContainer" class="container">' +
          '<div id="joyBox" class="container">' +
          '<div id="pointerUp" class="pointer">' + "</div>" + 
          '<div id="joyDiv" class="joyStick">' + "</div>" +
          '<div id="pointerDown" class="pointer">' + "</div>" + 
          '<div id="nextButton" class="nextButton">' + "</div>" +
          "</div>" +
        "</div>";
      display_element.innerHTML = html;
      //console.log(display_element);

      const joyStick = display_element.querySelector(".joyStick");
      const next = display_element.querySelector(".nextButton");

      // set up the joystick
                    // could make this set of things a parameter to adjust in the constructor
      const joyParam = { "internalFillColor": "#d41313", "externalStrokeColor": "#d41313"};
      var Joy = new JoyStick('joyDiv', joyParam);
      

      




      //load audio

      // var context = new (window.AudioContext || window.webkitAudioContext)();
      // // Functions for decoding and preparing audio

      // fetch(trial.stimulus);

      // function fetch(url) {
      //   var request = new XMLHttpRequest();
      //   request.open('GET', url, true);
      //   request.responseType = 'arraybuffer';
      //   request.onload = function () { onSuccess(request) };
      //   request.send();
      // }

      // function onSuccess(request) {
      //   var audioData = request.response;
      //   context.decodeAudioData(audioData, onBuffer, onDecodeBufferError);
      // }

      // function onBuffer(buffer) {
      //   console.log(buffer);
      //   console.log(context);
      //   shifter = new PitchShifter(context, buffer, 1024);
      //   //marginChanger();
      //   shifter.tempo = tempo/100;
      //   shifter.pitch = 1;
      //   shifter.on('play', (detail) => {
      //       playing = true;
      //   });
      // }

      // function onDecodeBufferError(e) {
      //   console.log('Error decoding buffer: ' + e.message);
      //   console.log(e);
      // }
      
      var context = this.jsPsych.pluginAPI.audioContext();

      console.log(context)
      this.jsPsych.pluginAPI
      .getAudioBuffer(trial.stimulus)
      .then((buffer) => {
      if (context !== null) {
          this.audio = context.createBufferSource();
          this.audio.buffer = buffer;
          console.log(buffer); // buffer is actually a buffer now
          this.audio.connect(context.destination);
        //  createPitchShifter(buffer);
          console.log(this.audio); // here this.audio is a buffersource node
          this.audio.start(context.currentTime);//figure out how to play audiobufferNODE 
      }
     else {
          this.audio = buffer;
          this.audio.currentTime = 0;
          this.audio.play();
          // throw an error that says "web audio not utilized" or something
      }
  })
      .catch((err) => {
      console.error(`Failed to load audio file "${trial.stimulus}"`);
      console.error(err);
  });




////////////////////  Variables n whatnot

      const changeRate = trial.changeRate;                      
      const updateInterval = 500;                   // How often the update set interval thing runs
      const margin = trial.jitter;                  // Percentage of variability of the starting tempo (aka Jitter)
      let trueTempo;                                // True tempo of the audio file in ms
      let tempo = 100;                              // Tempo of the audio file as a percentage
      let shifter;                                  // Becomes the PitchShifter variable
      let tracker;                                  // Used for interval beat tracking
      let update;                                   // Used to update the Y value of the joystick with pressed                    
      // play audio



//////////////// FUNCTIONS

//General Fns
      function createPitchShifter(buffer) {
        shifter = new PitchShifter(context, buffer, 1024); // need to figure out the import stuff
        //marginChanger();
        shifter.tempo = tempo/100;
        shifter.pitch = 1;
      }

      // Jitters the starting tempo, begins playback, begins timer, and adds joystick listeners
      // potentially change this to onstart? i think thats a jsPsych thing?
      // function startTrial() {
      //   marginChanger();
      //   joyStick.addEventListener("mousedown", startTempoStick);
      //   next.addEventListener("click", nextButton);
      //   startTimer();
      //   //play audio
      // }

      // function startTimer() {
      //   // begins the timer
      // }

      // Runs when the next button is pressed, ending the trial
      //    --this should maybe pass on the audio tempo or something? for the tap task
      function endTrial() {
        display_element.innerHTML = "";
        this.jsPsych.finishTrial(trial_data); //not working for some reason
      }

      // Function to change the tempo of the audio
      // takes an int representing the new tempo of the audio as a percentage
      // function changeTempo(t) { 
      //   shifter.tempo = t/100;
      //   shifter.pitch = 1;     // ensures the pitch stays the same after changing tempo
      //   // Resets the beat tracker every time the tempo changes

      //   // clearInterval(tracker);
      //   // tracker = setInterval(beatTrack, (trueTempo - (trueTempo * deltaT/100))); //this keeps the beats aligned with the tempo
      // }

      // // Function to randomly add or subtract a percentage from the tempo based on the "margin" const
      // function marginChanger() {
      //   trueTempo = jsPsychTempoChanger.startTempo;
      //   let n = Math.floor(Math.random() * 2) + 1;
      //   let ran = (Math.random() * margin)
      //   console.log(n);
      //   switch (n) {
      //       case 1:
      //           tempo += ran;
      //           trueTempo += ran;
      //       case 2:
      //           tempo -= ran;
      //           trueTempo -= ran;
      //   }
      // }

      // // Pushes the tempo change at its time stamp to the data array
      // function storeTempoChange(t, b) {
      //   //
      // }
      

//Joystick Reacting Fns

joyStick.addEventListener("mousedown", startTempoStick);
next.addEventListener("click", endTrial);

      // Reads the joystick position and adjusts tempo
      function tempoStick(currY) {
        var rate = currY * changeRate;
        if (tempo < 1) {
            tempo = 1;
            console.log("Tempo at Minimum");
        } else {
            tempo += rate;
          //  deltaT += rate; //to help 
            if (rate < 0) {
                console.log("Decreasing Tempo");
            } else {
                console.log("Increasing Tempo");
            }
        }
        //storeTempoChange(tempo, beat); // will need to change beat to timestamp
       //changeTempo(tempo);
        //console.log(tempo);
      }


      function startTempoStick() {
        console.log("stick pressed");
        joyStick.addEventListener("mousemove", updateTempoStick);
        joyStick.addEventListener("mouseup", stopStick);
      }
      
        //fn that continuously updates the y value of the stick
      function updateTempoStick() {
        update = setInterval(tempoStick(Joy.GetY()), updateInterval);
      }

      function stopStick() {
        clearInterval(update);
        joyStick.removeEventListener("mouseup", stopStick);
        joyStick.removeEventListener("mousemove", updateTempoStick);
        console.log("stick unpressed");
      }



      // data saving
      var trial_data = {
        stimulus: "audioFileName", //null response
        // tempoData: [], //null response
        // startTempo: 1,
        // endTempo: tempo,
      };
      //this.jsPsych.finishTrial(trial_data);
    }
  }
  TempoChangerPlugin.info = info;

  return TempoChangerPlugin;
})(jsPsychModule);
