Feature: As an Attendee, I want	the app to display the sessions for a particular day

	Scenario Outline: Sessions with only one session per time
		Given I open the Schedule tab
		And open the <schedule_day> schedule
		When time slot <time_slot> exists
		Then the title should be <title>
		And the speaker should be <speaker>
		
		Examples:
			| schedule_day | time_slot | title                                           			| speaker       |
	  		| Wednesday     | 09:00AM   | Keynote Address - Things I Wish I'd Known       			| Rod Johnson   | 
	  		| Thursday       | 09:00AM   | Keynote Address: Exploring NoSQL 				 			| Erik Meijer   |
