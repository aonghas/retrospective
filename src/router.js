import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import NewBill from "./views/NewBill.vue";
import Bills from "./views/Bills.vue";
import Bill from "./views/Bill.vue";
import Register from "./views/Register.vue";
import CheckIn from "./views/CheckIn.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/bills/new",
      name: "new-bill",
      component: NewBill
    },
    {
      path: "/bills/:aliasID",
      name: "bill",
      component: Bill
    },
    {
      path: "/bills",
      name: "bills",
      component: Bills
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "/checkin/:userID/:meetingID",
      name: "CheckIn",
      component: CheckIn
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
