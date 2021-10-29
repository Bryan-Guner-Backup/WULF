import { getKeypath, normalise } from 'shared/keypaths';
import Observer from './Observer';
import PatternObserver from './PatternObserver';

let emptyObject = {};

export default function getObserverFacade ( ractive, keypath, callback, options ) {
	var observer, isPatternObserver, cancelled;

	keypath = getKeypath( normalise( keypath ) );
	options = options || emptyObject;

	// pattern observers are treated differently
	if ( keypath.isPattern ) {
		observer = new PatternObserver( ractive, keypath, callback, options );
		ractive.viewmodel.patternObservers.push( observer );
		isPatternObserver = true;
	} else {
		observer = new Observer( ractive, keypath, callback, options );
	}

	observer.init( options.init );
	ractive.viewmodel.register( keypath, observer, isPatternObserver ? 'patternObservers' : 'observers' );

	// This flag allows observers to initialise even with undefined values
	observer.ready = true;

	let facade = {
		cancel () {
			var index;

			if ( cancelled ) {
				return;
			}

			if ( isPatternObserver ) {
				index = ractive.viewmodel.patternObservers.indexOf( observer );

				ractive.viewmodel.patternObservers.splice( index, 1 );
				ractive.viewmodel.unregister( keypath, observer, 'patternObservers' );
			} else {
				ractive.viewmodel.unregister( keypath, observer, 'observers' );
			}
			cancelled = true;
		}
	};

	ractive._observers.push( facade );
	return facade;
}
