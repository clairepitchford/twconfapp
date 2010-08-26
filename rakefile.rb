require 'cucumber/rake/task'

task :default => [:cucumber]

Cucumber::Rake::Task.new do |t|
  t.cucumber_opts = "--format pretty"
end

