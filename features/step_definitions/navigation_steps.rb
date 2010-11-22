Then /^the highlighted button should be (\w+)$/ do |button|
  @phone.tab?.should == button
end

Then /^I should see the "([^"]*)" blurb$/ do |blurb|
  (@phone.browser.contains_text(blurb)).should_not be_nil
end
