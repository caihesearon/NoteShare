//app.js

App({
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'cloud-test-tnjps',
        traceUser: true,
      })
    }
    const db = wx.cloud.database()
    var that = this
    this.globalData = {}
    wx.getSetting({
      success(res) {
        if(res.authSetting['scope.userInfo']){
          db.collection('noteUser').get().then(res => {
            that.globalData.nickName = res.data[0].nickName, //该用户昵称
            that.globalData.dataid = res.data[0]._id, //该用户的_id
            that.globalData.identity = res.data[0].identity, //该用户身份
            that.globalData.school = res.data[0].school, //该用户学校
            that.globalData.academy = res.data[0].academy, //该用户学院
            that.globalData.email = res.data[0].email, //该用户邮箱
            that.globalData.signature = res.data[0].signature, //该用户个性签名
            that.globalData.rewardPath = res.data[0].rewardPath //该用户打赏码路径
          })
        }
      }
    })
  }
})
