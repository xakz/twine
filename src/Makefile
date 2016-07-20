########################################################################
# The MIT License (MIT)
#
# Copyright (c) 2013, Maxime Chatelle, All rights reserved.
#
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation files
# (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge,
# publish, distribute, sublicense, and/or sell copies of the Software,
# and to permit persons to whom the Software is furnished to do so,
# subject to the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
# BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
# ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
# CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
########################################################################

CFLAGS		:= -g -O0 -Wall -Wextra -std=c99
LDLIBS		:=
LDFLAGS		:=

CHECKGEN	:= ./checkgen
RUNNER		:= test_runner
TESTS		:= $(wildcard *.ts)

SRCS		:= twine.c
OBJS		:= $(SRCS:.c=.o)

all: test

# unit testing
$(RUNNER).c: $(TESTS)
	$(CHECKGEN) $^ > $@
$(RUNNER).o: $(RUNNER).c
	$(CC) $(CFLAGS) $(shell pkg-config --cflags check) $< -c -o $@
$(RUNNER): $(RUNNER).o $(OBJS)
	$(CC) $(LDFLAGS) $^ $(LDLIBS) $(shell pkg-config --libs check) -o $@
test: $(RUNNER)
	./$<

# cleanup
clean:
	rm -f $(RUNNER).c $(RUNNER).o $(OBJS)
distclean: clean
	rm -f $(RUNNER)


.PHONY: all clean distclean test
