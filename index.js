#!/usr/bin/env node

import {spawn} from 'node:child_process';
import process from 'node:process';

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
			help: {
				alias: 'h',
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
	const child = spawn(command, cli.input.slice(1), {
		shell: true,
		cwd: process.cwd(),
	})
		.on('close', () => {
			setTimeout(intervalFunction, interval);
		})
		.on('exit', code => {
			if (code !== 0) {
				process.exit(code);
			}
		})
		.on('error', error => {
			console.error(error);
			process.exit(1);
		});
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
};

intervalFunction();
