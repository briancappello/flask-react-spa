# Ansible Deployment Scripts

Ansible on the local machine should be at version 2.2+. The stack is pretty basic:

- CentOS 7.3
- Python 3.6
- uWSGI + NGINX
- PostgreSQL 9.6

There are three supported environments: `dev`, `staging`, and `prod`. These are specified through the `app_env` variable in the inventory files (`hosts_<env>` in the `ansible` directory).

## Local development using VMs

See `dev-scripts/README`, or you can use Vagrant / VirtualBox / etc to set up your own virtual machines.

```bash
# first run only
$ ansible-playbook -i hosts_dev playbooks/create-deploy-user.yaml

# full provision & deploy
$ ansible-playbook -i hosts_dev playbooks/main.yaml
```

## Deployment to staging

!! FIXME !!

```bash
$ ansible-playbook -i hosts_staging playbooks/main.yaml
```

## Deployment to production

!! FIXME !!

```bash
$ ansible-playbook -i hosts_prod playbooks/main.yaml
```

## Supported Tags

!! FIXME !!
