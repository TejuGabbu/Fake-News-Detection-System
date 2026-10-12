"""
Dataset generator & curator for Fake News Detection System.
Generates a balanced dataset of verified Real News and Potentially Fake News
across diverse domains: Science, Health, Politics, Technology, and World Affairs.
"""

import os
import csv
import random

REAL_ARTICLES = [
    # Science & Space
    ("James Webb Telescope Detects Organic Molecules in Distant Galaxy",
     "Astronomers utilizing the James Webb Space Telescope have confirmed the detection of complex carbon-based molecules in a galaxy located over 12 billion light-years from Earth. According to the peer-reviewed study published in Nature Astronomy, the observations provide critical empirical insights into the chemical evolution of the early universe. Dr. Elena Vance, lead astrophysicist at the European Space Agency, stated that spectroscopic data reveals distinct polycyclic aromatic hydrocarbon signatures.",
     "Nature Astronomy / ESA"),
    ("NASA Confirms Successful Orbital Adjustment for Planetary Defense Probe",
     "NASA officials announced on Tuesday that the recent orbital adjustment maneuver for its planetary defense observation satellite was completed within expected parameters. Telemetry verified that the spacecraft fired its thrusters for 4 minutes and 12 seconds, positioning it to monitor near-Earth asteroids. The mission control center in Greenbelt, Maryland, reported that all scientific instruments are operating normally and data transmission remains stable.",
     "NASA Press Release"),
    ("Biologists Discover Resilient Coral Species in Northern Great Barrier Reef",
     "Marine biologists from James Cook University have documented a previously unknown strain of stony coral that exhibits remarkable thermal tolerance. In controlled laboratory conditions mimicking marine heatwaves, the coral retained photosynthetic algae 30 percent longer than surrounding colonies. The researchers published their findings in the Journal of Experimental Marine Biology, noting that while this offers hope for reef rehabilitation, global emissions reductions remain paramount.",
     "James Cook University / Marine Bio"),
    ("Geological Survey Records Moderate 5.2 Magnitude Earthquake in Pacific Rim",
     "The United States Geological Survey (USGS) reported a magnitude 5.2 earthquake occurring off the coast of northern Chile at a depth of 35 kilometers. Regional emergency management agencies confirmed that no tsunami warnings were issued, and structural inspections reported no immediate injuries or critical infrastructure failure. Seismic sensors recorded several minor aftershocks consistent with regional subduction zone tectonics.",
     "USGS Bulletin"),
    ("Renewable Energy Generates Record Share of European Power Grid in Q2",
     "Official statistics released by the European Energy Agency confirm that wind, solar, and hydroelectric generation accounted for 52 percent of total electricity consumed across member states during the second quarter. The report highlighted significant additions to offshore wind capacity in the North Sea and sustained industrial solar deployments. Grid operators noted improved battery storage integrations stabilized peak evening demand.",
     "European Energy Agency"),
    
    # Health & Medicine
    ("Clinical Trials Confirm Efficacy of Targeted Antibody Treatment for Rheumatoid Arthritis",
     "A multi-center Phase III clinical trial involving 1,400 patients has demonstrated that a novel monoclonal antibody significantly reduces inflammation and joint erosion in severe rheumatoid arthritis. The randomized, double-blind study, published in The New England Journal of Medicine, reported that 68 percent of participants achieved clinical remission without adverse liver toxicity. Regulators at the FDA have accepted the biologics license application for formal priority review.",
     "New England Journal of Medicine"),
    ("World Health Organization Launches Global Vaccination Campaign Against Cholera",
     "The World Health Organization (WHO) and international humanitarian partners have dispatched 2.4 million doses of oral cholera vaccine to flood-affected regions. Spokesperson Christian Lindmeier emphasized that establishing clean water access and sanitation infrastructure remains essential alongside immunization to contain the seasonal surge in waterborne diseases.",
     "World Health Organization (WHO)"),
    ("Dietary Study Links Mediterranean Diet to Reduced Cognitive Decline in Older Adults",
     "Researchers at Johns Hopkins University followed 3,200 participants over an eight-year period to assess the impact of nutritional habits on neurological aging. The longitudinal findings indicate that individuals closely adhering to a diet rich in olive oil, leafy greens, legumes, and lean fish experienced a 24 percent slower rate of cognitive decline compared to controls. The authors controlled for socioeconomic status and baseline physical activity.",
     "Johns Hopkins Medicine"),
    ("Cardiologists Publish Updated Guidelines for Managing Pediatric Hypertension",
     "The American Heart Association has released revised clinical guidelines for pediatric blood pressure screenings during routine annual examinations. The document recommends using standardized oscillometric monitors and lifestyle interventions before pharmacotherapy in mild cases. Pediatricians emphasize that early detection helps mitigate long-term cardiovascular risks in young adulthood.",
     "American Heart Association"),
    ("Pharmaceutical Consortium Expands Low-Cost Insulin Distribution to Developing Markets",
     "A coalition of global pharmaceutical manufacturers announced an agreement with global health organizations to cap biosimilar insulin costs at $3 per vial in 40 low- and middle-income countries. Independent monitoring agencies will oversee supply chains to prevent local tariff markups and ensure cold-storage logistics integrity.",
     "Reuters Health"),

    # Politics & Governance
    ("Parliament Passes Bipartisan Infrastructure Funding Package with Supermajority",
     "Lawmakers voted 342 to 78 to approve a comprehensive infrastructure modernization bill allocating $45 billion over five years toward bridge repairs, public transit upgrades, and municipal water treatment plants. Committee leaders from both political parties praised the compromise legislation as a vital investment in national productivity. The executive branch signaled the bill will be signed into law on Friday.",
     "Associated Press"),
    ("Supreme Court Delivers Ruling on Interstate Commerce and Environmental Jurisdiction",
     "In a 7-2 decision, the Supreme Court ruled that federal regulatory authorities maintain statutory oversight regarding industrial runoff that traverses interstate waterways. Writing for the majority, Justice Henderson cited precedence under the Clean Water Act and constitutional commerce clauses. State attorneys general who brought the petition noted that compliance grace periods will be sought.",
     "Reuters Legal"),
    ("Central Bank Holds Benchmark Interest Rate Steady Amid Moderate Inflation Indicators",
     "The Federal Reserve announced following its two-day monetary policy meeting that it will maintain the federal funds target rate unchanged at 4.75 to 5.00 percent. In a prepared statement, the board indicated that while labor markets remain resilient, consumer price indexes have decelerated toward the 2 percent target. Financial markets reacted calmly to the consensus decision.",
     "Financial Times"),
    ("Electoral Commission Publishes Audited Turnout Statistics for National Parliamentary Election",
     "The National Election Commission concluded its official canvass of last month's general election, reporting a final national voter turnout rate of 67.4 percent. The comprehensive report documented paper ballot verification protocols, bipartisan observer certifications, and resolution of 14 localized mechanical tabulator anomalies without impact to outcomes.",
     "Official Election Gazette"),
    ("City Council Approves New Zoning Codes to Encourage Affordable Housing Development",
     "Following a four-hour public hearing, the metropolitan city council voted to overhaul suburban residential zoning, permitting duplex and triplex construction on parcels previously restricted to single-family dwellings. Urban planning analysts project the reform will stimulate 12,000 new housing units over the next decade while preserving green spaces.",
     "Municipal News Service"),

    # Technology & Cybersecurity
    ("Open Source Security Foundation Releases Framework to Mitigate Supply Chain Attacks",
     "The OpenSSF unveiled an automated verification framework designed to scan open-source software libraries for malicious dependencies and compromised signing keys. The tool leverages cryptographic attestation and automated static code analysis to protect critical cloud and financial infrastructure.",
     "OpenSSF Bulletin"),
    ("Semiconductor Foundry Commences High-Volume Production of 2-Nanometer Microchips",
     "Taiwan Semiconductor Manufacturing Company (TSMC) confirmed that test production yields for its next-generation 2-nanometer nanosheet architecture have reached industrial thresholds. Volume commercial shipments to global hardware manufacturers are scheduled to commence late next year, offering 15 percent performance gains and 30 percent reduced power consumption.",
     "TechCrunch / EE Times"),
    ("Cybersecurity Agency Issues Advisory on Patching Critical Enterprise VPN Vulnerability",
     "The Cybersecurity and Infrastructure Security Agency (CISA) issued an urgent directive urging systems administrators to apply security updates addressing an unauthenticated remote code execution vulnerability in enterprise VPN appliances. Federal agencies were instructed to remediate vulnerable systems within 72 hours.",
     "CISA Advisory"),
    ("Consortium of Tech Firms Standardizes Interoperable Smart Home Protocols",
     "Leading smart device manufacturers have finalized version 1.4 of the unified Matter protocol, introducing streamlined device onboarding, enhanced end-to-end encryption, and offline mesh networking capabilities. The protocol aims to eliminate consumer fragmentation across competing voice assistant ecosystems.",
     "Wired / Verge"),
    ("Quantum Computing Laboratory Demonstrates Fault-Tolerant Logical Qubit Operation",
     "Physicists at IBM Quantum and collaborating university laboratories published experimental benchmarks showing continuous error correction across 12 logical qubits. The results indicate significant progress toward practical quantum algorithms capable of molecular simulation and materials design.",
     "Nature Physical Science"),

    # Environment & Economy
    ("Agricultural Agency Reports Bumper Wheat Harvest Following Favorable Spring Rains",
     "The Department of Agriculture's latest World Agricultural Supply and Demand Estimates raised national wheat production forecasts by 8 percent. Favorable weather patterns across the Great Plains countered earlier drought concerns, helping stabilize global grain prices on commodity exchanges.",
     "USDA World Agricultural Estimates"),
    ("International Maritime Organization Adopts Stricter Emissions Targets for Cargo Shipping",
     "Delegates representing 175 member nations at the International Maritime Organization approved a revised greenhouse gas strategy mandating a 30 percent reduction in shipping emissions by 2030 and net-zero by 2050. The agreement includes financial mechanisms to incentivize clean fuels such as green methanol and ammonia.",
     "IMO Press Release"),
    ("Treasury Department Issues Clarification on Clean Energy Manufacturing Tax Credits",
     "The Treasury Department published comprehensive guidelines defining domestic sourcing requirements for wind turbines, solar cells, and industrial battery components. Manufacturers meeting local content benchmarks will qualify for bonus investment tax credits under the federal clean economy initiative.",
     "US Treasury Department"),
    ("Labor Department Statistics Indicate Unemployment Rate Remained at 3.9 Percent in August",
     "Nonfarm payroll employment increased by 187,000 jobs in August, with notable gains in healthcare, leisure, hospitality, and professional services, according to the Bureau of Labor Statistics. Average hourly earnings rose 0.2 percent over the month, consistent with moderate wage growth.",
     "Bureau of Labor Statistics"),
    ("Regional Water District Completes Desalination Plant Modernization Project",
     "A $120 million upgrade to the coastal seawater desalination facility has expanded capacity by 25 million gallons per day while decreasing energy consumption by 18 percent through state-of-the-art energy recovery reverse osmosis membranes.",
     "Civil Engineering Today")
]

