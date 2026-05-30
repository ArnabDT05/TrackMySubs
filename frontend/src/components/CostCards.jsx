import React from 'react';

export default function CostCards({ subscriptions }) {
  const calculateTotals = () => {
    const monthlyCosts = subscriptions.map((sub) => {
      const price = parseFloat(sub.price) || 0;
      if (sub.billingCycle === 'weekly') {
        return price * 4.33;
      }
      if (sub.billingCycle === 'yearly') {
        return price / 12;
      }
      return price;
    });

    const totalMonthly = monthlyCosts.reduce((acc, curr) => acc + curr, 0);
    const totalYearly = totalMonthly * 12;

    return {
      monthly: totalMonthly.toFixed(2),
      yearly: totalYearly.toFixed(2),
    };
  };

  const totals = calculateTotals();

  return (
    <div className="cost-cards-grid">
      <div className="stat-card">
        <h3>Total Monthly Spend</h3>
        <p className="stat-value">${totals.monthly}</p>
        <span className="stat-change positive">Standardized equivalent</span>
      </div>
      <div className="stat-card">
        <h3>Total Yearly Spend</h3>
        <p className="stat-value">${totals.yearly}</p>
        <span className="stat-change positive">Projected annual outlay</span>
      </div>
    </div>
  );
}
