/* -*- c -*- */
/***********************************************************************
 * This file is part of twine.
 ***********************************************************************
 * Revised BSD License (BSD-3)
 *
 * Copyright (c) 2014, Maxime Chatelle, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *
 *   * Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following
 *     disclaimer in the documentation and/or other materials provided
 *     with the distribution.
 *
 *   * Neither the name of the copyright holder(s) nor the names of its
 *     contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT HOLDER(S) BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 * USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
 * OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
 * SUCH DAMAGE.
 *
 **********************************************************************/
#include "twine.h"

/*====================================================================*/
#suite accessors
/*====================================================================*/

/**********************************************************************/
#tcase non empty twine
/**********************************************************************/
#test length is correct
twine_t *t1 = TWINE("foo");
ck_assert_uint_eq(twlen(t1), 3);

#test capacity is correct
twine_t *t1 = TWINE("foo");
ck_assert_uint_eq(twcap(t1), 3);

#test size is correct
twine_t *t1 = TWINE("foo");
ck_assert_uint_eq(twsize(t1), 4);

#test bytesize is correct
twine_t *t1 = TWINE("foo");
ck_assert_uint_eq(twbytesize(t1), 4 * sizeof(twchar_t));

#test twcstr returns valid c string
twine_t *t1 = TWINE("foo");
ck_assert_str_eq("foo", twcstr(t1));

/**********************************************************************/
#tcase empty twine
/**********************************************************************/
#test length is correct
twine_t *t1 = TWINE("");
ck_assert_uint_eq(twlen(t1), 0);

#test capacity is correct
twine_t *t1 = TWINE("");
ck_assert_uint_eq(twcap(t1), 0);

#test size is correct
twine_t *t1 = TWINE("");
ck_assert_uint_eq(twsize(t1), 1);

#test bytesize is correct
twine_t *t1 = TWINE("");
ck_assert_uint_eq(twbytesize(t1), 1 * sizeof(twchar_t));

#test twcstr returns valid c string
twine_t *t1 = TWINE("");
ck_assert_str_eq("", twcstr(t1));

/**********************************************************************/
#tcase null twine
/**********************************************************************/
#test length is correct
twine_t *t1 = TWINE("");
/* virtually make null twine */
t1->cstr = NULL; t1->size = 0; t1->length = 0;
ck_assert_uint_eq(twlen(t1), 0);

#test capacity is correct
twine_t *t1 = TWINE("");
/* virtually make null twine */
t1->cstr = NULL; t1->size = 0; t1->length = 0;
ck_assert_uint_eq(twcap(t1), 0);

#test size is correct
twine_t *t1 = TWINE("");
/* virtually make null twine */
t1->cstr = NULL; t1->size = 0; t1->length = 0;
ck_assert_uint_eq(twsize(t1), 0);

#test bytesize is correct
twine_t *t1 = TWINE("");
/* virtually make null twine */
t1->cstr = NULL; t1->size = 0; t1->length = 0;
ck_assert_uint_eq(twbytesize(t1), 0 * sizeof(twchar_t));

#test twcstr returns valid c string
twine_t *t1 = TWINE("");
/* virtually make null twine */
t1->cstr = NULL; t1->size = 0; t1->length = 0;
ck_assert_str_eq("", twcstr(t1));

/**********************************************************************/
#tcase mutability
/**********************************************************************/
#test twine are mutable by default
twine_t *t1 = TWINE("foo");
ck_assert_msg(twismutable(t1),
	"Twine should be mutable by default.");

#test twimmutable set the flag correctly
twine_t *t1 = TWINE("foo");
twimmutable(t1);
ck_assert_msg(!twismutable(t1),
	"twimmutable() do not set to immutable flag.");

#test twmutable unset the flag correctly
twine_t *t1 = TWINE("foo");
twimmutable(t1);
twmutable(t1);
ck_assert_msg(twismutable(t1),
	"twmutable() do not unset immutable flag.");

#test twimmutable do not change other flags
twine_t *t1 = TWINE("foo");
twdynamic(t1);
twimmutable(t1);
ck_assert_msg(twisdynamic(t1),
	"twimmutable() should not change other flags.");
twdestroy(t1);

#test twmutable do not change other flags
twine_t *t1 = TWINE("foo");
twdynamic(t1);
twmutable(t1);
ck_assert_msg(twisdynamic(t1),
	"twmutable() should not change other flags.");
twdestroy(t1);
