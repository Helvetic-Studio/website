// jsdom ships no AnimationEvent. React DOM reads `"AnimationEvent" in window` once, when it loads,
// and otherwise listens for the WebKit-prefixed event name — so this must run before any test
// helper imports react-dom (see vitest.setup.ts at the repository root).
class AnimationEventPolyfill extends Event {
  readonly animationName: string;
  readonly elapsedTime: number;
  readonly pseudoElement: string;

  constructor(type: string, init: AnimationEventInit = {}) {
    super(type, init);
    this.animationName = init.animationName ?? "";
    this.elapsedTime = init.elapsedTime ?? 0;
    this.pseudoElement = init.pseudoElement ?? "";
  }
}

if (typeof window !== "undefined" && !("AnimationEvent" in window)) {
  Reflect.set(window, "AnimationEvent", AnimationEventPolyfill);
}
