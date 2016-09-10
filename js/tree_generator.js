var string = `.
├── ./commands
│   ├── ./commands/16h-c03-guide.md
│   ├── ./commands/16h-c03.txt
│   └── ./commands/16i-c05.txt
├── ./css
│   ├── ./css/card_c03-c.css
│   ├── ./css/card_c03-d.css
│   └── ./css/index.css
├── ./html
│   ├── ./html/card_c03-b.html
│   ├── ./html/card_c03-c.html
│   ├── ./html/card_c03_demo.html
│   ├── ./html/card_c03-d.html
│   ├── ./html/card_c03.html
│   ├── ./html/card_c05.html
│   ├── ./html/card.html
│   ├── ./html/static
│   │   ├── ./html/static/card_c03-b.html
│   │   ├── ./html/static/card_c03-c.html
│   │   ├── ./html/static/card_c03.html
│   │   ├── ./html/static/wordcloud_0.html
│   │   └── ./html/static/wordcloud_1.html
│   ├── ./html/wordcloud_0.html
│   ├── ./html/wordcloud_1.html
│   └── ./html/wordcloud_2.html
├── ./img
│   ├── ./img/16h-c03-a.png
│   ├── ./img/16h-c03-b.png
│   ├── ./img/16h-c03.png
│   ├── ./img/16h-c04-a.png
│   ├── ./img/16h-c04-b.png
│   ├── ./img/16h-c04-c.png
│   ├── ./img/16h-c04-d.png
│   ├── ./img/16h-c04-e.png
│   ├── ./img/16h-c04-f.png
│   ├── ./img/Example_tweet_column.png
│   ├── ./img/paper-column1.png
│   ├── ./img/paper-column.png
│   └── ./img/syntaxnet_ambiguity.png
├── ./index.html
├── ./Interview_task
│   ├── ./Interview_task/commands.md
│   └── ./Interview_task/stopwords.txt
├── ./js
│   ├── ./js/c05.js
│   ├── ./js/c05-words.js
│   ├── ./js/cloud_backup.js
│   ├── ./js/cloud.js
│   ├── ./js/jsonMaker_0.js
│   ├── ./js/jsonMaker_1.js
│   ├── ./js/test.js
│   ├── ./js/test.txt
│   ├── ./js/text.txt
│   └── ./js/tree_generator.js
└── ./README.md`

string.split('\n').map(function(v){
  var str = v.split(' ')
  var file = str.pop()
  
  file = '<a href="'+file+'">'+file.split('/').pop()+'</a>'
  
  str.push(file)
  
  return str.join(' ')
}).join('\n')
  .replace(/└/g,'&#x2514;')
  .replace(/├/g,'&#x251C;')
  .replace(/─/g,'&#x2500;')
  .replace(/│/g,'&#x2502;')