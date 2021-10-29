#ifndef IMAGE_ITERATORS_
#define IMAGE_ITERATORS_

#include <string>
#include <iostream>
#include <vector>
#include <random>

#include <opencv2/core/core.hpp>

typedef struct {
  float xmin, ymin, xmax, ymax;
} box;

/** An iterator over list of image files.
 * Takes a list of image files and iterates over them.
 * Images are cropped, jittered, flipped etc.
 */ 
template<typename T>
class RawImageFileIterator {
public:
  RawImageFileIterator(const std::vector<std::string> &filelist, const int image_size_y,
                       const int image_size_x, const int raw_image_size_y,
                       const int raw_image_size_x, const bool flip,
                       const bool translate, const bool random_jitter,
                       const int max_angle, const float min_scale);
  virtual ~RawImageFileIterator();

  // Memory must already be allocated : num_dims * num_dims * 3.
  void GetNext(T* data_ptr);
  void GetNext(T* data_ptr, const int row, const int position);
  void Get(T* data_ptr, const int row, const int position);

  void Seek(int row) { row_ = row; }
  int Tell() const { return row_; }
  void SetMaxDataSetSize(int max_dataset_size);
  virtual int GetDataSetSize() const;
  virtual void SampleNoiseDistributions(const int chunk_size);
  virtual void RectifyBBox(box& b, int width, int height, int row) const;

  // Transform image into a (size_x, size_y) image preserving aspect ratio.
  // Rotate by angle (in degrees), translate by (trans_x, trans_y) and scale by factor.
  // Translations are numbers between 0 and 1 (fraction of max translation).
  // Scale must be bigger than 1.0.
  static void Transform(cv::Mat &image, float angle, float trans_x,
                        float trans_y, float scale, int size_x, int size_y);

protected:
  virtual void LoadImageFile(const int row, cv::Mat &image);

private:
  void Resize(cv::Mat &image) const;
  void AddRandomJitter(cv::Mat &image, int row) const;
  void ExtractRGB(cv::Mat &image, T* data_ptr, int position) const;
  void GetCoordinates(int width, int height, int position, int* left, int* top, bool* flip) const;

  std::default_random_engine generator_;
  std::uniform_real_distribution<float> * distribution_;
  std::vector<float> angles_, trans_y_, trans_x_, scale_;
  int dataset_size_, row_, image_id_, position_;
  std::vector<std::string> filenames_;
  cv::Mat image_;
  const int image_size_y_, image_size_x_, num_positions_, raw_image_size_y_,
            raw_image_size_x_;
  const bool random_jitter_;
  const int max_angle_;
  const float min_scale_;
};

/** An iterator over sliding windows of an image.*/
template<typename T>
class SlidingWindowIterator {
public:
  SlidingWindowIterator(const int window_size, const int stride);
  void SetImage(const std::string& filename);
  int GetNumWindows() { return num_windows_;}
  void GetNext(T* data_ptr);
  void GetNext(T* data_ptr, int left, int top);
  bool Done();
  void Reset();

private:
  const int window_size_, stride_;
  int num_windows_, center_x_, center_y_;
  cv::Mat image_;
  bool done_;
};

/** A Bounding-box aware image file iterator.*/
template<typename T>
class BBoxImageFileIterator : public RawImageFileIterator<T> {
public:
  BBoxImageFileIterator(const std::vector<std::string>& filelist, const std::string& bbox_file,
                        const int image_size_y, const int image_size_x,
                        const int raw_image_size_y, const int raw_image_size_x,
                        const bool flip, const bool translate,
                        const bool random_jitter, const int max_angle,
                        const float min_scale, const float context_factor,
                        const bool center_on_bbox);
  virtual ~BBoxImageFileIterator();
  
  virtual void SampleNoiseDistributions(const int chunk_size);
  virtual void RectifyBBox(box& b, int width, int height, int row) const;

protected:
  virtual void LoadImageFile(const int row, cv::Mat &image);

private:
  void GetCropCoordinates(int row, int width, int height, int* xmin, int* xmax, int* ymin, int* ymax) const;
  std::default_random_engine generator_;
  std::uniform_real_distribution<float> * distribution_;
  std::vector<std::vector<box>> data_;
  std::vector<float> box_rv_;
  const float context_factor_;
  const bool center_on_bbox_;
};

/** An iterator over cropped windows of an image.*/
template<typename T>
class CropIterator {
public:
  CropIterator(const int image_size, const float context_factor, const bool warp_bbox);
  void SetImage(const std::string& filename, const std::vector<box>& crops);
  void GetNext(T* data_ptr);
  bool Done();
  void Reset();

private:
  const int image_size_;
  cv::Mat image_;
  std::vector<box> crops_;
  bool done_;
  int index_;
  const float context_factor_;
  const bool warp_bbox_;
};

#endif
