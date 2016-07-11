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
#ifndef TWINE_H_INCLUDED__8A3B
#define TWINE_H_INCLUDED__8A3B 1

#include <stddef.h>
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif
/**
 * @addtogroup twine
 * @brief Enhanced string data type for C.
 * @{
 */

/**
 * @page twine The Twine library
 *
 * @par
 * The difference here is usability. C99's compound literals permit to
 * use it with ease. By default, @e twines are allocated on the stack,
 * but they can switch to heap allocation on demand (if the user code
 * allow it).
 *
 * @par
 * Terminology:
 * @li Length: The length of the @e twine, in character count,
 *     @e excluding the terminating null byte.
 * @li Capacity: The maximum length of a @e twine, in character count,
 *     @e excluding the terminating null byte.
 * @li Size: The size of the buffer containing the @e twine, in character count,
 *     @e including terminating null byte.
 *
 * @par
 * Obviously, terminating null byte is automatically handled. Majority
 * of functions, if needed, will take a length or a capacity as
 * parameter. Thus, user code dont have to care about the terminating
 * null byte.
 */

/**
 * Twine version info.
 * Numeric version.
 */
#define TWINE_VERSION		0x010000

/**
 * Twine version info.
 * String version.
 */
#define TWINE_VERSION_STRING	"1.0.0"

/**
 * Twine flags.
 */
typedef enum twflag {
	/** No flag is set. */
	TWFLAG_NONE		= 0,
	/** Read only. */
	TWFLAG_IMMUTABLE	= 1,
	/** Dynamic allocation. */
	TWFLAG_DYNAMIC		= (1<<1),
} twflag_t;

/**
 * Error codes.
 */
enum twerr {
	/** Success. No error occured. */
	TWERR_SUCCESS = 0,
	/** Memory allocation error. */
	TWERR_NOMEM,
	/** Destination @e twine too small. */
	TWERR_TOOSMALL,
	/** IMMUTABLE @e twine. */
	TWERR_IMMUTABLE,
	/** Not using DYNAMIC memory allocation. */
	TWERR_DYNAMIC,
	/** Integer overflow. */
	TWERR_OVERFLOW,
};
typedef enum twerr twerr_t;

/**
 * Type used to store characters.
 */
typedef char twchar_t;

/**
 * Type used for @e twine length, capacity and internal
 * buffer size.
 */
typedef size_t twsize_t;

/**
 * Maximum value for a twsize_t.
 */
#define TWSIZE_MAX	(SIZE_MAX / sizeof(twchar_t))

/**
 * Maximum byte size of a twine.
 */
#define TWBYTESIZE_MAX	SIZE_MAX

/**
 * Maximum capacity of a twine
 */
#define TWCAP_MAX	(TWSIZE_MAX - 1)

/**
 * Maximum length of a twine
 */
#define TWLEN_MAX	TWCAP_MAX

/**
 * The @e twine data structure.
 */
struct twine {
	/** Pointer to the underlaying buffer. */
	twchar_t *cstr;
	/** Twine length. */
	twsize_t length;
	/** Underlaying buffer size. */
	twsize_t size;
	/** Twine flags. */
	twflag_t flags;
};
typedef struct twine twine_t;

/**
 * @brief Create a @e twine on stack with specified capacity.
 *
 * @param _cstr		A literal C string.
 * @param _cap		Desired capacity.
 *
 * @return Pointer to an initialized @e twine.
 */
#define TWINECAP(_cstr, _cap)						\
	(&(twine_t){							\
		.length = sizeof(_cstr) - 1,				\
		.size = ((_cap) < sizeof(_cstr) - 1) ?			\
			sizeof(_cstr) : (_cap) + 1,			\
		.flags = TWFLAG_NONE,					\
		.cstr = (twchar_t[((_cap) < sizeof(_cstr) - 1) ?	\
				sizeof(_cstr) : (_cap) + 1]){_cstr},	\
	})

/**
 * @brief Create a @e twine on stack.
 *
 * @param _cstr		A literal C string.
 *
 * @return Pointer to an initialized @e twine.
 */
#define TWINE(_cstr)		TWINECAP(_cstr, (sizeof(_cstr) - 1))

/**
 * @brief Create an empty @e twine on stack with specified capacity.
 *
 * @param _cap		Desired capacity.
 *
 * @return Pointer to an initialized @e twine.
 */
#define ETWINE(_cap)		TWINECAP("", _cap)

/**
 * @brief Create a DYNAMIC @e twine.
 */
#define DTWINE()					\
	(&(twine_t){					\
		.length = 0,				\
		.size = 0,				\
		.flags = TWFLAG_DYNAMIC,		\
		.cstr = NULL,				\
	})

/* Forward declare inline functions. See below for documentation and
 * definitions. */
