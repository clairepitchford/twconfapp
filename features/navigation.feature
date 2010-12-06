Feature: As I'm a UX expert who is pained by the details, I'd like the tabbar icons to change highlighting with the current page.

  Scenario Outline: A button should be highlighted after being selected.
    Given I open the <tab> tab
    Then the highlighted button should be <tab>

    Examples:
      | tab |
      | Schedule |
      | About |
      | Buzz |
      | Rooms |
      | Where |

  Scenario: The schedule button should be highlighted when Thursday is selected.
    Given I open the Schedule tab
    And open the Thursday schedule
    Then the highlighted button should be Schedule


  Scenario Outline: The button should be highlighted and some texts should exist.
		Given I open the <tab> tab
		Then the highlighted button should be <tab>
		And I should see the "<text>" blurb

		Examples:
			| tab   | text                        |
			| About | ThoughtWorks                |
			| Rooms | Royal On The Park Floorplan |
			| Where | Royal On The Park           |