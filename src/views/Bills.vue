<template>
  <div class="container mt-4">
    <div class="row justify-content-center mb-3">
      <div class="col-12 col-md-9 col-lg-7">
        <router-link class="btn btn-outline-primary mr-2" to="/bills/new" v-if="user">Add bill</router-link>
        <button
          class="btn btn-outline-secondary float-right"
          v-text="editText"
          @click="editMode = !editMode"
        ></button>
      </div>
    </div>
    <div class="row justify-content-center">
      <h1 class="ol-12 col-md-9 col-lg-7 font-weight-light">Your bills</h1>

      <div class="col-12 col-md-9 col-lg-7">
        <div class="card">
          <div class="list-group list-group-flush">
            <router-link
              tag="button"
              class="list-group-item list-group-item-action"
              v-for="item in bills"
              :key="item.id"
              title="View bill"
              :to="'/bills/' + item.aliasID"
            >
              <button
                class="btn btn-sm btn-outline-secondary"
                title="Delete Bill"
                @click.prevent="$emit('deleteBill', item.id)"
              >
                <font-awesome-icon icon="trash"></font-awesome-icon>
              </button>
              <span class="ml-2">{{item.name}}</span>
              <div class="float-right text-muted">{{item.items | totalPrice | currency }}</div>
            </router-link>
            <div class="list-group-item d-flex" v-if="!bills.length">You have no bills to split.</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
export default {
  name: "bills",
  data() {
    return {
      editMode: false,
      meetingName: null
    };
  },
  computed: {
    editText() {
      return !this.editMode ? "Edit" : "Done";
    }
  },
  filters: {
    totalPrice(value) {
      const reducer = (accum, current) => parseFloat(current.price) + accum;
      return value.reduce(reducer, 0);
    }
  },
  methods: {},
  props: ["user", "bills"],
  components: {
    FontAwesomeIcon
  }
};
</script>