FAKE_ARTICLES = [
    # Miracle Cures & Health Hoaxes
    ("SHOCKING: Secret Lemon Peel Miracle Cure Big Pharma Doesn't Want You To Know About!",
     "Doctors are stunned! A hidden natural cure made from boiled lemon peel and baking soda completely eradicates all stage 4 diseases in just 48 hours. Corrupt pharmaceutical giants and the mainstream media have banned this simple recipe because they will lose trillions in chemotherapy profits. Share this urgent alert with everyone before the government wipes this website from the internet! Thousands have already been cured miraculously!",
     "HealthTruthSecretBOMBSHELL.net"),
    ("URGENT ALERT: Government Secretly Spraying Mind-Control Chemicals via Nighttime Drones",
     "Whistleblower bombshell! Leaked classified military documents prove that deep-state operatives have been using stealth drones to spray neuro-toxins over major cities every night at 3 AM. The toxic spray causes brain fog, compliance, and obedience. You must wrap your windows in tin foil immediately to shield your family from the government poison! Wake up before it is too late!",
     "TheUncensoredAwakening.org"),
    ("BOMBSHELL: Ancient Tibetan Root Melts 40 Pounds of Belly Fat Overnight Without Exercise",
     "Celebrity doctors are furious after this forbidden Himalayan root was leaked online! Scientists were baffled when test subjects lost 40 pounds of pure visceral fat in their sleep without any diet or gym workout. Big Pharma tried to suppress the clinical trial, but an undercover whistleblower uploaded the secret recipe. Click here right now before the globalist elite takes this link down forever!",
     "MiracleFatMelterDaily.info"),
    ("PROOF: 5G Cell Towers Are Transmitting Frequencies That Alter Human DNA Permanently",
     "It is finally proven! A rogue scientist who was fired from a top tech conglomerate has revealed proof that 5G millimeter waves are tuned to resonance frequencies designed to modify human genetic code and harvest our thoughts. Mainstream media refuses to report this terrifying coverup! Throw away your smartphone today to save your soul!",
     "Stop5GFrequenciesNow.biz"),
    ("DANGEROUS HOAX EXPOSED: Drinking Raw Pond Mud Reverses Aging by 30 Years Instantly",
     "Forget surgery and expensive creams! This forgotten ancient swamp mud contains super-charged primordial microbes that instantly erase wrinkles, regrow full heads of hair, and make 70-year-olds look 20 again within days. Dermatologists hate this one weird trick! The deep state is trying to outlaw collecting pond water, so order your miracle mud flask right now!",
     "PondMudRejuvenationSecret.xyz"),

    # Political Conspiracies & Fabricated Scandals
    ("EXPOSED: Secret Underground Bunkers Found Stocked with Gold by Globalist Shadow Cabal",
     "Incredible leaked footage has emerged from beneath an abandoned airport showing miles of underground bunkers containing trillions of dollars in gold bullion stolen from working citizens! The corrupt elites are planning to collapse the global economy next Tuesday and flee to their subterranean palaces. Mainstream news will never air this mind-blowing truth!",
     "DeepStateBunkerExposed.news"),
    ("BOMBSHELL: Leaked Audio Catches World Leaders Admitting Moon Landing Was Staged on Movie Set",
     "Top secret audio tapes recorded during a closed-door summit reveal prime ministers laughing about how NASA hired Hollywood directors to fake every single Apollo mission in a Nevada desert soundstage! The whistleblower who leaked the recording has gone into hiding after secret agents surrounded his house. Share this viral post before it gets banned!",
     "CosmicCoverupInsider.org"),
    ("RIGGED: Voting Machines Caught Altering 50 Million Ballots in Secret Midnight Update",
     "Total proof of massive election fraud! A lone patriotic programmer discovered hidden code embedded inside voting software that automatically flips every vote every 15 minutes. High-ranking officials were caught on hidden camera confessing to the entire scheme. Demand immediate nullification of all votes and arrest the corrupt conspirators immediately!",
     "PatriotVoiceRebellion.net"),
    ("UNBELIEVABLE: Celebrity Replaced by Robot Clone After Mysterious Disappearance Last Month",
     "Fans are horrified after eagle-eyed viewers spotted exposed mechanical wiring on the neck of a famous pop star during a live television interview! Insiders claim the original singer was quietly abducted by secret societies and replaced with an artificial android clone to brainwash youth with subliminal frequencies. Look at the shocking photos!",
     "IlluminatiCelebrityClones.info"),
    ("TERRIFYING TRUTH: Drinking Tap Water Turns Citizens into Mind-Controlled Sheeple",
     "A rogue chemist has revealed that municipal water supplies contain synthetic hypnosis enzymes engineered to suppress critical thinking and make citizens vote for taxes! Only bottled spring water blessed with magnetic pyramids can protect your pineal gland from this insidious government plot. Wake up people!",
     "PureMindResistance.com"),

    # Sensational Science & Space Hoaxes
    ("MASSIVE COVERUP: NASA Hides Discovery of Giant Alien Pyramid on Surface of Mars",
     "Leaked satellite imagery that NASA tried to erase from their archives clearly shows a three-sided pyramid larger than Giza sitting directly on the Martian equator! Astronauts have been secretly mining Martian crystals for decades while lying to the public that Mars is a barren wasteland. The secret space program is real!",
     "MartianTruthLeakers.co"),
    ("SHOCKING DISCOVERY: Scientists Accidentally Open Portal to Parallel Universe in Basement Lab",
     "A bizarre quantum experiment conducted by rogue rogue physicists in an unlicensed basement breached the spacetime continuum, opening a glowing green portal through which alien creatures were heard screaming! The military was dispatched to seal off the city block and intimidate witnesses into silence! Must read!",
     "QuantumAbyssExposed.net"),
    ("SCIENTISTS BAFFLED: The Sun is Actually Burning Out in Exactly 48 Hours, Say Secret Reports",
     "Confidential solar observatory memos have been leaked online showing that the sun's core has gone completely dark and only an artificial reflector satellite is projecting light to prevent global panic! Stock up on canned food and candles immediately before eternal darkness engulfs planet Earth this weekend!",
     "DoomsdaySolarAlert.org"),
    ("BANNED ARCHAEOLOGY: 20-Foot Giant Skeletons Discovered in Remote Cave System",
     "Museum curators are in full damage control after local miners unearthed dozens of 20-foot tall human skeletons holding copper broadswords! Instead of displaying them, shadowy government vans confiscated the bones to bury them at an undisclosed military base to maintain false evolutionary timelines. The proof is undeniable!",
     "ForbiddenHistoryUnveiled.com"),
    ("URGENT: Time Traveler from 2085 Leaks Terrifying List of Upcoming Catastrophes",
     "A man claiming to be an undercover chrononaut from the year 2085 has passed a lie detector test with 100% accuracy after revealing upcoming world events! He warns that tomorrow an asteroid made of solid antimatter will pass within miles of the atmosphere. Watch the shocking video interview before censors wipe it!",
     "ChronosWhistleblowerDaily.xyz")
]

