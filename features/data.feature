Feature: As the organizer, I want to be able to enter a schedule and have it converted into the program.

  Scenario: A basic session.
    Given a topics YAML of:
      """
      open-house:
          date: Wed 01:23AM
          title: Something Amazing
          speakers:
          description: |
            <p>Who has ever wanted to sing?</p>
      """
    When the files are converted
    Then the first session ID should be "open-house"
    And the day should be Wednesday
    And the number of speakers should be 0
    And there should be a description

  Scenario: A session with a speaker.
    Given a speakers YAML of:
      """
      scott-robinson:
          name: Scott Robinson
          title: Pop Singer, ThoughtWorks
          description: |
              <p>Breakdancing queen.</p>
      """
    And a topics YAML of:
      """
      professional-training:
          date: Thu 11:22PM
          title: Crooning and Swooning
          speakers: scott-robinson
          description: |
              <p>YOUR EARS WILL BLEED</p>
      """
    When the files are converted
    Then the first session ID should be "professional-training"
    And the day should be Thursday
    And the number of speakers should be 1
    And there should be a description

  Scenario: A session with multiple speakers.
    Given a speakers YAML of:
      """
      scott-robinson:
          name: Scott Robinson
          title: Pop Singer, ThoughtWorks
          description: |
              <p>Breakdancing queen.</p>

      sam-tardif:
          name: Sam Tardif
          title: Rock God, ThoughtWorks
          description: |
              <p>Shredding and pillaging his way to your heart.</p>
      """
    And a topics YAML of:
      """
      laser-therapy:
          date: Wed 10:10AM
          title: LASER THERAPY
          speakers: scott-robinson, sam-tardif
          description: |
              <p>YOUR EARS WILL HEAL</p>
      """
    When the files are converted
    Then the first session ID should be "laser-therapy"
    And the day should be Wednesday
    And the number of speakers should be 2
    And there should be a description

  Scenario: A session with an invalid time shouldn't work.
    Given a topics YAML of:
      """
      open-house:
          date: Wed 55:55AM
          title: Something Amazing
          speakers: 
          description: |
              <p>YOUR EARS WILL HEAL</p>
      """
    Then there should be an error

  Scenario: A session on an invalid day shouldn't work.
      Given a topics YAML of:
      """
      open-house:
          date: Fri 11:11AM
          title: Something Amazing
          speakers: 
          description: |
              <p>YOUR EARS WILL HEAL</p>
      """
      Then there should be an error

      Given a topics YAML of:
      """
      open-house:
          date: Tue 11:11AM
          title: Something Amazing
          speakers: 
          description: |
              <p>YOUR EARS WILL HEAL</p>
      """
      Then there should be an error

  Scenario: A session shouldn't point to a non-existant speaker.
      Given a topics YAML of:
      """
      open-house:
          date: Thu 11:11AM
          title: Something Amazing
          speakers: noone-homes
          description: |
              <p>YOUR EARS WILL HEAL</p>
      """
      Then there should be an error

  Scenario: A speaker without a description shouldn't work.
    Given a speakers YAML of:
      """
      scott-robinson:
          name: Scott Robinson
          title: Pop Singer, ThoughtWorks
      """
    And a topics YAML of:
      """
      professional-training:
          date: Thu 11:22PM
          title: Crooning and Swooning
          speakers: scott-robinson
          description: |
              <p>YOUR EARS WILL BLEED</p>
      """
    Then there should be an error

  Scenario: A speaker without a title shouldn't work.
    Given a speakers YAML of:
      """
      scott-robinson:
          name: Scott Robinson
          description: |
              <p>Breakdancing queen.</p>
      """
    And a topics YAML of:
      """
      professional-training:
          date: Thu 11:22PM
          title: Crooning and Swooning
          speakers: scott-robinson
          description: |
              <p>YOUR EARS WILL BLEED</p>
      """
    Then there should be an error

  Scenario: A speaker without a name shouldn't work.
    Given a speakers YAML of:
      """
      scott-robinson:
          title: Pop Singer, ThoughtWorks
          description: |
              <p>Breakdancing queen.</p>
      """
    And a topics YAML of:
      """
      professional-training:
          date: Thu 11:22PM
          title: Crooning and Swooning
          speakers: scott-robinson
          description: |
              <p>YOUR EARS WILL BLEED</p>
      """
    Then there should be an error
