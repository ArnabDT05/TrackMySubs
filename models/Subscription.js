import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  billingCycle: {
    type: String,
    required: true,
    enum: ['weekly', 'monthly', 'yearly']
  },
  nextRenewalDate: {
    type: Date,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Entertainment', 'Utilities', 'Dev Tools', 'Health', 'Other'],
    default: 'Other'
  }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
