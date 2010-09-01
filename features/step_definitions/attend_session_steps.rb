And /the "(\w+)" session reminder is toggled off/ do |session_id|
  if @phone.session_checked? session_id
    @phone.toggle_session_reminder session_id
  end
end

When /I toggle the "(\w+)" session reminder/ do |session_id|
  @phone.toggle_session_reminder session_id
end

Then /the "(\w+)" session reminder should be toggled on/ do |session_id|
  @phone.session_checked?(session_id).should == true
end