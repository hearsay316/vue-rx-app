<template>
  <div id="app">
    <div>{{ count }}</div>

    <!-- simple usage -->
    <button v-stream:click="plus$">Add on Click</button>

    <button
      v-stream:click="{
        subject: plus$,
        data: minusDelta1,
        options: { once: true }
      }"
    >
      Add on Click (Option once:true)
    </button>

    <!-- you can also stream to the same subject with different events/data -->
    <button
      v-stream:click="{ subject: minus$, data: minusDelta1 }"
      v-stream:mousemove="{ subject: minus$, data: minusDelta2 }"
    >
      Minus on Click &amp; Mousemove
    </button>

    <pre>{{ $data }}</pre>

    <my-button v-stream:click="plus$"></my-button>
  </div>
</template>

<script>
import { map, pluck, startWith, scan } from "rxjs/operators";
import { merge } from "rxjs";
export default {
  name: "CombineLatest",
  data() {
    return {
      minusDelta1: -1,
      minusDelta2: -1
    };
  },
  components: {
    myButton: {
      template: `<button @click="$emit('click')">MyButton</button>`
    }
  },
  created() {
    //Speed up mousemove minus delta after 5s
    setTimeout(() => {
      this.minusDelta2 = -5;
    }, 5000);
    this.$eventToObservable("customEvent").subscribe(event =>
      console.log(event.name, event.msg)
    );
  },
  // declare dom stream Subjects
  domStreams: ["plus$", "minus$"],
  subscriptions() {
    return {
      count: merge(
        this.plus$.pipe(map(() => 1)),
        this.minus$.pipe(pluck("data"))
      ).pipe(
        startWith(0),
        scan((total, change) => total + change)
      )
    };
  }
};
</script>

<style scoped></style>
