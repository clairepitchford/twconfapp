require 'spec/expectations'
require 'watir-webdriver'

$browser = Watir::Browser.new (ENV['BROWSER']||'firefox')

Kernel::at_exit do 
  $browser.close
end