<template>
  <div id="app">
    <div id="nav">
      <template v-for="(routr, index) of routes.list">
        <router-link :to="routr.path" :key="index">
          {{ routr.name }}
        </router-link>
        <template v-if="index < routes.num">
          |
        </template>
      </template>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "app",
  computed: {
    routes() {
      return {
        list: this.$router.options.routes,
        num: this.$router.options.routes.length - 1
      };
    }
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
