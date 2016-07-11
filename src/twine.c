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
#include <stddef.h>
#include <string.h>
#include <stdlib.h>

/* Initialize default allocating function pointers */
static void *(*twrealloc)(void *, size_t) = realloc;
static void (*twfree)(void *) = free;

/**
 * Set allocator functions.
 *
 * @param a	The allocator function, with same signature and
 *		behavior than realloc().
 * @param f	The deallocator function, with same signature and
 *		behavior than free().
 */
void
twine_set_allocator_functions(void *(*a)(void *, size_t), void (*f)(void *))
{
	twrealloc = a;
	twfree = f;
}

/**
 * @brief Switch to DYNAMIC.
 *
 * @note Complexity O(n).
 *
 * @warning Dynamic @e Twine must be destroyed using twdestroy().
 *
 * @param tw		A @e twine.
 *
 * @retval TWERR_SUCCESS	Operation succeed.
 * @retval TWERR_IMMUTABLE	The @e twine is IMMUTABLE.
 * @retval TWERR_NOMEM	Memory allocation failed.
 *
 * @see twdestroy
 */
twerr_t
twdynamic(twine_t *tw)
{
	if (!twismutable(tw))
		return TWERR_IMMUTABLE;
	if (twisdynamic(tw))
		return TWERR_SUCCESS;
	twsize_t len = twlen(tw);
	if (len > TWCAP_MAX)
		len = TWCAP_MAX;
	void *ptr = twrealloc(NULL, (size_t)len + 1 * sizeof(twchar_t));
	if (ptr == NULL)
		return TWERR_NOMEM;
	tw->flags |= TWFLAG_DYNAMIC;
	memcpy(ptr, tw->cstr, len * sizeof(twchar_t));
	tw->cstr = ptr;
	tw->cstr[len] = '\0';
	return TWERR_SUCCESS;
}

/**
 * @brief Change capacity.
 *
 * Only usable with DYNAMIC @e twines.
 *
 * @note Complexity O(n).
 *
 * @param tw		A @e twine.
 * @param newcap	New desired capacity.
 *
 * @retval TWERR_SUCCESS	Operation succeed.
 * @retval TWERR_DYNAMIC	The @e twine is not DYNAMIC.
 * @retval TWERR_IMMUTABLE	The @e twine is IMMUTABLE.
 * @retval TWERR_NOMEM	Memory allocation failed.
 * @retval TWERR_OVERFLOW	@b newcap is too large.
 */
twerr_t
twrecap(twine_t *tw, twsize_t newcap)
{
	if (!twisdynamic(tw))
		return TWERR_DYNAMIC;
	if (!twismutable(tw))
		return TWERR_IMMUTABLE;
	/* avoid integer overflow */
	if (newcap > TWCAP_MAX)
		return TWERR_OVERFLOW;
	void *ptr = twrealloc(tw->cstr,
			((size_t)newcap + 1) * sizeof(twchar_t));
	if (ptr == NULL)
		return TWERR_NOMEM;
	if (newcap < tw->length)
		tw->length = newcap;
	tw->size = newcap + 1;
	tw->cstr = ptr;
	tw->cstr[tw->length] = '\0';
	return TWERR_SUCCESS;
}

/**
 * @brief Free used resources.
 *
 * Non DYNAMIC @e twine are truncated.  IMMUTABLE @e twines will
 * be destroyed disregard the IMMUTABLE flag.  Flags are left untouched.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 */
void
twdestroy(twine_t *tw)
{
	if (twisdynamic(tw)) {
		if (tw->cstr != NULL)
			twfree(tw->cstr);
		tw->length = 0;
		tw->size = 0;
		tw->cstr = NULL;
	} else {
		tw->length = 0;
		tw->cstr[0] = '\0';
	}
}

