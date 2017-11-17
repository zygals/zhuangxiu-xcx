//app.js

App({
	// 初次加载会执行，再次进入不一定会执行
  onLaunch: function () {
	  this.register()
  },
  	// 第次进入都会执行
  onShow:function(){
	  //设置用户名及系统设置缓存
	  this.getAbout();
  },
  //注册
  register: function () {
    var that = this;
    // Do something initial when launch.
    //当程序开启时，自动完成注册功能 
    wx.login({
      success: function (res) {
        if (res.code) {

          //发起网络请求,注册用户
          wx.request({
            url: that.globalData.wxUrl + 'user',
            data: {
              code: res.code
            },
            success: function (res) {
              try {
                wx.setStorageSync('username', res.data.data)
              } catch (e) {
                wx.showToast({
                  title: 'setStorageSync fail',
                  duration: 10000
                })
              }
            }, fail: function () {
              console.log('login-errro');
            }
          })
        } else {
          wx.showToast({
            title: '获取用户登录态失败！',
            duration: 10000
          })
        }
      }
    });
  },
  //取设置
  getAbout: function () {
    var that = this
    wx.request({
      url: that.globalData.wxUrl + 'setting/get_set',
      data: {

      },
      success: function (res) {
        wx.setStorage({
          key: 'setting',
          data: res.data.data,
        })
      }
    })

  },
  //隐藏时清除缓存数据,用户名不清
  onHide: function () {
    wx.removeStorage({
		key: 'cartShopGoodList',
		success: function(res) {},
	})
	wx.removeStorage({
		key: 'orders_all',
		success: function (res) { },
	})
	wx.removeStorage({
		key: 'shopInfo',
		success: function (res) { },
	})
	wx.removeStorage({
		key: 'sum_price_all',
		success: function (res) { },
	})
	  wx.removeStorage({
		  key: 'setting',
		  success: function (res) { },
	  })
  },
  globalData: {
    wxUrl: 'https://huahui.qingyy.net/zhuangxiutp/public/api/',
    imgUrl: 'https://huahui.qingyy.net/zhuangxiutp/public',
    cart_good: 'cartShopGoodList', //缓存购物车数据的key
    orders_all: 'orders_all', //缓存所有订单的key
    group_limit_store: 'groupLimitStore', //缓存团购-限量详情key
  }
})