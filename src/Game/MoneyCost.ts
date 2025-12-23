export enum MoneyCostType {
  FenceMake = 0,
  GroundMake,
  CornPlant,
  CornHarvest,
  StrawberryPlant,
  StrawberryHarvest,
  GrapePlant,
  GrapeHarvest,
  TomatoPlant,
  TomatoHarvest,
  CowBuy,
  CowDaily,
  SheepBuy,
  SheepDaily,
  SheepDamage,
  ChickenBuy,
  ChickenDaily,
  RentDaily,
  RentIncrease,
}

const MoneyCost: Record<MoneyCostType, number> = {
  [MoneyCostType.FenceMake]: -3000,
  [MoneyCostType.GroundMake]: -1500,

  [MoneyCostType.CornPlant]: -40,
  [MoneyCostType.CornHarvest]: 90,

  [MoneyCostType.StrawberryPlant]: -120,
  [MoneyCostType.StrawberryHarvest]: 320,

  [MoneyCostType.GrapePlant]: -200,
  [MoneyCostType.GrapeHarvest]: 600,

  [MoneyCostType.TomatoPlant]: -70,
  [MoneyCostType.TomatoHarvest]: 170,

  [MoneyCostType.CowBuy]: -600,
  [MoneyCostType.CowDaily]: 120,

  [MoneyCostType.SheepBuy]: -250,
  [MoneyCostType.SheepDaily]: 55,
  [MoneyCostType.SheepDamage]: -10,

  [MoneyCostType.ChickenBuy]: 0,
  [MoneyCostType.ChickenDaily]: 17,

  [MoneyCostType.RentDaily]: -300,
  [MoneyCostType.RentIncrease]: 0,
};

export function getMoneyCost(type: MoneyCostType): number {
  return MoneyCost[type];
}

export default MoneyCost;
