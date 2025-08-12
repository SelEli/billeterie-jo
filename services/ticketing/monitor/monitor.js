// monitor/monitor.js

class Timer {
  constructor(label) {
    this.label = label;
    this.startTime = null;
  }

  start() {
    this.startTime = process.hrtime();
    return this;
  }

  stop() {
    if (!this.startTime) {
      throw new Error(`[monitor] Timer "${this.label}" never started.`);
    }
    const [sec, nano] = process.hrtime(this.startTime);
    const duration = sec * 1000 + nano / 1e6;
    console.log(`[monitor] ${this.label} took ${duration.toFixed(2)}ms`);
    return duration;
  }

  success() {
    return this.stop();
  }

  fail(error) {
    console.error(`[monitor] ${this.label} failed: ${error?.message || error}`);
    return this.stop();
  }
}

function timer(label, fn) {
  if (typeof fn === 'function') {
    return async function wrapped(...args) {
      const t = new Timer(label).start();
      try {
        const result = fn.apply(this, args);
        if (result && typeof result.then === 'function') {
          return result.then(res => {
            t.success();
            return res;
          });
        } else {
          t.success();
          return result;
        }
      } catch (err) {
        t.fail(err);
        throw err;
      }
    };
  }

  if (typeof label !== 'string') {
    throw new TypeError(`[monitor] timer() attendu un label string, reçu: ${typeof label}`);
  }

  return new Timer(label);
}

module.exports = { timer };
