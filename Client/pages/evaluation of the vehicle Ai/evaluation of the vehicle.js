const valueToMB_MD = {
  "1.0": { MB: 1.0, MD: 0.0 },
  "0.9": { MB: 0.9, MD: 0.0 },
  "0.8": { MB: 0.8, MD: 0.0 },
  "0.6": { MB: 0.6, MD: 0.0 },
  "0.4": { MB: 0.4, MD: 0.1 },
  "0.0": { MB: 0.1, MD: 0.1 },
  "-0.4": { MB: 0.1, MD: 0.4 },
  "-0.6": { MB: 0.1, MD: 0.6 },
  "-0.8": { MB: 0.1, MD: 0.8 },
  "-1.0": { MB: 0.0, MD: 1.0 }
};

function combineValues(values) {
  let MB = 0;
  let MD = 0;

  values.forEach(val => {
    const valStr = parseFloat(val).toFixed(1);
    const entry = valueToMB_MD[valStr];

    if (!entry) {
      console.warn(`⚠️ Unrecognized value: ${val}`);
      return;
    }

    MB = MB + entry.MB * (1 - MB);
    MD = MD + entry.MD * (1 - MD);
  });

  return parseFloat((MB - MD).toFixed(3));
}

function calculateAllCFandPrice() {
  const fieldsets = document.querySelectorAll("fieldset");
  let totalCF = 0, count = 0;
  let fullResult = "<h3>🧠 CF Evaluation:</h3><ul>";

  for (const fieldset of fieldsets) {
    const selected = fieldset.querySelectorAll("input[type='radio']:checked");
    if (selected.length === 0) {
      document.getElementById("fullResult").innerHTML = "<div class='warning'>⚠️ Please complete all evaluation sections before calculating.</div>";
      return;
    }
  }

  fieldsets.forEach(fieldset => {
    const title = fieldset.querySelector("legend strong")?.innerText || "Untitled Section";
    const selected = fieldset.querySelectorAll("input[type='radio']:checked");
    const values = Array.from(selected).map(r => r.value);
    const cf = combineValues(values);
    totalCF += cf;
    count++;
    let color = cf >= 0.7 ? "green" : cf >= 0.3 ? "orange" : "red";
    fullResult += `<li><strong>${title}</strong>: <span style='color:${color}'>CF = ${cf.toFixed(3)}</span></li>`;
  });

  const avgCF = count > 0 ? parseFloat((totalCF / count).toFixed(3)) : 0;
  fullResult += `<p><strong>Average CF:</strong> ${avgCF.toFixed(3)}</p>`;

  const basePrice = parseFloat(document.getElementById("basePrice")?.value || 0);
  const mileage = parseFloat(document.getElementById("mileage")?.value || 0);
  const year = parseInt(document.getElementById("manufactureYear")?.value || "2025");
  const licenseYears = parseInt(document.getElementById("licenseYears")?.value || 0);
  const maintenance = document.getElementById("maintenance")?.value || "regular";
  const extras = document.querySelectorAll(".extra:checked").length;

  const ageFactor = Math.max(0.7, 1 - (2025 - year) * 0.03);
  const mileageFactor = mileage > 60000 ? 0.93 : 1;
  const licenseFactor = 1 + (licenseYears * 0.01);
  const maintenanceFactor = maintenance === "regular" ? 1 : 0.95;
  const extrasFactor = 1 + (extras * 0.008);

  const cfValue = basePrice * 0.6 * avgCF;
  const othersValue = basePrice * 0.4 * ageFactor * mileageFactor * licenseFactor * maintenanceFactor * extrasFactor;
  const finalPrice = cfValue + othersValue;
  window.lastFinalPrice = finalPrice;

  const cfPercent = ((cfValue / finalPrice) * 100).toFixed(1);
  const otherPercent = ((othersValue / finalPrice) * 100).toFixed(1);

  fullResult += `
    <table id="priceBreakdown">
      <tr><th>Component</th><th>Value (EGP)</th><th>Contribution (%)</th></tr>
      <tr><td>CF Score Contribution (60%)</td><td>${cfValue.toFixed(0)}</td><td>${cfPercent}%</td></tr>
      <tr><td>Other Factors (40%)</td><td>${othersValue.toFixed(0)}</td><td>${otherPercent}%</td></tr>
      <tr class="highlight"><td><strong>Final Vehicle Estimated Price</strong></td><td colspan="2"><strong>EGP ${finalPrice.toFixed(0)}</strong></td></tr>
    </table>
  `;

  document.getElementById("fullResult").innerHTML = fullResult;
  document.getElementById("marketCompareSection").style.display = "block";

  const ctx = document.getElementById('cfPieChart')?.getContext('2d');
  if (ctx) {
    if (window.cfChart) window.cfChart.destroy();
    window.cfChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [
          `CF Contribution (60%) - ${cfValue.toFixed(0)} EGP`,
          `Other Factors (40%) - ${othersValue.toFixed(0)} EGP`
        ],
        datasets: [{
          data: [cfValue, othersValue],
          backgroundColor: ['#4CAF50', '#FF9800']
        }]
      },
      options: {
        plugins: {
          legend: { position: 'bottom' },
          title: {
            display: true,
            text: 'Price Contribution Breakdown (%)'
          },
          tooltip: {
            callbacks: {
              label: (ctx) => `${ctx.label}: ${ctx.raw.toFixed(0)} EGP`
            }
          }
        }
      }
    });
  }
}


