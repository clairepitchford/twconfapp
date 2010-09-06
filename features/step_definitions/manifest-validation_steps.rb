Given /^the manifest "([^"]+)"$/ do |manifest_fn|
  @fn = manifest_fn
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
