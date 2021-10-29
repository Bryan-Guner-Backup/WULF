---
layout: page
lib: ccv
slug: ccv-image-processing
status: publish
title: lib/ccv_image_processing.c
desc: image processing utilities
categories:
  - lib
---

The utilities in this file provides image processing methods that are widely used for image enhancements.

## ccv_color_transform

    void ccv_color_transform(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int type, int flag)

Convert matrix from one color space representation to another.

- **a**: The input matrix.
- **b**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will use the sample type as the input matrix.
- **flag**: **CCV_RGB_TO_YUV** to convert from RGB color space to YUV color space.

## ccv_saturation

    void ccv_saturation(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int type, double ds)

Manipulate image's saturation.

- **a**: The input matrix.
- **b**: The output matrix (it is in-place safe).
- **type**: The type of output matrix, if 0, ccv will use the sample type as the input matrix.
- **ds**: The coefficient (0: grayscale, 1: original).

## ccv_contrast

    void ccv_contrast(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int type, double ds)

Manipulate image's contrast.

- **a**: The input matrix.
- **b**: The output matrix (it is in-place safe).
- **type**: The type of output matrix, if 0, ccv will use the sample type as the input matrix.
- **ds**: The coefficient (0: mean image, 1: original).
