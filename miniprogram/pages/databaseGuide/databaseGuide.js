// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 3,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    latitude: '',
    longitude: '',
    timestamp: ''
  },

  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }

    var latitude, longitude
    wx.getLocation({
      type: 'gcj02', //return wx.openLocation geo location
      success: res => {
        latitude = res.latitude
        longitude = res.longitude
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },

  onAdd: function () {   
    const db = wx.cloud.database()
    db.collection('counters').add({
      data: {
        latitude: this.data.latitude,
        longitude: this.data.longitude,
        timestamp: new Date(),

      },
      success: res1 => {
        console.log(this)
        this.setData({
          counterId: res1._id,
          timestamp: res1.timestamp
        })

        wx.navigateBack({
          delta: 1
        })

        wx.showToast({
          title: 'Success',
        })
        console.log('[DB] [New] Success _id: ', res1._id)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: 'Failed'
        })
        console.error('[DB] [New] Fail: ', err)
      }
    })
  },

  onQuery: function() {
    const db = wx.cloud.database()
    // Query all users
    db.collection('counters').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2)
        })
        console.log('[DB] [Query] Success: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: 'Failed'
        })
        console.error('[DB] [Query] Failed: ', err)
      }
    })
  },

  onCounterInc: function() {
    const db = wx.cloud.database()
    const newCount = this.data.count + 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[DB] [Update] Faild: ', err)
      }
    })
  },

  onCounterDec: function() {
    const db = wx.cloud.database()
    const newCount = this.data.count - 1
    db.collection('counters').doc(this.data.counterId).update({
      data: {
        count: newCount
      },
      success: res => {
        this.setData({
          count: newCount
        })
      },
      fail: err => {
        icon: 'none',
        console.error('[DB] [Update] Failed: ', err)
      }
    })
  },

  onRemove: function() {
    if (this.data.counterId) {
      const db = wx.cloud.database()
      db.collection('counters').doc(this.data.counterId).remove({
        success: res => {
          wx.showToast({
            title: '删除成功',
          })
          this.setData({
            counterId: '',
            count: null,
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: 'Delete failed',
          })
          console.error('[DB] [Delete] Failed:', err)
        }
      })
    } else {
      wx.showToast({
        title: 'No record to delete',
      })
    }
  },

  nextStep: function () {
    // 在第一步，需检查是否有 openid，如无需获取
    if (this.data.step === 3 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          // wx.showToast({
          //   icon: 'none',
          //   title: '获取 openid 失败，请检查是否有部署 login 云函数',
          // })
          console.log('[Cloud] [login] failed to take openid ', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function() {} : function() {
        console.group('Docs')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },

  goHome: function() {
    const pages = getCurrentPages()
    if (pages.length === 2) {
      wx.navigateBack()
    } else if (pages.length === 1) {
      wx.redirectTo({
        url: '../index/index',
      })
    } else {
      wx.reLaunch({
        url: '../index/index',
      })
    }
  }

})