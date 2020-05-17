const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    avatarUrl:"https://ae01.alicdn.com/kf/Hc0cdd9585b754635a427ed0cc0d8464bh.jpg",//用户头像
    nickName:"",//用户昵称
    isShow: true, //判断授权按钮是否显示
    noteCount:0, //笔记数量
    iconOne:"https://ae01.alicdn.com/kf/H9a673d4d3eac4ca9b9e647f0d5d1e488S.jpg",
    iconTwo:"https://ae01.alicdn.com/kf/H5d13394f2db24ecab7bda0f5b6f19228p.jpg",
    iconThree:"https://ae01.alicdn.com/kf/H7dbdb6d073cd41af899910d435a92c30f.jpg",
    iconFour:"https://ae01.alicdn.com/kf/H3e79694f985b405dae62e5905e5f9f6eT.jpg",
    iconFive:"https://ae01.alicdn.com/kf/H2c80a515e25f4c5c8e36a76af9939015L.jpg",
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
          // that.setData({
          //   avatarUrl: app.globalData.avatarUrl,
          //   nickName: app.globalData.nickName,
          //   isShow: false
          // })
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
        //只有授权的时候执行，只add一次就OK ---------- 后续可以改进为update 更新数据库 目的是用户会更换头像和昵称
        db.collection('noteUser').get().then(res => {
          //防止用户重复加入数据库
          if (res.data[0] == null) {
            app.globalData.nickName = that.data.nickName
            app.globalData.school = ""
            db.collection('noteUser').add({
              data:{
                nickName:that.data.nickName, //昵称
                avatarUrl:that.data.avatarUrl,//头像
                identity:'', //身份 
                school:'', //学校
                academy:'', //学院
                email:'',//邮箱
                signature:'',//个性签名
                rewardPath:'',//打赏码路径
              },
              success: res => {
                app.globalData.dataid = res._id
              }
            })
          }else{
            app.globalData.nickName = res.data[0].nickName, //该用户昵称
            app.globalData.dataid = res.data[0]._id, //该用户的_id
            app.globalData.identity = res.data[0].identity, //该用户身份
            app.globalData.school = res.data[0].school, //该用户学校
            app.globalData.academy = res.data[0].academy, //该用户学院
            app.globalData.email = res.data[0].email, //该用户邮箱
            app.globalData.signature = res.data[0].signature, //该用户个性签名
            app.globalData.rewardPath = res.data[0].rewardPath //该用户打赏码路径
            console.log('test..')
            console.log(res)
          }
        })
      }
    })
  }
})