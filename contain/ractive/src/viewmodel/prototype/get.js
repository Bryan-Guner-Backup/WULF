import { lastItem } from 'utils/array';
import { hasOwn } from 'utils/object';
import FAILED_LOOKUP from './get/FAILED_LOOKUP';

var empty = {};

export default function Viewmodel$get ( keypath, options ) {
	var cache = this.cache,
		value,
		computation,
		wrapped,
		captureGroup,
		keypathStr = keypath.str,
		key;

	options = options || empty;

	// capture the keypath, if we're inside a computation
	if ( options.capture && ( captureGroup = lastItem( this.captureGroups ) ) ) {
		if ( !~captureGroup.indexOf( keypath ) ) {
			captureGroup.push( keypath );
		}
	}

	if ( hasOwn.call( this.mappings, keypath.firstKey ) ) {
		return this.mappings[ keypath.firstKey ].get( keypath, options );
	}

	if ( keypath.isSpecial ) {
		return keypath.value;
	}

	if ( cache[ keypathStr ] === undefined ) {

		// Is this a computed property?
		if ( ( computation = this.computations[ keypathStr ] ) && !computation.bypass ) {
			value = computation.get();
			this.adapt( keypathStr, value );
		}

		// Is this a wrapped property?
		else if ( wrapped = this.wrapped[ keypathStr ] ) {
			value = wrapped.value;
		}

		// Is it the root?
		else if ( keypath.isRoot ) {
			this.adapt( '', this.data );
			value = this.data;
		}

		// No? Then we need to retrieve the value one key at a time
		else {
			value = retrieve( this, keypath );
		}

		cache[ keypathStr ] = value;
	} else {
		value = cache[ keypathStr ];
	}

	if ( !options.noUnwrap && ( wrapped = this.wrapped[ keypathStr ] ) ) {
		value = wrapped.get();
	}

	if ( keypath.isRoot && options.fullRootGet ) {
		for ( key in this.mappings ) {
			value[ key ] = this.mappings[ key ].getValue();
		}
	}

	return value === FAILED_LOOKUP ? void 0 : value;
}

function retrieve ( viewmodel, keypath ) {

	var parentValue, cacheMap, value, wrapped;

	parentValue = viewmodel.get( keypath.parent );

	if ( wrapped = viewmodel.wrapped[ keypath.parent.str ] ) {
		parentValue = wrapped.get();
	}

	if ( parentValue === null || parentValue === undefined ) {
		return;
	}

	// update cache map
	if ( !( cacheMap = viewmodel.cacheMap[ keypath.parent.str ] ) ) {
		viewmodel.cacheMap[ keypath.parent.str ] = [ keypath.str ];
	} else {
		if ( cacheMap.indexOf( keypath.str ) === -1 ) {
			cacheMap.push( keypath.str );
		}
	}

	// If this property doesn't exist, we return a sentinel value
	// so that we know to query parent scope (if such there be)
	if ( typeof parentValue === 'object' && !( keypath.lastKey in parentValue ) ) {
		return viewmodel.cache[ keypath.str ] = FAILED_LOOKUP;
	}

	value = parentValue[ keypath.lastKey ];

	// Do we have an adaptor for this value?
	viewmodel.adapt( keypath.str, value, false );

	// Update cache
	viewmodel.cache[ keypath.str ] = value;
	return value;
}
