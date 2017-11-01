build:
	npm run build

html:
	cd docs; make clean; make html; cd ..

doc_styles: html
	cd docs; cp -a _static/* _build/html/_static/; cd ..

docs: doc_styles
	python ./docs_dev_server.py

deploy_prod: build
	cd ansible; ansible-playbook -i hosts_prod playbooks/main.yaml; cd ..

quick_deploy_prod: build
	cd ansible; ansible-playbook -i hosts_prod playbooks/main.yaml -t flask.deploy; cd ..

deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml; cd ..

quick_deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml -t flask.deploy; cd ..

.PHONY: build docs doc_styles html deploy_dev quick_deploy_dev deploy_prod quick_deploy_prod
