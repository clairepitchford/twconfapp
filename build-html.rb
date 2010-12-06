require 'digest/sha2'
require 'json'
require 'yaml'

JSON_DATA_FILENAME = 'themes/agile2010/defaultData.js'
CONFIG_YAML_FILENAME = 'data/config.yml'
SPEAKER_YAML_FILENAME = 'data/speakers.yml'
TOPIC_YAML_FILENAME = 'data/topics.yml'
MANIFEST_IN_FILENAME = 'index.manifest.in'

class JSONConverter
  attr_reader :config, :topics, :speakers

  def initialize(config_yaml, topics_yaml, speakers_yaml)
    @config = YAML::load(config_yaml) || {}
    @topics = YAML::load(topics_yaml) || {}
    @speakers = YAML::load(speakers_yaml) || {}

    @topics.each_pair do |t_id, data|
      begin
        t = DateTime.strptime(data['date'], '%a %I:%M%p')    # Will throw on parse error
      rescue
        puts "Topic #{t_id} has invalid date of '#{data['date']}'"
        raise
      end
      raise "Topic #{t_id} is not on Monday or Tuesday." unless [1, 2].include? t.wday

      speakers = (data['speakers'] || '').split(',').map { |s| s.strip }.each do |s_id|
        raise "Topic #{t_id} points to a non-existant speaker #{s_id}" unless @speakers[s_id]
        raise "Speaker #{s_id} does not have a name" unless @speakers[s_id]['name']
        raise "Speaker #{s_id} does not have a description" unless @speakers[s_id]['description']
      end
      #puts 'process:' + t_id
    end
    puts 'topics processed: ' + @topics.keys.length.to_s
    
    
  end

  def write(out)
    out.write <<-EOF
      var defaultConfigData = {
        'data': #{@config.to_json}
      }
      var defaultSpeakerData = { 
        'data': #{@speakers.to_json}
      }
      var defaultSessionData = {
        'data': #{@topics.to_json}
      }
    EOF
  end
end

class ManifestProcessor
  def initialize(manifest_in)
    @lines = []

    File.open(manifest_in) do |f|
      f.readlines.each do |ln|
        ln.strip!

        if File.exists? ln
          h = Digest::SHA2.file(ln).hexdigest
          @lines << "#{ln} # #{h}"
        else
          @lines << ln
        end
      end
    end

    raise "MANIFEST template doesn't end with '.manifest.in'" unless /\.manifest\.in$/.match manifest_in
    @manifest_fn = manifest_in[/.*(?=\.in)/]
  end

  def write
    File.open(@manifest_fn, 'w') do |f|
      @lines.each { |l| f.puts l }
    end
  end
end
