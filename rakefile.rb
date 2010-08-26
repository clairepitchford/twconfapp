require 'cucumber/rake/task'

task :default => [:schedule, :cucumber]

task :schedule do
  ruby 'build-html.rb'
end

Cucumber::Rake::Task.new do |t|
  t.cucumber_opts = "--format pretty"
end
