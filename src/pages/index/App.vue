<template>
    <div id="app">
		<v-head-slider :user-info='userInfo'></v-head-slider>
		<v-search :cart-goods='cartGoods' :cart-total='cartTotal'></v-search>
		<v-navs :navs='navs' :cate-show='true'></v-navs>
		<div class="center-box" style="height: 500px;">
			<!-- 首页轮播 -->
			<dl class="slide-show">
				<dt>
					<el-carousel height="390px">
				      	<el-carousel-item v-for='(item,index) in banner' :key="index">
				        	<img :src="item.image">
				      	</el-carousel-item>
				    </el-carousel>
				</dt>
				<dd>
					<div class="left-btn" @click='sliderIndex=sliderIndex<(5-4)?++sliderIndex:(5-4);'>
						<i class="el-icon-arrow-left"></i>
					</div>   
					<div class="cont" :style='{width:212.5*5+"px",left: -212.5*sliderIndex+"px"}'>
						<img :src="item.image" alt="" v-for='(item,index) in banner' :key='index' >
					</div>
					<div class="right-btn" @click='sliderIndex=sliderIndex>0?--sliderIndex:0;'>
						<i class="el-icon-arrow-right"></i>
					</div>
				</dd>
			</dl>
			<!-- 用户信息 -->
			<v-user-info style='float: right;' :user-info='userInfo' :orderInfo='orderInfo' :ad='ad'></v-user-info>
		</div>
		<div class='center-box ad-box'>
			<img src="">
		</div>
		<!-- 每日上新 -->
		<div class='center-box'>
			<div class="title-slider color-9" style='width:270px;'>{{activity.name}}</div>
			<ul class='border-lt new-goods'>
				<v-good-list v-for='(item,index) in activity.goods.goods' :key='index' :col='6' :good='item' :hover='false'></v-good-list>
			</ul>
		</div>
		<!-- 主体商品 -->
		<div class='center-box'>
			<ul>
				<li v-for='(themeItem,index) in theme' :key='index'>
					<v-time-theme v-if='index==0' :content='themeItem'></v-time-theme>
					<v-base-theme v-else :content='themeItem'></v-base-theme>
				</li>
			</ul>
		</div>
		<v-slider :user-info='userInfo'></v-slider>
		<v-footer></v-footer>
  	</div>
</template>
<script>
	import vHeadSlider from '../../common/HeadSlider';
	import vSearch from '../../common/Search';
	import vNavs from '../../common/Nav';
	import vUserInfo from '../../components/home/UserInfo';
	import vGoodList from '../../common/GoodList';
	import vTimeTheme from '../../components/home/TimeTheme';
	import vBaseTheme from '../../components/home/BaseTheme';
	import vSlider from '../../common/Slider';
	import vFooter from  '../../common/Footer';
	import userMixin from '../../assets/js/userMixin';
	import shopMixin from '../../assets/js/shopMixin';
	import {postReq} from '../../assets/js/api';
    export default {
    	data(){
    		return{
    			navs: [
    				{
    					link: '',
    					name: 'KouHigh国际'
    				},{
    					link: '',
    					name: 'KouHigh直营'
    				}
    			],
    			banner: [],
    			activity: {
    				goods: [],
    				name: ''
    			},
    			theme: [],
    			sliderIndex: 0,
    			ad: []
    		}
    	},
    	components:{
    		vHeadSlider,vSearch,vNavs,vUserInfo,vGoodList,vTimeTheme,vBaseTheme,vSlider,vFooter
    	},
    	mixins: [userMixin,shopMixin],
    	methods:{
    		getHomeData(){
    			postReq('/mall/getHomeData',{}).then(res=>{
    				let {errcode,message,content} = res ;
					if(errcode == 0){
						this.banner = content.banner;
						this.activity = content.activity[0];
						this.theme = content.topic;
						this.ad = content.ad;
					}else {
						errorInfo(errcode,message);
					}
    			})
    		}
    	},
    	created(){
    		this.$nextTick(()=>{
    			this.getHomeData();
    		})
    	}
    }
</script>
<style type="text/css" lang='scss' scoped>
  	.slide-show{
  		float: left;
		width: 850px;
		height: 390px;
		margin-left: 150px;
		dt{
			img{
				width: 100%;
				height: 390px;
			}
		}
		dd{
			width: 100%;
			height: 110px;
			overflow: hidden;
			position: relative;
		}
		.cont{
			position: absolute;
			height: 110px;
			transition: all .5s;
			img{
				width: 212.5px;
				height: 110px;
				float: left;
			}
		}
		.left-btn,.right-btn{
			position: absolute;
			top: 0px;
			bottom: 0px;
			z-index: 10;
			width: 24px;
			height: 60px;
			margin: auto 0px;
			border-radius: 4px;
			background-color: rgba(0,0,0,.3);
			color: #fff;
			cursor: pointer;
			i{
				font-size: 24px;
				line-height: 56px;
			}
		}
		.left-btn{
			left: 4px;
		}
		.right-btn{
			right: 4px;
		}
	}
	.ad-box{
		height: 120px;
	}
	.new-goods{
		overflow: hidden;
		margin-top: 20px;
		li{
			float: left;
		}
	}
</style>
