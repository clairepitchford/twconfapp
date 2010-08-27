Feature: As an Attendee, I want	the app to open on Wednesday schedule, so that I immediately see what sessions are on

	Scenario Outline: Sessions with only one session per time
		Given I open <schedule_day>
		When the home page appears
		And time slot <time_slot> exists
		Then the title should be <title>
		And the speaker should be <speaker>
		
		Examples:
			| schedule_day | time_slot | title                                           | speaker       |
	  		| Wednesday    | 07:00AM   | Executive Breakfast with Jim Highsmith          | Jim Highsmith | 
	  		| Thursday     | 09:00AM   | CCH - The Essence of Agile Software Development | Martin Fowler |
