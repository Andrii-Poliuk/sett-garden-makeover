import { Container, Text } from "pixi.js";
import SpriteButton from "./SpriteButton";

export interface EconomyHintOptions {
  cost: number;
  income: number;
}

export default class EconomyHint extends Container {
  private costLabel: Text;
  private incomeLabel: Text;

  public static addEconomyHintToButton(
    button: SpriteButton,
    options: EconomyHintOptions,
  ): void {
    const textOffset: number = options.income != 0 ? -12 : 0;
    const hint = new EconomyHint(options);
    hint.position.set(50, 12 + textOffset);
    button.addChild(hint);
    button.setTextOffset(textOffset);
  }

  constructor(options: EconomyHintOptions) {
    super();

    this.costLabel = new Text({
      text: this.formatCost(options.cost),
      style: {
        fontFamily: "Arial",
        fontSize: 14,
        fill: 0xffcc00,
        stroke: { color: "#303030", width: 1 },
      },
    });
    this.costLabel.anchor.set(0, 0);
    this.addChild(this.costLabel);

    this.incomeLabel = new Text({
      text: this.formatIncome(options.income),
      style: {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0x90ee90,
        stroke: { color: "#303030", width: 1 },
      },
    });
    this.incomeLabel.anchor.set(0, 0);
    this.incomeLabel.y = 16;
    this.addChild(this.incomeLabel);
  }

  private formatCost(value: number): string {
    const absValue = Math.abs(value);
    return `-$${absValue}`;
  }

  private formatIncome(value: number): string {
    if (value == 0) {
      return "";
    }
    return `+$${value}`;
  }

  public setCost(value: number): void {
    this.costLabel.text = this.formatCost(value);
  }

  public setIncome(value: number): void {
    this.incomeLabel.text = this.formatIncome(value);
  }
}
