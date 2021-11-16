install: install-deps

install-deps:
	npm ci
test:
	DEBUG=nock.* npm test
test-coverage:
	npm test -- --coverage --coverageProvider=v8
lint:
	npx eslint .
fix:
	npx eslint . --fix
publish:
	npm publish --dry-run
