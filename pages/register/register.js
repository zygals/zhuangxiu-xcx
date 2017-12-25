// pages/register/register.js
var common = require("../../utils/util.js");
var app = getApp();
const imgurl = app.globalData.imgUrl;
Page({

    /**
     * 页面的初始数据
     */
	data: {
		imgurl: imgurl,
		baoming: [],  //难房报名，只有一个
		attendList: [], //在线报名列表
		setting: null,
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function (options) {
		this.getAttendList()

	},
	//取我的在线报名
	getAttendList: function () {
		var that = this;
		var username = common.getUserName()
		common.httpG('activity/my_attend', {
			username: username,
		}, function (data) {
			if (data.code == 0) {
				that.setData({
					attendList: data.data,
				})
			}
		})
	},
	//删除报名
	tapDel: function (e) {
		wx.showModal({
			title: '删除报名',
			content: '确定删活动报名吗？',
			success: function (res) {
				if (res.cancel) {
					return false;
				}
			}
		})
		var that = this;
		var id = e.currentTarget.dataset.id;
		common.httpP('activity/del_attend', {
			'id': id,
		}, function (data) {
			if (data.code == 0) {
				that.getAttendList();
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
		wx.stopPullDownRefresh()
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