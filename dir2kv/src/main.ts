import {RE} from './misc.ts';
import pack2Json from './pack2Json.ts';

import {walk, walkSync} from 'https://deno.land/std@0.83.0/fs/mod.ts';

const paths = [];

for (const entry of walkSync('.')) {
	if (RE.dotName.test(entry.path)) continue;

	if (entry.isDirectory) continue;

	paths.push(entry.path);
}

pack2Json(paths);
