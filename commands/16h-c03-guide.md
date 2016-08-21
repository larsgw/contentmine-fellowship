# Guide to reproduce data from project 16h-c03

I myself had some extra data, but these were unused by cards_c03.html. Therefore, commands to get that data are omitted, which results in a smaller .json file.

Below is a list of commands to get the .json file, with explanation and expected output.

    $ mkdir data

Make a directory for your data. You can name this anything, if you are consistent.

    $ cd data/

Go to that directory.

    /data$ getpapers --api eupmc -q 'Abies OR Pinus OR Picea' -n
    info: Searching using eupmc API
    info: Running in no-execute mode, so nothing will be downloaded
    info: Found 1366009 open access results
    
    /data$ getpapers --api eupmc -q 'Abies OR Pinus OR Picea' -o . -k 250 -x
    info: Searching using eupmc API
    info: Found 1366009 open access results
    info: Limiting to 250 hits
    Retrieving results [==============================] 100% (eta 0.0s)
    info: Done collecting results
    info: Saving result metadata
    info: Full EUPMC result metadata written to eupmc_results.json
    info: Individual EUPMC result metadata records written
    info: Extracting fulltext HTML URL list (may not be available for all articles)
    info: Fulltext HTML URL list written to eupmc_fulltext_html_urls.txt
    warn: Article with pmcid "PMC4963410" was not Open Access (therefore no XML)
    info: Got XML URLs for 249 out of 250 results
    info: Downloading fulltext XML files
    Downloading files [==============================] 100% (249/249) [13.3s elapsed, eta 0.0]
    info: All downloads succeeded!

Query the eupmc API for data with the `getpapers` command. Again, the query (`-q`) and limit to the number of papers (`-k`) are optional. **Note:** There are two commands in the code block above. Only the second is necessary, the first (with `-n`) is to see how many results there are without downloading.

    /data$ norma --project . -i fulltext.xml -o scholarly.html --transform nlm2html
    ......................... (and lots of UNKNOWN messages)

Transform `fulltext.xml` to `scholarly.html` with the `norma` command.

    /data$ ami2-species --project . -i scholarly.html --sp.species --sp.type genus
    ..........................

    /data$ ami2-species --project . -i scholarly.html --sp.species --sp.type binomial
    ..........................

Extract `genus` and `binomial` with the `ami` command. **Note:** Two commands, both necessary.

    /data$ ami2-sequence --project . --filter file\(\*\*/results.xml\) -o sequencesfiles.xml
    .........................

Sequence the results. This makes it easier for the program to fetch the files.

    /data$ cd ../

Go back to the root folder of the project.

To transform the data to JSON you need the [jsonMaker_0.js](https://github.com/larsgw/contentmine-fellowship/blob/master/js/jsonMaker_0.js) and NodeJS. It's dependencies are:

 * commander
 * clear
 * fs
 * xmldoc
 * colors
 * string.prototype.repeat

Now, you can run it. `-p` for the directory, `-o` for output directory, and `-f` for output file.

    $ mkdir js
     
    $ node js/jsonMaker_0.js -p data -o . -f data.json
      77: [INFO ] Parsing CTree project in folder: data/
      78: [INFO ] Outputting to folder: .
      79: [INFO ] Outputting to file: data.json
     178: [INFO ] Saving output to ././data.json
     180: [INFO ] Saving output succeeded!

If it gets an error, [raise an issue](https://github.com/larsgw/contentmine-fellowship/issues/new).