And /the "(\w+)" session reminder is toggled (off|on)/ do |session_id, reminder_state|
  reminder_state = reminder_state == "on" ? true : false
  if @phone.session_checked?(session_id) != reminder_state
    @phone.toggle_session_reminder session_id
  end
end

When /I toggle the "(\w+)" session reminder/ do |session_id|
  @phone.toggle_session_reminder session_id
end

Then /the "(\w+)" session reminder should be toggled (off|on)/ do |session_id, reminder_state|
  reminder_state = reminder_state == "on" ? true : false
  @phone.session_checked?(session_id).should == reminder_state
end