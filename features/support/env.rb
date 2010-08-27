require 'spec/expectations'
require 'safariwatir'
require 'nokogiri'

class Watir::Safari
  def eval_js string
    @scripter.instance_eval { eval_js string }
  end
  
  def dom
    Nokogiri::HTML(html)
  end
end

module ScheduleParser
  def parse_schedule
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
    times
  end
end

World(ScheduleParser)
