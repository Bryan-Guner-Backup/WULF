---
layout: page
lib: ccv
slug: ccv-resample
status: publish
title: lib/ccv_resample.c
desc: image resampling utilities
categories:
  - lib
---

## ccv_resample

    void ccv_resample(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int btype, int rows, int cols, int type)

Resample a given matrix to different size, as for now, ccv only supports either downsampling (with CCV_INTER_AREA) or upsampling (with CCV_INTER_CUBIC).

- **a**: The input matrix.
- **b**: The output matrix.
- **btype**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
- **rows**: The new row.
- **cols**: The new column.
- **type**: For now, ccv supports CCV_INTER_AREA, which is an extension to [bilinear resampling](https://en.wikipedia.org/wiki/Bilinear_filtering) for downsampling and CCV_INTER_CUBIC [bicubic resampling](https://en.wikipedia.org/wiki/Bicubic_interpolation) for upsampling.

## ccv_sample_down

    void ccv_sample_down(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int type, int src_x, int src_y)

Downsample a given matrix to exactly half size with a [Gaussian filter](https://en.wikipedia.org/wiki/Gaussian_filter). The half size is approximated by floor(rows _ 0.5) x floor(cols _ 0.5).

- **a**: The input matrix.
- **b**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
- **src_x**: Shift the start point by src_x.
- **src_y**: Shift the start point by src_y.

## ccv_sample_up

    void ccv_sample_up(ccv_dense_matrix_t *a, ccv_dense_matrix_t **b, int type, int src_x, int src_y)

Upsample a given matrix to exactly double size with a [Gaussian filter](https://en.wikipedia.org/wiki/Gaussian_filter).

- **a**: The input matrix.
- **b**: The output matrix.
- **type**: The type of output matrix, if 0, ccv will try to match the input matrix for appropriate type.
- **src_x**: Shift the start point by src_x.
- **src_y**: Shift the start point by src_y.
