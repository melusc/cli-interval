#!/usr/bin/env node

import {exec} from 'node:child_process';

import ms from 'ms';
import meow from 'meow';
import isNumber from 'is-number';

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
				alias: 't'
			},
			version: {
				type: 'boolean',
				alias: 'v'
			}
		}
	}
);

if (cli.flags.h || !cli.flags.interval) {
	cli.showHelp();
}

if (cli.version) {
	cli.showVersion();
}

const toMilliseconds = value => (isNumber(value) ? Number(value) : ms(value));

const command = cli.input[0];
const interval = toMilliseconds(cli.flags.interval);

const intervalFunction = () => {
	const child = exec(command, () => {
		setTimeout(intervalFunction, interval);
	});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
};

intervalFunction();
