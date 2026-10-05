const fs = require('fs');

const originalNodeMaster = `// AUTO-GENERATED FROM EXACT DATASET VALUES + Manual map calibration
// DO NOT EDIT x/y coordinates without running the calibration tool first.
// lat/lng are from DATASET for metadata display only — distance calc uses distanceKm from roadMaster.

export const NODE_TYPES = {
  L:  { color: 'var(--status-info)',    label: 'Operational Location' },
  CP: { color: 'var(--status-warning)', label: 'Checkpoint' },
  RP: { color: 'var(--accent-cyan)',    label: 'Rest Point' },
  HP: { color: 'var(--status-success)', label: 'Helipad' },
  BR: { color: 'var(--accent-blue)',    label: 'Bridge' },
  OT: { color: '#A855F7',              label: 'Observation Tower' },
  J:  { color: 'var(--road-inactive)', label: 'Junction' }
};

export const nodeMaster = [
  // ── OPERATIONAL LOCATIONS (L) ──────────────────────────────────────────
  {"id":"L01","name":"Command HQ",                  "type":"L","elevation":3505,"lat":34.1548,"lng":77.5806,"y":972,  "x":541 },
  {"id":"L02","name":"Communication Center",         "type":"L","elevation":3512,"lat":34.1572,"lng":77.5848,"y":953,  "x":534},
  {"id":"L03","name":"Mission Control",              "type":"L","elevation":3524,"lat":34.1605,"lng":77.5891,"y":870, "x":439},
  {"id":"L04","name":"Logistics Hub",                "type":"L","elevation":3658,"lat":34.2149,"lng":77.6246,"y":818, "x":368},
  {"id":"L05","name":"Fuel Depot",                   "type":"L","elevation":3925,"lat":34.2786,"lng":77.6394,"y":765, "x":297},
  {"id":"L06","name":"Vehicle Maintenance",          "type":"L","elevation":4058,"lat":34.2869,"lng":77.6488,"y":734, "x":416},
  {"id":"L07","name":"Transit Camp",                 "type":"L","elevation":4276,"lat":34.3268,"lng":77.6597,"y":574, "x":436},
  {"id":"L08","name":"Supply Camp",                  "type":"L","elevation":3186,"lat":34.6169,"lng":77.8298,"y":504, "x":386},
  {"id":"L09","name":"Medical Camp",                 "type":"L","elevation":3144,"lat":34.5828,"lng":77.5605,"y":474, "x":336},
  {"id":"L10","name":"Engineering Camp",             "type":"L","elevation":3162,"lat":34.5962,"lng":77.4798,"y":556, "x":297},
  {"id":"L11","name":"Weather Station",              "type":"L","elevation":3338,"lat":34.6558,"lng":77.5749,"y":104, "x":756 },
  {"id":"L12","name":"Avalanche Center",             "type":"L","elevation":3472,"lat":34.6641,"lng":77.5826,"y":451, "x":487},
  {"id":"L13","name":"Snow Patrol Camp",             "type":"L","elevation":3628,"lat":34.6739,"lng":77.5907,"y":399, "x":605 },
  {"id":"L14","name":"Emergency Camp",               "type":"L","elevation":4015,"lat":34.7364,"lng":77.7118,"y":347, "x":724 },
  {"id":"L15","name":"Glacier Operations Camp",      "type":"L","elevation":4328,"lat":34.7798,"lng":77.7589,"y":294, "x":843 },
  {"id":"L16","name":"Ice Rescue Center",            "type":"L","elevation":4486,"lat":34.8136,"lng":77.7924,"y":242, "x":961 },
  {"id":"L17","name":"Radar Station",                "type":"L","elevation":4728,"lat":34.8529,"lng":77.8315,"y":190, "x":1080 },
  {"id":"L18","name":"OP Alpha",                     "type":"L","elevation":4958,"lat":34.8895,"lng":77.8661,"y":138, "x":1199 },
  {"id":"L19","name":"OP Bravo",                     "type":"L","elevation":5152,"lat":34.9254,"lng":77.9014,"y":85, "x":1317 },
  {"id":"L20","name":"Peak Sentinel",                "type":"L","elevation":5428,"lat":34.9682,"lng":77.9448,"y":52, "x":1417 },
  // ── CHECKPOINTS (CP) ───────────────────────────────────────────────────
  {"id":"CP01","name":"Leh Entry Checkpoint",            "type":"CP","elevation":3510,"lat":34.154, "lng":77.5765,"y":964,  "x":539 },
  {"id":"CP02","name":"Indus Bridge Checkpoint",         "type":"CP","elevation":3555,"lat":34.1785,"lng":77.6208,"y":959,  "x":536},
  {"id":"CP03","name":"Logistics Access Checkpoint",     "type":"CP","elevation":3665,"lat":34.245, "lng":77.7355,"y":525, "x":843 },
  {"id":"CP04","name":"Khardung Sector Checkpoint",      "type":"CP","elevation":3815,"lat":34.3005,"lng":77.82,  "y":644, "x":436},
  {"id":"CP05","name":"Supply Route Checkpoint",         "type":"CP","elevation":3990,"lat":34.3845,"lng":77.9285,"y":524, "x":366},
  {"id":"CP06","name":"Glacier Base Checkpoint",         "type":"CP","elevation":4255,"lat":34.4655,"lng":78.0625,"y":315, "x":771 },
  {"id":"CP07","name":"Nubra Patrol Checkpoint",         "type":"CP","elevation":4385,"lat":34.5145,"lng":78.1455,"y":378, "x":653 },
  {"id":"CP08","name":"Valley Junction Checkpoint",      "type":"CP","elevation":4075,"lat":34.3985,"lng":77.9955,"y":420, "x":534},
  {"id":"CP09","name":"Ridge Security Checkpoint",       "type":"CP","elevation":4135,"lat":34.421, "lng":78.0225,"y":556, "x":368},
  {"id":"CP10","name":"Northern Defense Checkpoint",     "type":"CP","elevation":4550,"lat":34.5485,"lng":78.228, "y":211, "x":1032 },
  {"id":"CP11","name":"Forward Observation Checkpoint",  "type":"CP","elevation":4725,"lat":34.612, "lng":78.31,  "y":315, "x":653 },
  {"id":"CP12","name":"Peak Sentinel Checkpoint",        "type":"CP","elevation":4885,"lat":34.6555,"lng":78.3655,"y":127, "x":1246 },
  // ── REST POINTS (RP) ───────────────────────────────────────────────────
  {"id":"RP01","name":"Indus Bridge Rest",    "type":"RP","elevation":3565,"lat":34.1868,"lng":77.6365,"y":922, "x":487},
  {"id":"RP02","name":"Nubra Rest Point",     "type":"RP","elevation":4015,"lat":34.3865,"lng":77.9312,"y":608, "x":605 },
  {"id":"RP03","name":"Khardung Rest Point",  "type":"RP","elevation":3875,"lat":34.3175,"lng":77.8515,"y":577, "x":415},
  {"id":"RP04","name":"Khalsar Rest Point",   "type":"RP","elevation":3635,"lat":34.2218,"lng":77.6942,"y":724, "x":416},
  {"id":"RP05","name":"Shyok Rest Point",     "type":"RP","elevation":4115,"lat":34.4095,"lng":78.0085,"y":604, "x":356},
  {"id":"RP06","name":"Siachen Base Rest",    "type":"RP","elevation":4395,"lat":34.5015,"lng":78.1385,"y":368, "x":676 },
  {"id":"RP07","name":"Glacier View Rest",    "type":"RP","elevation":4785,"lat":34.6245,"lng":78.3285,"y":274, "x":866 },
  // ── HELIPADS (HP) ──────────────────────────────────────────────────────
  {"id":"HP01","name":"Leh Helipad",               "type":"HP","elevation":3515,"lat":34.1548,"lng":77.5778,"y":969,  "x":546 },
  {"id":"HP02","name":"North Pullu Helipad",        "type":"HP","elevation":3795,"lat":34.2684,"lng":77.7426,"y":415, "x":522},
  {"id":"HP03","name":"Shyok Helipad",              "type":"HP","elevation":4085,"lat":34.3952,"lng":77.9868,"y":744, "x":356},
  {"id":"HP04","name":"Indus Helipad",              "type":"HP","elevation":3645,"lat":34.2338,"lng":77.7065,"y":603, "x":593 },
  {"id":"HP05","name":"Pananik Helipad",            "type":"HP","elevation":4535,"lat":34.5538,"lng":78.2195,"y":310, "x":641 },
  {"id":"HP06","name":"Peak Helipad",               "type":"HP","elevation":4895,"lat":34.6572,"lng":78.3678,"y":54, "x":1412 },
  // ── OBSERVATION TOWERS (OT) ────────────────────────────────────────────
  {"id":"OT01","name":"North Pass Tower",   "type":"OT","elevation":4625,"lat":34.5715,"lng":78.2485,"y":144,"x":1186},
  {"id":"OT02","name":"Indus Ridge Tower",  "type":"OT","elevation":3545,"lat":34.1685,"lng":77.6015,"y":934, "x":526},
  {"id":"OT03","name":"Shyok Ridge Tower",  "type":"OT","elevation":4135,"lat":34.4125,"lng":78.0145,"y":534,"x":396},
  {"id":"OT04","name":"Nubra Ridge Tower",  "type":"OT","elevation":3925,"lat":34.3465,"lng":77.8825,"y":614,"x":456},
  // ── BRIDGES (BR) ───────────────────────────────────────────────────────
  {"id":"BR01","name":"Bridge 01","type":"BR","elevation":3300,"y":874,"x":486},
  {"id":"BR02","name":"Bridge 02","type":"BR","elevation":3400,"y":774,"x":436},
  {"id":"BR03","name":"Bridge 03","type":"BR","elevation":3500,"y":674,"x":386},
  {"id":"BR04","name":"Bridge 04","type":"BR","elevation":3600,"y":574,"x":336},
  {"id":"BR05","name":"Bridge 05","type":"BR","elevation":3700,"y":474,"x":286},
  // ── JUNCTIONS (J) — routing topology nodes, no physical facility ──────
  {"id":"J01","name":"Junction 01","type":"J","elevation":3400,"y":943, "x":510},
  {"id":"J02","name":"Junction 02","type":"J","elevation":3200,"y":797,"x":320},
  {"id":"J03","name":"Junction 03","type":"J","elevation":3800,"y":587,"x":344},
  {"id":"J04","name":"Junction 04","type":"J","elevation":4500,"y":204,"x":786 },
  {"id":"J05","name":"Junction 05","type":"J","elevation":4200,"y":304,"x":816 },
  {"id":"J06","name":"Junction 06","type":"J","elevation":3200,"y":424,"x":836 },
  {"id":"J07","name":"Junction 07","type":"J","elevation":3150,"y":629,"x":653 },
  {"id":"J08","name":"Junction 08","type":"J","elevation":4650,"y":336,"x":748 },
  {"id":"J09","name":"Junction 09","type":"J","elevation":5100,"y":169,"x":1151 },
  {"id":"J10","name":"Junction 10","type":"J","elevation":6000,"y":75,"x":1365 },
  {"id":"J11","name":"Junction 11","type":"J","elevation":4000,"y":544,"x":746 },
  {"id":"J12","name":"Junction 12","type":"J","elevation":4100,"y":504,"x":736 },
  {"id":"J13","name":"Junction 13","type":"J","elevation":4200,"y":464,"x":726 },
  {"id":"J14","name":"Junction 14","type":"J","elevation":4300,"y":424,"x":716 },
  {"id":"J15","name":"Junction 15","type":"J","elevation":4500,"y":324,"x":1336 }
];
`;

fs.writeFileSync('./src/data/nodeMaster.js', originalNodeMaster);
console.log('Restored original nodeMaster.js');
