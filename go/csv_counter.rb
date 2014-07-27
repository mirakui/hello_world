require 'csv'

sum_lines = sum_cols = 0

ARGF.each_line do |line|
  cols = CSV.parse_line(line)
  sum_cols += cols.length
  sum_lines += 1
end

puts "lines: #{sum_lines}"
puts "columns: #{sum_cols}"
