require 'httparty' 


##configr_steps.rb

require 'yaml'

Given /^the configuration file exists$/ do
  config_fn = 'data/config.yml'
  File.exist? config_fn
  @config_yml = YAML::load(File.open(config_fn))
end

Then /^the Twitter API call should exist within the configuration file$/ do
    @twitter_api = @config_yml["twitter_search_api"]
    @twitter_api.should_not be_nil
end

class TwitterSearch
  include HTTParty
  format :plain
end

Then /^the Twitter API call should return tweets from Twitter$/ do
  tweet_search = @twitter_api + 'twitter'
  response = TwitterSearch.get(tweet_search)
  response.code.should == 200
  response.body.should_not be_nil
end

Then /^the conference hashtag should exist within the configuration file$/ do
      @conference_hashtags = @config_yml["conference_hashtags"]
      @conference_hashtags.should_not be_nil
end


