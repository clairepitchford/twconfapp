Feature: As an attendee, I want to get the full advertising experience from one of the most advanced and successful companies around.

	Scenario Outline: The tab texts.
		Given I open the <tab> tab
		Then I should see the "<text>" blurb

		Examples:
			| tab | text |
			| About | ThoughtWorks are pioneers |
			| Rooms | All session will be held within rooms |
			| Where | Crown Conference Center |
