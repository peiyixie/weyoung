// pages/storageConsole/storageConsole.js

const app = getApp()

Page({

  data: {
    regUserID: '',
    regPassword: '',
    regConfirmPassword: '',
    openid: '',
    passOK: true,
    finished: false

  },

  onLoad: function (options) {
    if (!this.data.openid) {
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
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    }
    this.setData({
        openid: app.globalData.openid
    })

    console.group('register')
    console.log('register user')
    console.groupEnd()
  },
  bindIDInput(e) {
    this.setData({
      regUserID: e.detail.value
    })
  },
  bindPassInput(e) {
    this.setData({
      regPassword: e.detail.value
    })
  },
  bindPassTwoInput(e) {
    this.setData({
      regConfirmPassword: e.detail.value
    })
    if(this.data.regConfirmPassword != this.data.regPassword){
      this.setData({
        passOK: false
      })
    }else{
      this.setData({
        passOK: true
      })
    }
  },
  doRegister(e){
    console.log("register")


    const db = wx.cloud.database()

    // Query users to check for duplicates
   
    db.collection('user').where({
      userID: this.data.regUserID,
    }).get({
      success: res => {
        console.log(res)
        if (res.data[0] == undefined) {
          //add user
          db.collection('user').add({
            data: {
              userID: this.data.regUserID,
              password: this.data.regConfirmPassword
            },
            success: res1 => {

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
          console.log('[DB] [Query] Success: ', res)
        } else {
          wx.showToast({
            icon: 'none',
            title: 'Duplicate user ID'
          })
        }

      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: 'Failed'
        })
        console.error('[DB] [Query] Failed: ', err)
      }
    })

   
  }

})