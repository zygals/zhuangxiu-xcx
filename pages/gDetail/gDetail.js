// pages/gDetail/gDetail.js

var common = require("../../utils/util.js");
var app = getApp();

const imgurl = app.globalData.imgUrl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    imgurl: imgurl,
    endTime: '',
    clock : '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var t_id = options.t_id
    that.list(t_id);
  },
  //查看限量团购商品详情页 
  list(t_id) {
    var that = this;
    common.httpG('group/skim', { t_id: t_id }, function (res) {
      that.setData({
        list: res.data,
        endTime: res.data.end_time
      })
      that.countDown();
    })
  },
  countDown() {
    var that = this;
    var timer =null;
    let now_time = Math.floor(new Date().getTime()/1000);
    let total_micro_time = that.data.endTime - now_time;
    let dateClock = that.dateFormate(total_micro_time)
    if (total_micro_time <= 0) {
      clearTimeout(timer);
      that.setData({
        clock: dateClock
      })
      return
    };
   timer = setTimeout(()=> {
      that.setData({
        clock: dateClock
      })
      that.countDown();
    },1000)

  },
  
  dateFormate(opt) {
    let day = Math.floor(opt / 3600 / 24);
    let hr = Math.floor(opt / 3600 % 24);
    let min = Math.floor(opt / 60 % 60);
    let sec = Math.floor(opt % 60);
    return common.formatNumber(day) + '天' + ':' + common.formatNumber(hr) + '小时' + ':' + common.formatNumber(min) + '分' + ':' + common.formatNumber(sec) + '秒';
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