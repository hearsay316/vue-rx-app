<template>
  <div class="about">
    <section class="section">
      <b-tabs v-model="activeTab">
        <b-tab-item
          :label="person.name"
          v-for="person of people$"
          :key="person.id"
        >
        </b-tab-item>
      </b-tabs>
      <h1 class="title">{{ name$ }}</h1>
      <img src="" alt="" />
    </section>
  </div>
</template>
<script>
import { of } from "rxjs";
import { switchMap, map, catchError, pluck, share } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
export default {
  name: "about",
  data() {
    return {
      activeTab: 0
    };
  },
  domstrrams: [],
  subscriptions() {
    const people$ = ajax("http://localhost:3000/people").pipe(
      map(res => res),
      catchError(() => of("error")),
      pluck("response")
    );
    const activeTab$ = this.$watchAsObservable("activeTab", {
      immediate: true
    }).pipe(pluck("newValue"));
    const person$ = activeTab$.pipe(
      switchMap(id =>
        ajax(`http://localhost:3000/people/${id}`).pipe(
          pluck("response"),
          share()
        )
      )
    );
    const name$ = person$.pipe(pluck("name"));
    return { people$, person$, name$ };
  }
};
</script>
