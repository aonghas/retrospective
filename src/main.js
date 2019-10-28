import Vue from "vue";
import Vue2Filters from "vue2-filters";
import App from "./App.vue";
import router from "./router";

import { library } from "@fortawesome/fontawesome-svg-core";

import {
  faTrash,
  faLink,
  faListUl,
  faRandom,
  faUndo,
  faStar,
  faEnvelope,
  faArrowLeft
} from "@fortawesome/free-solid-svg-icons";

import vuetify from "./plugins/vuetify";
library.add(
  faTrash,
  faLink,
  faListUl,
  faRandom,
  faUndo,
  faStar,
  faEnvelope,
  faArrowLeft
);

Vue.config.productionTip = false;

// Vue.filter("currency", value => {
//   return "$" + parseFloat(value).toFixed(2);
// });

Vue.use(Vue2Filters);

Vue.mixin({
  methods: {
    generateID: len =>
      Math.random()
        .toString(36)
        .replace(/([^a-z0-9]+)/g, "")
        .substr(0, len)
  }
});

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
