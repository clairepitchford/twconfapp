Feature: As I'm a UX expert who is pained by the details, I'd like the tabbar icons to change highlighting with the current page.

  Scenario Outline: A button should be hightlighted after being selected.
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
