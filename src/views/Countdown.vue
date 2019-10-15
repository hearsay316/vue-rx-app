<template>
  <div class="Countdown">
    <button :disabled="isFalse" v-stream:click="count$">{{ deac }}</button>
    {{ deac }}
  </div>
</template>

<script>
import { of, interval } from "rxjs";
import {
  switchMap,
  scan,
  startWith,
  takeWhile,
  repeat,
  catchError,
  pluck,
  exhaustMap,
  retry,
  take
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
      exhaustMap(() =>
        ///list?typeId=525&page=1
        ajax("http://www.mxnzp.com/api/news/list?typeId=525&page=1").pipe(
          retry(3),
          catchError(err => of(err).pipe(take())),
          pluck("response"),
          switchMap(() => interval(1000))
        )
      ),
      startWith(30),
      scan(time => time - 1),
      takeWhile(time => time > -1),
      repeat()
    );
    handleClick.subscribe(x => {
      console.log(x);
      if (x === 30) {
        this.isFalse = false;
        this.deac = "点击发送按钮";
        return;
      }
      this.isFalse = true;
      this.deac = ``;
    });

    return { handleClick };
  }
};
</script>

<style scoped></style>
