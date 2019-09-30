<template>
  <div class="snooze">
    <div>{{ desc }}</div>
    <button :disabled="disAble" v-stream:click="snooze$">{{ desc }}</button>
    <button :disabled="disAble" v-stream:click="dismiss$">停止</button>
  </div>
</template>

<script>
import { interval, concat, of } from "rxjs";
import {
  map,
  scan,
  startWith,
  takeWhile,
  repeatWhen,
  takeUntil,
  share,
  shareReplay
} from "rxjs/operators";

export default {
  name: "snooze",
  domStreams: ["snooze$", "dismiss$"],
  subscriptions() {
    const countdown$ = interval(1000);
    const takeFourNumbers = countdown$.pipe(
      startWith(60),
      scan(time => time - 1),
      takeWhile(time => time > 0)
    );
    let meg = concat(takeFourNumbers, of("按钮"));
    meg = meg.pipe(share());
    const user = meg.pipe(
      repeatWhen(() => this.snooze$),
      takeUntil(this.dismiss$)
    );
    let desc = concat(user, of("这个是ok"));
    desc = desc.pipe(shareReplay());
    let disAble = desc.pipe(map(value => value !== "按钮"));
    return {
      desc,
      disAble
    };
  }
};
</script>

<style scoped></style>
