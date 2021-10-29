/*global console */
var now;

if ( window.performance && window.performance.now ) {
	now = function () { return window.performance.now(); };
} else if ( Date.now ) {
	now = function () { return Date.now(); };
} else {
	now = function () { return new Date().getTime(); };
}

function runSuite ( tests, version, ractiveUrl, callback ) {
	var testResults = { tests: [] },
		container = document.querySelector( '.iframe-container' ),
		solo;

	console.group( 'running performance tests (' + version + ')' );

	tests = tests.filter( function ( t ) { return !t.skip; });

	solo = tests.filter( function ( t ) { return t.solo; });
	if ( solo.length ) {
		tests = solo;
	}

	function runNextTest () {
		var test, frame;

		test = tests.shift();
		if ( !test ) {
			console.groupEnd();
			return callback( null, testResults );
		}

		frame = document.createElement( 'iframe' );
		container.appendChild( frame );

		runTest( frame.contentWindow, test, version, ractiveUrl, function ( err, result ) {
			if ( err ) {
				console.groupEnd();
				return callback( err );
			}

			testResults.tests.push( result );
			container.innerHTML = '';

			setTimeout( runNextTest );
		});
	}

	runNextTest();
}

function runTest ( context, test, version, ractiveUrl, callback ) {
	console.group( test.name );

	injectScript( context, ractiveUrl, function ( err ) {
		var alreadySetup, setupResult;

		if ( err ) {
			return callback( err );
		}

		// copy setTimeout from parent to child... prevents errors
		context.setTimeout = window.setTimeout;

		// setup test
		context.setupComplete = function ( err, setupResult ) {
			var start, runStart, duration, totalDuration, count = 0, label = version + ': ' + test.name;

			if ( err ) {
				return callback( err );
			}

			if ( alreadySetup ) throw new Error( 'setupComplete callback was called more than once' );
			alreadySetup = true;

			console.profile( label );

			start = now();
			duration = totalDuration = 0;

			context.setupResult = setupResult;

			while ( duration < 1000 && totalDuration < 3000 ) {
				if ( test.beforeEach ) {
					context.eval( '(' + test.beforeEach.toString() + ')()' );
				}

				count += 1;
				runStart = now();

				try {
					context.eval( '(' + test.test.toString() + ')(setupResult)' );
				} catch ( e ) {
					return callback( e );
				}

				duration += now() - runStart;
				totalDuration = now() - start;
			}

			console.profileEnd( label );

			console.groupEnd();

			callback( null, {
				test: test,
				version: version,
				ractiveUrl: ractiveUrl,
				name: test.name,
				count: count,
				duration: duration,
				average: duration / count
			});
		};


		if ( test.setup ) {
			setupResult = context.eval( '(' +  test.setup.toString() + ')(setupComplete)' );
		}

		if ( !test.setup || !test.setup.length ) {
			context.setupComplete( null, setupResult );
		}
	});
}

function injectScript ( context, url, callback ) {
	var doc, script, id, handleMessage;

	doc = context.document;

	script = doc.createElement( 'script' );
	script.src = url;

	id = Math.random();

	window.addEventListener( 'message', handleMessage = function ( event ) {
		if ( event.data === id ) {
			window.removeEventListener( 'message', handleMessage );
			callback();
		}
	});

	script.onload = function () {
		window.parent.postMessage( id, window.location.origin );
	};

	script.onerror = function () {
		var err = new Error( 'Could not load ' + url );
		callback( err );
	};

	doc.body.appendChild( script );
}
