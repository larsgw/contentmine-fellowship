// Include
var program = require('commander'),
    clear   = require('clear' ),
    fs      = require('fs'    ),
    colors  = require('colors');

// Debug
//clear();

program
  .version('0.1')
  .option('-o <path>',
	  'Path to output to')
  .option('-c <path>',
	  'File to print')
  .option('-t <string>',
	  'Text to print')
  .option('-d <string>',
	  'Data to write')
  .option('-v <string>',
	  'Verbosity: DEBUG, INFO, LOG, WARN or ERROR')
  .option('-T',
	  'Test')
  //.parse(process.argv)

//console.log(program)

if ( !process.argv.slice(2).length ) program.help();

// Initiate variables to parse arguments
var arg_obj = {
      t:false,
      c:false,
      o:false,
      d:false,
      v:false,
      _nameless_arg:[]
    },
    exp_arg = {
      o:true,
      c:true,
      t:true,
      d:true,
      v:true
    };

(function ( argv ) {
  
  // Remove 'node' and 'filename.js'
  argv = argv.slice( 2, argv.length );
  
  // Loop trough arguments, and join structures like '--url https://google.com'
  var rmCurrent = false;
  
  for ( var i = 0; i < argv.length; i++ ) {
    var arg = argv[ i ];
    
    if ( rmCurrent )
      
      argv.splice( i, 1 );
    
    if ( exp_arg[ arg.replace( /^--?/, '' ) ] )
      
      argv[ i ] = arg + ' ' + argv[ i + 1 ],
      rmCurrent = true;
    
    else
      
      rmCurrent = false;
  }
  
  // Loop trough arguments again, and put data in arg_obj
  for ( var i = 0; i < argv.length; i++ ) {
    var arg = argv[ i ];
    
    // Extract data differently in different situations
    
    // Situation: '-abc'    
    if ( arg.match( /^-[A-Za-z]{2,}$/ ) )
      
      // Set every argument in arg_obj to true
      arg.replace( /^-/, '' ).split( '' ).map( function ( v, i ) { arg_obj[ v ] = true; return v } );
    
    // Situation: '-a (input string/file/etc)'
    else if ( arg.match( /^-[A-Za-z]( .+)?$/ ) ) {
      
      var parts = arg.match( /^-([A-Za-z])(?: (.+))?$/ );
      
      // Set argument to input or true
      arg_obj[ parts[ 1 ] ] = parts[ 2 ] || true; }
    
    // Situation: '--long_arg_name (input string/file/etc)'
    else if ( arg.match( /^--[A-Za-z_0-9]+( .+)?$/ ) ) {
      
      var parts = arg.match( /^--([A-Za-z_0-9]+)(?: (.+))?$/ );
      
      // Set argument to input or true
      arg_obj[ parts[ 1 ] ] = parts[ 2 ] || true; }
    
    // Situation: 'file/string/etc'
    else
      
      // Push to _nameless_arg
      arg_obj._nameless_arg.push(arg);
    
  }
  
})(process.argv);

// Making custom logs
var v_level = {
      DEBUG : 00,
      INFO  : 10,
      LOG   : 20,
      WARN  : 30,
      ERROR : 40,
    },
    custom  = {
      console : {
	debug : function () {
	  if ( verbosity <= v_level[ 'DEBUG' ]  )
	    console.log( '[' + 'DEBUG'.blue + '] ' + Array.prototype.slice.call( arguments ).join( ' ' ) )
	},
	info : function () {
	  if ( verbosity <= v_level[ 'INFO' ]  )
	    console.log( '[' + 'INFO'.green + ']  ' + Array.prototype.slice.call( arguments ).join( ' ' ) )
	},
	log : function () {
	  if ( verbosity <= v_level[ 'LOG' ]  )
	    console.log( '        ' + Array.prototype.slice.call( arguments ).join( ' ' ) )
	},
	warn : function () {
	  if ( verbosity <= v_level[ 'WARN' ]  )
	    console.log( '[' + 'WARN'.yellow + ']  ' + Array.prototype.slice.call( arguments ).join( ' ' ) )
	},
	error : function () {
	  if ( verbosity <= v_level[ 'ERROR' ]  )
	    console.log( '[' + 'ERROR'.red + '] ' + Array.prototype.slice.call( arguments ).join( ' ' ) )
	}
      }
    }

var verbosity = v_level[ arg_obj.v || 'INFO' ];

if ( arg_obj.o && arg_obj.d )
  
  fs.writeFile( arg_obj.o, arg_obj.d, function( err, data ) {
    if ( err )
      return custom.console.error( err.message )
    
    custom.console.log( arg_obj.d + ' -> ' + arg_obj.o )
  } );

else if ( arg_obj.c )
  
  fs.readFile( arg_obj.c, 'utf-8', function( err, data ) {
    if ( err )
      return custom.console.error( err.message )
    
    custom.console.log( data.trim() )
    
  } );

else if ( arg_obj.t )
  
  custom.console.log( arg_obj.t );