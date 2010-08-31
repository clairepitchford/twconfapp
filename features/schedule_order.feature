Feature: As an Attendee, I want the sessions to appear in order on the schedule list, so that schedule times are clear to me

	Scenario Outline: An earlier session should be before a later session
		Given I open the Schedule tab
		And open the <schedule_day> schedule
		Then I should see an <early_session> before a <later_session>
		
		Examples:
			| schedule_day	| early_session	| later_session |
			| Wednesday		| 07:00AM		| 12:15PM		|
			| Wednesday		| 11:30AM		| 12:15PM		|
			| Wednesday		| 09:00AM		| 04:00PM		|
			| Thursday		| 09:00AM		| 01:00PM		|
			| Thursday		| 11:15AM		| 01:00PM		|