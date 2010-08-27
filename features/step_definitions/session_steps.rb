Given /I open (\w+)/ do |schedule_day|
  @browser = Watir::Safari.start("file:///#{Dir.getwd}/index.html")
  @browser.eval_js "$(\"div.current div.toolbar a[href='##{schedule_day}']\").click()"
  loop do
    sleep 0.1
    break if @browser.dom.at('div.current')['id'] == schedule_day
  end
  @schedule = parse_schedule()
end

When /the home page appears/ do
  @browser.title.should == "Agile 2010"
end

Then /I should see (\w+) selected/ do |schedule_day|
  @browser.link(:class, "selected").text.should == schedule_day
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
