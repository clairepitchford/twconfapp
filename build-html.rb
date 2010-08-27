#!/usr/bin/env ruby

require 'yaml'
require 'json'

Topic = Struct.new ('Topic', :id, :day, :time, :title, :speakers, :description)
Speaker = Struct.new ('Speaker', :id, :name, :title, :description)

class JSONConverter
  attr_reader :topics, :speakers

  def initialize(topics_yaml, speakers_yaml)
    @topics = YAML::load(topics_yaml) || {}
    @speakers = YAML::load(speakers_yaml) || {}

    @topics.each_pair do |t_id, data|
      t = DateTime.strptime(data['date'], '%a %I:%M%p')    # Will throw on parse error
      raise "Topic #{t_id} is not on Wednesday or Thursday." unless [3, 4].include? t.wday
      raise "Topic #{t_id} does not have a description" unless data['description']

      speakers = (data['speakers'] || '').split(',').map { |s| s.strip }.each do |s_id|
        raise "Topic #{t_id} points to a non-existant speaker #{s_id}" unless @speakers[s_id]
        raise "Speaker #{s_id} does not have a description" unless @speakers[s_id]['description']
        raise "Speaker #{s_id} does not have a title" unless @speakers[s_id]['title']
        raise "Speaker #{s_id} does not have a name" unless @speakers[s_id]['name']
      end
    end
  end

  def write(out)
    out.write <<-EOF
      var defaultSpeakerData = { 
        'data': #{@speakers.to_json}
      }
      var defaultSessionData = {
        'data': #{@topics.to_json}
      }
    EOF
  end
end

if __FILE__ == $0
  File.open("themes/agile2010/defaultData.js", "w") do |f|
    JSONConverter(File.open('data/topics.yml'),
                  File.open('data/speakers.yml')).write f
  end
end
