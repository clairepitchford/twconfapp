Feature: As an Attendee, I want to keep track of sessions that I'm interested in attending

	Scenario: I want to make a reminder to attend the first session
		Given I open the Schedule tab
		And open the Wednesday schedule
		And the "welcome" session reminder is toggled off
		When I toggle the "welcome" session reminder
		Then the "welcome" session reminder should be toggled on
		
	Scenario: I've changed my mind about attending the second session
		Given I open the Schedule tab
		And open the Wednesday schedule
		And the "welcome" session reminder is toggled on
		When I toggle the "welcome" session reminder
		Then the "welcome" session reminder should be toggled off
	
	Scenario: I've quit the app and want to see the reminders I saved in a previous session
		Given I open the Schedule tab
		And open the Wednesday schedule
		And the "welcome" session reminder is toggled on
		When I open the Schedule tab
		And open the Wednesday schedule
		Then the "welcome" session reminder should be toggled on