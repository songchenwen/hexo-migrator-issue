hexo-migrator-issue
===================

Pull the issues from a public Github repository into Hexo `_posts` folder as Markdown files.

Your issue must obey the Hexo writing rules, which means it must contain the front-matter block wrapped with `---` in front of the file.

The issue title will be used as the file name and the issue body as the file content.

##Advantages

Since Github offers a really nice webpage to edit issues, we can update our blog posts almost anywhere. And with a little work on [Heroku](http://heroku.com), we can even make this progress totally automatic. I will write a post about how that is achieved at [Gary Blog](http://emptyzone.github.io) later.

##Install

``` bash
$ npm install hexo-migrator-issue --save
```

##Configure

Edit `_config.yml`

``` yaml
issue_migrator :
    repository_name : repository.github.io  
        # Where to pull issues from (can't be empty)
                                             
    owner_name : someone                     
        # Owner user name (can't be empty)
                                             
    label : blog            
        # Only issues with this label will be pulled. 
        # Empty means all the issues will be pulled
        # Default empty.
                                             
    issue_count_per_page : 20
        # How many issues will be pulled with one api request
        # Default 20
    
    clean : true
        # If true, all files in `_posts` will be deleted before the migrator runs.
        # Useful when you decide to host all your posts with Github issues like I do.
        # Default false
    
    including_closed : false
        # Usually we don't want to see closed issues on our website.
        # If true, closed issues will be pulled too.
        # Default false
```

##Usage

``` bash
$ hexo migrate issue
```
