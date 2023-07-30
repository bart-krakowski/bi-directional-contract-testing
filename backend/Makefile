ifneq (,$(wildcard ./.env))
    include .env
    export
endif

VERSION?=$(shell npx -y absolute-version)
BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)

OAS_PATH=oas/swagger.yml
REPORT_PATH?=$(shell ls oas/*)
REPORT_FILE_CONTENT_TYPE?=text/plain
VERIFIER_TOOL?=tap

install: yarn install

test:
	@echo "========== STAGE: test 🧪 =========="
	@echo "Running tests to test locally running provider"
	@yarn run test

ci: test_and_publish can_i_deploy $(DEPLOY_TARGET)

test_and_publish:
	@if make test; then \
		EXIT_CODE=0 make publish_provider_contract; \
	else \
		EXIT_CODE=1 make publish_provider_contract; \
	fi; \

publish_provider_contract:
	@echo "========== STAGE: publish-provider-contract (spec + results) =========="
	@echo "EXIT_CODE" ${EXIT_CODE}
	VERSION=$(shell npx -y absolute-version) \
	BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
	docker-compose run publish_provider_contract

ifneq ($(filter $(BRANCH),main master),)
	DEPLOY_TARGET=deploy
else
	DEPLOY_TARGET=no_deploy
endif

deploy: deploy_app record_deployment
deploy_target: can_i_deploy $(DEPLOY_TARGET)
no_deploy:
	@echo "Not deploying as not on master branch"

can_i_deploy:
	@echo "========== STAGE: can-i-deploy? 🌉 =========="
	docker-compose run can_i_deploy

deploy_app:
	@echo "========== STAGE: deploy 🚀 =========="
	@echo "Deploying to prod"

record_deployment:
	docker-compose run record_deployment

.PHONY: start stop test