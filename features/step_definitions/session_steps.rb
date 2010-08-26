XPATH_CURRENT = "//div[contains(@class, 'current')]"
XPATH_SCHEDULE = "#{XPATH_CURRENT}//ul[contains(@class, 'schedule')]"

Given /I open (\w+)/ do |schedule_day|
  @browser = Watir::Safari.start "#{Dir.getwd}/index.html"
  @browser.link(:xpath, "#{XPATH_CURRENT}//div[@class='toolbar']//a[@href='##{schedule_day}']").click
end

When /the home page appears/ do
  @browser.title.should == "Agile 2010"
end

Then /I should see (\w+) selected/ do |schedule_day|
  @browser.link(:class, "selected").text.should == schedule_day
end

Then /time slot (\d\d:\d\d(?:AM|PM)) exists/ do |time_slot|
  @ts_query = "#{XPATH_SCHEDULE}//li[text()='#{time_slot}']"

  @browser.li(:xpath, @ts_query).text.should == time_slot
end

Then /the title should be (.+)/ do |title|
  @browser.link(:xpath, "#{@ts_query}/following-sibling::li//a[contains(@class, 'topic-link')]").text.should == title
end

Then /the speaker should be (.+)/ do |speaker|
  @browser.div(:xpath, "#{@ts_query}/following-sibling::li//div[contains(@class, 'speaker-go')]").text.should == speaker
end
