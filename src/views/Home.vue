<template>
  <div class="home">
    <button v-stream:click="load$">这个是按钮</button>
    <div>{{ name$ }}</div>
    <img :src="image$" alt="" />
    <ul>
      <li v-for="(value, key, index) in data" :key="index.id">
        {{ key }}=={{ value }}-{{ index }}
      </li>
    </ul>
  </div>
</template>
<script>
// @ is an alias to /src
import { of } from "rxjs";
import { switchMap, map, catchError, pluck } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

export default {
  name: "home",
  domStreams: ["load$"],
  subscriptions() {
    const data = this.load$.pipe(
      switchMap(() =>
        //http://localhost:3000/people/0
        ajax("http://localhost:3000/people/0").pipe(
          map(userResponse => {
            console.log(userResponse);
            return userResponse;
          }),
          catchError(err => {
            console.log(err);
            return of(err);
          }),
          pluck("response")
        )
      )
    );
    const name$ = data.pipe(pluck("name"));
    const image$ = data.pipe(
      pluck("image"),
      map(image => `http://localhost:3000/${image}`)
    );
    return { data, image$, name$ };
  }
};
</script>
