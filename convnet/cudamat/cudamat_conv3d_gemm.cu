/** Kernels for 3D convolutions. These kernels call the regular 2D kernels in a loop.
 *  Data layout - column major-
 *  data : (num_images, image_size_x, image_size_y, num_input_channels, image_size_t)
 *  filters : (num_output_channels, kernel_size_x, kernel_size_y, num_input_channels, kernel_size_t)
 */

#include "cudamat_conv_gemm.cuh"

#ifdef __cplusplus
extern "C" {
#endif

void convUp3DGemm(cudamat* images, cudamat* filters, cudamat* targets,
                Shape4D* images_shape, Shape4D* filters_shape,
                Shape4D* targets_shape, ConvDesc conv_desc,
                float scaleTargets) {
  int kernel_size_t       = conv_desc.kernel_size_t;
  int stride_t            = conv_desc.stride_t;
  int padding_t           = conv_desc.padding_t;
  int num_input_channels  = conv_desc.num_input_channels;
  int num_output_channels = conv_desc.num_output_channels;
  
  assert(padding_t == 0);  // For now. It is unlikely that we will require non-zero padding.

  int num_images    = images_shape->shape[0];
  int num_modules_t = targets_shape->shape[3] / num_output_channels;

  // Size of one time frame.
  int input_frame_size  = images_shape->shape[1]  * images_shape->shape[2]  * num_input_channels;
  int output_frame_size = targets_shape->shape[1] * targets_shape->shape[2] * num_output_channels;

  ConvDesc conv2d_desc = conv_desc;
  conv2d_desc.kernel_size_t = 1;
  conv2d_desc.num_input_channels *= kernel_size_t;
  conv2d_desc.input_channel_end  *= kernel_size_t;
  // Slicing works only for kernel_size_t = 1, For kernel_size_t > 1, only full slices are supported in 3d conv.
  assert(kernel_size_t == 1 || (conv_desc.input_channel_end == conv_desc.num_input_channels && conv_desc.input_channel_begin == 0));

  Shape4D images2d_shape   = *images_shape;
  Shape4D targets2d_shape  = *targets_shape;
  images2d_shape.shape[3]  = num_input_channels * kernel_size_t;
  targets2d_shape.shape[3] = num_output_channels;
 
  // Pretend that images contains kernel_size_t frames only.
  images->size[1]  = input_frame_size * kernel_size_t;
  // Pretend that targets contains 1 frame only.
  targets->size[1] = output_frame_size;

  float* images_data_device  = images->data_device;  // Backup.
  float* targets_data_device = targets->data_device;  // Backup.
  for (int i = 0; i < num_modules_t; i++) {
    convUpGemm(images, filters, targets, &images2d_shape, filters_shape,
               &targets2d_shape, conv2d_desc, scaleTargets);
    images->data_device  += input_frame_size  * num_images * stride_t;  // Move images by stride_t frames.
    targets->data_device += output_frame_size * num_images;  // Move output by 1 frame.
  }
  images->data_device  = images_data_device;  // Restore from backup.
  targets->data_device = targets_data_device;  // Restore from backup.

  // UnPretend.
  images->size[1]  = images_shape->shape[1] * images_shape->shape[2] * images_shape->shape[3];
  targets->size[1] = targets_shape->shape[1] * targets_shape->shape[2] * targets_shape->shape[3];
}

void convDown3DGemm(cudamat* derivs, cudamat* filters, cudamat* targets,
                  Shape4D* derivs_shape, Shape4D* filters_shape,
                  Shape4D* targets_shape, ConvDesc conv_desc,
                  float scaleTargets) {

  int kernel_size_t       = conv_desc.kernel_size_t;
  int stride_t            = conv_desc.stride_t;
  int padding_t           = conv_desc.padding_t;
  int num_input_channels  = conv_desc.num_input_channels;
  int num_output_channels = conv_desc.num_output_channels;
  
  assert(padding_t == 0);  // For now. It is unlikely that we will require non-zero padding.

  int num_images         = derivs_shape->shape[0];
  int num_modules_t      = derivs_shape->shape[3] / num_output_channels;
  int targets_frame_size = targets_shape->shape[1]  * targets_shape->shape[2]  * num_input_channels;
  int derivs_frame_size  = derivs_shape->shape[1] * derivs_shape->shape[2] * num_output_channels;

  ConvDesc conv2d_desc = conv_desc;
  conv2d_desc.kernel_size_t = 1;
  conv2d_desc.num_input_channels *= kernel_size_t;
  conv2d_desc.input_channel_end  *= kernel_size_t;
  // Slicing works only for kernel_size_t = 1, For kernel_size_t > 1, only full slices are supported in 3d conv.
  assert(kernel_size_t == 1 || (conv_desc.input_channel_end == conv_desc.num_input_channels && conv_desc.input_channel_begin == 0));

  Shape4D targets2d_shape  = *targets_shape;
  Shape4D derivs2d_shape   = *derivs_shape;
  derivs2d_shape.shape[3]  = num_output_channels;
  targets2d_shape.shape[3] = num_input_channels * kernel_size_t;
  
  Scale(targets, scaleTargets);
  
  derivs->size[1]  = derivs_frame_size;
  targets->size[1] = targets_frame_size * kernel_size_t;

  float* derivs_data_device  = derivs->data_device;
  float* targets_data_device = targets->data_device;

  for (int i = 0; i < num_modules_t; i++) {
    convDownGemm(derivs, filters, targets, &derivs2d_shape, filters_shape,
                 &targets2d_shape, conv2d_desc, 1.0);
    derivs->data_device  += derivs_frame_size  * num_images;
    targets->data_device += targets_frame_size * num_images * stride_t;
  }
  targets->data_device  = targets_data_device;
  derivs->data_device = derivs_data_device;

  targets->size[1] = targets_shape->shape[1] * targets_shape->shape[2] * targets_shape->shape[3];
  derivs->size[1]  = derivs_shape->shape[1] * derivs_shape->shape[2] * derivs_shape->shape[3];
}

void convOutp3DGemm(cudamat* images, cudamat* derivs, cudamat* targets,
              Shape4D* images_shape, Shape4D* derivs_shape, Shape4D* targets_shape,
              ConvDesc conv_desc, float scaleTargets, float scaleOutput) {
  int kernel_size_t       = conv_desc.kernel_size_t;
  int stride_t            = conv_desc.stride_t;
  int padding_t           = conv_desc.padding_t;
  int num_input_channels  = conv_desc.num_input_channels;
  int num_output_channels = conv_desc.num_output_channels;
  
  assert(padding_t == 0);  // For now. It is unlikely that we will require non-zero padding.

  int num_images    = images_shape->shape[0];
  int num_modules_t = derivs_shape->shape[3] / num_output_channels;

  // Size of one time frame.
  int input_frame_size = images_shape->shape[1] * images_shape->shape[2] * num_input_channels;
  int deriv_frame_size = derivs_shape->shape[1] * derivs_shape->shape[2] * num_output_channels;

  ConvDesc conv2d_desc = conv_desc;
  conv2d_desc.kernel_size_t = 1;
  conv2d_desc.num_input_channels *= kernel_size_t;
  conv2d_desc.input_channel_end  *= kernel_size_t;
  // Slicing works only for kernel_size_t = 1, For kernel_size_t > 1, only full slices are supported in 3d conv.
  assert(kernel_size_t == 1 || (conv_desc.input_channel_end == conv_desc.num_input_channels && conv_desc.input_channel_begin == 0));

  Shape4D images2d_shape  = *images_shape;
  Shape4D derivs2d_shape  = *derivs_shape;
  images2d_shape.shape[3] = num_input_channels * kernel_size_t;
  derivs2d_shape.shape[3] = num_output_channels;
 
  Scale(targets, scaleTargets);

  // Pretend that images contains kernel_size_t frames only.
  images->size[1] = input_frame_size * kernel_size_t;
  // Pretend that targets contains 1 frame only.
  derivs->size[1] = deriv_frame_size;

  float* images_data_device = images->data_device;  // Backup.
  float* derivs_data_device = derivs->data_device;  // Backup.
  for (int i = 0; i < num_modules_t; i++) {
    convOutpGemm(images, derivs, targets, &images2d_shape, &derivs2d_shape, targets_shape,
                 conv2d_desc, 1.0, scaleOutput);
    images->data_device += input_frame_size * num_images * stride_t;  // Move images by stride_t frames.
    derivs->data_device += deriv_frame_size * num_images;  // Move output by 1 frame.
  }
  images->data_device = images_data_device;  // Restore from backup.
  derivs->data_device = derivs_data_device;  // Restore from backup.
  images->size[1] = images_shape->shape[1] * images_shape->shape[2] * images_shape->shape[3];
  derivs->size[1] = derivs_shape->shape[1] * derivs_shape->shape[2] * derivs_shape->shape[3];
}

void ResponseNormCrossMap3DGemm(
  cudamat* images, cudamat* targets, int numFilters, int sizeF, float addScale,
  float powScale, bool blocked, int image_size_t) {

  int num_images = images->size[0];
  int frame_size = images->size[1] / image_size_t;
  images->size[1]  = frame_size;
  targets->size[1] = frame_size;
  float* images_data_device  = images->data_device;  // Backup.
  float* targets_data_device = targets->data_device;  // Backup.
  for (int t = 0; t < image_size_t; t++) {
    ResponseNormCrossMapGemm(images, targets, numFilters, sizeF, addScale,
                             powScale, blocked);
    images->data_device  += frame_size * num_images;
    targets->data_device += frame_size * num_images;
  }
  images->data_device  = images_data_device;  // Restore from backup.
  targets->data_device = targets_data_device;  // Restore from backup.
  images->size[1]  = frame_size * image_size_t;
  targets->size[1] = frame_size * image_size_t;
}

void ResponseNormCrossMap3DUndoGemm(
  cudamat* outGrads, cudamat* inputs, cudamat* targets,
  int num_filters, int sizeF, float addScale, float powScale, bool blocked,
  int image_size_t) {
  int num_images = inputs->size[0];
  int frame_size = inputs->size[1] / image_size_t;
  outGrads->size[1] = frame_size;
  inputs->size[1]   = frame_size;
  targets->size[1]  = frame_size;
  float* outgrads_data_device  = outGrads->data_device;  // Backup.
  float* inputs_data_device = inputs->data_device;  // Backup.
  float* targets_data_device = targets->data_device;  // Backup.
  for (int t = 0; t < image_size_t; t++) {
    ResponseNormCrossMapUndoGemm(outGrads, inputs, targets, num_filters, sizeF,
                                 addScale, powScale, blocked);
    outGrads->data_device += frame_size * num_images;
    inputs->data_device   += frame_size * num_images;
    targets->data_device  += frame_size * num_images;
  }
  outGrads->data_device = outgrads_data_device;  // Backup.
  inputs->data_device = inputs_data_device;  // Backup.
  targets->data_device = targets_data_device;  // Backup.
  outGrads->size[1] = frame_size * image_size_t;
  inputs->size[1]   = frame_size * image_size_t;
  targets->size[1]  = frame_size * image_size_t;
}
#ifdef __cplusplus
}
#endif
