
// 获取默认环境的数据库的引用：
const db = wx.cloud.database()
const app = getApp()
//引入登陆拦截器
let filter = require('../../utils/filter.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Identityarray:["老师","学生"], //身份只能在老师和学生中选
    objectArray: [{
        id: 0,
        name: '老师'
      },
      {
        id: 1,
        name: '学生'
      }
    ],
    dataid:'', //数据库中的_id
    identity:"", //身份
    nickName:'',//昵称
    school:'',//学校
    academy:'',//学院
    email:'',//邮箱
    signature:'',//个性签名
    rewardPath:''//打赏码路径
  },
  //选择器选中的值发生改变时触发
  bindPickerChange: function(e) {
    var index = e.detail.value; 
    var id = this.data.objectArray[index].id;
    var name = this.data.objectArray[index].name;
    this.setData({
      identity: this.data.Identityarray[e.detail.value]
    })
  },
  //点击取消时触发
  bindCancel: function(e) {
    wx.showToast({
      title: '请选择你的身份',
      icon: 'none',
      duration: 2000
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSetting({
      success(res) {
        //若该用户已授权，获取其昵称和头像
        if(!res.authSetting['scope.userInfo']){
          //进行登录拦截
          const flag = filter.identityFilter()  
          if(flag){
            this.page = 0 
            this.getMyPostList(true)
          }
        }else{
          if(app.globalData.school != null){
            that.setData({
              dataid: app.globalData.dataid, //该用户在数据库中唯一_id
              nickName: app.globalData.nickName, //用户昵称
              identity: app.globalData.identity, //用户身份
              school: app.globalData.school, //用户学校
              academy: app.globalData.academy, //用户学院
              email: app.globalData.email, //用户邮箱
              signature: app.globalData.signature //用户个性签名
            })
          }
        }
      }
    })
  },
  
  //学校输入框失去焦点时触发
  loseSchool:function(e){
    this.setData({
      school: e.detail.value
    })
  },
  //学院输入框失去焦点时触发
  loseAcademy:function(e){
    this.setData({
      academy: e.detail.value
    })
  },
  //邮箱输入框失去焦点时触发
  loseEmail:function(e){
    this.setData({
      email: e.detail.value
    })
  },
  //个性签名输入框失去焦点时触发
  loseSignature:function(e){
    this.setData({
      signature: e.detail.value
    })
  },
  submitInfo: function(e){
    var that = this
    app.globalData.nickName = that.data.nickName, //用户昵称
    app.globalData.identity = that.data.identity, //用户身份
    app.globalData.school = that.data.school, //用户学校
    app.globalData.academy = that.data.academy, //用户学院
    app.globalData.email = that.data.email, //用户邮箱
    app.globalData.signature = that.data.signature //用户个性签名
    //完善用户信息传入到数据库
    db.collection('noteUser').doc(this.data.dataid).update({
      data: {
        //将输入的数据更新到数据库中
        nickName:this.data.nickName, //昵称
        identity:this.data.identity, //身份 
        school:this.data.school, //学校
        academy:this.data.academy, //学院
        email:this.data.email,//邮箱
        signature:this.data.signature//个性签名
      }
    }).then(res => {
      console.log(res)
    })
    wx.navigateBack({
      delta: 1
    })
    wx.showToast({ //弹出框
      title: '保存成功！', //显示内容
      icon: 'sucess',
      duration: 1000
    })
  }
  
 
})