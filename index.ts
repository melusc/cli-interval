#!/usr/bin/env node

import {exec} from 'node:child_process';
import {exit, stderr, stdin, stdout} from 'node:process';

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
				shortFlag: 't',
				isRequired: true,
			},
			version: {
				type: 'boolean',
				shortFlag: 'v',
			},
			help: {
				shortFlag: 'h',
			},
		},
	},
);

let interval: number | undefined;

try {
	interval = ms(cli.flags.interval);
} catch {}

if (interval === undefined) {
	console.error(
		`Error: Invalid interval "${cli.flags.interval}". See https://github.com/vercel/ms for valid formats.`,
	);
	exit(1);
}

if (cli.input.length === 0) {
	cli.showHelp();
}

const intervalFunction = () => {
	const child = exec(cli.input.join(' '))
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

	child.stdout!.pipe(stdout);
	child.stderr!.pipe(stderr);
	stdin.pipe(child.stdin!);
};

intervalFunction();
