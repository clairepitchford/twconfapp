require 'cucumber/rake/task'
require 'build-html'

task :default => [:schedule, :cucumber]

task :schedule do
  File.open("themes/agile2010/defaultData.js", "w") do |f|
    JSONConverter.new(File.open('data/topics.yml'),
                      File.open('data/speakers.yml')).write f
  end
end

Cucumber::Rake::Task.new do |t|
  t.cucumber_opts = "--format pretty"
end
