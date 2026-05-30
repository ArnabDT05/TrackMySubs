import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid 
} from 'recharts';

const COLORS = {
  'Entertainment': '#e71d36',
  'Utilities': '#ff9f43',
  'Dev Tools': '#66fcf1',
  'Health': '#2ec4b6',
  'Other': '#9b59b6'
};

export function CategoryDonutChart({ subscriptions }) {
  const processData = () => {
    const totals = {
      'Entertainment': 0,
      'Utilities': 0,
      'Dev Tools': 0,
      'Health': 0,
      'Other': 0
    };

    const activeSubs = subscriptions.filter(sub => sub.status !== 'paused');
    activeSubs.forEach((sub) => {
      const price = parseFloat(sub.price) || 0;
      let monthlyEquivalent = price;
      
      if (sub.billingCycle === 'weekly') {
        monthlyEquivalent = price * 4.33;
      } else if (sub.billingCycle === 'yearly') {
        monthlyEquivalent = price / 12;
      }

      const category = sub.category || 'Other';
      if (totals[category] !== undefined) {
        totals[category] += monthlyEquivalent;
      } else {
        totals['Other'] += monthlyEquivalent;
      }
    });

    return Object.keys(totals)
      .map(name => ({
        name,
        value: parseFloat(totals[name].toFixed(2))
      }))
      .filter(item => item.value > 0);
  };

  const data = processData();

  return (
    <div className="chart-card">
      <h3>Monthly Spend by Category</h3>
      <div className="chart-container">
        {data.length === 0 ? (
          <div className="empty-state">No data available</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#9b59b6'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1f2833', borderColor: '#2d3748', color: '#fff' }}
                formatter={(value) => [`$${value}`, 'Monthly Cost']}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export function ForecastingLineChart({ subscriptions }) {
  const generateData = () => {
    const data = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const currentDate = new Date();
    
    for (let i = 0; i < 12; i++) {
      const futureDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const targetMonth = futureDate.getMonth();
      const targetYear = futureDate.getFullYear();
      
      let monthlyTotal = 0;

      const activeSubs = subscriptions.filter(sub => sub.status !== 'paused');
      activeSubs.forEach((sub) => {
        const price = parseFloat(sub.price) || 0;
        
        if (sub.billingCycle === 'weekly') {
          monthlyTotal += price * 4.33;
        } else if (sub.billingCycle === 'monthly') {
          monthlyTotal += price;
        } else if (sub.billingCycle === 'yearly') {
          if (sub.nextRenewalDate) {
            const renewal = new Date(sub.nextRenewalDate);
            if (renewal.getMonth() === targetMonth) {
              monthlyTotal += price;
            }
          }
        }
      });

      data.push({
        name: `${monthNames[targetMonth]} ${targetYear.toString().slice(-2)}`,
        amount: parseFloat(monthlyTotal.toFixed(2))
      });
    }

    return data;
  };

  const data = generateData();

  return (
    <div className="chart-card">
      <h3>12-Month Outlay Forecasting</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
            <XAxis dataKey="name" stroke="#8f9499" fontSize={10} />
            <YAxis stroke="#8f9499" fontSize={10} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1f2833', borderColor: '#2d3748', color: '#fff' }}
              formatter={(value) => [`$${value}`, 'Projected Spend']}
            />
            <Line 
              type="monotone" 
              dataKey="amount" 
              stroke="#66fcf1" 
              strokeWidth={3} 
              activeDot={{ r: 6 }} 
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
