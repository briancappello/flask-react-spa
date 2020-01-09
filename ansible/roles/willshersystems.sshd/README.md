OpenSSH Server
==============

[![Build Status](https://travis-ci.org/willshersystems/ansible-sshd.svg?branch=master)](https://travis-ci.org/willshersystems/ansible-sshd) [![Ansible Galaxy](http://img.shields.io/badge/galaxy-willshersystems.sshd-660198.svg?style=flat)](https://galaxy.ansible.com/willshersystems/sshd/)

This role configures the OpenSSH daemon. It:

* By default configures the SSH daemon with the normal OS defaults.
* Works across a variety of UN*X like distributions
* Can be configured by dict or simple variables
* Supports Match sets
* Supports all sshd_config options. Templates are programmatically generated.
  (see [meta/make_option_list](meta/make_option_list))
* Tests the sshd_config before reloading sshd.

**WARNING** Misconfiguration of this role can lock you out of your server!
Please test your configuration and its interaction with your users configuration
before using in production!

**WARNING** Digital Ocean allows root with passwords via SSH on Debian and
Ubuntu. This is not the default assigned by this module - it will set
`PermitRootLogin without-password` which will allow access via SSH key but not
via simple password. If you need this functionality, be sure to set
`ssh_PermitRootLogin yes` for those hosts.

Requirements
------------

Tested on:

* Ubuntu precise, trusty
* Debian wheezy, jessie
* FreeBSD 10.1
* EL 6,7 derived distributions
* Fedora 22, 23
* OpenBSD 6.0
* AIX 7.1, 7.2

It will likely work on other flavours and more direct support via suitable
[vars/](vars/) files is welcome.

Role variables
---------------

Unconfigured, this role will provide a sshd_config that matches the OS default,
minus the comments and in a different order.

* `sshd_enable`

If set to False, the role will be completely disabled. Defaults to True.

* `sshd_skip_defaults`

If set to True, don't apply default values. This means that you must have a
complete set of configuration defaults via either the sshd dict, or sshd_Key
variables. Defaults to *False*.

* `sshd_manage_service`

If set to False, the service/daemon won't be **managed** at all, i.e. will not
try to enable on boot or start or reload the service.  Defaults to *True*
unless: Running inside a docker container (it is assumed ansible is used during
build phase) or AIX (Ansible `service` module does not currently support `enabled` 
for AIX)

* `sshd_allow_reload`

If set to False, a reload of sshd wont happen on change. This can help with
troubleshooting. You'll need to manually reload sshd if you want to apply the
changed configuration. Defaults to the same value as ``sshd_manage_service``. 
(Except on AIX, where `sshd_manage_service` is default *False*, but 
`sshd_allow_reload` is default *True*)

* `sshd_install_service`

If set to True, the role will install service files for the ssh service.
Defaults to False.

The templates for the service files to be used are pointed to by the variables

  - `sshd_service_template_service` (__default__: _templates/sshd.service.j2_)
  - `sshd_service_template_at_service` (__default__: _templates/sshd@.service.j2_)
  - `sshd_service_template_socket` (__default__: _templates/sshd.socket.j2_)

Using these variables, you can use your own custom templates. With the above
default templates, the name of the installed ssh service will be provided by
the `sshd_service` variable.

* sshd

A dict containing configuration.  e.g.

```yaml
sshd:
  Compression: delayed
  ListenAddress:
    - 0.0.0.0
```

* `ssh_...`

Simple variables can be used rather than a dict. Simple values override dict
values. e.g.:

```yaml
sshd_Compression: off
```

In all cases, booleans correctly rendered as yes and no in sshd configuration.
Lists can be used for multiline configuration items. e.g.

```yaml
sshd_ListenAddress:
  - 0.0.0.0
  - '::'
```

Renders as:

```
ListenAddress 0.0.0.0
ListenAddress ::
```

* `sshd_match`

A list of dicts for a match section. See the example playbook.

* `sshd_match_1` through `sshd_match_9`

A list of dicts or just a dict for a Match section.

### Secondary role variables

These variables are used by the role internals and can be used to override the
defaults that correspond to each supported platform.

* `sshd_packages`

Use this variable to override the default list of packages to install.

* `sshd_config_owner`, `sshd_config_group`, `sshd_config_mode`

Use these variables to set the ownership and permissions for the openssh config
file that this role produces.

* `sshd_config_file`

The path where the openssh configuration produced by this role should be saved.

* `sshd_binary`

The path to the openssh executable

* `sshd_service`

The name of the openssh service. By default, this variable contains the name of
the ssh service that the target platform uses. But it can also be used to set
the name of the custom ssh service when the `sshd_install_service` variable is
used.


Dependencies
------------

None

Example Playbook
----------------

**DANGER!** This example is to show the range of configuration this role
provides. Running it will likely break your SSH access to the server!

```yaml
---
- hosts: all
  vars:
    sshd_skip_defaults: true
    sshd:
      Compression: true
      ListenAddress:
        - "0.0.0.0"
        - "::"
      GSSAPIAuthentication: no
      Match:
        - Condition: "Group user"
          GSSAPIAuthentication: yes
    sshd_UsePrivilegeSeparation: no
    sshd_match:
        - Condition: "Group xusers"
          X11Forwarding: yes
  roles:
    - role: willshersystems.sshd
```

Results in:

```
# Ansible managed: ...
Compression yes
GSSAPIAuthentication no
UsePrivilegeSeparation no
Match Group user
  GSSAPIAuthentication yes
Match Group xusers
  X11Forwarding yes
```

Template Generation
-------------------

The [sshd_config.j2](templates/sshd_config.j2) template is programatically
generated by the scripts in meta. New options should be added to the
options_body or options_match.

To regenerate the template, from within the meta/ directory run:
`./make_option_list >../templates/sshd_config.j2`

License
-------

LGPLv3


Author
------

Matt Willsher <matt@willsher.systems>

&copy; 2014,2015 Willsher Systems Ltd.
