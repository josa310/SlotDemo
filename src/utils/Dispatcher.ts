
export type IListener = (id: number) => void;

export class Dispatcher {
  private listeners: Map<number, Set<IListener>> = new Map();

  public addEventListener(id: number, listener: IListener): void {
    if (!this.listeners.has(id)) {
      this.listeners.set(id, new Set());
    }
    this.listeners.get(id)!.add(listener);
  }

  public removeEventListener(id: number, listener: IListener): void {
    if (this.listeners.has(id)) {
      this.listeners.get(id)!.delete(listener);
    }
  }

  public dispatchEvent(id: number): void {
    if (this.listeners.has(id)) {
      this.listeners.get(id)!.forEach(listener => listener(id));
    }
  }
}