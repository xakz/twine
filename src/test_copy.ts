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
#suite copy
/*====================================================================*/

/**********************************************************************/
#tcase twncpy
/**********************************************************************/
#test on stack twine and exact length  copy is OK
twine_t *t1 = TWINE("foo");
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twncpy(t1, t2, 3), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), twcstr(t2));
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test on stack twine and larger length  copy is OK
twine_t *t1 = TWINE("foo");
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twncpy(t1, t2, 10), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), twcstr(t2));
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test on stack twine and smaller length  copy is OK
twine_t *t1 = TWINE("foo");
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twncpy(t1, t2, 2), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), "ba");
ck_assert_uint_eq(twlen(t1), 2);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test on stack too small twine and exact length  returns error
twine_t *t1 = TWINE("f");
twine_t *t2 = TWINE("bar");
ck_assert_msg(twncpy(t1, t2, 3) == TWERR_TOOSMALL,
	"Length checking is bugged.");
ck_assert_str_eq(twcstr(t1), "f");
ck_assert_uint_eq(twlen(t1), 1);
ck_assert_uint_eq(twcap(t1), 1);
ck_assert_uint_eq(twsize(t1), 2);

#test on stack too small twine and exact length for destination  returns success
twine_t *t1 = TWINE("f");
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twncpy(t1, t2, 1), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), "b");
ck_assert_uint_eq(twlen(t1), 1);
ck_assert_uint_eq(twcap(t1), 1);
ck_assert_uint_eq(twsize(t1), 2);

#test dynamic twine  succeed
twine_t *t1 = DTWINE();
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twncpy(t1, t2, 3), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), "bar");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);
twdestroy(t1);

#test immutable twine  returns error
twine_t *t1 = TWINE("foo");
twine_t *t2 = TWINE("bar");
twimmutable(t1);
ck_assert_msg(twncpy(t1, t2, 3) == TWERR_IMMUTABLE,
	"Bad checking of the immutable flag.");
ck_assert_str_eq(twcstr(t1), "foo");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

/**********************************************************************/
#tcase twcpy
/**********************************************************************/
#test on stack twine  copy is OK
twine_t *t1 = TWINE("foo");
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twcpy(t1, t2), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), twcstr(t2));
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test on stack too small twine  returns error
twine_t *t1 = TWINE("f");
twine_t *t2 = TWINE("bar");
ck_assert_msg(twcpy(t1, t2) == TWERR_TOOSMALL,
	"Length checking is bugged.");
ck_assert_str_eq(twcstr(t1), "f");
ck_assert_uint_eq(twlen(t1), 1);
ck_assert_uint_eq(twcap(t1), 1);
ck_assert_uint_eq(twsize(t1), 2);

#test dynamic twine  succeed
twine_t *t1 = DTWINE();
twine_t *t2 = TWINE("bar");
ck_assert_int_eq(twcpy(t1, t2), TWERR_SUCCESS);
ck_assert_str_eq(twcstr(t1), "bar");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);
twdestroy(t1);

#test immutable twine  returns error
twine_t *t1 = TWINE("foo");
twine_t *t2 = TWINE("bar");
twimmutable(t1);
ck_assert_msg(twcpy(t1, t2) == TWERR_IMMUTABLE,
	"Bad checking of the immutable flag.");
ck_assert_str_eq(twcstr(t1), "foo");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);