static inline void twinit(twine_t *);
static inline twsize_t twlen(const twine_t *);
static inline twsize_t twcap(const twine_t *);
static inline twsize_t twsize(const twine_t *);
static inline size_t twbytesize(const twine_t *);
static inline const twchar_t *twcstr(const twine_t *);
static inline bool twisdynamic(const twine_t *);
static inline bool twismutable(const twine_t *);
static inline void twimmutable(twine_t *);
static inline void twmutable(twine_t *);

extern twerr_t twcpy(twine_t *dest, const twine_t *src);
extern twerr_t twncpy(twine_t *dest, const twine_t *src, twsize_t len);
extern twerr_t twsub(twine_t *dest, const twine_t *src,
		twsize_t start, twsize_t len);
extern twerr_t twsubreplace(twine_t *dest, twsize_t dstart, twsize_t dlen,
			const twine_t *src, twsize_t sstart, twsize_t slen);
extern twerr_t twrecap(twine_t *tw, twsize_t newcap);
extern twerr_t twdynamic(twine_t * tw);
extern void twdestroy(twine_t *tw);
extern twerr_t twset(twine_t *tw, twsize_t pos, twchar_t c);
extern twchar_t twget(const twine_t *tw, twsize_t pos);

/**
 * @addtogroup advanced
 * @brief Advanced features for @e Twine manipulation.
 * Some functions can be insecure, use with caution.
 * @{
 */

extern void twine_set_allocator_functions(void *(*a)(void *, size_t),
					void (*f)(void *));

extern void twine_attach_buffer(twine_t *tw, void *bufptr, size_t buflen);

extern void twine_attach_dynamic_buffer(twine_t *tw, void *bufptr,
					size_t buflen);

/** @} */ /* End of advanced Doxygen group. */

/********************** Inline functions definitions ************************/

/**
 * @brief Initialize a dynamic @e twine.
 *
 * The previously contained data is freed if needed.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 */
void
twinit(twine_t *tw)
{
	if (!twismutable(tw))
		return TWERR_IMMUTABLE;
	twdestroy(tw);
	tw->cstr = NULL;
	tw->length = 0;
	tw->size = 0;
	tw->flags |= TWFLAG_DYNAMIC;
}

/**
 * @brief Obtain the length of a @e twine.
 *
 * Value unit is @e character. Terminating null byte is excluded from
 * the count.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @return Length of the @e twine.
 */
twsize_t
twlen(const twine_t *tw)
{
	return tw->length;
}

/**
 * @brief Obtain the capacity of a @e twine.
 *
 * Value unit is @e character. Terminating null byte is excluded from
 * the count.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @return Capacity of the @e twine.
 */
twsize_t
twcap(const twine_t *tw)
{
	return tw->size ? tw->size - 1 : 0;
}

/**
 * @brief Obtain the size of the data buffer.
 *
 * Value unit is @e character. Terminating null byte is included in
 * the count.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @return Size of the data buffer.
 */
twsize_t
twsize(const twine_t *tw)
{
	return tw->size;
}

/**
 * @brief Obtain the size in bytes the data buffer.
 *
 * Value unit is @e byte. Terminating null byte is included in
 * the count.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @return Size of the data buffer in bytes.
 */
size_t
twbytesize(const twine_t *tw)
{
	return ((size_t)tw->size) * sizeof(twchar_t);
}

/**
 * @brief Check if DYNAMIC.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @retval false	Not DYNAMIC.
 * @retval true		DYNAMIC.
 */
bool
twisdynamic(const twine_t *tw)
{
	return tw->flags & TWFLAG_DYNAMIC;
}

/**
 * @brief Check if IMMUTABLE.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @retval false	Writes allowed.
 * @retval true		@e Twine is immutable.
 */
bool
twismutable(const twine_t *tw)
{
	return !(tw->flags & TWFLAG_IMMUTABLE);
}

/**
 * @brief Set IMMUTABLE.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 */
void
twimmutable(twine_t *tw)
{
	tw->flags |= TWFLAG_IMMUTABLE;
}

/**
 * @brief Set MUTABLE.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 */
void
twmutable(twine_t *tw)
{
	tw->flags &= ~TWFLAG_IMMUTABLE;
}

/**
 * @brief Obtain a standard C string from a @e twine.
 *
 * @note Complexity O(1).
 *
 * @param tw	A @e twine.
 *
 * @return A valid null terminated C string.
 */
const twchar_t *
twcstr(const twine_t *tw)
{
	if (tw->cstr == NULL)
		return "";
	return tw->cstr;
}

/** @} */ /* End of @addtogroup Doxygen block. */
#ifdef __cplusplus
}
#endif
#endif /* TWINE_H_INCLUDED__8A3B */
