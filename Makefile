
SRC = $(wildcard *.js)

build: components touchit.css $(SRC)
	@component build -v

components:
	@component install

clean:
	rm -fr build components

.PHONY: clean
