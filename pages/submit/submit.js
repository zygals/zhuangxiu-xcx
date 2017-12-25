// pages/submit/submit.js  由购物车来

var common = require("../../utils/util.js");
var app = getApp();
const imgurl = app.globalData.imgUrl;
const wxurl = app.globalData.wxUrl;
const CART_GOOD = app.globalData.cart_good
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		imgurl: imgurl,
		address: null,     //收货地址
		shopGoodList: [],  //店铺 + 商品数据
		sum_price_all: 0,
		sumitOrderSt: false, //默认没有提交，提交后变为true
		deposit: null, //支付过的订金订单
		is_deposit_check: false,
		deposit_yuanlai: 0, //可用订金
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {

		var shopGoodList = wx.getStorageSync(CART_GOOD)
		var sum_price_all = wx.getStorageSync('sum_price_all')
		if (!shopGoodList) {
			wx.navigateBack({})
		}
		this.setData({ shopGoodList: shopGoodList, sum_price_all: sum_price_all })
		if (shopGoodList.length == 1) {//如果是单商家
			//取用户支付过的订金
			this.getOrderDeposit(shopGoodList[0].shop_id);
		}


		//取用户支付过的全款
		//this.getOrderMoneyAll();

	},
	//取用户支付过的订金
	getOrderDeposit: function (shop_id) {
		var that = this;
		var username = common.getUserName()
		common.httpG('dingdan/my_shop_deposit', {
			username: username,
			shop_id: shop_id,
		}, function (data) {
			if (data.code == 0) {
				that.setData({
					deposit: data.data,
					deposit_yuanlai: Number(data.data.sum_price) + Number(data.data.sum_price_youhui)
				})
			}
		})
	},
	//选或不选订金
	checkboxChange: function (e) {
		var deposit_check = e.detail.value//数组
		var sum_price_all = this.data.sum_price_all
		var deposit_price = this.data.deposit_yuanlai //实际可用订金

		if (deposit_check[0] > 0) {//选择中
			this.setData({
				sum_price_all: common.numSub(sum_price_all, deposit_price),
				is_deposit_check: true,
			})
		} else {
			this.setData({
				sum_price_all: Number(sum_price_all) + Number(deposit_price),
				is_deposit_check: false,
			})
		}
	},

	//取默认地址
	getAddress: function () {
		var that = this;
		var username = common.getUserName()
		common.httpG('address/default_address', {
			username: username
		}, function (data) {
			if (data.code == 0) {
				that.setData({
					address: data.data,
				})
			}
		})
	},
	//改地址
	tapAddress: function (e) {
		wx.navigateTo({
			url: '/pages/address/address?from_=orderConfirm',
		})
	},
	//提交订单:添加成功后则发起支付
	tapAddOrder: function () {
		if (this.data.address == null) {
			wx.showToast({
				title: '请添加地址',
			})
			return;
		}
		this.setData({
			sumitOrderSt: true,
		})
		var that = this
		var username = common.getUserName()
		var shop_good_list = wx.getStorageSync(CART_GOOD)
		var sum_price_all = wx.getStorageSync('sum_price_all')
		var order_id_deposit = 0
		if (this.data.is_deposit_check && this.data.deposit.id) {
			order_id_deposit = this.data.deposit.id
			sum_price_all = common.numSub(sum_price_all, this.data.deposit_yuanlai)//实际可用订金
		}
		common.httpG('dingdan/save_all', {
			username: username,
			shop_good_list: shop_good_list,
			sum_price_all: sum_price_all,
			address_id: that.data.address.id,
			order_id_deposit: order_id_deposit,
		}, function (data) {
			if (data.code == 0) {
				//发起支付
				that.payNow(data.type, data.data, username)
			} else {
				that.setData({
					sumitOrderSt: false,
				})
			}

		})
	},

	//立即支付,多商家:可能一次支付多个订单
	payNow: function (type_, order_id, username) {
		wx.showLoading({
			title: '请求支付中...',
		})
		wx.request({
			url: wxurl + 'pay/pay_now',
			data: {
				order_id: order_id,
				username: username,
				type_: type_, //  类型：shop_order 或是 contact_order 

			},
			success: function (res) {
				var data = res.data;
				if (data.code == 0) {
					wx.hideLoading();
					wx.requestPayment({
						'timeStamp': data.timeStamp,
						'nonceStr': data.nonceStr,
						'package': data.package,
						'signType': 'MD5',
						'paySign': data.paySign,//签名,
						'success': function (res) {
							//更改订单状态为已支付
							wx.request({
								url: wxurl + 'dingdan/update_pay_st',
								data: {
									order_id: order_id,
									st: 'paid',
									type_: type_,
									prepay_id:data.prepay_id
								},
								success: function (res) {
									wx.showModal({
										title: '支付成功',
										content: '订单支付成功,前去我的订单列表查看',
										success:function(res){
											if(res.confirm){
												wx.redirectTo({
													url: '/pages/orders/orders',
												})
											}
											
										}
									})
							
								}
							})
						},
						'fail': function (res) {
							console.log(res)
						}
					})
				} else {
					wx.hideLoading();
					wx.showToast({
						title: res.data.msg,
					})
				}

			}
		})
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {

	},
	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {
		this.getAddress()
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})