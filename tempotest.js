import { jsPsychTempoChanger } from "/index.js";

var jsPsych = initJsPsych({
  //use_webaudio: true
});
var timeline =[];

// var preload = {
//   type: jsPsychPreload,
//   audio: ['Audio/1_context_75.wav'],
//   auto_preload: true,
//   show_detailed_errors: true
// //TODO: load in audio
// };
// timeline.push(preload);

var welcome = {
type: jsPsychHtmlKeyboardResponse, 
stimulus: "Welcome to the Tempo Determination Experiment. Press any key to begin."
//maybe make all these into mouse clicks considering its basically all done with the mouse
};
timeline.push(welcome);




var trial = {
  type: jsPsychTempoChanger,
  stimulus: "Audio/1_context_75.wav", 
};
timeline.push(trial);

var end = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: "done trial"
};
timeline.push(end);


jsPsych.run(timeline);