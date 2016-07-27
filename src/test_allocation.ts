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
#suite allocation
/*====================================================================*/

/**********************************************************************/
#tcase twdynamic with on stack twine
/**********************************************************************/
#test dynamic flag is set
twine_t *t1 = TWINE("foo");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_msg(twisdynamic(t1),
	"Dynamic flag should be set.");
twdestroy(t1);

#test content is correctly copied on heap
twine_t *t1 = TWINE("foo");
const twchar_t *oldcstr = twcstr(t1);
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_msg(twcstr(t1) != oldcstr,
	"Content should "
	"not point to the same place.");
twdestroy(t1);

#test appear unchanged
twine_t *t1 = TWINE("foo");
const twchar_t *oldcstr = twcstr(t1);
twsize_t oldlen = twlen(t1);
twsize_t oldsize = twsize(t1);
twsize_t oldcap = twcap(t1);
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), oldcstr);
ck_assert_uint_eq(twlen(t1), oldlen);
ck_assert_uint_eq(twsize(t1), oldsize);
ck_assert_uint_eq(twcap(t1), oldcap);
twdestroy(t1);

/**********************************************************************/
#tcase twdynamic with immutable twine
/**********************************************************************/
#test returns error
twine_t *t1 = TWINE("foo");
twimmutable(t1);
ck_assert_int_eq(twdynamic(t1), TWERR_IMMUTABLE);
twdestroy(t1);

#test content is unchanged
twine_t *t1 = TWINE("foo");
twimmutable(t1);
const twchar_t *oldcstr = twcstr(t1);
ck_assert_int_eq(twdynamic(t1), TWERR_IMMUTABLE);
ck_assert_msg(twcstr(t1) == oldcstr,
	"Content should "
	"point to the same place.");
twdestroy(t1);

#test appear unchanged
twine_t *t1 = TWINE("foo");
twimmutable(t1);
const twchar_t *oldcstr = twcstr(t1);
twsize_t oldlen = twlen(t1);
twsize_t oldsize = twsize(t1);
twsize_t oldcap = twcap(t1);
ck_assert_int_eq(twdynamic(t1), TWERR_IMMUTABLE);
ck_assert_str_eq(twcstr(t1), oldcstr);
ck_assert_uint_eq(twlen(t1), oldlen);
ck_assert_uint_eq(twsize(t1), oldsize);
ck_assert_uint_eq(twcap(t1), oldcap);
twdestroy(t1);

/**********************************************************************/
#tcase twdynamic with dynamic twine
/**********************************************************************/
#test can be called two times
twine_t *t1 = TWINE("foo");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
twdestroy(t1);

#test appear unchanged if called two times
twine_t *t1 = TWINE("foo");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
const twchar_t *oldcstr = twcstr(t1);
twsize_t oldlen = twlen(t1);
twsize_t oldsize = twsize(t1);
twsize_t oldcap = twcap(t1);
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), oldcstr);
ck_assert_uint_eq(twlen(t1), oldlen);
ck_assert_uint_eq(twsize(t1), oldsize);
ck_assert_uint_eq(twcap(t1), oldcap);
twdestroy(t1);

/**********************************************************************/
#tcase twdestroy
/**********************************************************************/
#test non dynamic twine  is truncated
twine_t *t1 = TWINE("foo");
twsize_t oldcap = twcap(t1);
twsize_t oldsize = twsize(t1);
twdestroy(t1);
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twcap(t1), oldcap);
ck_assert_uint_eq(twsize(t1), oldsize);

#test dynamic twine  is freed and appear truncated
twine_t *t1 = TWINE("foo");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
twdestroy(t1);
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twcap(t1), 0);
ck_assert_uint_eq(twsize(t1), 0);

#test immutable twine  is destroyed
twine_t *t1 = TWINE("foo");
twimmutable(t1);
twdestroy(t1);
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_str_eq(twcstr(t1), "");

#test immutable dynamic twine  is destroyed
twine_t *t1 = TWINE("foo");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
twimmutable(t1);
twdestroy(t1);
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twcap(t1), 0);
ck_assert_uint_eq(twsize(t1), 0);

/**********************************************************************/
#tcase twrecap
/**********************************************************************/
#test on stack twine  returns error
twine_t *t1 = TWINE("foo");
ck_assert_msg(twrecap(t1, 10) == TWERR_DYNAMIC,
	"Do not check the dynamic flag correctly.");

#test dynamic twine  set right values
twine_t *t1 = DTWINE();
ck_assert_int_eq(twrecap(t1, 10), TWERR_SUCCESS);
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_uint_eq(twcap(t1), 10);
ck_assert_uint_eq(twsize(t1), 11);
ck_assert_str_eq(twcstr(t1), "");
twdestroy(t1);

#test immutable dynamic twine  returns error
twine_t *t1 = DTWINE();
twimmutable(t1);
ck_assert_msg(twrecap(t1, 10) == TWERR_IMMUTABLE,
	"Do not check immutable flag correctly");

#test enlarge dynamic twine  all fields are OK
twine_t *t1 = TWINE("foo");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_int_eq(twrecap(t1, 10), TWERR_SUCCESS);
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 10);
ck_assert_uint_eq(twsize(t1), 11);
ck_assert_str_eq(twcstr(t1), "foo");
twdestroy(t1);

#test shrink dynamic twine  all fields are OK
twine_t *t1 = TWINE("foobar");
ck_assert_int_eq(twdynamic(t1), TWERR_SUCCESS);
ck_assert_int_eq(twrecap(t1, 3), TWERR_SUCCESS);
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);
ck_assert_str_eq(twcstr(t1), "foo");
twdestroy(t1);
