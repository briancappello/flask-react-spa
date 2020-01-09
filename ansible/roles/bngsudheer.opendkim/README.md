Role Name
=========

Ansbile role to setup opendkim and sign keys.

Dependncies
------------
For EL systems, the opendkim package is available from EPEL. Enable EPEL before
using this role.

Role Variables
--------------
  - dkim_admin_email: The email address of the admin
  - dkim_selector: The name of the dkim selector
  - dkim_domains: List of domain names for which keys have to be signed.

Example Playbook
----------------

Including an example of how to use your role (for instance, with variables passed in as parameters) is always nice for users too:

```yaml
---
  - hosts: all
    vars:
      dkim_selector: default
      dkim_domains:
        - example.com
        - example.org
    roles:
      - role: bngsudheer.opendkim
```
In this example, example.com will be used as primary domain.

Example with EPEL:
```yaml
---
  - hosts: all
    vars:
      admin_email: admin@example.com
      dkim_selector: default
      dkim_domains:
        - example.com
        - example.org
    roles:
      - role: bngsudheer.centos_base
      - role: bngsudheer.opendkim
```

License
-------
BSD

Author Information
------------------
Written by Sudheer Satyanarayana. Originally forked from https://github.com/sunfoxcz/ansible-dkim.
