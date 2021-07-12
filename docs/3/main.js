window.addEventListener('load', (event) => {
    var documents = [{
      "id": 0,
      "title": "Lunr",
      "body": "Like Solr, but much smaller, and not as bright."
    }, {
      "id": 1,
      "title": "React",
      "body": "A JavaScript library for building user interfaces."
    }, {
      "id": 2,
      "title": "Lodash",
      "body": "A modern JavaScript utility library delivering modularity, performance & extras."
    }, {
      "id": 3,
      "title": "タイトルですよ。",
      "body": "こんな本文ですよ。"
    }, {
      "id": 4,
      "title": "日本語のタイトルとEnglish Titleを混在させてみる。",
      "body": "和文と英文をmixさせてみる。"
    }];

    require(['lib/lunr/lunr.2.3.9.min.js', 
             'lib/lunr/tinyseg.js', 
             'lib/lunr/wordcut.js', 
             'lib/lunr/languages/lunr.stemmer.support.min.js', 
             'lib/lunr/languages/lunr.multi.min.js', 
             'lib/lunr/languages/lunr.ja.min.js'
            ], function(lunr, tinySegmenter, wordCut, stemmerSupport, multi, ja) {
        stemmerSupport(lunr);
        tinySegmenter(lunr);
        ja(lunr);
        multi(lunr);
        var idx = lunr(function () {
//        var idx = lunr(function () {
//            this.use(lunr.ja);
            this.use(lunr.multiLanguage('en', 'ja'));
            this.field('title')
            this.field('body')
            documents.forEach(function(doc) { this.add(doc); }, this);
        });

        function createAllDocumentDom() {
            const result = document.querySelector('#SearchResult');
            console.log(result)
            for (const doc of documents) {
                result.appendChild(createDocumentDom(doc))
            }
        }
        function createDocumentDom(doc) {
            var details = document.createElement('details');
            var summary = document.createElement('summary');
            summary.appendChild(document.createTextNode(doc.title))
            details.appendChild(summary)
            details.appendChild(document.createTextNode(doc.body))
            return details
        }
        createAllDocumentDom()
        function createSearchResultDom(keyword) {
            const dom = document.querySelector('#SearchResult');
            while (dom.firstChild) { dom.removeChild(dom.firstChild); }
            result = idx.search(keyword)
            console.log(result);
            for (const res of result) {
                dom.appendChild(createDocumentDom(documents.find(doc => doc.id == res.ref)))
            }
        }
        const input = document.querySelector('input[type="search"]');
        input.addEventListener('input', () => {
            createSearchResultDom(input.value)
        });
        input.focus()
        input.selectionStart = input.selectionEnd = input.value.length;
        createSearchResultDom(input.value)

    });

});
