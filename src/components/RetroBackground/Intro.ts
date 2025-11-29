import { CONFIG } from "./Config";

export class IntroAnimation {
    private startTime: number = 0;
    private isComplete: boolean = false;
    private isStarted: boolean = false;

    // Progress for each element (0 to 1)
    public moonProgress: number = 0;
    public backProgress: number = 0;
    public midProgress: number = 0;
    public foreProgress: number = 0;
    public opacity: number = 0;

    start() {
        this.startTime = performance.now();
        this.isComplete = false;
        this.isStarted = true;
    }

    update(time: number) {
        if (!this.isStarted || this.isComplete) return;

        const elapsed = time - this.startTime;

        // Canvas Fade In
        this.opacity = Math.min(elapsed / 800, 1);

        // Calculate progress for each layer based on delays
        this.moonProgress = this.easeOutCubic(Math.max(0, Math.min((elapsed - CONFIG.intro.moonDelay) / 1000, 1)));
        this.backProgress = this.easeOutCubic(Math.max(0, Math.min((elapsed - CONFIG.intro.mountainBackDelay) / 800, 1)));
        this.midProgress = this.easeOutCubic(Math.max(0, Math.min((elapsed - CONFIG.intro.mountainMidDelay) / 800, 1)));
        this.foreProgress = this.easeOutCubic(Math.max(0, Math.min((elapsed - CONFIG.intro.mountainForeDelay) / 800, 1)));

        if (elapsed > CONFIG.intro.duration) {
            this.isComplete = true;
            this.moonProgress = 1;
            this.backProgress = 1;
            this.midProgress = 1;
            this.foreProgress = 1;
            this.opacity = 1;
        }
    }

    private easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }
}
