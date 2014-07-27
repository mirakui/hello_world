require 'csv'

sum_lines = sum_cols = 0

CSV.foreach(ARGV[0]) do |cols|
  sum_cols += cols.length
  sum_lines += 1
end

puts "lines: #{sum_lines}"
puts "columns: #{sum_cols}"
