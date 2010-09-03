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
    JSONConverter.new(File.open(TOPIC_YAML_FILENAME ),
                      File.open(SPEAKER_YAML_FILENAME)).write f
  end
end
