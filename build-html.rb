#!/usr/bin/env ruby

require 'yaml'
require 'erb'
require 'time'
require 'fileutils'
require 'rubygems'
require 'json'

class Main
  def check_speakers
    puts "Loading topics"
    topics = YAML::load(File.open('data/topics.yml'))

    puts "Loading speakers"
    speakers = YAML::load(File.open('data/speakers.yml'))
    valid = true
    topics.each_key do |id|
      topic_speakers = topics[id]['speakers']
      if topic_speakers!=nil
        topic_speakers.split(',').each do |speaker_id|
          speaker_id.strip!
          if speakers[speaker_id] == nil
            puts "topic #{id} points to speaker #{speaker_id} which is not in speakers.yml"
            valid = false
          end
          raise "Speaker #{speaker_id} does not have a description" unless speakers[speaker_id]['description']
          raise "Speaker #{speaker_id} does not have a title" unless speakers[speaker_id]['title']
          raise "Speaker #{speaker_id} does not have a name" unless speakers[speaker_id]['name']
        end
      end
    end
    
    now = DateTime.now
    
    data = <<-DATA
    var defaultSpeakerData = { 
      'timestamp': '#{now}',
      'data': #{speakers.to_json}
    }
    var defaultSessionData = {
      'timestamp': '#{now}',
      'data': #{topics.to_json}
    }
    DATA
    
    File.open("themes/agile2010/defaultData.js", "w") { |f| f.puts data }
    
    return valid
  end
end

if __FILE__ == $0
  main = Main.new
  main.check_speakers
end
