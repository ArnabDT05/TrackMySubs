import express from 'express';
import Subscription from '../models/Subscription.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, price, billingCycle, nextRenewalDate } = req.body;
    const subscription = new Subscription({
      name,
      price,
      billingCycle,
      nextRenewalDate
    });
    const savedSubscription = await subscription.save();
    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, price, billingCycle, nextRenewalDate } = req.body;
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { name, price, billingCycle, nextRenewalDate },
      { new: true, runValidators: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!deletedSubscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
