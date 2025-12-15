export function calculateFieldPlan({ crop, area }) {
  const seedsRequired = area * 40;          // kg
  const waterRequired = area * 120000;      // liters
  const expectedYield = area * 20;          // quintals

  const pricePerQuintal = crop.price || 2000;
  const revenue = expectedYield * pricePerQuintal;

  const seedCost = seedsRequired * 50;
  const irrigationCost = area * 3000;
  const fertilizerCost = area * 2500;

  const totalCost = seedCost + irrigationCost + fertilizerCost;
  const profit = revenue - totalCost;

  return {
    seedsRequired,
    waterRequired,
    expectedYield,
    revenue,
    totalCost,
    profit,
  };
}
