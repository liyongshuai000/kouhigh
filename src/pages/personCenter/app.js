import Vue from 'vue'
import App from './App.vue'
import "babel-polyfill";
import {Form,FormItem,Input,Button,Row,Col,Pagination,Dialog,Select,Option} from 'element-ui'
Vue.use(Button)
Vue.use(Pagination)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input);
Vue.use(Dialog);
Vue.use(Select);
Vue.use(Option);
Vue.use(Row)
Vue.use(Col)
import router from '../../assets/js/perosonCenterRouter';

new Vue({
  el:'#app',
  router,
  template:'<App/>',
  components:{
    App
  }
})
