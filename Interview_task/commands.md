# Commands used:

**(a)**

`getpapers`, `norma` and `ami` were already installed.

    > getpapers --api eupmc -q 'ABSTRACT:"Pinus"' -n
    
    info: Searching using eupmc API
    info: Running in no-execute mode, so nothing will be downloaded
    info: Found 496 open access results

More than 100 hits, so I do not have to change the query. I used `-q 'ABSTRACT:"Pinus"'` to try to remove false positives. 

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

Downloading XML with `-x` for `norma` and `ami`. Limiting the hits to 200 with `-k 200` so processing will go faster and the repository size will not be too big.

**(b)**

    > norma --project Pinus -i fulltext.xml -o scholarly.html --transform nlm2html
    
    Output: a lot of UNKNOWN warnings.

I don't remember seeing them the last time testing, but I may be mistaken.

    > ami2-word --project Pinus/ --w.words wordFrequencies --w.stopwords stopwords.txt
    
    0    [main] DEBUG org.xmlcml.ami2.wordutil.WordSetWrapper  - symbol expands to: /org/xmlcml/ami2/wordutil/stopwords.txt
    ....................29370 [main] WARN  org.xmlcml.ami2.plugins.word.WordCollectionFactory  - No scholarlyHtml or PDFTXT: Pinus/PMC4885872
    !29370 [main] WARN  org.xmlcml.ami2.plugins.word.WordCollectionFactory  - no words found to extract
    !

Copied and used the stopwords.txt from the command because I was not sure if it would use it automatically. Nothing special, at least in the first article. Still problems with the CSS in the scholarly.html, and TeX is also not ignored. It would not hurt to remove punctuation, maybe make it case insensitive and add some stopwords like "additionally" either. As an example, "error" shows up four times, as "error", "Error", "error," and "errors".

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

I do not really expect human genes in articles that should be about pines, but you never now. The first article has some false positives, mainly abbreviations like "ICC", which in this case meant "intraclass correlation coefficient".

**(c)**

`quickscrape` (0.4.7) was already installed too.

    > git clone https://github.com/ContentMine/journal-scrapers.git
    
    Cloning into 'journal-scrapers'...
    remote: Counting objects: 824, done.
    remote: Total 824 (delta 0), reused 0 (delta 0), pack-reused 824
    Receiving objects: 100% (824/824), 2.57 MiB | 758.00 KiB/s, done.
    Resolving deltas: 100% (408/408), done.
    Checking connectivity... done.

Cloning scrapers...

    > quickscrape --url http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0043531 --scraper ../../journal-scrapers/scrapers/plos.json --output pone.0043531 --outformat bibjson
    
    info: quickscrape 0.4.7 launched with...
    info: - URL: http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0043531
    info: - Scraper: /home/larsw/public_html/cm-repo/Interview_task/journal-scrapers/scrapers/plos.json
    info: - Rate limit: 3 per minute
    info: - Log level: info
    info: urls to scrape: 1
    info: processing URL: http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0043531
    info: [scraper]. URL rendered. http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0043531.
    info: [scraper]. download started. fulltext.xml.
    info: [scraper]. download started. fulltext.pdf.
    info: URL processed: captured 20/33 elements (13 captures failed)
    info: all tasks completed

Quickscraping the first article, this one is from PLoS one. The suppinfo `.docx` is not recognized because it is hosted on figshare.

    > quickscrape --url http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0067345 --scraper ../../journal-scrapers/scrapers/plos.json --output pone.0067345 --outformat bibjson
    
    info: quickscrape 0.4.7 launched with...
    info: - URL: http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0067345
    info: - Scraper: /home/larsw/public_html/cm-repo/Interview_task/journal-scrapers/scrapers/plos.json
    info: - Rate limit: 3 per minute
    info: - Log level: info
    info: urls to scrape: 1
    info: processing URL: http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0067345
    info: [scraper]. URL rendered. http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0067345.
    info: [scraper]. download started. fulltext.xml.
    info: [scraper]. download started. fulltext.pdf.
    info: URL processed: captured 20/33 elements (13 captures failed)
    info: all tasks completed

