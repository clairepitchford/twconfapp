Feature: As a not very tech savy conference attendee, I want my hand held through adding the app to my home screen.

  Scenario: I load the page in Safari
    Given I open the Schedule tab
    Then I should see a bookmark reminder popup
    When I click the bookmark reminder popup
    Then it should disappear

  Scenario: I load the page in web-app mode
    Given I open the Schedule tab
    And I'm running as a web app
    Then I should not see a bookmark reminder popup