/**
 * @brief Copy of a @e twine to an other.
 *
 * @param dest		Destination @e twine.
 * @param src		Source @e twine.
 *
 * @retval TWERR_SUCCESS	Operation succeed.
 * @retval TWERR_TOOSMALL	The destination @e twine is too small
 *				and is not DYNAMIC.
 * @retval TWERR_IMMUTABLE	The destination @e twine is IMMUTABLE.
 * @retval TWERR_NOMEM		Memory allocation failed.
 */
twerr_t
twcpy(twine_t *dest, const twine_t *src)
{
	return twsubreplace(dest, 0, twlen(dest), src, 0, twlen(src));
}

/**
 * @brief Partial copy of a @e twine to an other.
 *
 * @param dest		Destination @e twine.
 * @param src		Source @e twine.
 * @param len		Desired part length to copy.
 *
 * @retval TWERR_SUCCESS	Operation succeed.
 * @retval TWERR_TOOSMALL	The destination @e twine is too small
 *				and is not DYNAMIC.
 * @retval TWERR_IMMUTABLE	The destination @e twine is IMMUTABLE.
 * @retval TWERR_NOMEM		Memory allocation failed.
 */
twerr_t
twncpy(twine_t *dest, const twine_t *src, twsize_t len)
{
	return twsubreplace(dest, 0, twlen(dest), src, 0, len);
}

/**
 * @brief Extract a @e subtwine to an other one.
 *
 * @param dest		Destination @e twine.
 * @param src		Source @e twine.
 * @param start		Index of the first character of the @e subtwine.
 * @param len		Length of the @e subtwine.
 *
 * @retval TWERR_SUCCESS	Operation succeed.
 * @retval TWERR_TOOSMALL	The destination @e twine is too small
 *				and is not DYNAMIC.
 * @retval TWERR_IMMUTABLE	The destination @e twine is IMMUTABLE.
 * @retval TWERR_NOMEM		Memory allocation failed.
 */
twerr_t
twsub(twine_t *dest, const twine_t *src, twsize_t start, twsize_t len)
{
	return twsubreplace(dest, 0, twlen(dest), src, start, len);
}

twerr_t
twsubreplace(twine_t *dest, twsize_t dstart, twsize_t dlen,
	const twine_t *src, twsize_t sstart, twsize_t slen)
{
	if (!twismutable(dest))
		return TWERR_IMMUTABLE;
	/* Clamps position parameters. */
	if (dstart > twlen(dest))
		dstart = twlen(dest);
	if (dlen > twlen(dest) - dstart)
		dlen = twlen(dest) - dstart;
	if (sstart > twlen(src))
		sstart = twlen(src);
	if (slen > twlen(src) - sstart)
		slen = twlen(src) - sstart;

	/* Avoids integer overflow. */
	if (TWSIZE_MAX - slen < twlen(dest) - dlen)
		return TWERR_OVERFLOW;
	twsize_t newlen = twlen(dest) - dlen + slen;
	if (newlen > twcap(dest)) {
		if (twisdynamic(dest)) {
			twerr_t err = twrecap(dest, newlen);
			if (err != TWERR_SUCCESS)
				return err;
		} else {
			return TWERR_TOOSMALL;
		}
	}
	/* Makes space for the source sub-twine. */
	if (dlen) {
		memmove(dest->cstr + dstart + slen, dest->cstr + dstart + dlen,
			(twlen(dest) - dstart - dlen + 1) * sizeof(twchar_t));
	}
	memcpy(dest->cstr + dstart, src->cstr + sstart,
		slen * sizeof(twchar_t));
	dest->length = newlen;
	dest->cstr[newlen] = '\0';
	return TWERR_SUCCESS;
}

twerr_t
twset(twine_t *tw, twsize_t pos, twchar_t c)
{
	if (!twismutable(tw))
		return TWERR_IMMUTABLE;
	/* TODO */
	return TWERR_SUCCESS;
}

twchar_t
twget(const twine_t *tw, twsize_t pos)
{
	if (pos >= twlen(tw))
		return '\0';
	return tw->cstr[pos];
}
