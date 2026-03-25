import { LessonDocLink } from './types';
import { lessons } from './lessons';

/**
 * Authoritative NumPy reference & user-guide URLs for each lesson (same order as `lessons`).
 * Row logos come from the URL hostname — see `src/lib/docLinkSources.ts` (not hardcoded per link).
 */
export const LESSON_DOC_LINKS: LessonDocLink[][] = [
  // 1 Your First Array
  [
    { label: 'numpy.array', href: 'https://numpy.org/doc/stable/reference/generated/numpy.array.html' },
    { label: 'The N-dimensional array (ndarray)', href: 'https://numpy.org/doc/stable/reference/arrays.ndarray.html' },
  ],
  // 2 Array Properties
  [
    { label: 'numpy.ndarray (shape, dtype, ndim)', href: 'https://numpy.org/doc/stable/reference/generated/numpy.ndarray.html' },
    { label: 'numpy.dtype', href: 'https://numpy.org/doc/stable/reference/generated/numpy.dtype.html' },
  ],
  // 3 Array Generators
  [
    { label: 'numpy.zeros', href: 'https://numpy.org/doc/stable/reference/generated/numpy.zeros.html' },
    { label: 'numpy.ones', href: 'https://numpy.org/doc/stable/reference/generated/numpy.ones.html' },
    { label: 'numpy.arange', href: 'https://numpy.org/doc/stable/reference/generated/numpy.arange.html' },
    { label: 'numpy.linspace', href: 'https://numpy.org/doc/stable/reference/generated/numpy.linspace.html' },
  ],
  // 4 Random Arrays
  [
    { label: 'numpy.random.default_rng', href: 'https://numpy.org/doc/stable/reference/random/generator.html#numpy.random.default_rng' },
    { label: 'Generator.integers', href: 'https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.integers.html' },
    { label: 'Generator.random', href: 'https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.random.html' },
    { label: 'Generator.normal', href: 'https://numpy.org/doc/stable/reference/random/generated/numpy.random.Generator.normal.html' },
  ],
  // 5 Basic Indexing
  [
    { label: 'Indexing (user guide)', href: 'https://numpy.org/doc/stable/user/basics.indexing.html' },
    { label: 'numpy.arange', href: 'https://numpy.org/doc/stable/reference/generated/numpy.arange.html' },
  ],
  // 6 Boolean Indexing
  [
    { label: 'Boolean array indexing', href: 'https://numpy.org/doc/stable/user/basics.indexing.html#boolean-array-indexing' },
  ],
  // 7 Fancy Indexing
  [
    { label: 'Integer array indexing', href: 'https://numpy.org/doc/stable/user/basics.indexing.html#integer-array-indexing' },
  ],
  // 8 Element-wise Math
  [
    { label: 'Broadcasting', href: 'https://numpy.org/doc/stable/user/basics.broadcasting.html' },
    { label: 'numpy.add (binary ufuncs)', href: 'https://numpy.org/doc/stable/reference/generated/numpy.add.html' },
  ],
  // 9 Aggregation
  [
    { label: 'numpy.sum', href: 'https://numpy.org/doc/stable/reference/generated/numpy.sum.html' },
    { label: 'numpy.mean', href: 'https://numpy.org/doc/stable/reference/generated/numpy.mean.html' },
    { label: 'numpy.min', href: 'https://numpy.org/doc/stable/reference/generated/numpy.min.html' },
    { label: 'numpy.max', href: 'https://numpy.org/doc/stable/reference/generated/numpy.max.html' },
    { label: 'numpy.argmax', href: 'https://numpy.org/doc/stable/reference/generated/numpy.argmax.html' },
  ],
  // 10 Universal Functions
  [
    { label: 'numpy.sin', href: 'https://numpy.org/doc/stable/reference/generated/numpy.sin.html' },
    { label: 'Universal functions (ufunc)', href: 'https://numpy.org/doc/stable/reference/ufuncs.html' },
    { label: 'Mathematical ufuncs', href: 'https://numpy.org/doc/stable/reference/routines.math.html' },
  ],
  // 11 Reshape & Flatten
  [
    { label: 'numpy.reshape', href: 'https://numpy.org/doc/stable/reference/generated/numpy.reshape.html' },
    { label: 'ndarray.flatten', href: 'https://numpy.org/doc/stable/reference/generated/numpy.ndarray.flatten.html' },
    { label: 'numpy.arange', href: 'https://numpy.org/doc/stable/reference/generated/numpy.arange.html' },
  ],
  // 12 Transpose
  [
    { label: 'ndarray.T', href: 'https://numpy.org/doc/stable/reference/generated/numpy.ndarray.T.html' },
    { label: 'numpy.transpose', href: 'https://numpy.org/doc/stable/reference/generated/numpy.transpose.html' },
  ],
  // 13 Stacking
  [
    { label: 'numpy.vstack', href: 'https://numpy.org/doc/stable/reference/generated/numpy.vstack.html' },
    { label: 'numpy.hstack', href: 'https://numpy.org/doc/stable/reference/generated/numpy.hstack.html' },
  ],
  // 14 Broadcasting Basics
  [
    { label: 'Broadcasting', href: 'https://numpy.org/doc/stable/user/basics.broadcasting.html' },
  ],
  // 15 Column Broadcasting
  [
    { label: 'numpy.reshape', href: 'https://numpy.org/doc/stable/reference/generated/numpy.reshape.html' },
    { label: 'Broadcasting', href: 'https://numpy.org/doc/stable/user/basics.broadcasting.html' },
  ],
  // 16 Views vs Copies
  [
    { label: 'Copies and views', href: 'https://numpy.org/doc/stable/user/basics.copies.html' },
    { label: 'ndarray.copy', href: 'https://numpy.org/doc/stable/reference/generated/numpy.ndarray.copy.html' },
  ],
  // 17 Where & Select
  [
    { label: 'numpy.where', href: 'https://numpy.org/doc/stable/reference/generated/numpy.where.html' },
  ],
  // 18 Sorting & Searching
  [
    { label: 'numpy.argsort', href: 'https://numpy.org/doc/stable/reference/generated/numpy.argsort.html' },
    { label: 'numpy.sort', href: 'https://numpy.org/doc/stable/reference/generated/numpy.sort.html' },
    { label: 'numpy.searchsorted', href: 'https://numpy.org/doc/stable/reference/generated/numpy.searchsorted.html' },
  ],
  // 19 String Operations
  [
    { label: 'numpy.char.capitalize', href: 'https://numpy.org/doc/stable/reference/generated/numpy.char.capitalize.html' },
    { label: 'numpy.char.str_len', href: 'https://numpy.org/doc/stable/reference/generated/numpy.char.str_len.html' },
    { label: 'String routines (numpy.char)', href: 'https://numpy.org/doc/stable/reference/routines.char.html' },
  ],
  // 20 Dot & Matmul
  [
    { label: 'numpy.dot', href: 'https://numpy.org/doc/stable/reference/generated/numpy.dot.html' },
    { label: 'numpy.matmul', href: 'https://numpy.org/doc/stable/reference/generated/numpy.matmul.html' },
  ],
  // 21 Inverse & Determinant
  [
    { label: 'numpy.linalg.det', href: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.det.html' },
    { label: 'numpy.linalg.inv', href: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.inv.html' },
    { label: 'Linear algebra (numpy.linalg)', href: 'https://numpy.org/doc/stable/reference/routines.linalg.html' },
  ],
  // 22 Solving Linear Systems
  [
    { label: 'numpy.linalg.solve', href: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.solve.html' },
    { label: 'numpy.linalg.lstsq', href: 'https://numpy.org/doc/stable/reference/generated/numpy.linalg.lstsq.html' },
    { label: 'Linear algebra (numpy.linalg)', href: 'https://numpy.org/doc/stable/reference/routines.linalg.html' },
  ],
];

if (LESSON_DOC_LINKS.length !== lessons.length) {
  throw new Error('LESSON_DOC_LINKS length must match lessons array');
}
