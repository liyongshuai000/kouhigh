<template>
	<div class="wrap">
		<div class="border-c bg-f5 shop-info-head">
			<el-row>
				<el-col :span='9'>商品信息</el-col>
				<el-col :span='2'>单价</el-col>
				<el-col :span='2'>数量</el-col>
				<el-col :span='2'>售后</el-col>
				<el-col :span='3'>付款信息</el-col>
				<el-col :span='3'>交易状态</el-col>
				<el-col :span='3'>交易操作</el-col>
			</el-row>
		</div>
		<div class="border-c shop-info-list" v-for='(shopItem,shopIndex) in order' :key='shopIndex' v-if='order.length'>
			<div class="f5-bg title">
				<el-row>
					<el-col :span='9'>
						<em style='margin-left:24px;font-weight: 600;'>{{shopItem.date_add*1000|dateymd}}</em>
						<span style='margin-left:26px'>订单号：{{shopItem.order_sn}}</span>
					</el-col>
					<el-col :span='10'>
						<span v-text='shopItem.shop_name'></span>
					</el-col>
				</el-row>
			</div>
			<div>
				<div class='list-con'>
				 	<div class="goods-list-box">
				 		<div v-for='(item,index) in shopItem.goods' :key='item.goods_id' class="goods-list">
					 		<dl class="goods-msg">
								<dt>
									<a :href="`goodDetail.html?goods_id=${item.goods_id}`">
										<img :src="item.cover">
									</a>
								</dt>
								<dd>
									<div class="goods-name" v-text='item.name'></div>
									<div class="color-6">
										<span style='margin-right:10px;'>规格:{{item.option_name}}</span>
									</div>
								</dd>
							</dl>
							<div class='goods-price'>
								<div>${{item.price}}</div>
							</div>
							<div class="goods-price" v-text='item.quantity'></div>
							<div class="goods-price" style='cursor:pointer;' @click='applyRefund(shopItem.order_sn,item.goods_id,item.option_id)' v-show='shopItem.order_state!=="1"&&shopItem.order_state!=="6"'>
								申请售后
							</div>
						</div>
				 	</div>
					<div class="goods-info" :style="{height:130*shopItem.goods.length+'px'}" :class='{"multiple":shopItem.goods.length>1}'>
						<el-row>
							<el-col :span='8'>
								<div style="line-height:26px;font-size:14px;font-weight:600;">${{shopItem.order_amount}}</div>
								<div class='color-6' style="line-height:20px;">含运费:${{shopItem.express_amount}}</div>
								<div class='color-6' style='line-height:20px;'>增值税:${{shopItem.coupon_amount}}</div>
								<div class='color-6' style='line-height:20px;'>积分抵:${{shopItem.coupon_amount}}</div>
							</el-col>
							<el-col :span='8' style='line-height:20px;padding-top: 4px;'>
								<!-- 待付款 待发货 待评价 -->
								<ul style='margin-top:10px;' v-if='shopItem.order_state!=="3"'>
									<li v-text='shopItem.state'></li>
									<li @click='checkOrder(shopItem.order_sn)' class="opera">订单详情</li>
								</ul>
								<!-- 待收货 -->
								<ul v-else>
									<li v-text='shopItem.state'></li>
									<li @click='checkOrder(shopItem.order_sn)' class="opera">订单详情</li>
									<li @click='checkOrder(shopItem.order_sn)' class="opera" v-show='shopItem.order_state==="3"'>查看物流</li>
								</ul>
							</el-col>
							<el-col :span='8'>
								<!-- 待付款 -->
								<ul v-show='shopItem.order_state==="1"'   style='margin-top:10px;'>
									<li>
										<el-button size='small' type='text' @click='payFor(shopItem.order_sn)'>立即付款</el-button>
									</li>
									<li>
										<span @click='cancel(shopItem.order_sn)'>取消订单</span>
									</li>
								</ul>
								<!-- 待发货 -->
								<div v-show='shopItem.order_state==="2"' style='padding-top: 16px;'>
									<span @click='remind(shopItem.order_sn)'>提醒发货</span>
								</div>
								<!-- 待收货 -->
								<div v-show='shopItem.order_state==="3"' style='padding-top: 16px;'>
									<el-button size='small' type='text' @click='confirmGet(shopItem.order_sn)'>确认收货</el-button>
								</div>
								<!-- 待评价 -->
								<div v-show='shopItem.order_state==="4"' style='padding-top: 16px;'>
									<el-button size='small' type='text' @click='toEval(shopItem.order_sn)'>评价</el-button>
								</div>
								<!-- 追加评价 -->
								<div v-show='shopItem.order_state==="5"' style='padding-top: 16px;'>
									<span>追加评价</span>
								</div>
								<!-- 再次购买 -->
								<div v-show='shopItem.order_state==="6"' style='padding-top: 8px;'>
									<ul>
										<li><span @click='buyAgain(shopItem.goods[0].goods_id)'>再次购买</span></li>
										<li><span @click='del(shopItem.order_sn)'>删除订单</span></li>
									</ul>
								</div>
								<div v-show='shopItem.order_state==="7"' style='padding-top: 16px;'>
									<span @click='del(shopItem.order_sn)'>删除订单</span>
								</div>
							</el-col>
						</el-row>
					</div>
				</div>
			</div>
		</div>
		<v-pagination :total-page='totalPage-0' @changePage='changePage' ref='pagination'></v-pagination>
	</div>
