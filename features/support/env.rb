require 'spec/expectations'
require 'safariwatir'
require 'nokogiri'
require 'build-html'

module Watir
  class Safari
    def eval_js string
      @scripter.instance_eval { eval_js string }
    end

    def dom
      Nokogiri::HTML(html)
    end
  end

  class Container::HtmlElement
    OPERATIONS[:jquery] = "by_jquery"
  end

  class AppleScripter 
    def click_link_jquery(element = @element)      
      page_load do
        execute(element.operate { %|$(element).trigger('click');| })
      end
    end

    def operate_by_jquery(element)
      jquery = element.what.gsub(/"/, "\'")
      js.operate(%|var element = $("#{jquery}")[0];|, yield)
    end
  end
end

class SimPhone
  def initialize(topic_yaml = TOPIC_YAML_FILENAME, speaker_yaml = SPEAKER_YAML_FILENAME)
    File.open(JSON_DATA_FILENAME, "w") do |f|
      JSONConverter.new(File.open(topic_yaml),
                        File.open(speaker_yaml)).write f
    end

    @browser = Watir::Safari.start("file:///#{Dir.getwd}/index.html")
  end

  def title
    return @browser.title
  end

  def schedule(day)
    @browser.link(:jquery, "div.current div.toolbar a[href='##{day}']").click_jquery()
    return ScheduleView.new @browser
  end
end

class ScheduleView < SimPhone
  def initialize(browser)
    @browser = browser
  end

  def day
    @browser.div(:jquery, "div.current div.toolbar a.selected").text
  end

  def [](time_slot)
    times, time = {}, nil
    @browser.dom.at('div.current ul.schedule').children.each do |child|
      if child['class'] == 'sep'
        time = child.inner_text
      else
        times[time] ||= []
        times[time] << {
          'speaker' => child.at('span.speaker-title3').inner_text,
          'title' => child.at('a.topic-link').inner_text
        }
      end
    end

    return times[time_slot]
  end
end
