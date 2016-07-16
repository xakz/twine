

test:
	$(MAKE) -C src test
doc:
	doxygen
clean:
	$(MAKE) -C src clean
distclean:
	$(MAKE) -C src distclean
	rm -rf doc/*

.PHONY: test doc distclean clean
