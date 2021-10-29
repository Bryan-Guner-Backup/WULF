import Hook from './shared/hooks/Hook';
import { warnIfDebug } from 'utils/log';
import Promise from 'utils/Promise';
import { removeFromArray } from 'utils/array';
import runloop from 'global/runloop';

var unrenderHook = new Hook( 'unrender' );

export default function Ractive$unrender () {
	var promise, shouldDestroy;

	if ( !this.fragment.rendered ) {
		warnIfDebug( 'ractive.unrender() was called on a Ractive instance that was not rendered' );
		return Promise.resolve();
	}

	promise = runloop.start( this, true );

	// If this is a component, and the component isn't marked for destruction,
	// don't detach nodes from the DOM unnecessarily
	shouldDestroy = !this.component || this.component.shouldDestroy || this.shouldDestroy;

	// Cancel any animations in progress
	while ( this._animations[0] ) {
		this._animations[0].stop(); // it will remove itself from the index
	}

	this.fragment.unrender( shouldDestroy );

	removeFromArray( this.el.__ractive_instances__, this );

	unrenderHook.fire( this );

	runloop.end();
	return promise;
}
