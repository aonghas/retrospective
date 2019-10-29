import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import Login from "./views/Login.vue";
import NewBoard from "./views/NewBoard.vue";
import Boards from "./views/Boards.vue";
import Board from "./views/Board.vue";
import Register from "./views/Register.vue";

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
      path: "/boards/new",
      name: "new-board",
      component: NewBoard
    },
    {
      path: "/boards/:aliasID",
      name: "board",
      component: Board
    },
    {
      path: "/boards",
      name: "boards",
      component: Boards
    },
    {
      path: "/register",
      name: "register",
      component: Register
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});
