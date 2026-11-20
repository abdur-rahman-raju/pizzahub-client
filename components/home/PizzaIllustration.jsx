export default function PizzaIllustration({ className }) {
  const pepperoni = [
    [150, 140], [250, 150], [200, 210], [130, 240], [270, 250], [190, 290], [215, 115],
  ];
  const olives = [[110, 190], [300, 200], [230, 300], [170, 100]];
  const basil = [
    [175, 175, -30], [235, 235, 40], [150, 300, 15], [262, 112, -50],
  ];
  const sliceEnds = [
    [390, 200], [334, 334], [200, 390], [66, 334], [10, 200], [66, 66], [200, 10], [334, 66],
  ];

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Illustration of a fresh pizza"
    >
      <circle cx="200" cy="200" r="192" fill="#e8a55b" />
      <circle cx="200" cy="200" r="192" fill="none" stroke="#c9803a" strokeWidth="6" />
      <circle cx="200" cy="200" r="162" fill="#d62828" />
      <circle cx="200" cy="200" r="150" fill="#ffd166" />

      {sliceEnds.map(([x, y], i) => (
        <line key={i} x1="200" y1="200" x2={x} y2={y} stroke="#c9803a" strokeOpacity="0.55" strokeWidth="3" />
      ))}

      {pepperoni.map(([cx, cy], i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r="23" fill="#b71c1c" />
          <circle cx={cx} cy={cy} r="16" fill="#c62828" />
        </g>
      ))}

      {olives.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="9" fill="none" stroke="#2b1a12" strokeWidth="5" />
      ))}

      {basil.map(([x, y, rotate], i) => (
        <ellipse key={i} cx={x} cy={y} rx="13" ry="6" fill="#2e7d32" transform={`rotate(${rotate} ${x} ${y})`} />
      ))}
    </svg>
  );
}