function compareWithMarket() {
  const inputs = document.querySelectorAll(".marketPrice");
  const prices = Array.from(inputs)
    .map(i => parseFloat(i.value))
    .filter(p => !isNaN(p) && p > 0);

  if (prices.length === 0) {
    document.getElementById("marketComparisonResult").innerHTML = "<span style='color: red;'>❗ Please enter at least one valid market price.</span>";
    return;
  }

  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const finalPrice = window.lastFinalPrice || 0;

  if (finalPrice === 0) {
    document.getElementById("marketComparisonResult").innerHTML = "<span style='color: red;'>❗ Final price not calculated yet.</span>";
    return;
  }

  const diff = finalPrice - avg;
  const percentRaw = (diff / avg) * 100;
  const percent = percentRaw.toFixed(1);
  const direction = percentRaw > 0 ? 'Higher than market average' : (percentRaw < 0 ? 'Lower than market average' : 'Same as market average');
  const color = percentRaw > 0 ? 'green' : (percentRaw < 0 ? 'red' : 'gray');
  const status = finalPrice < min ? "Below market range ❗" : finalPrice > max ? "Above market range ⚠️" : "Within market range ✅";
  const barPercentage = Math.min(Math.max((finalPrice - min) / (max - min), 0), 1) * 100;

  const barHTML = `
    <div style="margin-top: 20px; padding: 20px; border-radius: 10px; background: #f8f8f8; box-shadow: 0 0 10px rgba(0,0,0,0.1); font-family: sans-serif;">
      <h3 style="margin-bottom: 10px;">📊 Market Price Comparison</h3>

      <div style="margin-bottom: 10px;">
        <strong style="color: #555;">Market Avg:</strong>
        <span style="color: #2196F3;">EGP ${avg.toLocaleString()}</span>
      </div>

      <div style="margin-bottom: 10px;">
        <strong style="color: #555;">Your Estimate:</strong>
        <span style="color: #4CAF50;">EGP ${finalPrice.toLocaleString()}</span>
      </div>

      <div style="margin-bottom: 10px;">
        <strong>Difference:</strong>
        <span style="color: ${color}; font-weight: bold;">
          ${percent > 0 ? "+" : ""}${percent}% (${direction})
        </span>
      </div>

      <div style="margin-bottom: 10px;">
        <strong>Status:</strong> 
        <span style="font-weight: bold; color: ${status.includes('Within') ? 'green' : (status.includes('Above') ? '#e91e63' : '#f44336')}">${status}</span>
      </div>

      <div style="position: relative; height: 20px; background: #ddd; border-radius: 10px; overflow: hidden; margin-top: 20px;">
        <div style="width: ${barPercentage}%; background: linear-gradient(to right, #4CAF50, #2196F3); height: 100%;"></div>
        <div style="position: absolute; top: -22px; left: 0; font-size: 12px;">Min: ${min.toLocaleString()}</div>
        <div style="position: absolute; top: -22px; right: 0; font-size: 12px;">Max: ${max.toLocaleString()}</div>
        <div style="position: absolute; top: 22px; left: ${barPercentage}%; transform: translateX(-50%); font-size: 12px; font-weight: bold;">You</div>
      </div>
    </div>
  `;

  document.getElementById("marketComparisonResult").innerHTML = barHTML;
}
