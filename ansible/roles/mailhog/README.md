## mailhog

[![Build Status](https://travis-ci.org/Oefenweb/ansible-mailhog.svg?branch=master)](https://travis-ci.org/Oefenweb/ansible-mailhog) [![Ansible Galaxy](http://img.shields.io/badge/ansible--galaxy-mailhog-blue.svg)](https://galaxy.ansible.com/Oefenweb/mailhog/)

Set up (the latest version of) [MailHog](https://github.com/mailhog/MailHog) in Ubuntu systems.

#### Requirements

None

#### Variables

* `mailhog_version` [default: `v1.0.0`]: Version to install
* `mailhog_install_prefix` [default: `/usr/local/bin`]: Install prefix

* `mailhog_user` [default: `mailhog`]: The user that will run the `mailhog` daemon
* `mailhog_group` [default: `mailhog`]: The primary group of the `mailhog` user
* `mailhog_groups` [default: `[]`]: The secondary groups of the `mailhog` user

* `mailhog_options: {}`]: Options to pass to the `mailhog` daemon (e.g. `{hostname: mailhog.test}`)

## Dependencies

None

#### Example (without any options)

```yaml
---
- hosts: all
  roles:
    - mailhog
```

#### Example (with daemon options)

```yaml
---
- hosts: all
  roles:
    - mailhog
  vars:
    mailhog_options:
      hostname: "{{ inventory_hostname }}"
      api-bind-addr: 127.0.0.1:8025
      ui-bind-addr: 127.0.0.2:8025
      smtp-bind-addr: 127.0.0.3:1025
```
#### License

MIT

#### Author Information

Mischa ter Smitten

#### Feedback, bug-reports, requests, ...

Are [welcome](https://github.com/Oefenweb/ansible-mailhog/issues)!
