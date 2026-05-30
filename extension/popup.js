document.addEventListener('DOMContentLoaded', async () => {
  const nameInput = document.getElementById('name');
  const priceInput = document.getElementById('price');
  const billingCycleSelect = document.getElementById('billingCycle');
  const statusDiv = document.getElementById('status');
  const form = document.getElementById('sub-form');
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab && tab.url) {
      const hostname = new URL(tab.url).hostname;
      const cleanParts = hostname.replace('www.', '').split('.');
      let cleanName = cleanParts[0] || '';
      if (cleanName) {
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }
      nameInput.value = cleanName;

      chrome.tabs.sendMessage(tab.id, { action: 'scrapePrice' }, (response) => {
        if (chrome.runtime.lastError) {
          return;
        }
        if (response && response.price) {
          const parsed = parseFloat(response.price);
          if (!isNaN(parsed)) {
            priceInput.value = parsed.toFixed(2);
          }
        }
      });
    }
  } catch (err) {
    console.error(err);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusDiv.className = 'status-msg';
    statusDiv.textContent = '';

    const name = nameInput.value;
    const price = parseFloat(priceInput.value);
    const billingCycle = billingCycleSelect.value;
    const category = document.getElementById('category').value;
    const paymentMethod = document.getElementById('paymentMethod').value.trim() || 'Cash/Unlinked';
    const isTrial = document.getElementById('isTrial').checked;

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextRenewalDate = nextMonth.toISOString().split('T')[0];

    try {
      const response = await fetch('http://localhost:5001/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          price,
          billingCycle,
          nextRenewalDate,
          category,
          isTrial,
          paymentMethod,
          status: 'active'
        }),
      });

      if (response.status === 201) {
        statusDiv.className = 'status-msg success';
        statusDiv.textContent = 'Subscription saved successfully!';
        priceInput.value = '';
        document.getElementById('category').value = 'Other';
        document.getElementById('paymentMethod').value = '';
        document.getElementById('isTrial').checked = false;
      } else {
        const errorData = await response.json();
        statusDiv.className = 'status-msg error';
        statusDiv.textContent = errorData.error || 'Failed to save subscription.';
      }
    } catch (err) {
      statusDiv.className = 'status-msg error';
      statusDiv.textContent = 'Server connection failed.';
    }
  });
});
