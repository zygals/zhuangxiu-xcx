var app = getApp();
const wxurl = app.globalData.wxUrl;


  const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

//取用户名
function getUserName(){
	var username = wx.getStorageSync('username');
	if (!username) {
		app.register();
		username = wx.getStorageSync('username')
	}
	return username;
}
//缓存设置
// function getSetting() {
// 	var setting = wx.getStorageSync('setting');
// 	if (!setting) {
// 		app.getAbout();
// 		setting = wx.getStorageSync('setting')
// 	}
// 	return setting;
// }
function httpG(url, data, callback) {
	wx.showLoading({
		title: '努力加载中^^...',
	})
	wx.request({
		url: wxurl+url,
		data: data,
		success: function (res) {
			callback(res.data);
		},
		fail: function (res) {
			console.log('request-get error:', res);
		},
		complete: function (res) {
			wx.hideLoading();
			 // console.log("get-complete:", res.data)
			  if (res.data.code && res.data.code != 0 && res.data.msg) {
				wx.showToast({
					 title: res.data.msg,
				})
			}
		}
	})
}
function httpP(url, data, callback) {
  wx.request({
    url: wxurl + url,
    data: data,
    method: "post",
    success: function (res) {
      if (res.data.code == 0) {
        callback(res.data);
      }
    },
    fail: function (res) {
      console.log('request-post error:', res);
    },
    complete: function (res) {
      //console.log("post-complete:", res.data)
	  if (res.data.code && res.data.code != 0 && res.data.msg) {
        wx.showToast({
           title: res.data.msg,
       })
      }
    }
  })
}

module.exports = {
  formatTime: formatTime,
  httpP: httpP,
  httpG: httpG,
  getUserName: getUserName,
  formatNumber: formatNumber,
 // getSetting: getSetting,
}
