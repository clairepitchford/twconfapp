Feature: As I'm a developer, sick of having the manifest go invalid, I want it to be automatically confirmed in the tests.

	Scenario: All files should exist.
		Given the manifest "index.manifest"
		Then all files in it should exist

  Scenario: All Speakers should have an associated photo
    Given the speaker file "data/speakers.yml"
    Then each speaker should have an image file associated with him or her
