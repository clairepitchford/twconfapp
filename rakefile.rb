require 'build-html'

task :default => MANIFEST_IN_FILENAME

begin
  require 'cucumber/rake/task'

  task :default => :cucumber

  Cucumber::Rake::Task.new do |t|
    t.cucumber_opts = "--format pretty"
  end
rescue LoadError
end

task JSON_DATA_FILENAME => [TOPIC_YAML_FILENAME, SPEAKER_YAML_FILENAME] do
  File.open(JSON_DATA_FILENAME, "w") do |f|
    JSONConverter.new(File.open(TOPIC_YAML_FILENAME),
                      File.open(SPEAKER_YAML_FILENAME)).write f
  end
end

task MANIFEST_IN_FILENAME do
  ManifestProcessor.new(MANIFEST_IN_FILENAME).write
end

def compile(ins, out)
  task out => ins do |t|
    ins_js = t.prerequisites.map { |s| " --js #{s} " }
    sh "java -jar bin/closure-compiler.jar #{ins_js} --js_output_file=#{t.name}"
  end
  task MANIFEST_IN_FILENAME => out
end

compile [JSON_DATA_FILENAME, "themes/agile2010/agile2010.js"],
  "themes/agile2010/agile2010.compiled.js"

compile ["jqtouch/jqtouch.js", "jqtouch/extensions/jqt.scroll/jqt.scroll.js"],
  "jqtouch/jqt_with_scroll.compiled.js"
