// pages/groupList/groupList.js

var common = require("../../utils/util.js");
var app = getApp();

const imgurl = app.globalData.imgUrl;

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		imgurl: imgurl,
		activityNow: [],
		activityHistory: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		this.getActivityNow();
		this.getActivityHistory()
	},
	//取活动正在进行
	getActivityNow: function () {
		var that = this
		common.httpG('activity/index', {}, function (data) {
			if (data.code == 0) {
				that.setData({
					activityNow: data.data
				})
			}
		})
	},
	//取活动历史
	getActivityHistory: function () {
		var that = this
		common.httpG('activity/history_activity', {}, function (data) {
			if (data.code == 0) {
				that.setData({
					activityHistory: data.data
				})
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