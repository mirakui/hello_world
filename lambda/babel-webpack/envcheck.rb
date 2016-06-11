#!/usr/bin/env ruby
require 'json'

if ARGV.empty?
  puts "usage: #{$0} <commands>"
  abort
end

cmd = %Q!{ "cmd" : "#{ARGV.join(' ')}" }!
out = `echo '#{cmd}' | apex invoke envcheck`

json = JSON.parse(out)
json.each do |k,v|
  puts "[#{k}]"
  puts v.gsub('\n', "\n")
end
