chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrapePrice') {
    try {
      const cleanPrice = (str) => {
        let clean = '';
        for (let i = 0; i < str.length; i++) {
          const char = str[i];
          if ((char >= '0' && char <= '9') || char === '.') {
            clean += char;
          }
        }
        return clean;
      };

      const currencyRegex = /(?:[\$₹€£]\s*\d+\.\d{2})|(?:\d+\.\d{2}\s*[\$₹€£])/;
      const text = document.body.innerText || '';
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const keywords = ['total', 'due', 'pay', 'price', 'renew', '/mo', 'amount'];

      let foundPrice = '';

      for (const line of lines) {
        const lowerLine = line.toLowerCase();
        const hasKeyword = keywords.some(kw => lowerLine.includes(kw));
        if (hasKeyword) {
          const match = line.match(currencyRegex);
          if (match) {
            foundPrice = cleanPrice(match[0]);
            break;
          }
        }
      }

      if (!foundPrice) {
        const allElements = Array.from(document.querySelectorAll('*'));
        let maxFontSize = 0;
        let bestElementText = '';

        for (const el of allElements) {
          if (el.children.length === 0) {
            const elText = (el.textContent || '').trim();
            if (currencyRegex.test(elText)) {
              const style = window.getComputedStyle(el);
              const fontSize = parseInt(style.fontSize, 10) || 0;
              if (fontSize > maxFontSize) {
                maxFontSize = fontSize;
                bestElementText = elText;
              }
            }
          }
        }

        if (bestElementText) {
          const match = bestElementText.match(currencyRegex);
          if (match) {
            foundPrice = cleanPrice(match[0]);
          }
        }
      }

      sendResponse({ price: foundPrice || '' });
    } catch (err) {
      sendResponse({ price: '' });
    }
  }
  return true;
});
