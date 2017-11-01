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
        baomingNum: 0, //报名人数
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
        //取报名人数
        this.getBaomingNum()
    },
    //添加报名 
    addBaoming: function (event) {
        var data_baoming = event.detail.value;
        console.log(data_baoming)
        var username = common.getUserName();
        var truename = data_baoming.truename, mobile = data_baoming.mobile, time_to = data_baoming.time_to, address = data_baoming.address;
        common.httpP('baoming/save', {
            truename: truename,
            mobile: mobile,
            time_to: time_to,
            address: address,
            username: username,
        }, function (data) {
            if (data.code == 0) {
                wx.showToast({
                    title: data.msg,
                })
            }
        })
    },
    //取报名人数
    getBaomingNum: function () {
        var that = this
        var username = common.getUserName();
        common.httpG('baoming/getnum', {
            'username': username,
        }, function (data) {
            if (data.code == 0) {
                that.setData({
                    baomingNum: data.data,
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