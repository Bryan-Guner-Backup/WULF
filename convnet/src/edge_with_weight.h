#ifndef EDGE_WITH_WEIGHT_H_
#define EDGE_WITH_WEIGHT_H_
#include "edge.h"
#include "optimizer.h"

/** Base class for all edges which have weights.
 * All edges which have trainable parameters should inherit from this class.
 */ 
class EdgeWithWeight : public Edge {
 public:
  EdgeWithWeight(const config::Edge& edge_config);
  ~EdgeWithWeight();

  virtual void Initialize();
  virtual void SaveParameters(hid_t file);
  virtual void LoadParameters(hid_t file);
  virtual void LoadParameters(hid_t file, const std::string& edge_name);

  virtual float GetRMSWeight();
  virtual void ReduceLearningRate(float factor);
  virtual bool HasNoParameters() const;
  virtual int GetNumModules() const;
  virtual void DisplayWeights();
  virtual void DisplayWeightStats();
  virtual void SetTiedTo(Edge* e);
  virtual void NotifyStart();

  virtual void UpdateWeights();
  Matrix& GetWeight() { return weights_;}
  Matrix& GetGradWeight() { return grad_weights_;}
  Matrix& GetBias() { return bias_;}
  Matrix& GetGradBias() { return grad_bias_;}

  float GetDecayedEpsilon(float base_epsilon) const;
  float GetMomentum() const;

 protected:
  
  // Tied edge management.
  void IncrementNumGradsReceived();
  int GetNumGradsReceived();

  Matrix weights_, grad_weights_, bias_, grad_bias_;
  Optimizer * const weight_optimizer_;
  Optimizer * const bias_optimizer_;
  EdgeWithWeight* tied_edge_;

  const config::Edge::Initialization initialization_;

  // Hyperparams.
  const float init_wt_, init_bias_;

  const bool has_no_bias_;
  int num_grads_received_, num_shares_;
  const float scale_gradients_;

  const std::string pretrained_model_, pretrained_edge_name_;
};
#endif