</template>
<script>
import vPagination from '../../common/Pagination';
import {dateymd} from '../../assets/js/filter'
import {MessageBox} from  'element-ui';
import {postReq} from '../../assets/js/api';
import {errorInfo} from '../../assets/js/check';
	export default {
		data(){
			return {
				order: [],
				page: 1,
				totalPage: 1,
				state: "0" 
			}
		},
		filters: {
			dateymd
		},
		components:{
			vPagination
		},
		watch: {
		  	'$route' (to, from) {
		   		this.init()
		  	}	
		},
	    methods: {
	    	init(){
	    		let path = this.$router.history.current.name;
	    		path = path.substr(0,path.length-1);
				switch (path){
					case 'allOrder':
						this.state = 0;
					break;
					case 'waitPayFor':
						this.state = 1;
					break;
					case 'waitSend':
						this.state = 2;
					break;
					case 'waitGet':
						this.state = 3;
					break;
					case 'waitComment':
						this.state = 4;
					break;
				}
				this.getOrderList();
	    	},	
	        handleSelect(key, keyPath) {
	            console.log(key, keyPath);
	        },
	        getOrderList(state,page){
	        	let params = {
		    		token: getCookie('token'),
		    		order_state: this.state,
		    		page: this.page
		    	};
		    	postReq('/order/getOrders',params).then(res=>{
		    		let {errcode,message,content} = res ;
					if(errcode == 0){
						this.order = content.order;
					}else {
						errorInfo(errcode,message) ;
					}
		    	})
	   	 	},
	   	 	// 申请售后
	   	 	applyRefund(order_sn,goods_id,option_id){
	   	 		option_id = option_id?option_id:"";
	   	 		window.open(`afterSale.html#applyType?order_sn=${order_sn}&goods_id=${goods_id}&option_id=${option_id}`);
	   	 	},
	   	 	// 查看订单详情  物流信息
	   	 	checkOrder(order_sn){
	   	 		window.open(`orderDetail.html#?order_sn=${order_sn}`);
	   	 	},
	   	 	// 立即付款
	   	 	payFor(order_sn){
	   	 		window.open(`confirmOrder.html#payfor?order_sn=${order_sn}`) ;
	   	 	},
	   	 	// 提醒发货
	   	 	remind(order_sn){
	   	 		let params = {
	   	 			access_token: getCookie('access_token'),
	   	 			order_sn: order_sn
	   	 		}
	   	 		orderRemind(params).then(res=>{
	   	 			let {errcode,message,content} = res ;
						if(errcode!==0) {
							errorInfo(errcode,message) ;
						}else{
							Message.success({
					            message: message,
					            type: 'success'
					        });
						}
	   	 		})
	   	 	},
	   	 	// 取消订单
	   	 	cancel(order_sn){
	   	 		let msg  = '是否取消订单?'
	   	 		this.commonAPI(msg,cancelOrder,order_sn);
	   	 	},
	   	 	// 再次购买
	   	 	buyAgain(id){
	   	 		window.open(`goodDetail.html?goods_id=${id}`);
	   	 	},
	   	 	// 评价
	   	 	toEval(order_sn){
	   	 		window.open(`eval.html?order_sn=${order_sn}`);
	   	 	},
	   	 	// 确认收货
	   	 	confirmGet(order_sn){
	   	 		let msg  = '确定收货之前确定是否已经收货?'
	   	 		this.commonAPI(msg,delivery,order_sn);
	   	 	},
	   	 	// 删除订单
	   	 	del(order_sn){
	   	 		let msg  = '是否确定永久删除订单？'
	   	 		this.commonAPI(msg,delOrder,order_sn);
	   	 	},
	   	 	commonAPI(msg,api,order_sn){
	   	 		MessageBox.confirm(msg, '提示', {
		            confirmButtonText: '确定',
		            cancelButtonText: '取消',
		            type: 'warning'
		        }).then(() => {
		            let params = {
		   	 			access_token: getCookie('access_token'),
		   	 			order_sn: order_sn
		   	 		}
		   	 		api(params).then(res=>{
		   	 			let {errcode,message,content} = res ;
						if(errcode!==0) {
							errorInfo(errcode,message) ;
						}else{
							Message.success({
					            message: message,
					            type: 'success'
					        });
					        this.getOrderList(this.state,'1');
						}
		   	 		})
		        }).catch(() => {
		                   
		        });
	   	 	},
	   	 	// 改变页数
			changePage(page){
				this.getOrderList(this.state,page);
			}
		},
		created(){
			this.$nextTick(()=>{
				this.init();
			})
		}
	}
