import { Application } from "pixi.js";

export class LayoutManager {
  readonly ASPECT_RATIO = 16 / 9;
  readonly BASE_WIDTH = 1600;
  readonly BASE_HEIGHT = this.BASE_WIDTH / this.ASPECT_RATIO;

  constructor(private app: Application) {
    app.renderer.resize(this.BASE_WIDTH, this.BASE_HEIGHT);
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
  }

  private onResize() {
    const { innerWidth, innerHeight } = window;
    const currentAspectRatio = innerWidth / innerHeight;

    if (currentAspectRatio > this.ASPECT_RATIO) {
      this.app.canvas.style.width = innerHeight * this.ASPECT_RATIO + 'px';
      this.app.canvas.style.height = innerHeight + 'px';
    } else { 
      this.app.canvas.style.width = innerWidth + 'px';
      this.app.canvas.style.height = innerWidth / this.ASPECT_RATIO + 'px';
    }

    this.app.renderer.resize(this.BASE_WIDTH, this.BASE_HEIGHT);
  }
}