# interval

Repeat a command at a given interval, and aggregate its output.

[![NPM](https://img.shields.io/npm/v/@lusc/cli-interval.svg?style=flat)](https://npmjs.org/package/@lusc/cli-interval)
[![License](https://img.shields.io/npm/l/@lusc/cli-interval.svg?style=flat)](https://github.com/melusc/cli-interval)

```bash
npm install -g @lusc/cli-interval
```

The following example outputs "Hello" to `stdout` every second.

```bash
$ interval -t 1s "echo Hello"
Hello
Hello
# ...
```

The command can also be passed as multiple arguments.

```bash
interval -t 1s "node index.js"
# same as
interval -t 1s "node" "index.js"
```

It aggregates both `stdout` and `stderr` over time, and pipes them into its respective outputs.

It waits for the command to finish, waits the specified delay and runs the command again.

## Arguments

- `-h`, `--help` print the command usage and exit
- `-v`, `--version` print the version and exit
- `-t`, `--interval` specify the interval at which to run the command, e.g.
  - `-t 100` every 100 milliseconds
  - `-t 5s` every 5 seconds
  - `-t 2m` every 2 minutes
  - `-t 1h` every hour
  - Accepts any value that [ms](https://github.com/vercel/ms) can parse.

---

This is a fork of [Tabcorp/cli-interval](https://github.com/Tabcorp/cli-interval).
