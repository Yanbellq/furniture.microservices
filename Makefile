include .env
export

export PROJECT_ROOT=.

env-up:
	docker compose -f docker/docker-compose.yaml -p furniture-lab up -d

env-down:
	docker compose -f docker/docker-compose.yaml -p furniture-lab down