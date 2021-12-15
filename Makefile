start:
	npm start

test:
	npm test -s

testSession:
	NODE_OPTIONS=--experimental-vm-modules npx jest ./__tests__/session.test.js

testTopics:
	NODE_OPTIONS=--experimental-vm-modules npx jest ./__tests__/topics.test.js

testComments:
	NODE_OPTIONS=--experimental-vm-modules npx jest ./__tests__/comments.test.js

lint:
	npx eslint .