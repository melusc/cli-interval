import {spawn} from 'node:child_process';
import {readFile} from 'node:fs/promises';
import {exit} from 'node:process';
import {parseArgs} from 'node:util';

import ms from 'ms';

const {values, positionals} = parseArgs({
	allowPositionals: true,
	options: {
		help: {
			default: false,
			type: 'boolean',
			short: 'h',
		},
		interval: {
			type: 'string',
			short: 't',
		},
		version: {
			default: false,
			type: 'boolean',
			short: 'v',
		},
	},
});

function printHelp() {
	console.info(`
  Usage
    $ interval <options> -- <command>

  Options
    -t, --interval  [required] interval as a number in milliseconds or as a string (1s, 400ms...)
    -v, --version   Show version and exit
    -h, --help      Show this help-text and exit

  Examples
    $ interval -t 500ms -- echo Hello
    $ interval -t 500ms -- rm -r abc
`);
	exit(0);
}

async function printVersion() {
	// eslint-disable-next-line security/detect-non-literal-fs-filename
	const packageJsonRaw = await readFile(
		new URL('../package.json', import.meta.url),
		'utf8',
	);
	const packageJson = JSON.parse(packageJsonRaw) as {version: string};
	console.info(packageJson.version);
	exit(0);
}

if (values.version) {
	await printVersion();
}

if (values.help || positionals.length === 0) {
	printHelp();
}

if (values.interval === undefined) {
	console.error('Missing -t, --interval.');
	exit(1);
}

let interval: number | undefined;

try {
	interval = ms(values.interval as ms.StringValue);
} catch {}

if (interval === undefined) {
	console.error(
		`Error: Invalid interval "${values.interval}". See https://github.com/vercel/ms for valid formats.`,
	);
	exit(1);
}

function intervalFunction() {
	spawn(positionals[0]!, positionals.slice(1), {
		stdio: 'inherit',
	})
		.on('close', () => {
			setTimeout(intervalFunction, interval);
		})
		.on('exit', code => {
			if (code !== 0) {
				exit(code ?? 1);
			}
		})
		.on('error', error => {
			console.error(error);
			exit(1);
		});
}

intervalFunction();
