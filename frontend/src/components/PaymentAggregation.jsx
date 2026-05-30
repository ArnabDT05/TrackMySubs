import React from 'react';
import { Wallet } from 'lucide-react';

export default function PaymentAggregation({ subscriptions }) {
  const calculateAggregates = () => {
    const activeSubs = subscriptions.filter(sub => sub.status !== 'paused');
    const groups = {};

    activeSubs.forEach((sub) => {
      let rawMethod = sub.paymentMethod;
      if (typeof rawMethod === 'string') {
        rawMethod = rawMethod.trim();
      }
      const method = rawMethod || 'Cash/Unlinked';

      const price = parseFloat(sub.price) || 0;
      let monthlyEquivalent = price;

      if (sub.billingCycle === 'weekly') {
        monthlyEquivalent = price * 4.33;
      } else if (sub.billingCycle === 'yearly') {
        monthlyEquivalent = price / 12;
      }

      if (groups[method]) {
        groups[method] += monthlyEquivalent;
      } else {
        groups[method] = monthlyEquivalent;
      }
    });

    return Object.keys(groups).map((key) => ({
      method: key,
      amount: groups[key],
    }));
  };

  const aggregates = calculateAggregates();

  if (aggregates.length === 0) {
    return null;
  }

  return (
    <div className="payment-aggregation-section">
      <h3>Spend by Payment Method</h3>
      <div className="payment-scroll-wrapper">
        {aggregates.map((agg) => (
          <div className="payment-micro-card" key={agg.method}>
            <div className="payment-micro-header">
              <Wallet className="payment-micro-icon" />
              <span className="payment-micro-title">{agg.method}</span>
            </div>
            <span className="payment-micro-amount">${agg.amount.toFixed(2)}/mo</span>
          </div>
        ))}
      </div>
    </div>
  );
}
