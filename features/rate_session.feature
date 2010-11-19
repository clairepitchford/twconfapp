Feature: As an Attendee, I want to give the speaker feedback by rating the session

	Scenario: I want to go to the feedback form for a session
		Given I have not previously rated the "welcome" session
		And the current time is set to "Wed Dec 15 2010 10:00:00"
		And I open the Schedule tab
		When I click the "Rate this session" icon for the "welcome" session
		Then I am on the "welcome" session page
		
	# Scenario: I want to give a star rating for a session
	# 	Given I have not previously rated the "welcome" session
	# 	And the current time is set to "Thu Sep 15 2010 10:00:00"
	# 	And I open the Schedule tab
	# 	And I click the "Rate this session" icon for the "welcome" session
	# 	And I am on the "welcome" session page
	# 	When I click the second star icon
	# 	Then two star icons should be red