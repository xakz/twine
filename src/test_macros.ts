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
#suite macros
/*====================================================================*/

/**********************************************************************/
#tcase TWINECAP with exact capacity
/**********************************************************************/
#test is mutable
twine_t *t1 = TWINECAP("foo", 3);
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = TWINECAP("foo", 3);
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = TWINECAP("foo", 3);
ck_assert_str_eq(twcstr(t1), "foo");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test is null terminated
twine_t *t1 = TWINECAP("foo", 3);
const char *str = twcstr(t1);
ck_assert_int_eq(str[3], '\0');

/**********************************************************************/
#tcase TWINECAP with large capacity
/**********************************************************************/
#test is mutable
twine_t *t1 = TWINECAP("foo", 10);
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = TWINECAP("foo", 10);
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = TWINECAP("foo", 10);
ck_assert_str_eq(twcstr(t1), "foo");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 10);
ck_assert_uint_eq(twsize(t1), 11);

#test is null terminated
twine_t *t1 = TWINECAP("foo", 10);
const char *str = twcstr(t1);
ck_assert_int_eq(str[3], '\0');

/**********************************************************************/
#tcase TWINECAP with small capacity
/**********************************************************************/
#test is mutable
twine_t *t1 = TWINECAP("foo", 1);
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = TWINECAP("foo", 1);
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = TWINECAP("foo", 1);
ck_assert_str_eq(twcstr(t1), "foo");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test is null terminated
twine_t *t1 = TWINECAP("foo", 1);
const char *str = twcstr(t1);
ck_assert_int_eq(str[3], '\0');

/**********************************************************************/
#tcase TWINECAP with zero capacity and empty string
/**********************************************************************/
#test is mutable
twine_t *t1 = TWINECAP("", 0);
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = TWINECAP("", 0);
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = TWINECAP("", 0);
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_uint_eq(twcap(t1), 0);
ck_assert_uint_eq(twsize(t1), 1);

#test is null terminated
twine_t *t1 = TWINECAP("", 0);
const char *str = twcstr(t1);
ck_assert_int_eq(str[0], '\0');

/**********************************************************************/
#tcase TWINE non empty string
/**********************************************************************/
#test is mutable
twine_t *t1 = TWINE("foo");
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = TWINE("foo");
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = TWINE("foo");
ck_assert_str_eq(twcstr(t1), "foo");
ck_assert_uint_eq(twlen(t1), 3);
ck_assert_uint_eq(twcap(t1), 3);
ck_assert_uint_eq(twsize(t1), 4);

#test is null terminated
twine_t *t1 = TWINE("foo");
const char *str = twcstr(t1);
ck_assert_int_eq(str[3], '\0');

/**********************************************************************/
#tcase TWINE empty string
/**********************************************************************/
#test is mutable
twine_t *t1 = TWINE("");
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = TWINE("");
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = TWINE("");
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_uint_eq(twcap(t1), 0);
ck_assert_uint_eq(twsize(t1), 1);

#test is null terminated
twine_t *t1 = TWINE("");
const char *str = twcstr(t1);
ck_assert_int_eq(str[0], '\0');

/**********************************************************************/
#tcase ETWINE zero capacity
/**********************************************************************/
#test is mutable
twine_t *t1 = ETWINE(0);
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = ETWINE(0);
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = ETWINE(0);
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_uint_eq(twcap(t1), 0);
ck_assert_uint_eq(twsize(t1), 1);

#test is null terminated
twine_t *t1 = ETWINE(0);
const char *str = twcstr(t1);
ck_assert_int_eq(str[0], '\0');

/**********************************************************************/
#tcase ETWINE non zero capacity
/**********************************************************************/
#test is mutable
twine_t *t1 = ETWINE(10);
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is not dynamic
twine_t *t1 = ETWINE(10);
ck_assert_msg(!twisdynamic(t1), "The twine should not be dynamic.");

#test is correctly initialized
twine_t *t1 = ETWINE(10);
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_uint_eq(twcap(t1), 10);
ck_assert_uint_eq(twsize(t1), 11);

#test is null terminated
twine_t *t1 = ETWINE(10);
const char *str = twcstr(t1);
ck_assert_int_eq(str[0], '\0');

/**********************************************************************/
#tcase DTWINE
/**********************************************************************/
#test is mutable
twine_t *t1 = DTWINE();
ck_assert_msg(twismutable(t1), "The twine should be mutable.");

#test is dynamic
twine_t *t1 = DTWINE();
ck_assert_msg(twisdynamic(t1), "The twine should be dynamic.");

#test is correctly initialized
twine_t *t1 = DTWINE();
ck_assert_str_eq(twcstr(t1), "");
ck_assert_uint_eq(twlen(t1), 0);
ck_assert_uint_eq(twcap(t1), 0);
ck_assert_uint_eq(twsize(t1), 0);

#test is null terminated
twine_t *t1 = DTWINE();
const char *str = twcstr(t1);
ck_assert_int_eq(str[0], '\0');
