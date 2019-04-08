//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: 'https://imgur.com/7B61FLl.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    userID: '',
    password: '',
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
    
  },
  doLogout: function(e){
    this.setData({
      avatarUrl: 'https://imgur.com/7B61FLl.png',
      userInfo: {},
      logged: false,
      takeSession: false,
      requestResult: '',
      userID: '',
      password: '',
      loggedIn: false,
    })
    app.globalData.loggedIn = false
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }

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
          console.log(res.result)
     
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
    const db = wx.cloud.database()
    // Query all users
    db.collection('user').where({
      userID: this.data.userID,
    }).get({
      success: res => {
        if (res.data[0] && (res.data[0].password == this.data.password)){
          this.setData({
            queryResult: JSON.stringify(res.data, null, 2),
            loggedIn: true,
          })
          console.log('[DB] [Query] Success: ', res)
          app.globalData.loggedIn = true

        }else{
          wx.showToast({
            icon: 'none',
            title: 'Incorrect ID/password'
          })
          console.log(res.data[0].password)
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

  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  bindIDInput(e) {
    this.setData({
      userID: e.detail.value
    })
  },
  bindPassInput(e) {
    this.setData({
      password: e.detail.value
    })
  },
  //navigate to register page
  onRegister(e){
    wx.navigateTo({
      url: '../register/register'
    })
  },
  // Upload image
  doUpload: function (e) {
    // Choose Image
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: 'Uploading...',
        })

        const filePath = res.tempFilePaths[0]
        console.log(filePath)
        // upload image
        var now = new Date()
        const cloudPath = app.globalData.openid + now.nv_getTime() + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[Upload] Success: ', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            

            const db = wx.cloud.database()
            db.collection('upload').add({
              data: {
                openid: app.globalData.openid,
                cloudPath: cloudPath,
                timestamp: now
              },
              success: res1 => {
                console.log('[DB] [NewUpload] Success _id: ', res1._id)
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: 'Failed'
                })
                console.error('[DB] [NewUpload] Fail: ', err)
              }
            })

            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[Upload] Failed: ', e)
            wx.showToast({
              icon: 'none',
              title: 'Upload failed.',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
