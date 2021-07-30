#!/usr/bin/env node

import {exec} from 'node:child_process';

import ms from 'ms';
import meow from 'meow';

const cli = meow(
	`
    Usage
      $ interval <command>

    Options
      -t, --interval  interval as a number in milliseconds or as a string (1s, 400ms...)
      -v, --version   Show version and exit
      -h, --help      Show this help text and exit

    Examples
      $ interval -t 500ms "echo Hello"
`,
	{
		importMeta: import.meta,
		flags: {
			interval: {
				type: 'string',
				alias: 't',
				isRequired: true,
			},
			version: {
				type: 'boolean',
				alias: 'v',
			},
		},
	},
);

if (cli.flags.h || !cli.flags.interval) {
	cli.showHelp();
}

if (cli.flags.version) {
	cli.showVersion();
}

const command = cli.input[0];
const interval = ms(cli.flags.interval);

if (interval === undefined) {
	throw new Error('ms could not interpret interval-string.');
}

if (!command) {
	cli.showHelp();
}

const intervalFunction = () => {
	const child = exec(command, error => {
		if (error) {
			throw error;
		}

		setTimeout(intervalFunction, interval);
	});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
};

intervalFunction();
