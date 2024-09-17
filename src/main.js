// =========================================================
// * Vue Material Dashboard - v1.5.2
// =========================================================
//
// * Product Page: https://www.creative-tim.com/product/vue-material-dashboard
// * Copyright 2024 Creative Tim (https://www.creative-tim.com)
// * Licensed under MIT (https://github.com/creativetimofficial/vue-material-dashboard/blob/master/LICENSE.md)
//
// * Coded by Creative Tim
//
// =========================================================
//
// * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App";

// router setup
import routes from "./routes/routes";
import vClickOutside from 'v-click-outside';

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import Notifications from "./components/NotificationPlugin";

// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";

import Chartist from "chartist";

import Components from 'unplugin-vue-components/vite'
// import RadixVueResolver from 'radix-vue/resolver'
// import { Dialog, DialogOverlay, DialogContent, DialogClose } from '@radix-ui/vue-dialog'
import PrimeVue from 'primevue/config';
// import Aura from '@primevue/themes/aura';
import 'primevue/resources/themes/saga-blue/theme.css'; // Choose a PrimeVue theme
import 'primevue/resources/primevue.min.css'; // PrimeVue core CSS
import 'primeicons/primeicons.css'; // PrimeIcons for icons


// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active",
});

Vue.prototype.$Chartist = Chartist;

Vue.use(VueRouter);
Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);
Vue.use(Notifications);
app.use(vClickOutside);

Vue.component('RadixDialog', Dialog);
Vue.component('RadixDialogOverlay', DialogOverlay);
Vue.component('RadixDialogContent', DialogContent);
Vue.component('RadixDialogClose', DialogClose);

Vue.use(PrimeVue, {
  theme: 'aura'
});

Vue.use(Components, {
  resolvers: [
    RadixVueResolver({
      Dialog,
      DialogOverlay,
      DialogContent,
      DialogClose
    })
  ]
})



/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: (h) => h(App),
  router,
  data: {
    Chartist: Chartist,
  },
});
