export function calculateEntityAttributes(entropy) {
  const performanceFactor = entropy.toString() % 10;
  const lastTwoDigits = entropy.toString() % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((entropy / 40000).toFixed(3));
  let role;
  const result = entropy.toString() % 3;
  if (result === 0) {
    role = 'Forger';
  } else {
    role = 'Merger';
  }
  return { role, forgePotential, nukeFactor, performanceFactor };
}