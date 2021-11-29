start:
	node server/bin/server.js

test:
	npm test -s

lint:
	npx eslint .