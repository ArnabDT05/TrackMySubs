import React, { useState, useEffect } from 'react';
import { CreditCard } from 'lucide-react';
import SubscriptionForm from './components/SubscriptionForm';
import CostCards from './components/CostCards';
import SubscriptionList from './components/SubscriptionList';
import { CategoryDonutChart, ForecastingLineChart } from './components/AnalyticsCharts';
import PaymentAggregation from './components/PaymentAggregation';
import NotificationBell from './components/NotificationBell';

export default function App() {
  const [subscriptions, setSubscriptions] = useState([]);

  const fetchSubscriptions = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      }
    } catch (err) {
      console.error('Failed to fetch subscriptions:', err);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <CreditCard className="brand-icon" />
          <span className="brand-name">TrackMySubs</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1>Subscription Tracker</h1>
            <p>Monitor, optimize, and manage your recurring bills</p>
          </div>
          <NotificationBell subscriptions={subscriptions} />
        </header>

        <CostCards subscriptions={subscriptions} />

        <PaymentAggregation subscriptions={subscriptions} />

        <div className="analytics-grid">
          <CategoryDonutChart subscriptions={subscriptions} />
          <ForecastingLineChart subscriptions={subscriptions} />
        </div>

        <div className="dashboard-body">
          <div className="form-column">
            <SubscriptionForm onSubscriptionAdded={fetchSubscriptions} />
          </div>
          <div className="list-column">
            <SubscriptionList 
              subscriptions={subscriptions} 
              onSubscriptionDeleted={fetchSubscriptions} 
            />
          </div>
        </div>
      </main>
    </div>
  );
}
