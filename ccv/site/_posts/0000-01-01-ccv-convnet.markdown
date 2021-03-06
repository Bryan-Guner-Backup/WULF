---
layout: page
lib: ccv
slug: ccv-convnet
status: publish
title: lib/ccv_convnet.c
desc: deep convolutional networks
categories:
  - lib
---

This is a implementation of deep convolutional networks mainly for image recognition and object detection.

## ccv_convnet_new

    ccv_convnet_new(int use_cwc_accel, ccv_size_t input, ccv_convnet_layer_param_t params[], int count)

Create a new (deep) convolutional network with specified parameters. ccv only supports convolutional layer (shared weights), max pooling layer, average pooling layer, full connect layer and local response normalization layer.

- **use_cwc_accel**: Whether use CUDA-enabled GPU to accelerate various computations for convolutional network.
- **input**: Ihe input size of the image, it is not necessarily the input size of the first convolutional layer.
- **params[]**: The C-array of **ccv_convnet_layer_param_t** that specifies the parameters for each layer.
- **count**: The size of params[] C-array.

**return**: A new deep convolutional network structs

## ccv_convnet_layer_param_t

- **bias**: The initialization value for bias if applicable (for convolutional layer and full connect layer).
- **glorot**: The truncated uniform distribution coefficients for weights if applicable (for convolutional layer and full connect layer, glorot / sqrt(in + out)).
- **input**: A **ccv_convnet_input_t** specifies the input structure.
- **output**: A **ccv_convnet_type_t** specifies the output parameters and structure.
- **type**: One of following value to specify the network layer type, **CCV_CONVNET_CONVOLUTIONAL**, **CCV_CONVNET_FULL_CONNECT**, **CCV_CONVNET_MAX_POOL**, **CCV_CONVNET_AVERAGE_POOL**, **CCV_CONVNET_LOCAL_RESPONSE_NORM**.

## ccv_convnet_input_t

- **matrix.channels**: The number of channels of the input matrix.
- **matrix.cols**: The number of columns of the input matrix.
- **matrix.partition**: The number of partitions of the input matrix, it must be dividable by the number of channels (it is partitioned by channels).
- **matrix.rows**: The number of rows of the input matrix.
- **node.count**: The number of nodes. You should either use **node** or **matrix** to specify the input structure.

## ccv_convnet_type_t

- **convolutional.border**: The padding border size for the input matrix.
- **convolutional.channels**: The number of channels for convolutional filter.
- **convolutional.cols**: The number of columns for convolutional filter.
- **convolutional.count**: The number of filters for convolutional layer.
- **convolutional.partition**: The number of partitions for convolutional filter.
- **convolutional.rows**: The number of rows for convolutional filter.
- **convolutional.strides**: The strides for convolutional filter.
- **full_connect.count**: The number of output nodes for full connect layer.
- **full_connect.relu**: 0 - ReLU, 1 - no ReLU
- **pool.border**: The padding border size for the input matrix.
- **pool.size**: The window size for pooling layer.
- **pool.strides**: The strides for pooling layer.
- **rnorm.alpha**: See **rnorm.kappa**.
- **rnorm.beta**: See **rnorm.kappa**.
- **rnorm.kappa**: As of b[i] = a[i] / (rnorm.kappa + rnorm.alpha \* sum(a, i - rnorm.size / 2, i + rnorm.size / 2)) ^ rnorm.beta
- **rnorm.size**: The size of local response normalization layer.

## ccv_convnet_verify

    int ccv_convnet_verify(ccv_convnet_t *convnet, int output)

Verify the specified parameters make sense as a deep convolutional network.

- **convnet**: A deep convolutional network to verify.
- **output**: The output number of nodes (for the last full connect layer).

**return**: 0 if the given deep convolutional network making sense.

## ccv_convnet_supervised_train

    void ccv_convnet_supervised_train(ccv_convnet_t *convnet, ccv_array_t *categorizeds, ccv_array_t *tests, const char *filename, ccv_convnet_train_param_t params)

Start to train a deep convolutional network with given parameters and data.

