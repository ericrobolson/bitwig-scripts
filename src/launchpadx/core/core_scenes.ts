interface Scene {}
interface SceneBank {
  getScene(indexInBank: number): Scene;
  scrollPageUp(): void;
  scrollPageDown(): void;
}
