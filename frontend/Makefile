ifneq (,$(wildcard ./.env))
    include .env
    export
endif

PACT_CLI="docker run --rm -v ${PWD}:${PWD} -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli"
VERSION?=$(shell npx -y absolute-version)
GIT_COMMIT=$(shell git rev-parse --short HEAD)
GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD)

ifeq ($(GIT_BRANCH),master)
	DEPLOY_TARGET=deploy
else
	DEPLOY_TARGET=no_deploy
endif

ci: test publish_pacts can_i_deploy $(DEPLOY_TARGET)

publish_pacts: .env
	@echo "========== STAGE: publish pacts =========="
	@"${PACT_CLI}" publish ${PWD}/pacts --consumer-app-version ${GIT_COMMIT} --branch ${GIT_BRANCH}

test: .env
	@echo "========== STAGE: test (msw) 🧪 =========="
	npm run test

deploy: deploy_app record_deployment

no_deploy:
	@echo "Not deploying as not on master branch"

can_i_deploy: .env
	@echo "========== STAGE: can-i-deploy? =========="
	@"${PACT_CLI}" broker can-i-deploy \
	  --pacticipant ${PACTICIPANT} \
	  --version ${GIT_COMMIT} \
	  --to-environment production \
	  --retry-while-unknown 6 \
	  --retry-interval 10

deploy_app:
	@echo "========== STAGE: deploy =========="
	@echo "Deploying to production"

record_deployment: .env
	@"${PACT_CLI}" broker record-deployment --pacticipant ${PACTICIPANT} --version ${GIT_COMMIT} --environment production
