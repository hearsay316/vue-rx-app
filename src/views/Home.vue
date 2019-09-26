<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button v-stream:click="load$">这个是按钮</button>
  </div>
</template>

<script>
// @ is an alias to /src
import { switchMap, map } from "rxjs/operators";
import { ajax } from "rxjs/ajax";

export default {
  name: "home",
  domStreams: ["load$"],
  subscriptions() {
    const data = this.load$.pipe(
      switchMap(() =>
        ajax("https://api.github.com/users?per_page=5").pipe(
          map(userResponse => userResponse)
        )
      )
    );
    return { data };
  }
};
</script>
