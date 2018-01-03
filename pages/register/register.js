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
		var that = this;
		var id = e.currentTarget.dataset.id;
		
		wx.showModal({
			title: '删除报名',
			content: '确定删活动报名吗？',
			success: function (res) {
				if (res.confirm) {
					//表示确定删除：
					common.httpP('activity/del_attend', {
						'id': id,
					}, function (data) {
						if (data.code == 0) {
							that.getAttendList();
						}
					})
				}
			}
		})
	},
	//活动详情
	lookDetail: function (e) {
		var that = this;
		var id = e.currentTarget.dataset.id;
		var obj = {};
		var list = this.data.attendList;
		for (var i = 0; list.length; i++) {
			if (list[i].id == id) {
				obj = list[i];
				break;
			}
		}
		if (obj.type == 1) {
			console.log(1);
			wx.navigateTo({
				url: '/pages/groupPurchase/groupPurchase?activity_id=' + obj.activity_id,
			})
		} else {
			wx.navigateTo({
				url: '/pages/house/house',
			})
		}


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