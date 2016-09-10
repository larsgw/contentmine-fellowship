/*
 * Transform ctj.js output to my desired format, mainly to minify file size etc.
 * 
 */

// Include
var fs      = require( 'fs'        )

// Constants
var  input = 'data/1/data.json'
  , output = 'html/data/c05-c.json'

// Get JSON
var data    = JSON.parse( fs.readFileSync( input, 'utf8' ) )
  , out     = {
    articles: {}
  }

// Convert JSON:

// - articles
Object.keys( data.articles ).forEach( function ( article ) {
  var amires = data.articles[ article ].AMIResults
  
  out.articles[ article ] = {
    AMIResults: { frequencies: amires.frequencies }
  }
} )

// Saving file
fs.writeFileSync( output, JSON.stringify( out ) )