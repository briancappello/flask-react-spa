# Ansible Role: Redis

[![Build Status](https://travis-ci.org/sbaerlocher/ansible.redis.svg?branch=master)](https://travis-ci.org/sbaerlocher/ansible.redis) [![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://sbaerlo.ch/licence) [![Ansible Galaxy](http://img.shields.io/badge/ansible--galaxy-redis-blue.svg)](https://galaxy.ansible.com/sbaerlocher/redis)

## Description

Ansible role for installing [Redis](http://redis.io/) on installs RHEL/CentOS, Debian/Ubuntu or Arch Linux.

## Installation

```bash
ansible-galaxy install sbaerlocher.redis
```

## Requirements

None

## Role Variables

| Variable             | Default     | Comments (type)                                   |
| :---                 | :---        | :---                                              |
| ```redis_port```| ```6379``` | port and interface on which Redis will listen. Set the interface to `0.0.0.0` to listen on all interfaces |
| ```redis_bind_interface``` | ```127.0.0.1``` |  |
| ```redis_unixsocket:``` | ```' '``` | if set, Redis will also listen on a local Unix socket |
| ```redis_timeout``` | ```300``` | close a connection after a client is idle `N` seconds. Set to `0` to disable timeout |
| ```redis_loglevel``` | ```"notice"``` | log level (valid levels are `debug`, `verbose`, `notice`, and `warning`) |
| ```redis_logfile``` | ```/var/log/redis/redis-server.log``` | log location   |
| ```redis_databases``` | ```16``` | the number of Redis databases |
| ```redis_save``` | ```- 900 1``` | snapshotting configuration; setting values in this list will save the database to disk if the given number of seconds (e.g. `900`) and the given number of write operations (e.g. `1`) have occurred. |
| | ```- 300 10```  | |
| | ```- 300 10``` | |
| ```redis_rdbcompression``` |  ```"yes"``` | database compression |
| ```redis_dbfilename``` | ```dump.rdb``` | filename |
| ```redis_dbdir``` | ```/var/lib/redis``` | fieldir |
| ```redis_maxmemory``` | ```0``` | limit memory usage to the specified amount of bytes. Leave at 0 for unlimited |
| ```redis_maxmemory_policy``` | ```"noeviction"``` | the method to use to keep memory usage below the limit, if specified. See [Using Redis as an LRU cache](http://redis.io/topics/lru-cache) |
| ```redis_maxmemory_samples``` | ```5``` | number of samples to use to approximate LRU. See [Using Redis as an LRU cache](http://redis.io/topics/lru-cache) |
| ```redis_appendonly``` | ```"no"``` | the appendonly option, if enabled, affords better data durability guarantees, at the cost of slightly slower performance |
| ```redis_appendfsync``` | ```"everysec"``` |  valid values are `always` (slower, safest), `everysec` (happy medium), or `no` (let the filesystem flush data when it wants, most risky) |
| ```redis_includes``` | ```[]``` | add extra include file paths to this list to include more/localized Redis configuration |

## Dependencies

None

## Example Playbook

```yml
    - hosts: all
      roles:
        - sbaerlocher.redis
```

## Changelog

### 1.3

* add new standarts
* add new syntax

### 1.2

* add package manager for generic OS

### 1.1

* add travis
* fix travis problems

### 1.0

* Initial release

## Author

* [Simon Bärlocher](https://sbaerlocher.ch)

## License

This project is under the MIT License. See the [LICENSE](https://sbaerlo.ch/licence) file for the full license text.

## Copyright

(c) 2016, Simon Bärlocher