# Variations and templates to expand dataset to 300+ entries
REAL_TOPICS = [
    ("Renewable Energy", "Solar cell efficiency reaches 28% in university laboratory trials", "Clean energy engineers from MIT confirmed advances in perovskite-silicon tandem cells. Peer-reviewed measurements show improved durability under thermal cycling. Researchers published their findings in Applied Physics Letters."),
    ("Public Health", "National health institute reports 14% decline in seasonal influenza hospitalizations", "Epidemiologists attributed the reduction to early immunization drives and improved indoor ventilation standards. The surveillance report analyzed data from 400 participating hospitals."),
    ("Autonomous Transit", "Metropolitan transit authority concludes 12-month autonomous shuttle pilot", "The pilot program carried over 80,000 passengers with zero reported collisions. Independent safety auditors commended the vehicle's sensor redundancy and remote monitoring protocols."),
    ("Agriculture", "Drought-resistant maize variety receives safety certification from regulators", "Agronomists developed the crop using conventional cross-breeding techniques to withstand prolonged dry spells. Field trials across six research farms demonstrated an 18% yield improvement in low-moisture soils."),
    ("Deep Sea Ecology", "Oceanographic expedition discovers hydrothermal vent field teeming with unique fauna", "Marine scientists aboard the research vessel Atlantis mapped four previously uncharted mineral chimneys in the Mariana Basin, collecting water samples and imaging endemic invertebrate colonies."),
    ("Cyber Defense", "Financial institutions deploy post-quantum cryptographic standards across interbank networks", "Banking consortium security officers confirmed that transaction routing protocols now integrate lattice-based encryption algorithms certified by the National Institute of Standards and Technology."),
    ("Education", "Study examines correlation between elementary school start times and academic retention", "Educational psychologists analyzed test performance across 45 school districts, noting that a 45-minute later start time resulted in modest improvements in reading comprehension and attendance."),
    ("Astronomy", "Radio telescope array captures unprecedented detail of stellar accretion disk", "Astrophysicists operating the Atacama Large Millimeter Array published high-resolution maps showing protoplanetary ring gaps surrounding young star HL Tauri."),
    ("Forestry", "Satellite remote sensing confirms reforestation programs restored 50,000 hectares of canopy", "The Forestry Commission released its decadal conservation audit, verifying that indigenous tree planting initiatives successfully stabilized hillside watersheds."),
    ("Macroeconomics", "Consumer confidence index rises 2.4 points amid steady employment growth", "The monthly survey of 5,000 households reflected optimism regarding wage stability and softening fuel expenditures, according to the Conference Board.")
]

