// AUTO-GENERATED FROM EXACT DATASET VALUES + Manual map calibration
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

import { mapNodeCoordinates } from './mapNodeCoordinates.js';

const baseNodes = [
  // ── OPERATIONAL LOCATIONS (L) ──────────────────────────────────────────
  {"id":"L01","name":"Command HQ",                  "type":"L","elevation":3505,"lat":34.1548,"lng":77.5806,"y":775,"x":595 },
  {"id":"L02","name":"Communication Center",         "type":"L","elevation":3512,"lat":34.1572,"lng":77.5848,"y":688,"x":611},
  {"id":"L03","name":"Mission Control",              "type":"L","elevation":3524,"lat":34.1605,"lng":77.5891,"y":626,"x":630},
  {"id":"L04","name":"Logistics Hub",                "type":"L","elevation":3658,"lat":34.2149,"lng":77.6246,"y":774,"x":967},
  {"id":"L05","name":"Fuel Depot",                   "type":"L","elevation":3925,"lat":34.2786,"lng":77.6394,"y":623,"x":378},
  {"id":"L06","name":"Vehicle Maintenance",          "type":"L","elevation":4058,"lat":34.2869,"lng":77.6488,"y":555,"x":371},
  {"id":"L07","name":"Transit Camp",                 "type":"L","elevation":4276,"lat":34.3268,"lng":77.6597,"y":582,"x":838},
  {"id":"L08","name":"Supply Camp",                  "type":"L","elevation":3186,"lat":34.6169,"lng":77.8298,"y":506,"x":729},
  {"id":"L09","name":"Medical Camp",                 "type":"L","elevation":3144,"lat":34.5828,"lng":77.5605,"y":443,"x":561},
  {"id":"L10","name":"Engineering Camp",             "type":"L","elevation":3162,"lat":34.5962,"lng":77.4798,"y":453,"x":671},
  {"id":"L11","name":"Weather Station",              "type":"L","elevation":3338,"lat":34.6558,"lng":77.5749,"y":256,"x":485 },
  {"id":"L12","name":"Avalanche Center",             "type":"L","elevation":3472,"lat":34.6641,"lng":77.5826,"y":374,"x":455},
  {"id":"L13","name":"Snow Patrol Camp",             "type":"L","elevation":3628,"lat":34.6739,"lng":77.5907,"y":323,"x":677 },
  {"id":"L14","name":"Emergency Camp",               "type":"L","elevation":4015,"lat":34.7364,"lng":77.7118,"y":477,"x":905 },
  {"id":"L15","name":"Glacier Operations Camp",      "type":"L","elevation":4328,"lat":34.7798,"lng":77.7589,"y":245,"x":714 },
  {"id":"L16","name":"Ice Rescue Center",            "type":"L","elevation":4486,"lat":34.8136,"lng":77.7924,"y":310,"x":915 },
  {"id":"L17","name":"Radar Station",                "type":"L","elevation":4728,"lat":34.8529,"lng":77.8315,"y":141,"x":714 },
  {"id":"L18","name":"OP Alpha",                     "type":"L","elevation":4958,"lat":34.8895,"lng":77.8661,"y":95,"x":498 },
  {"id":"L19","name":"OP Bravo",                     "type":"L","elevation":5152,"lat":34.9254,"lng":77.9014,"y":101,"x":903 },
  {"id":"L20","name":"Peak Sentinel",                "type":"L","elevation":5428,"lat":34.9682,"lng":77.9448,"y":35,"x":751 },
  // ── CHECKPOINTS (CP) ───────────────────────────────────────────────────
  {"id":"CP01","name":"Leh Entry Checkpoint",            "type":"CP","elevation":3510,"lat":34.154, "lng":77.5765,"y":814,"x":500 },
  {"id":"CP02","name":"Indus Bridge Checkpoint",         "type":"CP","elevation":3555,"lat":34.1785,"lng":77.6208,"y":746,"x":749},
  {"id":"CP03","name":"Hunder Junction",     "type":"CP","elevation":3665,"lat":34.245, "lng":77.7355,"y":729,"x":429 },
  {"id":"CP04","name":"Khardung Sector Checkpoint",      "type":"CP","elevation":3815,"lat":34.3005,"lng":77.82,  "y":0,"x":0,"reserved":true },
  {"id":"CP05","name":"Supply Route Checkpoint",         "type":"CP","elevation":3990,"lat":34.3845,"lng":77.9285,"y":520,"x":562},
  {"id":"CP06","name":"Glacier Base Checkpoint",         "type":"CP","elevation":4255,"lat":34.4655,"lng":78.0625,"y":359,"x":843 },
  {"id":"CP07","name":"Nubra Patrol Checkpoint",         "type":"CP","elevation":4385,"lat":34.5145,"lng":78.1455,"y":385,"x":642 },
  {"id":"CP08","name":"Valley Junction Checkpoint",      "type":"CP","elevation":4075,"lat":34.3985,"lng":77.9955,"y":439,"x":435},
  {"id":"CP09","name":"Ridge Security Checkpoint",       "type":"CP","elevation":4135,"lat":34.421, "lng":78.0225,"y":323,"x":456},
  {"id":"CP10","name":"Northern Defense Checkpoint",     "type":"CP","elevation":4550,"lat":34.5485,"lng":78.228, "y":186,"x":718 },
  {"id":"CP11","name":"Forward Observation Checkpoint",  "type":"CP","elevation":4725,"lat":34.612, "lng":78.31,  "y":167,"x":521 },
  {"id":"CP12","name":"Peak Sentinel Checkpoint",        "type":"CP","elevation":4885,"lat":34.6555,"lng":78.3655,"y":83,"x":740 },
  // ── REST POINTS (RP) ───────────────────────────────────────────────────
  {"id":"RP01","name":"Indus Bridge Rest",    "type":"RP","elevation":3565,"lat":34.1868,"lng":77.6365,"y":0,"x":0,"reserved":true },
  {"id":"RP02","name":"Nubra Rest Point",     "type":"RP","elevation":4015,"lat":34.3865,"lng":77.9312,"y":653,"x":461 },
  {"id":"RP03","name":"Khardung Rest Point",  "type":"RP","elevation":3875,"lat":34.3175,"lng":77.8515,"y":0,"x":0,"reserved":true },
  {"id":"RP04","name":"Khalsar Rest Point",   "type":"RP","elevation":3635,"lat":34.2218,"lng":77.6942,"y":638,"x":850},
  {"id":"RP05","name":"Shyok Rest Point",     "type":"RP","elevation":4115,"lat":34.4095,"lng":78.0085,"y":599,"x":981},
  {"id":"RP06","name":"Siachen Base Rest",    "type":"RP","elevation":4395,"lat":34.5015,"lng":78.1385,"y":579,"x":753 },
  {"id":"RP07","name":"Glacier View Rest",    "type":"RP","elevation":4785,"lat":34.6245,"lng":78.3285,"y":139,"x":953 },
  // ── HELIPADS (HP) ──────────────────────────────────────────────────────
  {"id":"HP01","name":"Leh Helipad",               "type":"HP","elevation":3515,"lat":34.1548,"lng":77.5778,"y":792,"x":757 },
  {"id":"HP02","name":"North Pullu Helipad",        "type":"HP","elevation":3795,"lat":34.2684,"lng":77.7426,"y":517,"x":649},
  {"id":"HP03","name":"Shyok Helipad",              "type":"HP","elevation":4085,"lat":34.3952,"lng":77.9868,"y":697,"x":994},
  {"id":"HP04","name":"Indus Helipad",              "type":"HP","elevation":3645,"lat":34.2338,"lng":77.7065,"y":691,"x":431 },
  {"id":"HP05","name":"Pananik Helipad",            "type":"HP","elevation":4535,"lat":34.5538,"lng":78.2195,"y":208,"x":643 },
  {"id":"HP06","name":"Peak Helipad",               "type":"HP","elevation":4895,"lat":34.6572,"lng":78.3678,"y":47,"x":873 },
  // ── OBSERVATION TOWERS (OT) ────────────────────────────────────────────
  {"id":"OT01","name":"North Pass Tower",   "type":"OT","elevation":4625,"lat":34.5715,"lng":78.2485,"y":126,"x":630},
  {"id":"OT02","name":"Indus Ridge Tower",  "type":"OT","elevation":3545,"lat":34.1685,"lng":77.6015,"y":840,"x":778},
  {"id":"OT03","name":"Shyok Ridge Tower",  "type":"OT","elevation":4135,"lat":34.4125,"lng":78.0145,"y":727,"x":1034},
  {"id":"OT04","name":"Nubra Ridge Tower",  "type":"OT","elevation":3925,"lat":34.3465,"lng":77.8825,"y":494,"x":325},
  // ── BRIDGES (BR) ───────────────────────────────────────────────────────
  {"id":"BR01","name":"Bridge 01","type":"BR","elevation":3300,"y":771,"x":506},
  {"id":"BR02","name":"Bridge 02","type":"BR","elevation":3400,"y":410,"x":357},
  {"id":"BR03","name":"Bridge 03","type":"BR","elevation":3500,"y":0,"x":0,"reserved":true },
  {"id":"BR04","name":"Bridge 04","type":"BR","elevation":3600,"y":571,"x":1005},
  {"id":"BR05","name":"Bridge 05","type":"BR","elevation":3700,"y":202,"x":925},
  // ── JUNCTIONS (J) — routing topology nodes, no physical facility ──────
  {"id":"J01","name":"Junction 01","type":"J","elevation":3400,"y":632,"x":357},
  {"id":"J02","name":"Junction 02","type":"J","elevation":3200,"y":585,"x":331},
  {"id":"J03","name":"Junction 03","type":"J","elevation":3800,"y":521,"x":329},
  {"id":"J04","name":"Junction 04","type":"J","elevation":4500,"y":467,"x":347 },
  {"id":"J05","name":"Junction 05","type":"J","elevation":4200,"y":370,"x":409 },
  {"id":"J06","name":"Junction 06","type":"J","elevation":3200,"y":583,"x":623 },
  {"id":"J07","name":"Junction 07","type":"J","elevation":3150,"y":583,"x":668 },
  {"id":"J08","name":"Junction 08","type":"J","elevation":4650,"y":623,"x":811 },
  {"id":"J09","name":"Junction 09","type":"J","elevation":5100,"y":506,"x":896 },
  {"id":"J10","name":"Junction 10","type":"J","elevation":6000,"y":481,"x":802 },
  {"id":"J11","name":"Junction 11","type":"J","elevation":4000,"y":374,"x":813 },
  {"id":"J12","name":"Junction 12","type":"J","elevation":4100,"y":375,"x":765 },
  {"id":"J13","name":"Junction 13","type":"J","elevation":4200,"y":80,"x":858 },
  {"id":"J14","name":"Junction 14","type":"J","elevation":4300,"y":87,"x":618 },
  {"id":"J15","name":"Junction 15","type":"J","elevation":4500,"y":96,"x":477 }
];

// x/y always come from mapNodeCoordinates.js (the calibration tool's output). Nodes without an
// entry (reserved / not deployed) get x=0,y=0 and are hidden by the map.
export const nodeMaster = baseNodes.map(n => {
  const c = mapNodeCoordinates[n.id];
  return { ...n, x: c ? c.x : 0, y: c ? c.y : 0 };
});
