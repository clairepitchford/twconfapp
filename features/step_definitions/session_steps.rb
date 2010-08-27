Given /I open (\w+)/ do |schedule_day|
  @phone = SimPhone.new
  @schedule = @phone.schedule schedule_day
end

When /the home page appears/ do
  @phone.title.should == "Agile 2010"
end

Then /I should see (\w+) selected/ do |schedule_day|
  @schedule.day.should == schedule_day
end

Then /time slot (\d\d:\d\d(?:AM|PM)) exists/ do |time_slot|
  @time_slot = time_slot
  @schedule[@time_slot].should_not be_empty
end

Then /the title should be (.+)/ do |title|
  @schedule[@time_slot].first['title'].should == title
end

Then /the speaker should be (.+)/ do |speaker|
  @schedule[@time_slot].first['speaker'].should == speaker
end
