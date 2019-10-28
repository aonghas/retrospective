<template>
  <div class="wrapper">
    <!-- Sidebar -->
    <nav id="sidebar" v-if="showBar">
      <div id="dismiss" @click="$emit('dismiss')">
        <font-awesome-icon icon="arrow-left"></font-awesome-icon>
      </div>
      <div v-for="member in currentBill.participants" v-bind:key="member.id">{{member.name}}</div>
    </nav>
    <!-- Dark Overlay element -->
    <div class="overlay"></div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  props: ["showBar", "currentBill"],
  components: {
    FontAwesomeIcon
  }
};
</script>

<style scoped lang="scss">
@import "node_modules/bootstrap/scss/_functions";
@import "node_modules/bootstrap/scss/_variables";

.wrapper {
  display: block;
}

#sidebar {
  min-width: 280px;
  max-width: 280px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  /* top layer */
  z-index: 9999;
  box-shadow: 1px 0px 5px rgba(0, 0, 0, 0.7);
  background: $secondary;
  color: #fff;
  transition: all 0.3s;
}

.overlay {
  display: none;
  position: fixed;
  /* full screen */
  width: 100vw;
  height: 100vh;
  /* transparent black */
  background: rgba(0, 0, 0, 0.7);
  /* middle layer, i.e. appears below the sidebar */
  z-index: 998;
  opacity: 0;
  /* animate the transition */
  transition: all 0.5s ease-in-out;
}
/* display .overlay when it has the .active class */
.overlay.active {
  display: block;
  opacity: 1;
}

#dismiss {
  width: 35px;
  height: 35px;
  position: absolute;
  /* top right corner of the sidebar */
  top: 10px;
  right: 10px;
}

.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}

#sidebar.active {
  margin-left: -250px;
}
</style>