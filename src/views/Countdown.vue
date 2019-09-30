<template>
  <div class="Countdown">
    <button :disabled="disAble" v-stream:click="count$">{{ deac }}</button>
    {{ deac }}
  </div>
</template>

<script>
import { of, interval, concat } from "rxjs";
import {
  map,
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
      deac: ""
    };
  },
  subscriptions() {
    let arr = ["30", "按钮"];
    let handleClick = this.count$.pipe(
      switchMap(() => interval(1000)),
      startWith("30"),
      scan(time => time - 1),
      takeWhile(time => time > 0)
    );
    let meg = concat(handleClick, of("按钮"));
    const user = meg.pipe(repeatWhen(() => this.count$));
    let desc = concat(user, of("这个是ok"));
    desc = desc.pipe(shareReplay());
    meg.subscribe(x => {
      if (x === "30") {
        console.log(x === "30");
        return (this.deac = "点击发送按钮");
      }
      this.deac = x;
    });
    let disAble = desc.pipe(
      map(value => {
        return !arr.includes(value);
      })
    );
    return { desc, disAble };
  }
};
</script>

<style scoped></style>
