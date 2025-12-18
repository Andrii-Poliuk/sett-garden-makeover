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
  RentDaily
}

const MoneyCost: Record<MoneyCostType, number> = {
  [MoneyCostType.FenceMake]: 50,
  [MoneyCostType.GroundMake]: 100,

  [MoneyCostType.CornPlant]: -1,
  [MoneyCostType.CornHarvest]: 30,

  [MoneyCostType.StrawberryPlant]: -2,
  [MoneyCostType.StrawberryHarvest]: 4,

  [MoneyCostType.GrapePlant]: -3,
  [MoneyCostType.GrapeHarvest]: 5,

  [MoneyCostType.TomatoPlant]: -1,
  [MoneyCostType.TomatoHarvest]: 3,

  [MoneyCostType.CowBuy]: -10,
  [MoneyCostType.CowDaily]: 30,

  [MoneyCostType.SheepBuy]: -5,
  [MoneyCostType.SheepDaily]: 20,
  [MoneyCostType.SheepDamage]: -10,

  [MoneyCostType.ChickenBuy]: 0,
  [MoneyCostType.ChickenDaily]: 19,

  [MoneyCostType.RentDaily]: -300,
};

export function getMoneyCost(type: MoneyCostType): number {
  return MoneyCost[type];
}

export default MoneyCost;
