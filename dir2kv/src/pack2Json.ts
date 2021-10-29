import Chiqq from 'https://raw.githubusercontent.com/bico-media/chiqq/master/mod.ts';
import {Base64} from 'https://deno.land/x/bb64/mod.ts';
import {encode as b64} from 'https://deno.land/std@0.83.0/encoding/base64.ts';
import Mime from 'https://cdn.skypack.dev/mime';
import {hasBin, RE} from './misc.ts';

let q = new Chiqq({concurrency: 5});

export default async function pack2Json(
	paths: string[],
	outputFile = 'kv-bulk.json',
	prependKey = ''
) {
	if (!outputFile.toLowerCase().endsWith('.json')) outputFile += '.json';

	let bulk = await Promise.all(
		paths.map(async (path) => {
			console.log(path);

			let charset = 'utf-8';
			let mime = Mime.getType(path);
			const data = await Deno.readFile(path);

			mime = mime || hasBin(data) ? 'application/octet-stream' : 'text/plain';

			if (path.toLowerCase().endsWith('.ts') && !hasBin(data)) {
				mime = 'text/plain';
			}

			return {
				//expiration_ttl": 3600
				key: prependKey + path,
				value: b64(data),
				meta: JSON.stringify({
					mime,
					charset,
				}),
			};
		})
	);

	console.log(bulk);

	Deno.writeTextFileSync(outputFile, JSON.stringify(bulk, null, 2));
}
