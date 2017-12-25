// pages/house/house.js
var common = require("../../utils/util.js");
var app = getApp();
const imgurl = app.globalData.imgUrl;

Page({

    /**
     * 页面的初始数据
     */
	data: {
		imgurl: imgurl,
		winWidth: '',
		currentTab: 0,
		yanfangHistory: [], //验房列表
		baoming: null, //我的验房报名
		yanfangNow: null, //正在的验房
		rowAttend:null, //我的报名
	},

    /**
     * 生命周期函数--监听页面加载
     */
	onLoad: function () {
		var that = this;
		wx.getSystemInfo({
			success: function (res) {
				that.setData({
					winHeight: res.windowHeight
				});
			},
		})
		//取验房列表
		this.getYanfangList()
		//取现在验房
		this.getYanfangNow()
	},
		//取现在验房
	getYanfangNow:function(){
		var that = this
		common.httpG('activity/activity_yanfang', {
		}, function (data) {
			if (data.code == 0) {
				that.setData({
					yanfangNow: data.data
				})
				that.getAttend();
			}
		})
	},
	//取我验房报名
	getAttend: function () {
		var username = common.getUserName();
		var that = this;
		common.httpG('activity/read_attend', {
			username: username,
			activity_id: that.data.yanfangNow.id
		}, function (data) {
			if (data.code == 0) {
				that.setData({
					rowAttend: data.data
				})
			}
		})
	},
	//添加/修改在线报名
	attendAdd: function (e) {
		var that = this
		var data_post = e.detail.value
		var username = common.getUserName()
		data_post.activity_id = this.data.yanfangNow.id;
		data_post.username = username;
		common.httpP('activity/save', data_post, function (data) {
			if (data.code == 0 && that.data.rowAttend == null) {
				wx.showModal({
					title: '验房报名成功',
					content: '验房报名成功，前去我的报名查看',
					success: function () {
						wx.navigateTo({
							url: '/pages/register/register',
						})
					}
				})
			
			}
			if (data.code == 0 && that.data.rowAttend ){
				wx.showToast({
					title: '修改成功',
				})
			}
		})
	},
	//取验房列表
	getYanfangList: function () {
		var that = this
		common.httpG('activity/activity_yanfang_lishi', {}, function (data) {
			if (data.code == 0) {
				that.setData({
					yanfangHistory: data.data,
					// last_page:data.last_page
				})
			}
		})
	},
	
	houseChange(e) {
		var that = this;
		that.setData({
			currentTab: e.detail.current
		})
	},

	switchNav(e) {
		var that = this;
		if (that.data.currentTab === e.target.dataset.current) {
			return false
		} else {
			that.setData({
				currentTab: e.target.dataset.current
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
		//取我的验房报名
	//	this.getAttend()
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