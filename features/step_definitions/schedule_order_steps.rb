Then /I should see an (\d?\d:\d\d(?:AM|PM)) before a (\d?\d:\d\d(?:AM|PM))/ do |early_session, later_session|
  @schedule.index(early_session).should be < @schedule.index(later_session)
end