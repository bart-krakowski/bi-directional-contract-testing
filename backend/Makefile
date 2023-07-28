ifneq (,$(wildcard ./.env))
    include .env
    export
endif

VERSION?=$(shell npx -y absolute-version)
BRANCH?=$(shell git rev-parse --abbrev-ref HEAD)
PACT_BROKER_COMMAND=docker run --rm -v /${PWD}:/${PWD} -w ${PWD} -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli:latest pact-broker
PACTFLOW_CLI_COMMAND=docker run --rm -v /${PWD}:/${PWD} -w ${PWD} -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli:latest pactflow

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
	${PACTFLOW_CLI_COMMAND} publish-provider-contract \
      ${OAS_PATH} \
      --provider ${PACTICIPANT} \
      --provider-app-version ${VERSION} \
      --branch ${BRANCH} \
      --content-type application/yaml \
      --verification-exit-code=${EXIT_CODE} \
      --verification-results ${REPORT_PATH} \
      --verification-results-content-type ${REPORT_FILE_CONTENT_TYPE}\
      --verifier ${VERIFIER_TOOL}


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
	${PACT_BROKER_COMMAND} can-i-deploy \
	--pacticipant ${PACTICIPANT} \
	--version ${VERSION} \
	--to-environment production \
	--retry-while-unknown 6 \
	--retry-interval 10

deploy_app:
	@echo "========== STAGE: deploy 🚀 =========="
	@echo "Deploying to prod"

record_deployment:
	${PACT_BROKER_COMMAND} \
	record_deployment \
	--pacticipant ${PACTICIPANT} \
	--version ${VERSION} \
	--environment production

.PHONY: start stop test