import React from 'react';
import { Trash2 } from 'lucide-react';

export default function SubscriptionList({ subscriptions, onSubscriptionDeleted }) {
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onSubscriptionDeleted();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (sub) => {
    try {
      const nextStatus = sub.status === 'paused' ? 'active' : 'paused';
      const response = await fetch(`/api/subscriptions/${sub._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...sub,
          status: nextStatus,
        }),
      });

      if (response.ok) {
        onSubscriptionDeleted();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getTrialDaysRemaining = (renewalDateString) => {
    if (!renewalDateString) return 0;
    const renewalDate = new Date(renewalDateString);
    const today = new Date();
    renewalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="ledger-card">
      <h2>Active Subscriptions</h2>
      {subscriptions.length === 0 ? (
        <div className="empty-state">No subscriptions tracked yet. Add one above!</div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Service</th>
                <th>Category</th>
                <th>Price</th>
                <th>Cycle</th>
                <th>Next Renewal</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => {
                const daysLeft = getTrialDaysRemaining(sub.nextRenewalDate);
                return (
                  <tr 
                    key={sub._id} 
                    className={sub.status === 'paused' ? 'paused-row' : ''}
                  >
                    <td className="sub-name-cell">
                      <span className="sub-name-text">{sub.name}</span>
                      {sub.isTrial && (
                        <span className="trial-countdown-badge">
                          Trial ends in {daysLeft}d
                        </span>
                      )}
                    </td>
                    <td>{sub.category || 'Other'}</td>
                    <td>${parseFloat(sub.price).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${sub.billingCycle}`}>
                        {sub.billingCycle}
                      </span>
                    </td>
                    <td>{formatDate(sub.nextRenewalDate)}</td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(sub)}
                        className={`status-toggle-btn ${sub.status}`}
                      >
                        {sub.status === 'paused' ? 'Paused' : 'Active'}
                      </button>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(sub._id)}
                        className="delete-btn"
                        aria-label={`Delete ${sub.name}`}
                      >
                        <Trash2 className="delete-icon" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
