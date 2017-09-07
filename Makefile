build:
	npm run build

html:
	cd docs; make html; cd ..

doc_styles: html
	cd docs; cp -a _static/* _build/html/_static/; cd ..

docs: doc_styles
	python ./docs_dev_server.py

full_deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml; cd ..

deploy_dev: build
	cd ansible; ansible-playbook -i hosts_dev playbooks/main.yaml -t flask.deploy; cd ..

.PHONY: build docs doc_styles html deploy_dev full_deploy_dev
