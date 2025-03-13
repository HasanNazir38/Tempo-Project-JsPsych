
import { PitchShifter } from "/plugin-tempochanger/shifter.js";

export var jsPsychTempoChanger = (function (jspsych) { // will need an export thnig if you go that route
  "use strict";

  const info = {
    name: "Tempo-Changer",
    parameters: {
      // The audio file for the specific trial
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
      },
      // Parameters for drawing the joystick
      joyParameters : {
        type: jspsych.ParameterType.KEYS,
        default: { "internalFillColor": "#d41313", "externalStrokeColor": "#d41313"},
      },
      // Number of fractional digits in the data
      precision : {
        type: jspsych.ParameterType.INT,
        default: 2,
      },
      // Title text at the top of the page
      title : {
        type: jspsych.ParameterType.STR,
        default: null,
      },
      // Text above the Joystick Box
      prompt : {
        type: jspsych.ParameterType.STR,
        default: "Use the joystick to adjust tempo",
      },
      // maybe add something for experiment block, trial, id, etc so that the output file looks like how it does before
    },
  };

  /**
   * **Audio Tempo Shifter**
   *
   * Plays an audio file and allows you to use a joystick to shift the tempo without
   * adjusting the pitch.
   * Uses SoundtouchJS for the tempo adjustment
   *
   * @author HASAN NAZIR
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class TempoChangerPlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {

      // Set up the page participant controls
      var html = 
        '<div id="experimentContainer" class="container">' +
          '<div id="joyBox" class="container">' +
          '<div id="pointerUp" class="pointer">' + "</div>" + 
          '<div id="joyDiv" class="joyStick">' + "</div>" +
          '<div id="pointerDown" class="pointer">' + "</div>" + 
          '<div id="nextButton" class="nextButton">' + "</div>" +
          "</div>" +
        "</div>";

      if (trial.prompt !== null) {
        html = '<p>' + trial.prompt + "</p>" + html;
      }
      if (trial.title !== null) {
        html = '<h1>' + trial.title + "</h1>" + html;
      }
      display_element.innerHTML = html;

      // Finds the joystick and next button
      const joyStick = display_element.querySelector(".joyStick");
      const next = display_element.querySelector(".nextButton");

      // Set up the joystick
      var Joy = new JoyStick('joyDiv', trial.joyParameters);
      
      
      // //Load and play audio
       var context = this.jsPsych.pluginAPI.audioContext();
       var gainNode = context.createGain();
      // console.log(context);
      let buffer;

      //Fetches audiofile and creates audio buffer
      async function loadAudio() {
        try {
          // Load an audio file
          const response = await fetch(trial.stimulus);
          console.log(response);
          // Decode it
          buffer = await context.decodeAudioData(await response.arrayBuffer());
          createPitchShifter(buffer);
        } catch (err) {
          console.error(`Unable to fetch the audio file. Error: ${err.message}`);
        }
      }
      loadAudio();

////////////////////  Variables and Constants

      const changeRate = trial.changeRate;                      
      const updateInterval = 500;                   // How often the update set interval thing runs
      const margin = trial.jitter;                  // Percentage of variability of the starting tempo (aka Jitter)
      const digits = trial.precision;               // Number of digits to round data to
      const startTime = new Date().getTime();       // The time at which the trial starts in ms
      var trueTempo = trial.startTempo;             // True tempo of the audio file in ms
      var tempo = 100;                              // Tempo of the audio file as a percentage
      var shifter;                                  // Becomes the PitchShifter variable
      var playing = false;                          // Boolean to indicate audio playing
      var update;                                   // Used to update the Y value of the joystick with pressed                    
      var tempoDataPoints = [];                     // Data array with tempo at timestamp in seconds

//////////////// FUNCTIONS

//Key Component Fns//

      function createPitchShifter(buffer) {
        if (shifter) {
          shifter.off(); // remove any current listeners
        }
        shifter = new PitchShifter(context, buffer, 1024); 
        marginChanger();
        shifter.tempo = tempo/100;
        shifter.pitch = 1;
        shifter.on('play', (detail) => {
          playing = true;
          //console.log(detail.percentagePlayed);
          if (detail.percentagePlayed > 99) {
            shifter.percentagePlayed = 0;      //loops audio
          }
      });
        storeTempoChange(tempo);
        play();
      }

      const play = function (){
        shifter.connect(gainNode);
        gainNode.connect(context.destination);
      } 

      const stop = function(){
        shifter.disconnect()
      }

    
      // Function to change the tempo of the audio
      // takes an int representing the new tempo of the audio as a percentage
      function changeTempo(t) { 
        shifter.tempo = t/100; //undefined cuz createpitchshifter not running rn
        shifter.pitch = 1;     // ensures the pitch stays the same after changing tempo
      }

      // Function to randomly add or subtract a percentage from the tempo based on the "margin" const
      function marginChanger() {
        let n = Math.floor(Math.random() * 2) + 1;
        let ran = (Math.random() * margin)
        console.log(n);
        switch (n) {
            case 1:
                tempo += ran;
                trueTempo += ran;
            case 2:
                tempo -= ran;
                trueTempo -= ran;
        }
      }

// Data handling Fns //

      // Runs when the next button is pressed, ending the trial
      //    --this should maybe pass on the audio tempo or something? for the tap task
      const endTrial = () => {
        console.log("ending trial");
        display_element.innerHTML = "";
        stop();
        playing = false;
        var trial_data = {
          stimulus: trial.stimulus, 
          tempoData: tempoDataPoints, 
          startTempo: trueTempo,
          endTempo: tempo,
          // might need to add block, stim#, and trial#, could be done in experiment js
        };
        console.log(trial_data); //working
        this.jsPsych.finishTrial(trial_data); 
      }

      // Pushes the tempo change at its time stamp to the data array
      function storeTempoChange(t) {
        let stamp = getTimeStamp().toFixed(digits); 
        t = t.toFixed(digits);
        tempoDataPoints.push({t, stamp});
      }

      // Finds the current time elapsed from the beginning of the trial and converts it to seconds
      function getTimeStamp() {
        let currTime = new Date().getTime() - startTime;
        return currTime/1000; 
      }

/////Joystick Reacting Fns

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
            if (rate < 0) {
                console.log("Decreasing Tempo");
            } else {
                console.log("Increasing Tempo");
            }
        }
        storeTempoChange(tempo);
        changeTempo(tempo);
      }

      // Fn that reads when the stick is pressed and begins the tempo changing
      function startTempoStick() {
        console.log("stick pressed");
        joyStick.addEventListener("mousemove", updateTempoStick);
        joyStick.addEventListener("mouseup", stopStick);
      }
      
      // Fn that continuously updates the y value of the stick while stick is pressed
      function updateTempoStick() {
        update = setInterval(tempoStick(Joy.GetY()), updateInterval);
      }

      // Fn that reads when the joystick is no longer being used
      function stopStick() {
        clearInterval(update);
        joyStick.removeEventListener("mouseup", stopStick);
        joyStick.removeEventListener("mousemove", updateTempoStick);
        console.log("stick unpressed");
        console.log(tempoDataPoints); //!!! temp
      }
    }
  }
  TempoChangerPlugin.info = info;
  return TempoChangerPlugin;
})(jsPsychModule);