</script>
<style lang='scss' scoped>
	.shop-info-head{
		line-height: 40px;
		text-align: center;
		margin: 0px 0px 20px;
	}
	.shop-info-list{
		margin-bottom: 10px;
	}
	.title{
		line-height: 40px;
		border-bottom: 1px solid #ccc;
		button{
			border-radius: 16px;
			background-color: #fff;
			img{
				margin-right: 4px;
			}
		}
	}
	.list-con{
		overflow: hidden;
	}
	.goods-list-box{
		width: 674px;
		float: left;
		overflow: hidden;
	}
	.goods-list{
		float: left;
		padding: 20px 0px 20px 20px;
		overflow: hidden;
		border-top: 1px solid #ccc;
		margin-top: -1px;
	}
	.goods-msg{
		float: left;
		width: 384px;
		overflow: hidden;
		dt{
			float: left;
			width: 90px;
			height: 90px;
			img{
				width: 100%;
				height: 100%;
				cursor: pointer;
			}
		}
		dd{
			float: left;
			width: 240px;
			margin-left: 18px;
		}
	}
	.goods-name{
		line-height: 18px;
		margin-bottom: 18px;
	}
	.goods-price{
		float: left;
		width: 90px;
		text-align: center;
		margin-top: 32px;
		line-height: 20px;
	}
	.goods-info{
		float: left;
		width: 404px;
		height: 100%;
		position: relative;
		.el-row{
			width: 100%;
			height: 66px;
			position: absolute;
			right: 0px;
			top: 0px;
			bottom: 0px;
			margin: auto;
			text-align: center;
			.el-button{
				width: 62px;
				padding: 6px;
				color: #000;
				border: 1px solid #ccc;
			}
		}
		.opera{
			cursor: pointer;
		}
		.opera:hover{
			color: #c71724;
		}
		.el-col-8{
			span{
				line-height: 26px;
				cursor: pointer;
			}
			span:hover{
				color: #c71724;
			}
		}
	}
	.multiple{
		border-left: 1px solid #ccc;
	}
</style>