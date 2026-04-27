/**
 * @schema 2.10
 */
const nodes = [];

const w = pencil.width || 500;
const h = pencil.height || 350;

// Center the "hub" in the middle of this 500x350 component
const cx = w / 2;
const cy = h / 2;

// Functions to draw parts
function drawLine(x1, y1, x2, y2, color) {
  nodes.push({
    type: "path",
    x: Math.min(x1, x2), y: Math.min(y1, y2),
    width: Math.abs(x2 - x1) || 1, height: Math.abs(y2 - y1) || 1,
    fill: undefined,
    stroke: { align: "center", fill: color, thickness: 1, dashPattern: [4, 4] },
    viewBox: [Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1) || 1, Math.abs(y2 - y1) || 1],
    geometry: `M ${x1} ${y1} L ${x2} ${y2}`
  });
}

function drawServer(x, y, r, glow) {
  if (glow) {
    nodes.push({
      type: "ellipse",
      x: x - r*2.5, y: y - r*2.5, width: r*5, height: r*5,
      fill: "#4B0082",
      opacity: 0.15,
      effect: { type: "blur", radius: 40 }
    });
  }
  nodes.push({
    type: "rectangle",
    x: x - r, y: y - r, width: r*2, height: r*2,
    cornerRadius: r*0.3,
    fill: "#1A1C1C", // Dark surface instead of the weird blue
    stroke: { align: "inside", fill: "#ddb7ff", thickness: 2 },
    effect: { blur: 20, color: "#ddb7ff33", shadowType: "outer", type: "shadow" }
  });
  nodes.push({
    type: "rectangle", x: x - r*0.5, y: y - r*0.3, width: r, height: r*0.2, fill: "#ddb7ff"
  });
  nodes.push({
    type: "rectangle", x: x - r*0.5, y: y + r*0.1, width: r, height: r*0.2, fill: "#ddb7ff"
  });
}

function drawDB(x, y, r) {
  nodes.push({
    type: "rectangle",
    x: x - r, y: y - r*1.2, width: r*2, height: r*2.4,
    cornerRadius: r*0.4,
    fill: "#1A1C1C",
    stroke: { align: "inside", fill: "#978d9d", thickness: 1 },
    effect: { blur: 15, color: "#4B008222", shadowType: "outer", type: "shadow" }
  });
  nodes.push({
    type: "line", x: x - r, y: y - r*0.5, width: r*2, height: 1, stroke: { align: "center", fill: "#978d9d", thickness: 1 }
  });
  nodes.push({
    type: "line", x: x - r, y: y + r*0.5, width: r*2, height: 1, stroke: { align: "center", fill: "#978d9d", thickness: 1 }
  });
}

function drawNode(x, y, r, color) {
  nodes.push({
    type: "ellipse", x: x - r, y: y - r, width: r*2, height: r*2,
    fill: color,
    effect: { blur: 10, color: color, shadowType: "outer", type: "shadow" }
  });
}

const scaleX = 170;
const scaleY = 120;

// Generate the lines connecting them
const coords = [
  {x: cx - scaleX, y: cy - scaleY}, {x: cx + scaleX*0.8, y: cy - scaleY*0.8}, 
  {x: cx - scaleX*0.9, y: cy + scaleY}, {x: cx + scaleX*0.7, y: cy + scaleY*0.9},
  {x: cx - scaleX*1.2, y: cy}, {x: cx + scaleX, y: cy}
];

// Lines
coords.forEach(c => {
  drawLine(c.x, c.y, cx, cy, "#4B0082");
});

// Circular orbits
nodes.push({
  type: "ellipse", x: cx - scaleY*1.2, y: cy - scaleY*1.2, width: scaleY*2.4, height: scaleY*2.4,
  innerRadius: 0.99,
  fill: "#4B008233",
  stroke: { align: "center", fill: "#4B0082", thickness: 1, dashPattern: [15, 20] }
});

// Particles
const particleColor = "#ddb7ff";
drawNode(cx - scaleX*0.5, cy - scaleY*0.5, 5, particleColor);
drawNode(cx + scaleX*0.4, cy + scaleY*0.5, 6, particleColor);
drawNode(cx - scaleX*0.8, cy, 4, particleColor);
drawNode(cx + scaleX*0.5, cy - scaleY*0.2, 4, particleColor);
drawNode(cx - scaleX*0.3, cy + scaleY*0.8, 5, particleColor);

// Infrastructure components
drawDB(cx - scaleX, cy - scaleY, 20);
drawDB(cx + scaleX*0.7, cy + scaleY*0.9, 20);
drawServer(cx - scaleX*0.9, cy + scaleY, 20, false);
drawServer(cx + scaleX*0.8, cy - scaleY*0.8, 20, false);
drawServer(cx - scaleX*1.2, cy, 18, false);
drawServer(cx + scaleX, cy, 18, false);

// Central Hub
drawServer(cx, cy, 40, true);

// Add descriptive text
nodes.push({
  type: "text",
  x: cx - 60, y: cy + 55, width: 120,
  textGrowth: "fixed-width",
  content: "CORE ENGINE",
  fill: "#ddb7ff",
  fontFamily: "Space Grotesk",
  fontSize: 12,
  fontWeight: "600",
  letterSpacing: 3,
  textAlign: "center"
});

return nodes;
