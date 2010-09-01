Then /^I should see the "([^"]*)" blurb$/ do |blurb|
  @phone.browser.contains_text blurb
end
