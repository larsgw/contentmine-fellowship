# Commands used

    > getpapers --api eupmc -q 'ABSTRACT:"Pinus"' -n
    
    info: Searching using eupmc API
    info: Running in no-execute mode, so nothing will be downloaded
    info: Found 496 open access results

More than 100 hits, so I don't have to change the query. I used `-q 'ABSTRACT:"Pinus"'` to try to remove false positives. 

    > getpapers --api eupmc -q 'ABSTRACT:"Pinus"' -o Pinus -x -k 200
    
    info: Searching using eupmc API
    info: Found 496 open access results
    info: Limiting to 200 hits
    Retrieving results [==============================] 100% (eta 0.0s)
    info: Done collecting results
    info: Saving result metadata
    info: Full EUPMC result metadata written to eupmc_results.json
    info: Individual EUPMC result metadata records written
    info: Extracting fulltext HTML URL list (may not be available for all articles)
    info: Fulltext HTML URL list written to eupmc_fulltext_html_urls.txt
    warn: Article with pmcid "PMC4885872" was not Open Access (therefore no XML)
    info: Got XML URLs for 199 out of 200 results
    info: Downloading fulltext XML files
    Downloading files [==============================] 100% (199/199) [4.5s elapsed, eta 0.0]
    info: All downloads succeeded!

Downloading XML with `-x` for `norma` and `ami`. Limiting the hits to 200 with `-k 200` so processing will go faster and the repository size won't be too big.

    > norma --project Pinus -i fulltext.xml -o scholarly.html --transform nlm2html
    
    Output: a lot of UNKNOWN warnings.

I don't remember seeing them the last time testing, but I may be mistaken.

    > ami2-word --project Pinus/ --w.words wordFrequencies --w.stopwords stopwords.txt
    
    0    [main] DEBUG org.xmlcml.ami2.wordutil.WordSetWrapper  - symbol expands to: /org/xmlcml/ami2/wordutil/stopwords.txt
    ....................29370 [main] WARN  org.xmlcml.ami2.plugins.word.WordCollectionFactory  - No scholarlyHtml or PDFTXT: Pinus/PMC4885872
    !29370 [main] WARN  org.xmlcml.ami2.plugins.word.WordCollectionFactory  - no words found to extract
    !

Copied and used the stopwords.txt from the command because I wasn't sure if it would use it automatically. Nothing special, at least in the first article. Still problems with the CSS in the scholarly.html, and TeX is also not ignored. It wouldn't hurt to remove punctuation, maybe make it case insensitive and add some stopwords like "additionally" either. As an example, "error" shows up four times, as "error", "Error", "error," and "errors".

Some problems with the commandline messages: WARN messages end with `\n!` instead of `!\n`, and there are no newlines after the dots. This can be seen in the code block above.

    > ami2-species -q Pinus -i scholarly.html --sp.species --sp.type binomial genus genussp
    
    .

No files found in the results folder. Trying to find the problem. Aha, I need to use `--project` and not `-q`.

    > ami2-species --project Pinus/ -i scholarly.html --sp.species --sp.type binomial genus genussp
    
    ....................

This works. Let's count the results.

    > find Pinus/*/results/species/binomial/results.xml | wc -l
    
    196

196 out of 199 articles have results for binomial.

    > find Pinus/*/results/species/genus/results.xml | wc -l
    
    90

90 out of 199 articles have results for genus.

    > find Pinus/*/results/species/genussp/results.xml | wc -l
    
    52

52 out of 199 articles have results for genussp.

    > ami2-gene --project Pinus -i scholarly.html --g.gene --g.type human
    
    ....................

I don't really expect human genes in articles that should be about pines, but you never now. The first article has some false positives, mainly abbreviations like "ICC", which in this case meant "intraclass correlation coefficient".