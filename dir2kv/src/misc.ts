export const RE = {
	dotName: /^\.|[\\\/]\./,
	hasBin: /[\x01-\x06\x0E-\x1A]/,
};

export function hasBin(data: Uint8Array, limitTo = -1024, decoderCharset = 'utf-8') {
	const decoder = new TextDecoder(decoderCharset);
	return RE.hasBin.test(decoder.decode(data.subarray(limitTo)));
}
