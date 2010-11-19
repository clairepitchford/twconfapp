Given /the current time is set to "(.*?)"/ do |time_string|
  phone = SimPhone.new 
  phone.browser.eval_js('localStorage.setItem("_watir_tests_fake_time_string", "'+time_string+'");')
end

Given /I have not previously rated the "(.*?)" session/ do |session_id|
  phone = SimPhone.new
  phone.browser.eval_js('localStorage.removeItem("#{session_id}-rating")')
end

When /I click the "Rate this session" icon for the "(\w+)" session/ do |session_id|
  @phone.click_rate_session session_id
end

Then /I am on the "(\w+)" session page/ do |session_id|
  @phone.session?.downcase.should == session_id.downcase
end

When /I click the second star icon/ do 
  @phone.click_2_star_rating 
end

Then /two star icons should be red/ do
  @phone.red_stars?.should == 2
  @phone.browser.eval_js('localStorage.removeItem("breakfast-rating");');
end