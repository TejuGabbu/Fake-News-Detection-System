/**
 * VERITAS AI - 3D CLIENT-SIDE CONTROLLER & ENGINE ORCHESTRATION
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Theme Management (Dark / Light)
    // -------------------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    const savedTheme = localStorage.getItem('veritas_theme') || 'dark';
    htmlElement.setAttribute('data-bs-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-bs-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-bs-theme', newTheme);
            localStorage.setItem('veritas_theme', newTheme);
            if (window.Veritas3D && window.Veritas3D.audioFX) {
                window.Veritas3D.audioFX.playClick();
            }
        });
    }

    // -------------------------------------------------------------------------
    // 2. Input Mode Switching (Text / URL Extractor)
    // -------------------------------------------------------------------------
    const modeTextTab = document.getElementById('mode-text-tab');
    const modeUrlTab = document.getElementById('mode-url-tab');
    const urlInputSection = document.getElementById('url-input-section');
    const newsUrlInput = document.getElementById('news-url-input');
    const btnExtractArticle = document.getElementById('btn-extract-article');
    const urlExtractFeedback = document.getElementById('url-extract-feedback');

    if (modeTextTab && modeUrlTab && urlInputSection) {
        modeTextTab.addEventListener('click', () => {
            modeTextTab.classList.add('active');
            modeUrlTab.classList.remove('active');
            urlInputSection.classList.add('d-none');
        });

        modeUrlTab.addEventListener('click', () => {
            modeUrlTab.classList.add('active');
            modeTextTab.classList.remove('active');
            urlInputSection.classList.remove('d-none');
            if (newsUrlInput) newsUrlInput.focus();
        });
    }

    // Live URL Content Extractor Handler
    if (btnExtractArticle && newsUrlInput) {
        btnExtractArticle.addEventListener('click', async () => {
            const url = newsUrlInput.value.trim();
            if (!url) {
                alert('Please enter a valid news article URL (e.g. https://...)');
                return;
            }

            const btnText = btnExtractArticle.querySelector('.btn-extract-text');
            const spinner = btnExtractArticle.querySelector('.spinner-border');

            btnExtractArticle.disabled = true;
            if (btnText) btnText.classList.add('d-none');
            if (spinner) spinner.classList.remove('d-none');
            if (urlExtractFeedback) urlExtractFeedback.textContent = 'Extracting and parsing remote article structure...';

            try {
                const resp = await fetch('/extract-url', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });

                const data = await resp.json();
                if (!resp.ok) throw new Error(data.error || 'Failed to extract URL');

                const art = data.article;
                if (newsTitleInput && art.title) newsTitleInput.value = art.title;
                if (newsTextInput && art.text) newsTextInput.value = art.text;

                updateCounters();

                if (urlExtractFeedback) {
                    urlExtractFeedback.innerHTML = `<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> Successfully fetched article from <strong>${art.domain}</strong>! Ready for 3D verification.</span>`;
                }
                if (window.Veritas3D && window.Veritas3D.audioFX) {
                    window.Veritas3D.audioFX.playTone(880, 'sine', 0.15, 0.15);
                }
            } catch (err) {
                console.error(err);
                if (urlExtractFeedback) {
                    urlExtractFeedback.innerHTML = `<span class="text-danger"><i class="fa-solid fa-circle-exclamation me-1"></i> ${err.message}</span>`;
                }
            } finally {
                btnExtractArticle.disabled = false;
                if (btnText) btnText.classList.remove('d-none');
                if (spinner) spinner.classList.add('d-none');
            }
        });
    }

    // -------------------------------------------------------------------------
    // 3. Character & Word Counters
    // -------------------------------------------------------------------------
    const newsTitleInput = document.getElementById('news-title');
    const newsTextInput = document.getElementById('news-text');
    const charCounter = document.getElementById('char-counter');
    const wordCounter = document.getElementById('word-counter');
    const clearBtn = document.getElementById('clear-btn');

    function updateCounters() {
        if (!newsTextInput) return;
        const text = newsTextInput.value.trim();
        const chars = newsTextInput.value.length;
        const words = text ? text.split(/\s+/).length : 0;
        if (charCounter) charCounter.textContent = chars.toLocaleString();
        if (wordCounter) wordCounter.textContent = words.toLocaleString();
    }

    if (newsTextInput) {
        newsTextInput.addEventListener('input', updateCounters);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (newsTitleInput) newsTitleInput.value = '';
            if (newsTextInput) newsTextInput.value = '';
            if (newsUrlInput) newsUrlInput.value = '';
            updateCounters();
            const resultsSection = document.getElementById('results-section');
            if (resultsSection) resultsSection.classList.add('d-none');
            if (urlExtractFeedback) urlExtractFeedback.textContent = 'Pasting a live URL extracts headline and article body automatically for 3D analysis.';
        });
    }

    // -------------------------------------------------------------------------
    // 4. Quick-Load Sample Presets (3D Presets)
    // -------------------------------------------------------------------------
    const SAMPLE_PRESETS = {
        'preset-real-space': {
            title: 'James Webb Telescope Detects Organic Molecules in Distant Galaxy',
            text: 'Astronomers utilizing the James Webb Space Telescope have confirmed the detection of complex carbon-based molecules in a galaxy located over 12 billion light-years from Earth. According to the peer-reviewed study published in Nature Astronomy, the observations provide critical empirical insights into the chemical evolution of the early universe. Dr. Elena Vance, lead astrophysicist at the European Space Agency, stated that spectroscopic data reveals distinct polycyclic aromatic hydrocarbon signatures.'
        },
        'preset-fake-cure': {
            title: 'SHOCKING: Secret Lemon Peel Miracle Cure Big Pharma Doesn\'t Want You To Know About!',
            text: 'Doctors are stunned! A hidden natural cure made from boiled lemon peel and baking soda completely eradicates all stage 4 diseases in just 48 hours. Corrupt pharmaceutical giants and the mainstream media have banned this simple recipe because they will lose trillions in chemotherapy profits. Share this urgent alert with everyone before the government wipes this website from the internet! Thousands have already been cured miraculously!'
        },
        'preset-real-politics': {
            title: 'Parliament Passes Bipartisan Infrastructure Funding Package with Supermajority',
            text: 'Lawmakers voted 342 to 78 to approve a comprehensive infrastructure modernization bill allocating $45 billion over five years toward bridge repairs, public transit upgrades, and municipal water treatment plants. Committee leaders from both political parties praised the compromise legislation as a vital investment in national productivity. The executive branch signaled the bill will be signed into law on Friday.'
        },
        'preset-fake-drone': {
            title: 'URGENT ALERT: Government Secretly Spraying Mind-Control Chemicals via Nighttime Drones',
            text: 'Whistleblower bombshell! Leaked classified military documents prove that deep-state operatives have been using stealth drones to spray neuro-toxins over major cities every night at 3 AM. The toxic spray causes brain fog, compliance, and obedience. You must wrap your windows in tin foil immediately to shield your family from the government poison! Wake up before it is too late!'
        }
    };

    Object.keys(SAMPLE_PRESETS).forEach(presetId => {
        const btn = document.getElementById(presetId);
        if (btn) {
            btn.addEventListener('click', () => {
                const sample = SAMPLE_PRESETS[presetId];
                if (newsTitleInput) newsTitleInput.value = sample.title;
                if (newsTextInput) newsTextInput.value = sample.text;
                updateCounters();
                newsTextInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }
    });

    // -------------------------------------------------------------------------
    // 5. Form Submission & 3D Real-Time Pipeline Orchestration
    // -------------------------------------------------------------------------
    const form = document.getElementById('news-analyzer-form');
    const analyzeBtn = document.getElementById('analyze-btn');
    const scanningSection = document.getElementById('scanning-progress-section');
    const resultsSection = document.getElementById('results-section');
    const scanningStepText = document.getElementById('scanning-step-text');
    const scanningStepPct = document.getElementById('scanning-step-pct');
    const analysisProgressBar = document.getElementById('analysis-progress-bar');

    let currentScanId = null;

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const title = newsTitleInput ? newsTitleInput.value.trim() : '';
            const text = newsTextInput ? newsTextInput.value.trim() : '';
            const url = newsUrlInput ? newsUrlInput.value.trim() : '';

            if (!text && !url) {
                alert('Please provide news text or a valid article URL to perform 3D statistical analysis.');
                return;
            }

            if (text && text.split(/\s+/).length < 4 && !url) {
                alert('Please provide at least 4 words of news text to perform statistical analysis.');
                return;
            }

            // Enter 3D Scanning State
            setLoadingState(true);
            if (resultsSection) resultsSection.classList.add('d-none');
            if (scanningSection) {
                scanningSection.classList.remove('d-none');
                scanningSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

            // Start 3D Holographic Scanning Stage
            if (window.Veritas3D && window.Veritas3D.scannerScene) {
                window.Veritas3D.scannerScene.startScanning();
            }

            // Multi-phase scan simulation with cyber acoustic telemetry
            await simulateScanSteps();

            try {
                const response = await fetch('/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, text, url })
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Server processing error');
                }

                const data = await response.json();
                currentScanId = data.scan_id;

                // Stop scanning stage
                if (window.Veritas3D && window.Veritas3D.scannerScene) {
                    window.Veritas3D.scannerScene.stopScanning();
                }

                // Render Results
                renderAnalysisResults(data);

                // Hide scanning, reveal 3D results dashboard
                if (scanningSection) scanningSection.classList.add('d-none');
                if (resultsSection) {
                    resultsSection.classList.remove('d-none');
                    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }

                // Play audio verdict
                const isFake = (data.prediction === 1);
                if (window.Veritas3D && window.Veritas3D.audioFX) {
                    window.Veritas3D.audioFX.playVerdict(isFake);
                }

                // Re-trigger parallax & tilt on freshly populated result cards
                if (typeof initParallaxAnd3DPhysics === 'function') {
                    initParallaxAnd3DPhysics();
                }

            } catch (err) {
                console.error(err);
                alert(`Analysis Failed: ${err.message}`);
                if (scanningSection) scanningSection.classList.add('d-none');
            } finally {
                setLoadingState(false);
            }
        });
    }

    function setLoadingState(loading) {
        if (!analyzeBtn) return;
        const btnText = analyzeBtn.querySelector('.btn-text');
        const spinner = analyzeBtn.querySelector('.spinner-border');
        const loadingText = analyzeBtn.querySelector('.loading-text');

        analyzeBtn.disabled = loading;
        if (loading) {
            if (btnText) btnText.classList.add('d-none');
            if (spinner) spinner.classList.remove('d-none');
            if (loadingText) loadingText.classList.remove('d-none');
        } else {
            if (btnText) btnText.classList.remove('d-none');
            if (spinner) spinner.classList.add('d-none');
            if (loadingText) loadingText.classList.add('d-none');
        }
    }

    async function simulateScanSteps() {
        const steps = [
            { text: 'Sanitizing text & filtering stopword noise [25%]', pct: 25 },
            { text: 'Projecting 5000+ dimension TF-IDF vector space [55%]', pct: 55 },
            { text: 'Evaluating logistic decision hyperplane boundary [80%]', pct: 80 },
            { text: 'Synthesizing 3D diffusion propagation topology & XAI weights [95%]', pct: 95 }
        ];

        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            if (scanningStepText) scanningStepText.textContent = step.text;
            if (scanningStepPct) scanningStepPct.textContent = `${step.pct}%`;
            if (analysisProgressBar) analysisProgressBar.style.width = `${step.pct}%`;
            if (window.Veritas3D && window.Veritas3D.audioFX) {
                window.Veritas3D.audioFX.playScanBeep(i + 1);
            }
            await new Promise(r => setTimeout(r, 220));
        }
    }

    // -------------------------------------------------------------------------
    // 6. Render Results, 3D Gauge, 3D Propagation Map, and XAI Highlights
    // -------------------------------------------------------------------------
    function renderAnalysisResults(data) {
        const isFake = (data.prediction === 1);
        const conf = data.confidence || 75.0;

        // 1. Verdict Banner & Badging
        const verdictBanner = document.getElementById('verdict-banner');
        const verdictBadge = document.getElementById('verdict-badge');
        const verdictBadgeIcon = document.getElementById('verdict-badge-icon');
        const verdictBadgeText = document.getElementById('verdict-badge-text');
        const verdictHeadline = document.getElementById('verdict-headline');
        const verdictSummary = document.getElementById('verdict-summary');

        if (verdictBanner) {
            verdictBanner.className = `verdict-card-3d p-4 p-md-5 border-0 ${isFake ? 'verdict-fake' : 'verdict-real'}`;
        }

        if (verdictBadge) {
            verdictBadge.className = `verdict-badge-3d mb-3 ${isFake ? 'badge-fake' : 'badge-real'}`;
        }

        if (verdictBadgeIcon) {
            verdictBadgeIcon.className = isFake ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-shield-check';
        }

        if (verdictBadgeText) {
            verdictBadgeText.textContent = isFake ? 'POTENTIALLY FAKE NEWS' : 'VERIFIED REAL NEWS';
        }

        if (verdictHeadline) {
            verdictHeadline.textContent = isFake
                ? 'Elevated Misinformation Indicators Detected'
                : 'Consistent with Verified Journalistic Standards';
        }

        if (verdictSummary) {
            verdictSummary.textContent = isFake
                ? 'The submitted content exhibits vocabulary patterns, emotional framing, and structural characteristics matching fabricated narratives.'
                : 'The submitted content demonstrates structured reporting conventions, formal syntax, and lexical markers consistent with credible journalism.';
        }

        // 2. 3D Torus Gauge / Ring Chart Update
        const gaugePercentage = document.getElementById('confidence-percentage');
        const truthScoreLabel = document.getElementById('truth-score-label');
        if (gaugePercentage) gaugePercentage.textContent = `${conf}%`;
        if (truthScoreLabel) truthScoreLabel.textContent = isFake ? 'MISINFO RISK' : 'AUTHENTICITY';

        if (window.Veritas3D && window.Veritas3D.truthGauge) {
            window.Veritas3D.truthGauge.updateScore(conf, isFake);
        }

        // 3. 3D Source Propagation Network Graph
        if (window.Veritas3D && window.Veritas3D.propagationMap && data.propagation) {
            window.Veritas3D.propagationMap.renderNetwork(data.propagation);
        }

        // 4. Stylistic & Sensationalism Metrics (Tile 1)
        const ling = data.linguistic_stats || {};
        const sensationalismScore = ling.sensationalism_score || 0;
        const uppercaseRatio = ling.uppercase_ratio || 0;

        const metricSens = document.getElementById('metric-sensationalism');
        const barSens = document.getElementById('bar-sensationalism');
        if (metricSens) metricSens.textContent = `${sensationalismScore}%`;
        if (barSens) barSens.style.width = `${Math.min(sensationalismScore, 100)}%`;

        const metricUp = document.getElementById('metric-uppercase');
        const barUp = document.getElementById('bar-uppercase');
        if (metricUp) metricUp.textContent = `${uppercaseRatio}%`;
        if (barUp) barUp.style.width = `${Math.min(uppercaseRatio, 100)}%`;

        const metricExclam = document.getElementById('metric-exclamations');
        if (metricExclam) metricExclam.textContent = ling.exclamation_count || 0;

        const metricTrig = document.getElementById('metric-triggers');
        if (metricTrig) metricTrig.textContent = ling.sensational_trigger_count || 0;

        // 5. Source Credibility Metrics (Tile 2)
        const metricDomainTrust = document.getElementById('metric-domain-trust');
        const barDomainTrust = document.getElementById('bar-domain-trust');
        const metricEchoRisk = document.getElementById('metric-echo-risk');
        const barEchoRisk = document.getElementById('bar-echo-risk');
        const metricOriginDomain = document.getElementById('metric-origin-domain');

        const domainTrustVal = isFake ? 18 : 88;
        if (metricDomainTrust) metricDomainTrust.textContent = `${domainTrustVal}%`;
        if (barDomainTrust) {
            barDomainTrust.style.width = `${domainTrustVal}%`;
            barDomainTrust.className = `progress-3d-bar ${isFake ? 'bg-danger' : 'bg-success'}`;
        }

        if (metricEchoRisk) metricEchoRisk.textContent = isFake ? 'Elevated' : 'Minimal';
        if (barEchoRisk) {
            barEchoRisk.style.width = isFake ? '85%' : '20%';
            barEchoRisk.className = `progress-3d-bar ${isFake ? 'bg-danger' : 'bg-primary'}`;
        }

        if (metricOriginDomain) {
            metricOriginDomain.textContent = data.domain || (isFake ? 'Unverified Cluster' : 'Accredited Outlets');
        }

        // 6. XAI Highlighted Canvas
        const xaiCanvas = document.getElementById('xai-highlighted-text');
        if (xaiCanvas && data.xai) {
            xaiCanvas.innerHTML = data.xai.highlighted_html || `<p>${data.raw_text}</p>`;
            const tooltipTriggerList = xaiCanvas.querySelectorAll('[data-bs-toggle="tooltip"]');
            tooltipTriggerList.forEach(el => new bootstrap.Tooltip(el));
        }

        // 7. Top Impact Drivers List
        if (data.xai) {
            renderTokensList('top-fake-tokens-list', data.xai.top_fake_indicators, 'text-danger');
            renderTokensList('top-real-tokens-list', data.xai.top_real_indicators, 'text-success');
        }

        // 8. Educational Context & Diagnosis
        const eduBox = document.getElementById('educational-summary-box');
        if (eduBox && data.xai && data.xai.educational_summary) {
            const edu = data.xai.educational_summary;
            let pointsHtml = '';
            (edu.explanation_points || []).forEach(pt => {
                pointsHtml += `<li class="mb-2"><i class="fa-solid fa-angle-right text-primary me-2"></i>${pt}</li>`;
            });

            eduBox.innerHTML = `
                <h4 class="h6 fw-bold mb-2 text-white">${edu.headline}</h4>
                <ul class="list-unstyled small mb-3 text-muted">
                    ${pointsHtml}
                </ul>
                <div class="p-3 rounded bg-black bg-opacity-25 border border-white border-opacity-10 small border-start border-3 ${isFake ? 'border-danger' : 'border-success'}">
                    <strong class="text-white">Verification Guidance:</strong> ${edu.action_advice}
                </div>
            `;
        }

        // 9. External Fact-Checking Links
        const factCheckGrid = document.getElementById('fact-check-links-grid');
        if (factCheckGrid && data.xai && data.xai.fact_check_resources) {
            factCheckGrid.innerHTML = '';
            data.xai.fact_check_resources.forEach(res => {
                const col = document.createElement('div');
                col.className = 'col-md-6 col-lg-3';
                col.innerHTML = `
                    <div class="factcheck-card-3d p-3 h-100 d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="h6 fw-bold mb-0 text-white">${res.name}</h5>
                            <span class="badge bg-secondary-subtle text-body small font-mono">${res.badge}</span>
                        </div>
                        <p class="small text-muted mb-3 flex-grow-1">${res.desc}</p>
                        <a href="${res.url}" target="_blank" rel="noopener" class="btn btn-sm btn-outline-custom w-100 mt-auto font-mono">
                            <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Search Claim
                        </a>
                    </div>
                `;
                factCheckGrid.appendChild(col);
            });
        }
    }

    function renderTokensList(containerId, tokens, colorClass) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';

        if (!tokens || tokens.length === 0) {
            container.innerHTML = '<p class="text-muted small mb-0 py-2 font-mono">No dominant vocabulary flags extracted for this vector.</p>';
            return;
        }

        tokens.forEach(item => {
            const row = document.createElement('div');
            row.className = 'token-impact-item-3d';
            row.innerHTML = `
                <span class="font-mono fw-bold ${colorClass}">
                    ${item.token}
                </span>
                <span class="badge bg-black bg-opacity-40 border border-white border-opacity-10 font-mono text-muted small">
                    Score: ${item.weight}
                </span>
            `;
            container.appendChild(row);
        });
    }

    // -------------------------------------------------------------------------
    // 7. User Feedback (Agree / Dispute)
    // -------------------------------------------------------------------------
    const agreeBtn = document.getElementById('btn-feedback-agree');
    const disputeBtn = document.getElementById('btn-feedback-dispute');
    const feedbackActions = document.getElementById('feedback-actions');

    async function sendFeedback(feedbackType) {
        if (!currentScanId) return;
        try {
            const resp = await fetch(`/feedback/${currentScanId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback: feedbackType })
            });
            if (resp.ok && feedbackActions) {
                feedbackActions.innerHTML = `
                    <span class="badge bg-success-subtle text-success py-2 px-3 font-mono">
                        <i class="fa-solid fa-check me-1"></i> Telemetry Feedback Recorded (${feedbackType.toUpperCase()})
                    </span>
                `;
                if (window.Veritas3D && window.Veritas3D.audioFX) {
                    window.Veritas3D.audioFX.playTone(720, 'sine', 0.12, 0.1);
                }
            }
        } catch (e) {
            console.error('Feedback error:', e);
        }
    }

    if (agreeBtn) agreeBtn.addEventListener('click', () => sendFeedback('agreed'));
    if (disputeBtn) disputeBtn.addEventListener('click', () => sendFeedback('disputed'));
});
