# interval

Repeat a command at a given interval, and aggregate its output.

[![NPM](http://img.shields.io/npm/v/@lusc/cli-interval.svg?style=flat)](https://npmjs.org/package/@lusc/cli-interval)
[![License](http://img.shields.io/npm/l/@lusc/cli-interval.svg?style=flat)](https://github.com/melusc/cli-interval)
[![Dependencies](https://img.shields.io/david/melusc/cli-interval)](https://david-dm.org/TabDigital/cli-interval)

```bash
npm install -g cli-interval
```

The following example outputs a random number to `stdout` every second.

```bash
interval -t 1s "echo Hello"
```

It will aggregates both `stdout` and `stderr` over time, and pipes them into its respective outputs.

## Arguments

- `--help` print the command usage
- `-t` specify the interval at which to run the command, e.g.
  - `-t 0.5` every 500 milliseconds
  - `-t 10` every 10 milliseconds
  - `-t 5s` every 5 seconds
  - `-t 2m` every 2 minutes
  - `-t 1h` every hour

This is a fork of [Tabcorp/cli-interval](https://github.com/Tabcorp/cli-interval).