FAKE_TEMPLATES = [
    ("SHOCKING BOMBSHELL: {topic} Exposed as Giant Globalist Conspiracy to Poison the Public!",
     "Whistleblower leak! Insiders have confirmed that {topic} is a total fraud concocted by shadow elites to enslave hardworking citizens! Mainstream media is deliberately hiding this urgent alert! Share this mind blowing secret cure and wake up before the government shuts down this server!",
     "TruthUndergroundBOMBSHELL.net"),
    ("URGENT WARNING: They Don't Want You To Know The Terrifying Truth About {topic}!",
     "Doctors and scientists are in full panic mode! A classified document leaked on the dark web reveals that {topic} was engineered in an underground lab. Big Pharma tried to delete this video! Drink baking soda and salt water immediately to detoxify your system! Must see!",
     "TheRealUncensoredPatriot.org"),
    ("MIRACLE DISCOVERY: Ancient Herb Completely Destroys {topic} in 24 Hours Guaranteed!",
     "Banned by corrupt regulators! This forgotten Amazonian root cures every ailment linked to {topic} without pills or surgery! Billionaire CEOs are scrambling to buy up the supply, but an honest doctor leaked the secret formula online. Click here before it gets banned!",
     "MiracleSecretCure247.xyz"),
    ("PROOF: Leaked High-Level Memo Proves {topic} Was Staged on Hollywood Soundstage",
     "You cannot trust what you see on television! Investigative patriots obtained confidential satellite logs showing that the entire {topic} incident was performed by paid crisis actors directed by deep state operatives. Share this viral bombshell everywhere!",
     "ForbiddenTruthRebellion.info"),
    ("SCIENTISTS BAFFLED: Government Caught Using {topic} to Secretly Control Weather Patterns!",
     "It is no longer a theory, it is proven fact! Whistleblowers have released radar telemetry proving military jets are using {topic} to generate artificial hurricanes and manipulate crop harvests! Wake up people, the truth cannot be silenced!",
     "WeatherConspiracyExposed.org")
]

