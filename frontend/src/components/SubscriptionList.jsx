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
      console.error('Failed to delete subscription:', err);
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub._id}>
                  <td className="sub-name-cell">{sub.name}</td>
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
                      onClick={() => handleDelete(sub._id)}
                      className="delete-btn"
                      aria-label={`Delete ${sub.name}`}
                    >
                      <Trash2 className="delete-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
