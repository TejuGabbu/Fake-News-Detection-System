/**
 * VERITAS AI - ADMIN DASHBOARD & RETRAINING SCRIPT
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Chart.js Initialization for Verdict Distribution
    // -------------------------------------------------------------------------
    const chartCanvas = document.getElementById('chart-verdict-distribution');
    let verdictChart = null;

    if (chartCanvas && window.ADMIN_DATA) {
        const real = window.ADMIN_DATA.realCount || 0;
        const fake = window.ADMIN_DATA.fakeCount || 0;

        const ctx = chartCanvas.getContext('2d');
        verdictChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Real News', 'Potentially Fake News'],
                datasets: [{
                    data: [real, fake],
                    backgroundColor: ['#10b981', '#f43f5e'],
                    borderColor: 'transparent',
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = real + fake;
                                const val = context.raw || 0;
                                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                                return ` ${context.label}: ${val} (${pct}%)`;
                            }
                        }
                    }
                },
                cutout: '72%'
            }
        });
    }

    // -------------------------------------------------------------------------
    // 2. Model Retraining Studio Form Handler
    // -------------------------------------------------------------------------
    const retrainForm = document.getElementById('retrain-form');
    const retrainBtn = document.getElementById('btn-retrain');
    const algorithmSelect = document.getElementById('algorithm-select');

    if (retrainForm && retrainBtn) {
        retrainForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const algorithm = algorithmSelect ? algorithmSelect.value : 'logistic_regression';

            // Loading state
            const btnText = retrainBtn.querySelector('.retrain-btn-text');
            const spinner = retrainBtn.querySelector('.spinner-border');
            const loadingText = retrainBtn.querySelector('.retrain-loading-text');

            retrainBtn.disabled = true;
            if (btnText) btnText.classList.add('d-none');
            if (spinner) spinner.classList.remove('d-none');
            if (loadingText) loadingText.classList.remove('d-none');

            try {
                const response = await fetch('/admin/retrain', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ algorithm })
                });

                if (!response.ok) {
                    const err = await response.json();
                    throw new Error(err.error || 'Retraining failed');
                }

                const metrics = await response.json();

                // Update UI metrics
                const badge = document.getElementById('retrained-model-badge');
                if (badge) badge.textContent = metrics.model_name;

                const metricAcc = document.getElementById('metric-acc');
                if (metricAcc) metricAcc.textContent = `${metrics.accuracy}%`;

                const metricPrec = document.getElementById('metric-prec');
                if (metricPrec) metricPrec.textContent = `${metrics.precision}%`;

                const metricRec = document.getElementById('metric-rec');
                if (metricRec) metricRec.textContent = `${metrics.recall}%`;

                const metricF1 = document.getElementById('metric-f1');
                if (metricF1) metricF1.textContent = `${metrics.f1_score}%`;

                alert(`Successfully retrained model: ${metrics.model_name}\nAccuracy: ${metrics.accuracy}%\nF1-Score: ${metrics.f1_score}%`);

            } catch (err) {
                console.error(err);
                alert(`Error during retraining: ${err.message}`);
            } finally {
                retrainBtn.disabled = false;
                if (btnText) btnText.classList.remove('d-none');
                if (spinner) spinner.classList.add('d-none');
                if (loadingText) loadingText.classList.add('d-none');
            }
        });
    }
});
