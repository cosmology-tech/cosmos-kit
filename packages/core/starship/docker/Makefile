

.PHONY: setup
setup: 
	docker buildx create --use

.PHONY: build
build:
	docker buildx build --platform linux/amd64,linux/arm64 -t pyramation/osmosis:v16.1.0 . --push
