COMPILER = uglifyjs
LINT = jshint
TEST = vows

all: wkb.js wkb.min.js

wkb.js: src/preamble.js \
		src/types.js \
		src/utils.js \
		src/factory.js \
		src/geometry.js \
		src/geometries/linearring.js \
		src/geometries/linestring.js \
		src/geometries/polygon.js \
		src/geometry_collection.js \
		src/reader.js

wkb.js: Makefile
	cat $(filter %.js, $^) > $@

wkb.min.js: wkb.js
	$(COMPILER) $^ > $@

lint: wkb.js
	$(LINT) $^

#test:

.PHONY: lint all
