Feature: As an attendee, I want to get the full advertising experience from one of the most advanced and successful companies around.

	Scenario: The about tab.
		Given I open the About tab
		Then I should see the "Info" tab
		And I should see the "ThoughtWorks are pioneers" blurb

	Scenario: The buzz tab.
		Given I open the Buzz tab
		Then I should see the "#agileaus" tab

	Scenario: The rooms tab.
		Given I open the Rooms tab
		Then I should see the "Floor Plan" tab
		And I should see the "All sessions will be held within rooms" blurb

	Scenario: The where tab.
		Given I open the Where tab
		Then I should see the "Map" tab
		And I should see the "Crown Conference Center" blurb
