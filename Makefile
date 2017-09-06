build:
	npm run build

full_deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml; cd ..

deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml -t flask.deploy; cd ..

.PHONY: build deploy_dev full_deploy_dev
