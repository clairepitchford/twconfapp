require 'build-html'

begin
  require 'cucumber/rake/task'

  task :default => [:cucumber, :schedule]

  Cucumber::Rake::Task.new do |t|
    t.cucumber_opts = "--format pretty"
  end
rescue LoadError
  task :default => [:schedule]
end

task :schedule do
  File.open(JSON_DATA_FILENAME, "w") do |f|
    JSONConverter.new(File.open(TOPIC_YAML_FILENAME),
                      File.open(SPEAKER_YAML_FILENAME)).write f
  end

  ManifestProcessor.new(MANIFEST_IN_FILENAME).write
end

task :minify do
  system("java -jar bin/closure-compiler.jar --js themes/agile2010/defaultData.js --js themes/agile2010/agile2010.js --js_output_file=themes/agile2010/agile2010.compiled.js")
  system("java -jar bin/closure-compiler.jar --js jqtouch/jqtouch.js --js jqtouch/extensions/jqt.scroll/jqt.scroll.js --js_output_file=jqtouch/jqt_with_scroll.compiled.js")
end
