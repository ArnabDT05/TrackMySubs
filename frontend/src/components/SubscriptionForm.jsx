import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export default function SubscriptionForm({ onSubscriptionAdded }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [nextRenewalDate, setNextRenewalDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !price || !nextRenewalDate) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          billingCycle,
          nextRenewalDate,
        }),
      });

      if (response.status === 201) {
        setName('');
        setPrice('');
        setBillingCycle('monthly');
        setNextRenewalDate('');
        onSubscriptionAdded();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create subscription');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="form-card">
      <h2>Add New Subscription</h2>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="sub-name">Service Name</label>
          <input
            id="sub-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Netflix, Spotify"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="sub-price">Price ($)</label>
            <input
              id="sub-price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="sub-cycle">Billing Cycle</label>
            <select
              id="sub-cycle"
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="sub-date">Next Renewal Date</label>
          <input
            id="sub-date"
            type="date"
            value={nextRenewalDate}
            onChange={(e) => setNextRenewalDate(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          <Plus className="btn-icon" />
          <span>Add Subscription</span>
        </button>
      </form>
    </div>
  );
}