- **convnet**: A deep convolutional network that is initialized.
- **categorizeds**: An array of images with its category information for training.
- **tests**: An array of images with its category information for validating.
- **filename**: The working file to save progress and the trained convolutional network.
- **params**: A ccv_convnet_train_param_t that specifies the training parameters.

## ccv_convnet_train_param_t

- **color_gain**: The color variance for data augmentation (0 means no such augmentation).
- **device_count**: Use how many GPU devices, this is capped by available CUDA devices on your system. For now, ccv's implementation only support up to 4 GPUs
- **image_manipulation**: The value for image brightness / contrast / saturation manipulations.
- **input.max_dim**: The maximum dimensions for random resize of training images.
- **input.min_dim**: The minimum dimensions for random resize of training images.
- **iterations**: The number of iterations (an iteration is for one batch) before save the progress.
- **layer_params**: An C-array of **ccv_convnet_layer_train_param_t** training parameters for each layer.
- **max_epoch**: The number of epoch (an epoch sweeps through all the examples) to go through before end the training.
- **mini_batch**: The number of examples for a batch in stochastic gradient descent.
- **peer_access**: Enable peer access for cross device communications or not, this will enable faster multiple device training.
- **sgd_frequency**: After how many batches when we do a SGD update.
- **symmetric**: Whether to exploit the symmetric property of the provided examples.

## ccv_convnet_layer_train_param_t

- **bias**: A **ccv_convnet_layer_sgd_param_t** specifies the stochastic gradient descent update rule for bias, it is only applicable for full connect layer and convolutional layer weight.
- **dor**: The dropout rate for this layer, it is only applicable for full connect layer.
- **w**: A **ccv_convnet_layer_sgd_param_t** specifies the stochastic gradient descent update rule for weight, it is only applicable for full connect layer and convolutional layer.

## ccv_convnet_layer_sgd_param_t

- **decay**: See **learn_rate**.
- **learn_rate**: New velocity = **momentum** _ old velocity - **decay** _ **learn_rate** _ old value + **learn_rate** _ delta, new value = old value + new velocity
- **momentum**: See **learn_rate**.

## ccv_convnet_encode

    void ccv_convnet_encode(ccv_convnet_t *convnet, ccv_dense_matrix_t **a, ccv_dense_matrix_t **b, int batch)

Use a convolutional network to encode an image into a compact representation.

- **convnet**: The given convolutional network.
- **a**: A C-array of input images.
- **b**: A C-array of output matrix of compact representation.
- **batch**: The number of input images.

## ccv_convnet_classify

    void ccv_convnet_classify(ccv_convnet_t *convnet, ccv_dense_matrix_t **a, int symmetric, ccv_array_t **ranks, int tops, int batch)

Use a convolutional network to classify an image into categories.

- **convnet**: The given convolutional network.
- **a**: A C-array of input images.
- **symmetric**: Whether the input is symmetric.
- **ranks**: A C-array of **ccv_array_t** contains top categories by the convolutional network.
- **tops**: The number of top categories return for each image.
- **batch**: The number of input images.

## ccv_convnet_read

    ccv_convnet_read(int use_cwc_accel, const char *filename)

Read a convolutional network that persisted on the disk.

- **use_cwc_accel**: Use CUDA-enabled GPU acceleration.
- **filename**: The file on the disk.

## ccv_convnet_write

    void ccv_convnet_write(ccv_convnet_t *convnet, const char *filename, ccv_convnet_write_param_t params)

Write a convolutional network to a disk.

- **convnet**: A given convolutional network.
- **filename**: The file on the disk.
- **params**: A **ccv_convnet_write_param_t** to specify the write parameters.

## ccv_convnet_write_param_t

- **half_precision**: Use half precision float point to represent network parameters.

## ccv_convnet_compact

    void ccv_convnet_compact(ccv_convnet_t *convnet)

Free up temporary resources of a given convolutional network.

- **convnet**: A convolutional network.

## ccv_convnet_free

    void ccv_convnet_free(ccv_convnet_t *convnet)

Free up the memory of a given convolutional network.

- **convnet**: A convolutional network.
