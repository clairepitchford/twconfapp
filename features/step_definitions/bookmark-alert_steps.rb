Then /^I should see a bookmark reminder popup$/ do
  @reminder = @phone.bookmark_reminder
  @reminder.visible?.should be true
end

When /^I click the bookmark reminder popup$/ do
  @reminder.click
end

Then /^it should disappear$/ do
  @reminder.visible?.should be false
end

Given /^I'm running in Safari$/ do
  @phone.fullscreen = false
end

Then /^I should not see a bookmark reminder popup$/ do
  @reminder = @phone.bookmark_reminder
  @reminder.visible?.should be false
end
