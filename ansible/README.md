# Ansible Deployment Scripts

Ansible on the local machine should be at version 2.2+. The stack is pretty basic:

- CentOS 7.4
- Python 3.6
- uWSGI + NGINX
- PostgreSQL 9.6

There are two supported environments: `dev` and `prod`. These are specified through the `app_env` variable in the inventory files (`hosts_<env>` in the `ansible` directory).

## Local development using VMs

See `dev-scripts/README`, or you can use Vagrant / VirtualBox / etc to set up your own virtual machines.

```bash
# first run only
$ ansible-playbook -i hosts_dev playbooks/create-deploy-user.yaml

# full provision & deploy
$ ansible-playbook -i hosts_dev playbooks/main.yaml
```

## Deployment to production

Update `ansible/hosts_prod` to reflect your desired deployment destination.

Create the `ansible/secrets.yaml` file:

```bash
$ cd ansible
$ ansible-vault create secrets.yaml
```

At a minimum, you will want to define the following variables:

```yaml
---
FLASK_SECRET_KEY: 'the result of python -c "import os; print(os.urandom(32))"'
FLASK_DATABASE_NAME: 'some_database_name'
FLASK_DATABASE_USER: 'some_user_name'
FLASK_DATABASE_PASSWORD: 'some_secret_password'
```

And then from the project root directory:
```bash
$ make deploy_prod

# which is equivalent to:
$ npm run build
$ cd ansible; ansible-playbook -i hosts_prod playbooks/main.yaml
```

## Supported Tags

Tags should only be used after a full provision and deploy has been performed. (They will not work as expected on a fresh server.)

- flask (runs all flask-related tasks)
- flask.deploy (deploy an update to the flask application)
- flask.run_migrations (runs flask migrations)
- flask.run_fixtures (runs flask fixtures)
- flask.static_files (updates static files from local dir)
- flask.import_articles (updates articles from local dir)

Tags are specified by passing the `-t` argument to `ansible-playbook`. For example:

```bash
$ cd ansible; ansible-playbook -i hosts_prod playbooks/main.yaml -t flask.deploy
```
