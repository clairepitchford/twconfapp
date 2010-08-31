Then /^the highlighted button should be (\w+)$/ do |button|
  @phone.tab?.should == button
end
