# 2020-01-10 dealt with error when file does not exist
# 2019-01-18 added, and used in footer
# modified from (thank you!):
#   https://github.com/michaelx/jekyll-last-modified

module Jekyll
    class LastModifiedTag < Liquid::Tag
  
      def initialize(tag_name, path, tokens)
        super
        @path = path # copy into class property
      end
  
      def render(context)
        # Pipe parameter through Liquid to make additional replacements possible
        url = Liquid::Template.parse(@path).render context
        
        # Adds the site source, so that it also works with a custom one
        site_source = context.registers[:site].config['source']
        file_path = site_source + '/' + url
        
        # ensure it works even if the file does not exist (yet), for tags
        begin
          File.mtime(file_path.strip!) # last modified date
        rescue
          "" # if exception, return empty string
        end
      end
  
    end
  end
  
  Liquid::Template.register_tag('last_modified', Jekyll::LastModifiedTag)