Feature: As an Attendee, I want to keep track of sessions that I'm interested in attending

	Scenario: I want to make a reminder to attend the first session
		Given I open the Schedule tab
		And open the Wednesday schedule
		And the "breakfast" session reminder is toggled off
		When I toggle the "breakfast" session reminder
		Then the "breakfast" session reminder should be toggled on
		
	Scenario: I've changed my mind about attending the second session
	
	Scenario: I've quit the app and want to see the reminders I saved in a previous session