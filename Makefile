build:
	npm run build

deploy_prod: build
	cd ansible; ansible-playbook -i hosts_prod playbooks/main.yaml; cd ..

quick_deploy_prod: build
	cd ansible; ansible-playbook -i hosts_prod playbooks/main.yaml -t flask.deploy; cd ..

deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml; cd ..

quick_deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml -t flask.deploy; cd ..

.PHONY: build deploy_dev quick_deploy_dev deploy_prod quick_deploy_prod