FAKE_TOPICS = [
    "5G Radiation", "Chemtrail Sprays", "Fluoride In Tap Water", "Bird Drone Surveillance",
    "Microchip Implants", "Fake Moon Orbit", "Underground Lizard Cabal", "Secret Food Additives",
    "Weather Modification HAARP", "Subliminal TV Signals", "Ancient Alien Batteries", "Synthetic Virus Lab"
]

def generate_full_dataset(output_path: str):
    """Compiles the full training dataset with balanced real and fake news articles."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    data = []
    article_id = 1

    # Add core real articles
    for title, text, source in REAL_ARTICLES:
        data.append({
            "id": article_id,
            "title": title,
            "text": text,
            "label": 0,  # 0 = Real News
            "label_name": "Real News",
            "source": source
        })
        article_id += 1

    # Add core fake articles
    for title, text, source in FAKE_ARTICLES:
        data.append({
            "id": article_id,
            "title": title,
            "text": text,
            "label": 1,  # 1 = Potentially Fake News
            "label_name": "Potentially Fake News",
            "source": source
        })
        article_id += 1

    # Multiply variations for robust ML training (aiming for 300+ diverse rows)
    random.seed(42)

    # Generate synthetic Real variations with varying phrasing & accredited sources
    institutions = ["Reuters", "Associated Press", "BBC News", "Nature Journal", "Science Magazine", 
                    "NIST Research", "Harvard Gazette", "Oxford Academic", "The Lancet", "Bloomberg News"]
    
    for i in range(15):
        for topic_title, headline, body in REAL_TOPICS:
            inst = institutions[(i + len(topic_title)) % len(institutions)]
            date_str = f"202{random.randint(3, 6)}"
            expanded_text = f"{body} The research team coordinated across international sites, corroborating data with independent instrumentation in {date_str}. Official regulatory filings verified standard compliance without deviations."
            data.append({
                "id": article_id,
                "title": f"{topic_title}: {headline} (Study {i+1})",
                "text": expanded_text,
                "label": 0,
                "label_name": "Real News",
                "source": inst
            })
            article_id += 1

    # Generate synthetic Fake variations with high-frequency sensationalist phrases
    for i in range(12):
        for fake_topic in FAKE_TOPICS:
            template_title, template_body, template_source = FAKE_TEMPLATES[i % len(FAKE_TEMPLATES)]
            title = template_title.format(topic=fake_topic)
            text = template_body.format(topic=fake_topic) + f" Leaked confidential email batch #{random.randint(1000, 9999)} reveals total proof of this shocking scandal! DO NOT COMPLY! SHARE THIS IMMEDIATELY BEFORE IT DISAPPEARS!"
            data.append({
                "id": article_id,
                "title": title,
                "text": text,
                "label": 1,
                "label_name": "Potentially Fake News",
                "source": template_source
            })
            article_id += 1

    # Shuffle dataset
    random.shuffle(data)

    # Write to CSV
    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "title", "text", "label", "label_name", "source"])
        writer.writeheader()
        for row in data:
            writer.writerow(row)

    print(f"Generated {len(data)} articles successfully at {output_path}")
    real_cnt = sum(1 for r in data if r["label"] == 0)
    fake_cnt = sum(1 for r in data if r["label"] == 1)
    print(f"Distribution: {real_cnt} Real News, {fake_cnt} Potentially Fake News")
    return len(data)

if __name__ == "__main__":
    out_file = os.path.join(os.path.dirname(__file__), "dataset.csv")
    generate_full_dataset(out_file)
