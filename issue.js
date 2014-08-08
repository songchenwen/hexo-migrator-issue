var github = require('octonode'),
    async = require('async');

var issue_count_per_page = 20, current_page_index = 1;
var issue_migrator_running = false;

var issue_migrator = hexo.config.issue_migrator;
var owner_name = (issue_migrator && issue_migrator.owner_name) ? issue_migrator.owner_name : null;
var repository_name = (issue_migrator && issue_migrator.repository_name) ? issue_migrator.repository_name : null;
var label = (issue_migrator && issue_migrator.label) ? issue_migrator.label : null;
var clean = (issue_migrator && issue_migrator.clean) ? issue_migrator.clean : false;
var including_closed = (issue_migrator && issue_migrator.including_closed) ? issue_migrator.including_closed : false;

var issue_repo;
var log = hexo.log;
var file = hexo.util.file2;
var destDir = hexo.config.source_dir + '/_posts/';

var config_lost_warn = 'issue_migrator not configured';

function issue(args, callback){
    issue_migrator_running = true;
    if(!issue_migrator || !owner_name || !repository_name){
        log.e(config_lost_warn);
        issue_migrator_running = false;
        callback();
        return;
    }
    issue_repo = github.client().repo(owner_name + '/' + repository_name);
    current_page_index = 1;
    if(clean){
        file.emptyDir(destDir, function(){
                        log.i('cleaned');
                        requestNextPage(callback);
                      });
    }else{
        requestNextPage(callback);
    }
}

function requestNextPage(callback){
    log.i("requesting api content page " + current_page_index);
    issue_repo.issues(getOptions(), function(err, body, headers){
                      if(!err){
                            log.i("got page " + current_page_index + ", containing " + body.length + " issues");
                            if(body && body.length){
                               async.each(body, function(issue, cb){
                                            var fileName = issue.title + '.md';
                                            log.i('writing to: ' + fileName);
                                            file.writeFile(destDir + fileName, issue.body, cb);
                                          }, function(err){
                                            current_page_index++;
                                            requestNextPage(callback);
                                          });
                               return;
                            }
                            log.i("last page " + current_page_index);
                            callback();
                        }else{
                            log.e("api error page " + current_page_index);
                            callback();
                        }
                      });
}

function getOptions(){
    var options = {
        page: current_page_index,
        per_page: issue_count_per_page
    };
    options.state = including_closed ? 'all' : 'open';
    if(label){
        options.labels = label;
    }
    return options;
}

hexo.extend.migrator.register("issue", issue);