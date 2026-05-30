import React, { useState } from 'react';
import { Bell } from 'lucide-react';

export default function NotificationBell({ subscriptions }) {
  const [isOpen, setIsOpen] = useState(false);

  const getDaysRemaining = (renewalDateString) => {
    if (!renewalDateString) return 0;
    const renewalDate = new Date(renewalDateString);
    const today = new Date();
    renewalDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = renewalDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const urgentSubscriptions = subscriptions.filter((sub) => {
    if (sub.status === 'paused') return false;
    const daysLeft = getDaysRemaining(sub.nextRenewalDate);
    return daysLeft >= 0 && daysLeft <= 3;
  });

  return (
    <div className="bell-container">
      <button 
        className="bell-btn" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
      >
        <Bell className="bell-icon" />
        {urgentSubscriptions.length > 0 && (
          <span className="bell-badge">{urgentSubscriptions.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="bell-dropdown">
          <div className="bell-dropdown-header">
            <h4>Alerts Dashboard</h4>
          </div>
          {urgentSubscriptions.length === 0 ? (
            <div className="bell-dropdown-empty">No renewals in the next 3 days.</div>
          ) : (
            <div className="bell-dropdown-list">
              {urgentSubscriptions.map((sub) => {
                const daysLeft = getDaysRemaining(sub.nextRenewalDate);
                const dayText = daysLeft === 1 ? 'tomorrow' : `in ${daysLeft} days`;
                return (
                  <div className="bell-dropdown-item" key={sub._id}>
                    Your <strong>{sub.name}</strong> sub renews {dayText} (${parseFloat(sub.price).toFixed(2)})
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
