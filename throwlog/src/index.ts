const chalk = require('chalk');
const chromafi = require('chromafi');

var logOutputTo = console.log;
var logErrorTo = console.error;

function echoMsgBox(msg, colorFn, log = logOutputTo) {
	const width = 80;
	let toDump = false;
	if (typeof msg !== 'string' || width - 2 < msg.length) {
		toDump = msg;
		msg = ' ';
	}

	colorFn =
		colorFn ||
		function(x) {
			return x;
		};

	msg = ' '.repeat(((width - msg.length) / 2) | 0) + msg;
	log();
	log(colorFn(' '.repeat(width)));
	log(colorFn(msg + ' '.repeat(width - msg.length)));
	log(colorFn(' '.repeat(width)));
	log();

	if (!!toDump) {
		dump_(toDump, log);
	}
}

export function dump_(data, logTo = logErrorTo) {
	if(!/function|string|object/.test(typeof data)){
		data = '' + data
	}

	logTo(
		chromafi(data, {
			indent: 2,
			lineNumbers: false,
			colors: {
				string: chalk.green,
			},
		})
	);
}


export function dump(data) {
	dump_(data, logOutputTo)
}


export function error_(msg, logTo = logErrorTo) {
	echoMsgBox(msg, chalk.bgRed.whiteBright, logTo);
}

export function error(msg) {
	error_(msg, logOutputTo)
}

export function info_(msg, logTo = logErrorTo) {
	echoMsgBox(msg, chalk.bgBlue.whiteBright, logTo);
}

export function info(msg) {
	info_(msg, logOutputTo);
}

export function warn_(msg, logTo = logErrorTo) {
	echoMsgBox(msg, chalk.bgYellowBright.black, logTo);
}
export function warn(msg) {
	warn_(msg, logOutputTo);
}

export function success_(msg, logTo = logErrorTo) {
	echoMsgBox(msg, chalk.bgGreen.whiteBright, logTo);
}

export function success(msg) {
	success_(msg, logOutputTo);
}

export function kill(data, headline = '') {
	if (!!data) {
		headline.length && warn_(headline);
		error_(data);
	}
	process.exit(1);
}

interface ThrowLogConfig{
	defaltLog?:(any) => any;
	defaltError?:(any) => any;
}

export function throwLogConfig(conf:ThrowLogConfig){
	logOutputTo = conf.defaltLog || logOutputTo;
	logErrorTo = conf.defaltError || logErrorTo;
};