#!/usr/bin/env ruby
task :default => :generate_html
directory "build"

class LineCommands
  require 'yui/compressor' # http://github.com/sstephenson/ruby-yui-compressor

  def compress(line, path, mode=nil)
    mode ||= extract_suffix(path)
    compressor = (mode == :css) ? YUI::CssCompressor.new : YUI::JavaScriptCompressor.new(:munge => true)
    compressor.compress(include(line,path))
  end

  def include(line, path)
    file = File.new(path)
    file.read
  end

  def inline(line,a)
    return line unless path = line[/(link rel="stylesheet"|script).*(href|src)="([^"]+)"/i,3]
    case extract_suffix(path)
      when :js then "<script type=\"text/javascript\">\n#{compress(nil,path,:js)}\n</script>"
      when :css then "<style type=\"text/css\" media=\"#{line[/media="([^"]+)"/i,1]||'screen'}\">\n#{compress(nil,path,:css)}\n</style>"
      else line
    end
  end

  def delete(line,a)
    ''
  end

  def eval(line,code)
    Kernel::eval(code)
  end

  private
  def extract_suffix(path)
    (path[/\.(css|js)$/i,1]||:unknown).to_sym
  end
end

desc "generate stand-alone page.html"
task :generate_html => ["build"] do
  
  puts "processing lines with ### RAKE command [args] ### in index.html..."
  indexhtml = File.new('index.html')
  n = 1
  output = ''
  processor = LineCommands.new
  while (line = indexhtml.gets)
    line.rstrip!
    if m = line[/###\s*RAKE\s+(.+)\s*###/i,1]
      args = m.strip.split
      command = args.shift.downcase.to_sym
      begin
        puts "[#{n}] #{command}"
        line = processor.send(command,line,args.join(' '))
      rescue Exception => e
        puts "! error running \"#{command}\" !"
        puts e.inspect
      end
    end
    output << line+"\n"
    n += 1
  end

  puts "\nwriting to build/page.html..."
  File.open("build/page.html", 'w') {|f| f << output}
  puts "all done!"
end


