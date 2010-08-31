Feature: As I'm a developer, sick of having the manifest go invalid, I want it to be automatically confirmed in the tests.

	Scenario: All files should exist.
		Given the manifest "index.manifest"
		Then all files in it should exist
