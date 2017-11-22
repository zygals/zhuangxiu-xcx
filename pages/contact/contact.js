// pages/contact/contact.js
var common = require("../../utils/util.js");
const app = getApp();
const IMGURL = app.globalData.imgUrl;
const WXURL = app.globalData.wxUrl;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		shop_id: 0, //商家编号
		msg: '',  //用户写的
		msgs: [],//所有对话

		woshuo: '', //输入框内容
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var username = common.getUserName()
		this.setData({
			username: username
		})
		var shop = wx.getStorageSync('shopInfo');
		this.setData({
			shop_id: shop.shop_id
		})

		this.getMessages()

	},
	//取对话消息
	getMessages: function () {
		var that = this;
		common.httpG('message/index', {
			username: that.data.username,
			shop_id: that.data.shop_id,
		}, function (data) {
			if (data.code == 0) {
				that.setData({
					msgs: data.data,

				})
			}
		})
	},
	//将用户发的文字添加数据库
	submitSendMsg: function (e) {
		var that = this;
		var msg = e.detail.value.msg;
		this.setData({
			woshuo: '',

		})

		common.httpP('message/save', {
			username: that.data.username,
			shop_id: that.data.shop_id,
			message: msg,
		}, function (data) {
			if (data.code == 0) {
				wx.showToast({
					title: '发送成功！',
				})
				that.getMessages();
			}

		})
	},
	//删除一条
	ltapDelMsg: function (e) {
		var msg_id = e.target.dataset.msg_id
		var that = this
		wx.showModal({
			title: '删除',
			content: '确定删除消息么？',
			success: function (res) {
				if (res.confirm) {
					common.httpP('message/del_by_user', {
						msg_id: msg_id,
					}, function (data) {
						if (data.code == 0) {
							wx.showToast({
								title: '删除成功',
							})
							that.getMessages();
						}
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