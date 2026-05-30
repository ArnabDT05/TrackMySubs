import cron from 'node-cron';
import Subscription from '../models/Subscription.js';

const checkRenewals = async () => {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) return;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const subscriptions = await Subscription.find({
      nextRenewalDate: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    for (const sub of subscriptions) {
      const payload = {
        content: `🚨 **Upcoming Subscription Renewal** 🚨\n**Service:** ${sub.name}\n**Price:** $${sub.price.toFixed(2)} (${sub.billingCycle})\n**Renewal Date:** ${new Date(sub.nextRenewalDate).toDateString()}`
      };

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
};

export const initAlertWorker = () => {
  cron.schedule('0 0 * * *', checkRenewals);
};
