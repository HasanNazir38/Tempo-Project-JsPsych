index.js is the tempo shifting JsPsych plugin
The TempoDetExperiment files are an outline for the overall experiment
plugin-tempochanger contains files that index.js is depenedant on
tempotest are test files for the experiment

- for all imports(all the JsPsych plugins being used): use cdn based thingy (JsPsych has a page about this)
- SoundtouchJS runs uses deprecated ScriptProcessorNode. They have since released a version using the updated AudioWorkletNode,
    so updating to that would be a good idea. Most browsers still run the ScriptProcessorNode though
- For simpler sounds, using MIDI might be a better idea, though the problem is that doesn't scale well to more complicated
    audio, and stimuli would have to be remade with MIDI (which wouldnt be too bad, considering MuseScore does allow you to export 
    as MIDI)
- Other choices could be to use FFMPEG's atempo function. The problem is that FFMPEG currently (as I write this) does not have a version
    that can be used in browsers, but it seems like it is something that is being worked on and might exist in the near future. If so, 
    this would be ideal, as their tempo shifting works a lot better than SoundtouchJS and will probably be more future proof

