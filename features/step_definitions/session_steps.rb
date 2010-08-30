Given /I open the (\w+) tab/ do |tab|
  @phone = SimPhone.new.tab tab
end

Given /open the (\w+) schedule/ do |schedule_day|
  @schedule = @phone.schedule schedule_day
end

Then /I should see (\w+) selected/ do |schedule_day|
  @schedule.day?.should == schedule_day
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
