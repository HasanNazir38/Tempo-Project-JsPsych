import { jsPsychTempoChanger } from "/index.js";

/*
    Tempo Determination Experiment, running in jsPsych
Currently the audio playback and manipulation run with WebAudio and jsSoundTouch, as utilized within
the TempoChangerPlugin. If MIDI is the desired format for audio playback and manipulation, that can be
done by creating and using a different plugin that can handle that. 

Note: Due to some Web security protocol of some sort, you can't begin the experiment on a task
      that plays audio on load. It doesn't allow for audio to play without any user input. This
      is solved by simply added any page that requires the user to interact with it.
      Tl;dr You need a welcome page.
*/


var jsPsych = initJsPsych();
var timeline =[];

// Preload all the audio files for the experiment
var preload = {
    type: jsPsychPreload,
    //TODO: load in audio
};
timeline.push(preload);

// TODO!!!
// - Generate userId (described on jsPsych page)
// - Loading in stimuli properly
// - Handle output data (making sure its in the correct csv form, has everything it needs
//      aggregates correctly, prints to csv correctly, and is stored somewhere accessible.
//      Data storage might be a bit confusing because of server stuff and it being online)
// - Counter for how many trials left in a block (could use built in progress bar feature instead)
//       - I need to track trials and blocks anyways


/* ----------ALL THE COMPONENTS OF THE EXPERIMENT---------- */

// Stimuli arrays
var noContextStim = [
    {audio: 'insertaudiofilenamepath'},
    {audio: 'insertaudiofilenamepath'},
    {audio: 'insertaudiofilenamepath'},
    //...
];

var contextStim = [
    {audio: 'insertaudiofilenamepath'},
    {audio: 'insertaudiofilenamepath'},
    {audio: 'insertaudiofilenamepath'},
    //...
];


    // ---Trial types--- //
// The primary tempo changer trial
var tempoTask = {
    type: jsPsychTempoChanger,
    stimulus: jsPsych.timelineVariable('audio'),
/* ---Variables you can adjust in the trial (listed are the defaults)--- */
    // startTempo: 800,                 // In ms
    // changeRate: 0.02,                // Factor that adjusts the rate of tempo change
    // jitter: 10,                      // Margin for start time randomization in ms
    // joyParameters:                   // Parameters for adjusting the look of the joystick (joy.js has the extensive list of adjustable parameters)
    //      { "internalFillColor": "#d41313", "externalStrokeColor": "#d41313"},           
    // precision: 2,                    // Number of sig fig after the decimal in the data output
    // title: null,                     // Page title text
    // prompt:                          // Text displayed above the control box
    //      "Use the joystick to adjust tempo",  
    // update: 500,                     // Another precision tool, sets how frequently updating functions run in the plugin 
    
    //data : {},
};

// The tap tempo trial !!! todo
var tapTask = {
    type: TapTask,
    stimulus: jsPsych.timelineVariable('audio'), // Should take the endTempo data from the tempoTask
    //data: {,}
};


    // ---Experimental Blocks--- //
var withContext = {
    timeline: [tempoTask, tapTask],
    timeline_variables: contextStim,
    randomize_order: true,
};

var withoutContext = {
    timeline: [tempoTask, tapTask],
    timeline_variables: noContextStim,
    randomize_order: true,
};

// A break between the blocks. Add as needed
var between = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Trial block Completed, press any button to begin the next block"
};


/* --------EXPERIMENT TIMELINE---------*/

// Create welcome message
var welcome = {
    type: jsPsychHtmlKeyboardResponse, 
    stimulus: "Welcome to the Tempo Determination Experiment. Press any key to begin."
};
timeline.push(welcome);

// Instructions page
var instructions = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "heres ya dang instructions"
};
timeline.push(instructions);

// Practice run
var practice = {
    timeline: [tempoTask, tapTask],
    timeline_variables: {audio: 'audioname'}, // !!! give real audio path
};
timeline.push(practice);

// Page that just says begin
var begin = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: "Press any button to begin experiment"
};
timeline.push(begin);

// Trial block, add as needed, will run as many times as there are files defined in its array
timeline.push(withContext); 
timeline.push(between);
timeline.push(withoutContext);

// End of experiment
//!!!!TODO just a landing page basically

/* RUN EXPERIMENT */
jsPsych.run(timeline);