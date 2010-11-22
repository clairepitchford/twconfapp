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

desc "convert topic/spearker/config YML to JSON, process cache key for manifest, "
task :schedule do
  File.open(JSON_DATA_FILENAME, "w") do |f|
    JSONConverter.new(File.open(CONFIG_YAML_FILENAME),
                      File.open(TOPIC_YAML_FILENAME),
                      File.open(SPEAKER_YAML_FILENAME)).write f
  end

  ManifestProcessor.new(MANIFEST_IN_FILENAME).write
end
