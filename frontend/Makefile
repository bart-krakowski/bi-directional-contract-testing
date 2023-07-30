ifneq (,$(wildcard ./.env))
    include .env
    export
endif

ifeq ($(GIT_BRANCH),master)
	DEPLOY_TARGET=deploy
else
	DEPLOY_TARGET=no_deploy
endif

ci:
	GIT_COMMIT=`git rev-parse --short HEAD`+`date +%s` \
	GIT_BRANCH=`git rev-parse --abbrev-ref HEAD` \
	make test publish_pacts can_i_deploy $(DEPLOY_TARGET)

publish_pacts:
	@echo "========== STAGE: publish pacts =========="
	docker-compose run publish_pacts

test:
	@echo "\n========== STAGE: test (msw) ==========\n"
	npm run test

create_environment:
	@"${PACT_CLI}" broker create-environment --name production --production

deploy: deploy_app record_deployment

no_deploy:
	@echo "Not deploying as not on master branch"

can_i_deploy:
	@echo "========== STAGE: can-i-deploy? =========="
	docker-compose run can_i_deploy

deploy_app:
	@echo "\n========== STAGE: deploy ==========\n"
	@echo "Deploying to production"

record_deployment:
	docker-compose run record_deployment
