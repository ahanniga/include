/*\
title: $:/plugins/myplugin/get-titles
type: application/javascript
module-type: macro

\*/
(function() {
    exports.name = "getTitles";
    exports.params = [];

    // Function to return a list of tiddler titles
    exports.run = function() {
        // Get all tiddlers
        var titles = $tw.wiki.filterTiddlers("[all[tiddlers]]") || [];
        var thisTitle = "MQ Accept License";
        var refs = [];
        var t;
        for (let a = 0; a < titles.length; a++) {
            t = $tw.wiki.getTiddler(titles[a]); 
            if(t.text.indexOf(thisTitle) >= 0) {
              refs.push(t);
            }
        }
        for (let a = 0; a < refs.length; a++) {
          console.log(refs[a].title);
        }
    };
})();