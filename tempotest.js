import { jsPsychTempoChanger } from "/index.js";

var jsPsych = initJsPsych({
  use_webaudio: true
});
var timeline =[];

var preload = {
  type: jsPsychPreload,
  audio: ['Audio/1_context_75.wav'],
  auto_preload: true,
  show_detailed_errors: true
//TODO: load in audio
};
timeline.push(preload);

var welcome = {
type: jsPsychHtmlKeyboardResponse, 
stimulus: "Welcome to the Tempo Determination Experiment. Press any key to begin."
//maybe make all these into mouse clicks considering its basically all done with the mouse
};
timeline.push(welcome);



// var audio = {
// type: jsPsychAudioButtonResponse,
// stimulus: 'Audio/1_context_75.wav',
// choices: ['Low', 'High'],
// prompt: "<p>Is the pitch high or low?</p>"
// };
// timeline.push(audio);


// var test = {
//     type: jstemplate,
// }
//  timeline.push(test);


var trial = {
  type: jsPsychTempoChanger,
  stimulus: 'Audio/1_context_75.wav', 
};
timeline.push(trial);
//timeline.push(audio); //run the working trial again

jsPsych.run(timeline);