---
layout: page
lib: ccv
slug: ccv-algebra
status: publish
title: lib/ccv_algebra.c
desc: linear algebra
categories:
  - lib
---

## ccv_normalize

    double ccv_normalize(ccv_matrix_t *a, ccv_matrix_t **b, int btype, int flag)

Normalize a matrix and return the normalize factor.

- **a**: The input matrix.
- **b**: The output matrix.
- **btype**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
- **flag**: CCV_L1 or CCV_L2, for L1 or L2 normalization.

**return**: L1 or L2 sum.

## ccv_sat

    void ccv_sat(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int type, int padding_pattern)

Generate the [Summed Area Table](https://en.wikipedia.org/wiki/Summed_area_table).

- **a**: The input matrix.
- **b**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
- **padding_pattern**: CCV_NO_PADDING - the first row and the first column in the output matrix is the same as the input matrix. CCV_PADDING_ZERO - the first row and the first column in the output matrix is zero, thus, the output matrix size is 1 larger than the input matrix.

## ccv_dot

    double ccv_dot(ccv_matrix_t *a, ccv_matrix_t *b)

Dot product of two matrix.

- **a**: The input matrix.
- **b**: The other input matrix.

**return**: Dot product.

## ccv_sum

    double ccv_sum(ccv_matrix_t *mat, int flag)

Return the sum of all elements in the matrix.

- **mat**: The input matrix.
- **flag**: CCV_UNSIGNED - compute fabs(x) of the elements first and then sum up. CCV_SIGNED - compute the sum normally.

## ccv_variance

    double ccv_variance(ccv_matrix_t *mat)

Return the sum of all elements in the matrix.

- **mat**: The input matrix.

**return**: Element variance of the input matrix.

## ccv_multiply

    void ccv_multiply(ccv_matrix_t *a, ccv_matrix_t *b, ccv_matrix_t **c, int type)

Do element-wise matrix multiplication.

- **a**: The input matrix.
- **b**: The input matrix.
- **c**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.

## ccv_add

    void ccv_add(ccv_matrix_t *a, ccv_matrix_t *b, ccv_matrix_t **c, int type)

Matrix addition.

- **a**: The input matrix.
- **b**: The input matrix.
- **c**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.

## ccv_subtract

    void ccv_subtract(ccv_matrix_t *a, ccv_matrix_t *b, ccv_matrix_t **c, int type)

Matrix subtraction.

- **a**: The input matrix.
- **b**: The input matrix.
- **c**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.

## ccv_scale

    void ccv_scale(ccv_matrix_t *a, ccv_matrix_t **b, int type, double ds)

Scale given matrix by factor of **ds**.

- **a**: The input matrix.
- **b**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
- **ds**: The scale factor, `b = a * ds`

## ccv_gemm

    void ccv_gemm(ccv_matrix_t *a, ccv_matrix_t *b, double alpha, ccv_matrix_t *c, double beta, int transpose, ccv_matrix_t **d, int type)

General purpose matrix multiplication. This function has a hard dependency on [cblas](http://www.netlib.org/blas/) library.

As general as it is, it computes:

alpha _ A _ B + beta \* C

whereas A, B, C are matrix, and alpha, beta are scalar.

- **a**: The input matrix.
- **b**: The input matrix.
- **alpha**: The multiplication factor.
- **c**: The input matrix.
- **beta**: The multiplication factor.
- **transpose**: CCV_A_TRANSPOSE, CCV_B_TRANSPOSE to indicate if matrix A or B need to be transposed first before multiplication.
- **d**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
