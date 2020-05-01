const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    avatarUrl:"https://ae01.alicdn.com/kf/Hc0cdd9585b754635a427ed0cc0d8464bh.jpg",//用户头像
    nickName:"",//用户昵称
    isShow: true, //判断授权按钮是否显示
    noteCount:0 //笔记数量
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success(res) {
        //若该用户已授权，获取其昵称和头像
        if(res.authSetting['scope.userInfo']){
          that.getData()
        }
      }
    })
  },
  //获取头像和昵称
  getData(){
    var that = this
    wx.getUserInfo({
      success:function(res){
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,
          isShow: false
        })
      }
    })
  },
  //用户授权后将其加入数据库
  login(){
    var that = this
    wx.getUserInfo({
      success:function(res){
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,
          isShow: false
        })
        //将头像和昵称放入全局变量
        //只有授权的时候执行，只add一次就OK
        db.collection('noteUser').get().then(res => {
          //防止用户重复加入数据库
          if (res.data[0] == null) {
            app.globalData.nickName = that.data.nickName
            app.globalData.school = ""
            db.collection('noteUser').add({
              data:{
                nickName:that.data.nickName, //昵称
                identity:'', //身份 
                school:'', //学校
                academy:'', //学院
                email:'',//邮箱
                signature:'',//个性签名
                rewardPath:''//打赏码路径
              },
              success: res => {
                app.globalData.dataid = res._id
              }
            })
          }
        })
      }
    })
  }
})