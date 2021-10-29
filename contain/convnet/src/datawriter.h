#ifndef DATAWRITER_H_
#define DATAWRITER_H_
#include "layer.h"
/** Writes data into an HDF5 file.
 * Handles multiple output streams.
 */ 
class DataWriter {
 public:
  DataWriter(const config::FeatureExtractorConfig config);
  virtual ~DataWriter();
  void SetNumDims(const std::string& name, const int num_dims);
  void SetDataSetSize(int dataset_size);
  virtual void Write(std::vector<Layer*>& layers, int numcases);
  void WriteHDF5(Matrix& m, const std::string& dataset, int numcases, bool transpose);
  void WriteHDF5SeqBuf(Matrix& m, const std::string& dataset, int numcases);

 private:
  int dataset_size_;
  typedef struct {
    int num_dims, current_row, average_batches, average_online, counter, consumed;
    hid_t dataset;
    Matrix buf, seq_buf;
  } stream;
  std::map<std::string, stream> streams_;
  hid_t file_;
};
#endif
