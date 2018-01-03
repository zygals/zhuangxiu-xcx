// pages/assess/assess.js
var common = require("../../utils/util.js");
var app = getApp();
const imgurl = app.globalData.imgUrl;

const wxurl = app.globalData.wxUrl;
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		imgurl: imgurl,
		List: [],
		username: '',
		current_page: 1,
		last_page: 1,
		active_all:true,
		active_hp: false,
		active_zp: false,
		active_cp: false,
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		var that = this;

		this.getList();
	},


	//获取我的所有评价
	getList: function (star) {
		var that = this;
		var username = common.getUserName();
		if (star == undefined) {
			star = 0;
		}
		common.httpG('fankui/getFankui',
			{ username: username, star: star },
			function (data) {
				if (data.code == 0) {
					that.setData({
						List: data.data.data,
						evalute: data.evalute,
						page: data.data.current_page,
						last_page: data.data.last_page
					});
				}else{
					that.setData({
						List: [],
					})
				}
			})
	},
	getall: function (e) {
		this.getList(0)
		this.setData({
			active_all: true,
			active_hp: false,
			active_zp: false,
			active_cp: false,
		})
	},
	gethp: function (e) {
		this.getList(1)
		this.setData({
			active_all: false,
			active_hp: true,
			active_zp: false,
			active_cp: false,
		})
	},
	getzp: function (e) {
		this.getList(2)
		this.setData({
			active_all: false,
			active_hp: false,
			active_zp: true,
			active_cp: false,
		})
	},
	getcp: function (e) {
		this.getList(3)
		this.setData({
			active_all: false,
			active_hp: false,
			active_zp: false,
			active_cp: true,
		})
	},
	//删除评价
	delEva: function (e) {
		var that = this
		console.log(e)
		var id = e.currentTarget.dataset.id
		wx.showModal({
			title: '提示',
			content: '确定要删除评价吗?',
			success: function (res) {
				if (res.confirm) {
					common.httpG('fankui/delete', { id: id }, function (data) {
						if (data.code == 0) {
							that.getList()
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
		wx.showToast({
			title: '正在加载',
			icon: 'loading',
			duration: 10000
		})
		var that = this;
		var username = common.getUserName()
		wx.request({
			url: wxurl + 'fankui/getFankui',
			data: {
				username: username
			},
			success: (res) => {
				that.setData({
					List: res.data.data.data
				});
			},
			complete: () => {
				//结束下拉刷新
				wx.stopPullDownRefresh();
				setTimeout(() => {
					wx.hideToast();
				}, 600)
			}
		})
	},
	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		var that = this;
		var List = that.data.List;
		var username = common.getUserName()
		var current_page = that.data.current_page;
		var page = current_page + 1;
		if (current_page < that.data.last_page) {
			wx.request({
				url: wxurl + 'fankui/getFankui',
				data: {
					username: username,
					page: page,
				},
				success: (res) => {
					that.setData({
						current_page: res.data.current_page,
						List: that.data.List.concat(res.data.data.data),
					})
				},
				complete: () => {
					setTimeout(() => {
						wx.hideToast();
					}, 600)
				},
			});
		} else {
			wx.showToast({
				title: '没有更多啦',
			})
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})