<template>
  <div v-stream:click="handleClick$" class="pairwise">
    <button>按钮</button>
  </div>
</template>

<script>
import { pairwise, map } from "rxjs/operators";

export default {
  name: "pairwise",
  domStreams: ["handleClick$"],
  subscriptions() {
    let distances = this.handleClick$.pipe(
      pairwise(),
      map(pair => {
        const x0 = pair[0].event.clientX;
        const y0 = pair[0].event.clientY;
        const x1 = pair[1].event.clientX;
        const y1 = pair[1].event.clientY;
        return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
      })
    );
    distances.subscribe(x => console.log(x));
    return { distances };
  }
};
</script>

<style scoped></style>
