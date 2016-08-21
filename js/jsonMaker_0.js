// Include
var program = require( 'commander' )
  , clear   = require( 'clear'     )
  , fs      = require( 'fs'        )
  , xmldoc  = require( 'xmldoc'    )

require('colors');
require('string.prototype.repeat');

program
  .option('-p, --project <path>',
	  'CTree/project folder')
  .option('-o, --output <path>',
	  'where to output results ' +
          '(directory will be created if it doesn\'t exist)',
          'output')
  .option('-f, --outfile <name>',
	  'file to output results',
          'output-file.json')
  .option('-v, --verbosity <level>',
	  'amount of information to log ' +
          '(debug, info, log, warn, error)',
	  function ( a ) { return a.toUpperCase() },
          //'INFO')
	  'DEBUG')
  .parse(process.argv);

if ( !process.argv.slice(2).length )
  program.help();

// Making custom logs
var custom  = {
      getErrorObject: function () { try { throw Error( '' ) } catch ( e ) { return e; } },
      v_level: {},
      console: {},
      custom: function ( name, level, colour, prefix ) {
	var name   = typeof name   === 'string' ? name   :  name  + '' ,
	    level  = typeof level  === 'number' ? level  :  level * 0  ,
	    colour = typeof colour === 'string'
      && String.prototype[colour.toLowerCase()] ? colour : 'white'     ;
      
	if ( name.length > 5 ) name = name.slice(0,5);
	
	custom.v_level[name.toUpperCase()] = level;	
	this.console[name.toLowerCase()] = function () {
	  var caller_line = custom.getErrorObject().stack.split( '\n' )[ 4 ]
	    , index = caller_line.indexOf( 'at ' ) + 2
	    , clean = caller_line.slice( index, caller_line.length )
	    , ln    = clean.replace( /^.*?(\d+):\d+\)$/, '$1' ).slice(0,4)
	  
	  if ( custom.v_level[ program.verbosity ] <= custom.v_level[ name.toUpperCase() ]  )
	    console.log(
	      ' '.repeat( 4 - ln.length ) + ln + ': ' +
	      ( prefix || '[' + name.toUpperCase()[ colour ] + ' '.repeat( 5 - name.length ) ) + '] ' +
	      Array.prototype.slice.call( arguments ).join( ' ' )
	    )
	}
      },
      logs: [
	[ 'debug', 00, 'cyan'               ],
	[ 'info' , 10, 'green'              ],
	[ 'log'  , 20, 'white' , '        ' ],
	[ 'warn' , 30, 'yellow'             ],
	[ 'error', 40, 'red'                ],
      ]
    }

for ( var i = 0; i < custom.logs.length; i++ ) {
  custom.custom.apply(custom,custom.logs[i]);
}      

var project = program.project
  , output  = program.output
  , outfile = program.outfile

custom.console.debug( project, output, outfile, program.verbosity )

if ( !project ) {
  custom.console.error( 'You must provide a project directory' );
  process.exit( 1 ) }

if ( !fs.existsSync( project ) ) {
  custom.console.error( 'Project directory does not exist: ' + project );
  process.exit( 1 ); }

if ( !fs.existsSync( output ) ) {
  custom.console.info( 'Creating output directory: ' + program.output );
  fs.mkdirSync( program.output ); }

function getAMIResults ( directory ) {
  var doc = new xmldoc.XmlDocument( fs.readFileSync(
    [ project, directory, 'sequencesfiles.xml' ].join('/'),
    'utf8' ) )
    , files = doc.children
    , data = {}
  
  for ( var fileIndex = 0; fileIndex < files.length; fileIndex++ ) {
    var file = files[fileIndex]
      , fileDoc = new xmldoc.XmlDocument( fs.readFileSync(
      [ project, file.attr.name ].join('/'),
      'utf8' ) )
      , child = fileDoc.children
    
    data[ fileDoc.attr.title ] = child.map( function ( v, i ) {
      return v.attr;
    } )
  }
  
  return data;
}

var directories = fs.readdirSync( project )
  , articles = []

for ( var dirIndex = 0; dirIndex < directories.length; dirIndex++ ) {
  var directory = directories[ dirIndex ];
  
  if(!/PMC\d+/.test(directory))continue;
  
  var metadata = JSON.parse( fs.readFileSync(
	[ project, directory, 'eupmc_result.json' ].join('/'),
	'utf8' ) )
    , AMIResults = getAMIResults( directory );
  
  articles.push( {
    metadata: metadata,
    AMIResults: AMIResults
  } )
}

try {
  custom.console.info( 'Saving output to ./' + output + '/' + outfile )
  
  fs.writeFileSync( [ output, outfile ].join( '/' ), JSON.stringify( articles ) )
  
  custom.console.info( 'Saving output succeeded!' )
} catch ( e ) {
  
  custom.console.error( 'Saving output failed!', e.toString() )
}

process.exit(1);