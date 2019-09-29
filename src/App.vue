<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/slide">slide</router-link>
    </div>
    <div>{{ desc }}</div>
    <button :disabled="disAble" v-stream:click="snooze$">按钮</button>
    <button :disabled="disAble" v-stream:click="dismiss$">停止</button>
    <router-view />
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
  name: "app",
  domStreams: ["snooze$", "dismiss$"],
  subscriptions() {
    const countdown$ = interval(1000);
    const takeFourNumbers = countdown$.pipe(
      startWith(5),
      scan(time => time - 1),
      takeWhile(time => time > 0)
    );
    let meg = concat(takeFourNumbers, of("时间到了"));
    meg = meg.pipe(share());
    const user = meg.pipe(
      repeatWhen(() => this.snooze$),
      takeUntil(this.dismiss$)
    );
    let desc = concat(user, of("这个是ok"));
    desc = desc.pipe(shareReplay());
    let disAble = desc.pipe(map(value => value !== "时间到了"));
    return {
      desc,
      disAble
    };
  }
};
</script>
<style lang="stylus">
#app
    font-family 'Avenir', Helvetica, Arial, sans-serif
    -webkit-font-smoothing antialiased
    -moz-osx-font-smoothing grayscale
    text-align center
    color #2c3e50

#nav
    padding 30px

    a
        font-weight bold
        color #2c3e50

        &.router-link-exact-active
            color #42b983
</style>
