Feature: I want to externalise configuration for the application so I don't have to hunt through code to update these things.

Scenario: Twitter API call exists in configuration and return tweets
	Given the configuration file exists
	Then the Twitter API call should exist within the configuration file
	And the Twitter API call should return tweets from Twitter

  Scenario: Conference Twitter #tag exists in configuration
	Given the configuration file exists
	Then the conference hashtag should exist within the configuration file
