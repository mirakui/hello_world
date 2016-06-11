#!/usr/bin/env ruby
require 'json'
json = JSON.parse($stdin.read)
json.each do |k,v|
  puts "[#{k}]"
  puts v.gsub('\n', "\n")
end
