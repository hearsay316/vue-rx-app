<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <div>{{takeFourNumbers}}</div>
    <router-view />
  </div>
</template>
<script>
  import {interval} from 'rxjs';
  import {  scan ,startWith ,takeWhile} from 'rxjs/operators'
  export default{
    name:"app",
    subscriptions(){
      const contdown$ = interval(1000);
      const takeFourNumbers = contdown$.pipe(startWith(5),scan(time=>time-1),takeWhile(time=>time>0));
      return{
        takeFourNumbers
      }
    }
  }
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
