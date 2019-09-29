<template>
  <div class="slide">
    <div>
      {{ slide$ }}
    </div>
  </div>
</template>

<script>
import { of, fromEvent, merge } from "rxjs";
import {
  pluck,
  filter,
  mapTo,
  throttleTime,
  startWith,
  scan,
  combineLatest
} from "rxjs/operators";

export default {
  name: "slide",
  domstreams: [],
  subscriptions() {
    const key$ = fromEvent(window, "keydown").pipe(pluck("key"));

    const left$ = key$.pipe(
      filter(key => key === "ArrowLeft"),
      mapTo(-1)
    );

    const rigth$ = key$.pipe(
      filter(key => key === "ArrowRight"),
      mapTo(1)
    );

    const index$ = merge(left$, rigth$).pipe(
      throttleTime(250),
      startWith(0),
      scan((i, direction) => {
        return i + direction < 0 ? 7 : i + direction < 8 ? i + direction : 0;
      })
    );

    let slide$ = of([
      "Hi, I'm John Lindquist",
      "egghead.io founder",
      "vue-rx",
      "RxJS isn't easy",
      "I'm not smart",
      '"Badass: Making Users Awesome" - Kathy Sierra',
      "Perceptual Exposure",
      "Your Brain Will Detect Patterns"
    ]).pipe(
      combineLatest(index$, (slides, index) => {
        return slides[index];
      })
    );

    return { slide$ };
  }
};
</script>

<style scoped></style>
