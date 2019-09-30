<template>
  <div class="Countdown">
    <button :disabled="isFalse" v-stream:click="count$">{{ deac }}</button>
    {{ deac }}{{ next$ }}
  </div>
</template>

<script>
import { of, interval, concat } from "rxjs";
import {
  share,
  switchMap,
  scan,
  startWith,
  takeWhile,
  repeatWhen,
  shareReplay
} from "rxjs/operators";
export default {
  name: "Countdown",
  domStreams: ["count$"],
  data() {
    return {
      deac: "",
      isFalse: false
    };
  },
  subscriptions() {
    let handleClick = this.count$.pipe(
      switchMap(() => interval(1000)),
      startWith(30),
      scan(time => time - 1),
      takeWhile(time => time > 0),
      share()
    );
    const next$ = concat(handleClick, of("你好")).pipe(
      repeatWhen(() => this.count$),
      shareReplay()
    );
    next$.subscribe(x => {
      console.log(x);
      if (x === 30 || x === "你好") {
        this.isFalse = false;
        this.deac = "点击发送按钮";
        return;
      }
      this.isFalse = true;
      this.deac = x;
    });
    return { next$ };
  }
};
</script>

<style scoped></style>
