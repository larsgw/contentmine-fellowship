/*
 * Transform ctj.js output to my desired format, mainly to minify file size etc.
 * 
 */

// Include
var fs      = require( 'fs'        )

// Constants
var  input = 'data/1/data.json'
  , output = 'html/data/c05-a.json'

// Get JSON
var data    = JSON.parse( fs.readFileSync( input, 'utf8' ) )
  , out     = {
    articles: {},
    genus:    {},
    binomial: {}
  }

// Convert JSON:

// - articles
Object.keys( data.articles ).forEach( function ( article ) {
  var metadata = data.articles[ article ].metadata
    , amires   = data.articles[ article ].AMIResults
  
  out.articles[ article ] = {
    title    : metadata.title,
    authors  : metadata.authorString,
    doi      : metadata.doi,
    abstract : metadata.abstractText || '',
    journal  : metadata.journalInfo[ 0 ].journal[ 0 ].title[ 0 ],
    species  : ( amires.binomial || [] ).map( function ( v ) { return v.match } ),
    genera   : ( amires.genus || [] ).map( function ( v ) { return v.match } )
  }
} )

// - genus
Object.keys( data.genus ).forEach( function ( genus ) {
  var json = data.genus[ genus ]
    , hits = []
  
  // Hits per article
  json
    .slice()
    .map( function ( v ) {
      return v.pmc
    } )
    .sort()
    .forEach( function ( v ) {
      var last = hits[ hits.length-1 ] || [];
      if ( last[ 0 ] === v )
	last[ 1 ]++
      else hits.push( [ v, 1 ] )
    } )
  
  hits = hits.sort( function ( a, b ) {
    if ( a[ 1 ] !== b[ 1 ] )
      return b[ 1 ] - a[ 1 ];
    
    if ( a[ 0 ] < b[ 0 ] )
      return -1;
      
    if ( a[ 0 ] > b[ 0 ] )
      return  1;
    
    return 0;
  } )
  
  // Total hits
  var total = hits
    .slice()
    .reduce( function( a, b ) {
      return [ , a[ 1 ] + b[ 1 ] ]
    } )[ 1 ]
  
  out.genus[ genus ] = {
    total: total,
    hits : hits ,
    species: []
  }
} )

// - binomial
Object.keys( data.binomial ).forEach( function ( species ) {
  var json = data.binomial[ species ]
    , genus= species.split( ' ' )[0]
    , hits = []
  
  // Genus
  if ( out.genus.hasOwnProperty( genus ) )
    out.genus[ genus ].species.push( species )
  
  // Hits per article
  json
    .slice()
    .map( function ( v ) {
      return v.pmc
    } )
    .sort()
    .forEach( function ( v ) {
      var last = hits[ hits.length-1 ] || [];
      if ( last[ 0 ] === v )
	last[ 1 ]++
      else hits.push( [ v, 1 ] )
    } )
  
  hits = hits.sort( function ( a, b ) {
    if ( a[ 1 ] !== b[ 1 ] )
      return b[ 1 ] - a[ 1 ];
    
    if ( a[ 0 ] < b[ 0 ] )
      return -1;
      
    if ( a[ 0 ] > b[ 0 ] )
      return  1;
    
    return 0;
  } )
  
  // Total hits
  var total = hits
    .slice()
    .reduce( function( a, b ) {
      return [ , a[ 1 ] + b[ 1 ] ]
    } )[ 1 ]
  
  out.binomial[ species ] = {
    total: total,
    hits : hits
  }
} )

// Sorting
var genusKeys = Object.keys( out.genus )
  , binomialKeys = Object.keys( out.binomial )

genusKeys.forEach( function ( v ) {
  out.genus[ v ].species = out.genus[ v ].species.sort()
} )

genusKeys.sort( function ( b, a ) {
  return ( out.genus[ a ].total - out.genus[ b ].total )
} ).forEach( function ( v, i ) {
  out.genus[ v ].order = i;
} )

binomialKeys.sort( function ( b, a ) {
  return ( out.binomial[ a ].total - out.binomial[ b ].total )
} ).forEach( function ( v, i ) {
  out.binomial[ v ].order = i;
} )

// Saving file
fs.writeFileSync( output, JSON.stringify( out ) )