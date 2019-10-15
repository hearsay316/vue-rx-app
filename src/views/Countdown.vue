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
  repeat,
  shareReplay,
  catchError,
  pluck
} from "rxjs/operators";
import { ajax } from "rxjs/ajax";

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
      switchMap(() => {
        return ajax(
          "http://www.mxnzp.com/api/news/list?typeId=525&page=1"
        ).pipe(
          switchMap(userResponse => {
            console.log(userResponse, 2222);
            return interval(1000);
          }),
          catchError(err => {
            console.log(err, "err");
            return takeWhile(() => false);
          }),
          pluck("response")
        );
      }),
      startWith(30),
      scan(time => time - 1),
      takeWhile(time => time > 0),
      share()
    );
    const next$ = concat(handleClick, of("你好")).pipe(
      repeat(),
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
