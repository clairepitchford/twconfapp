require 'stringio'

require 'build-html'

Given /^a topics YAML of:$/ do |yaml|
  @topics_yaml = StringIO.new yaml
end

Given /^a speakers YAML of:$/ do |yaml|
  @speakers_yaml = StringIO.new yaml
end

When /^the files are converted$/ do
  @topics_yaml ||= StringIO.new
  @speakers_yaml ||= StringIO.new

  @convert = JSONConverter.new(@topics_yaml, @speakers_yaml)
end

Then /^there should be an error$/ do
  @topics_yaml ||= StringIO.new
  @speakers_yaml ||= StringIO.new

  lambda { JSONConverter.new(@topics_yaml, @speakers_yaml) }.should raise_error
end

Then /^the first session ID should be "([^"]*)"$/ do |sid|
  @convert.topics.keys.first.should == sid
end

Then /^the day should be (\w+)$/ do |day|
  # TODO: Make this conversion better, OK?
  @convert.topics.first[1]['date'][0..2].should == day[0..2]
end

Then /^the number of speakers should be (\d+)$/ do |num_speakers|
  @convert.speakers.length.should == num_speakers.to_i
end

Then /^there should be a description$/ do
  @convert.topics.first[1]['description'].should_not be nil
end