This one has suppinfo outside of figshare, which still is not fetched. Onto the next one.

    > quickscrape --url https://elifesciences.org/content/5/e13664 --scraper ../../journal-scrapers/scrapers/elife.json --output e13664 --outformat bibjson
    
    info: quickscrape 0.4.7 launched with...
    info: - URL: https://elifesciences.org/content/5/e13664
    info: - Scraper: /home/larsw/public_html/cm-repo/Interview_task/journal-scrapers/scrapers/elife.json
    info: - Rate limit: 3 per minute
    info: - Log level: info
    info: urls to scrape: 1
    info: processing URL: https://elifesciences.org/content/5/e13664
    info: [scraper]. URL rendered. https://elifesciences.org/content/5/e13664.
    info: [scraper]. download started. fulltext.xml.
    info: [scraper]. download started. fulltext.pdf.
    info: URL processed: captured 12/19 elements (7 captures failed)
    info: all tasks completed

From eLife. The supplementary information is not downloaded, probably because it is situated under a different tab. I am going to try to extract them like this:

    > quickscrape --url https://elifesciences.org/content/5/e13664/article-data --scraper ../../journal-scrapers/scrapers/elife.json --output e13664-suppinfo --outformat bibjson
    
    info: quickscrape 0.4.7 launched with...
    info: - URL: https://elifesciences.org/content/5/e13664/article-data
    info: - Scraper: /home/larsw/public_html/cm-repo/Interview_task/journal-scrapers/scrapers/elife.json
    info: - Rate limit: 3 per minute
    info: - Log level: info
    info: urls to scrape: 1
    info: processing URL: https://elifesciences.org/content/5/e13664/article-data
    info: [scraper]. URL rendered. https://elifesciences.org/content/5/e13664/article-data.
    info: [scraper]. download started. fulltext.xml.
    info: [scraper]. download started. fulltext.pdf.
    info: URL processed: captured 12/19 elements (7 captures failed)
    info: all tasks completed

This is the page containing the data. Still no suppinfo. It does still download the correct `fulltext.xml` and `fulltext.pdf`. I give up.

    > quickscrape --url https://peerj.com/articles/1045/ --scraper ../../journal-scrapers/scrapers/peerj.json --output peerJ1045 --outformat bibjson
    
    info: quickscrape 0.4.7 launched with...
    info: - URL: https://peerj.com/articles/1045/
    info: - Scraper: /home/larsw/public_html/cm-repo/Interview_task/journal-scrapers/scrapers/peerj.json
    info: - Rate limit: 3 per minute
    info: - Log level: info
    info: urls to scrape: 1
    info: processing URL: https://peerj.com/articles/1045/
    info: [scraper]. URL rendered. https://peerj.com/articles/1045/.
    info: [scraper]. download started. Data_2010_RittenhouseCD_et_al_Weather_and_mule_deer_migration_20150522.csv.
    info: [scraper]. download started. Data_2009_RittenhouseCD_et_al_Weather_and_mule_deer_migration_20150522.csv.
    info: [scraper]. download started. fig-1-full.png.
    info: [scraper]. download started. fulltext.xml.
    info: [scraper]. download started. fulltext.xml.
    info: [scraper]. download started. fig-2-full.png.
    info: [scraper]. download started. fulltext.html.
    info: [scraper]. download started. fulltext.pdf.
    info: URL processed: captured 28/34 elements (6 captures failed)
    info: all tasks completed

From peerJ. Finally, supplementary information. First images, and some `.csv` files. It downloaded `fulltext.xml` twice, not sure if they were the same file.

    > quickscrape --url http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29 --scraper ../../journal-scrapers/scrapers/peerj.json --output BMC1746-4269-2-29 --outformat bibjson
    
    info: quickscrape 0.4.7 launched with...
    info: - URL: http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29
    info: - Scraper: /home/larsw/public_html/cm-repo/Interview_task/journal-scrapers/scrapers/peerj.json
    info: - Rate limit: 3 per minute
    info: - Log level: info
    info: urls to scrape: 1
    info: processing URL: http://ethnobiomed.biomedcentral.com/articles/10.1186/1746-4269-2-29

From BMC. Seems to have a lot of suppinfo (2x `.pdf`, 9x `.ppt`). Seemed to fail silently, took at least 10 minutes, aborted.

I have not put the resulting files in my repository because they seem pretty useless and you can get them reproducing the steps, if you have the right version of `quickscrape` etc.