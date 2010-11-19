require 'yaml'

Given /^the manifest "([^"]+)"$/ do |manifest_fn|
  @fn = manifest_fn
end

Given /^the speaker file "([^"]+)"$/ do |speaker_fn|
  @speaker_fn = speaker_fn
end

Then /^all files in it should exist$/ do
  File.open(@fn) do |f|
    mode = :start

    f.readlines.each do |ln|
      ln = ln[0 ... ln.rindex('#')] if ln.rindex('#')
      ln.strip!

      if mode == :start
        ln.should == 'CACHE MANIFEST'
        mode = :cache
      else
        ln = "" if ln.start_with? '#'

        mode = :cache if ln == 'CACHE:'
        mode = :fallback if ln == 'FALLBACK:'
        mode = :network if ln == 'NETWORK:'

        ln.should satisfy { |fn| File.exist? fn } if mode == :cache and not ln.empty?
      end
    end
  end
end

#themes/agile2010/img/speakers/

Then /^each speaker should have an image file associated with him or her$/ do
  speakers = YAML::load(File.open(@speaker_fn))
  speakers.keys.each do |speaker_name|
    speaker_name.should satisfy { |fn| File.exist? 'themes/agile2010/img/speakers/' + fn + '.gif'}
  end
  

end





























