export default class GameLevel {
  public onLevelFinished?: () => void;

  constructor() {}

  public init(): void {}

  public async startLevel(): Promise<void> {}

  public async finishLevel(): Promise<void> {
    this.onLevelFinished?.();
  }

  public update(delta: number): void {}
}
