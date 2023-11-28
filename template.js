var jstemplate = (function (jspsych) {
  "use strict";

  const info = {
    name: "PLUGIN-NAME",
    parameters: {
      parameter_name: {
        type: jspsych.ParameterType.INT,
        default: undefined,
      },
      parameter_name2: {
        type: jspsych.ParameterType.IMAGE,
        default: undefined,
      },
    },
  };

  /**
   * **PLUGIN-NAME**
   *
   * SHORT PLUGIN DESCRIPTION
   *
   * @author YOUR NAME
   * @see {@link https://DOCUMENTATION_URL DOCUMENTATION LINK TEXT}
   */
  class PluginNamePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
      // data saving

      var html = 
        '<script src="Views/joy.js">' + "</script>" +
        '<div id="experimentContainer" class="container">' +
        '<div id="joyBox" class="container">' +
        '<div id="pointerUp" class="pointer">' + 
        "</div>" +
        '<div id="nextButton" class="nextButton">' + "</div>" +
        '<div id="pointerDown" class="pointer">' +
        "</div>" + 
        "</div>" +
        "</div>";
      display_element.innerHTML = html;
      console.log(display_element);
      const butt = display_element.querySelector(".nextButton");
      butt.addEventListener("click", endTrial);

      // const joyStick = display_element.querySelector(".joyStick");
      // const joyParam = { "internalFillColor": "#d41313", "externalStrokeColor": "#d41313"};
      // var Joy = new JoyStick('joyDiv', joyParam);

      
      
      var trial_data = {
        parameter_name: "parameter value",
      };
      // end trial
      function endTrial() {
        this.jsPsych.finishTrial(trial_data);
      }
    }
  }
  PluginNamePlugin.info = info;

  return PluginNamePlugin;
})(jsPsychModule);
