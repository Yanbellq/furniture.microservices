include .env
export

export PROJECT_ROOT=.

env-up:
	docker compose -f docker/docker-compose.yaml up -d

env-down:
	docker compose -f docker/docker-compose.yaml down