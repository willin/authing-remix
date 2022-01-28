
.PHONY: clean build test install example
all: build

clean:
	rm -rf `find . -name dist`

install:
	yarn install

build:
	yarn build

test:
	yarn test:cov

example: build
	rm -rf `find ./examples -name node_modules`
	cd ./examples/basic && yarn && yarn dev
