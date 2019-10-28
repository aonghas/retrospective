<template>
  <div>
    <h3>Participants</h3>
    <div
      v-for="member in orderBy(currentBill.participants, 'name')"
      v-bind:key="member.id"
    >{{member.name}}</div>
  </div>
</template>

<script>
import Vue2Filters from "vue2-filters";

export default {
  props: ["currentBill"],
  mixins: [Vue2Filters.mixin],
  components: {}
};
</script>

<style scoped lang="scss">
</style>