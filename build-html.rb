require 'json'
require 'yaml'

JSON_DATA_FILENAME = 'themes/agile2010/defaultData.js'
SPEAKER_YAML_FILENAME = 'data/speakers.yml'
TOPIC_YAML_FILENAME = 'data/topics.yml'

class JSONConverter
  attr_reader :topics, :speakers

  def initialize(topics_yaml, speakers_yaml)
    @topics = YAML::load(topics_yaml) || {}
    @speakers = YAML::load(speakers_yaml) || {}

    @topics.each_pair do |t_id, data|
      begin
        t = DateTime.strptime(data['date'], '%a %I:%M%p')    # Will throw on parse error
      rescue
        puts "Topic #{t_id} has invalid date of '#{data['date']}'"
        raise
      end
      raise "Topic #{t_id} is not on Wednesday or Thursday." unless [3, 4].include? t.wday

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
