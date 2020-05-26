const app = getApp();
const db = wx.cloud.database()
const filter = require("../../utils/filter.js")
const util = require("../../utils/util.js")
Page({

 
  data: {
    titleInfo:{//文章头部内容
      noteTitle:'',//'Java冒泡排序和选择排序',
      pointA:'',//'排序',
      pointB:'',//'排序原理'
    },
    html:'',//"<h3>笔记内容</h3><br/><img  style='width:100%;height:auto' src='https://636c-cloud-test-tnjps-1300299389.tcb.qcloud.la/userUploadImage/could-img-1570176712001wxfile.jpg'></img>",//笔记内容 
    currTime:'',//当前时间
    chooseCategory:false,//是否隐藏选择分类
    array:['计算机','理工','外语','文史','管理','艺术','心理','经历'],//分类数据 
    index: 0,
    showModalStatus: false,//分类选择器的状态
    animationData: '',//选择器的动画
    nickName:'',//用户昵称
  },
  
  onLoad: function (options) { 
    const that = this    
    filter.loginCheck()
    const {way} = options   
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`    
    this.setData({
      titleInfo: app.globalData.titleInfo,
      html:app.globalData.html,
      currTime: formatDate,
      way:way
    })        
    // util.setContent(that, that.data.html)
    console.log(way)
    console.log(this.data.titleInfo)
  },
  //返回编辑页面
  backToEditor:function(){
    wx.navigateBack({
      delta: 1
    })
  },//保存笔记并选择分类
  saveNote:function(e){
    //保存前需要先获取需要的所有数据
    //笔记头部 和 笔记内容    
    const titleInfo = this.data.titleInfo
    const html = this.data.html
    //当前时间
    const currTime = this.data.currTime
    //获取笔记分类
    const {value} = e.detail        
    //console.log(titleInfo)
    //获取用户昵称    
    const nickName = app.globalData.nickName    
    // console.log("我的名字: " + nickName)
    //初始化是否公开isOpen 点赞量likeCount 收藏量loveCount 访问量clickCount    
    db.collection('userNotes').add({
      data:{
        'titleInfo':titleInfo,//笔记标题信息 包含知识点
        'html': html,//笔记内容
        'noteCategory':value,//分类数据
        'currTime': currTime,//用于文本显示的时间
        'createTime': db.serverDate(),//用于排序的时间
        'likeCount':0,//点赞
        'loveCount':0,//收藏
        'clickCount':0,//访问
        'isOpen':false,//公开标志
        'nickName': nickName//'用户昵称'
      }
    }).then(res=>{
      console.log(res)
      const noteInfo = {
        titleInfo:null,
        html:''
      }
      app.globalData.noteInfo = noteInfo
      console.log("保存之后")
      console.log(app.globalData.noteInfo)
      //跳转到首页      
      //需要注意 跳转到首页需要传递
      //首页需要重新到数据库中获取数据 -- by harbor
      app.globalData.notesFlag = false
      wx.switchTab({
        url: '/pages/homePage/homePage',
      })      
    }).catch(error=>{
      console.log(error)
    })
    // console.log(e)   
  },//下方笔记分类的显示动画
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },//隐藏下方的分类块
  hideModal: function () {
    this.setData({
      showModalStatus: false,
    })
  
  },
  //登录以及检查是否授权
  login:function(e){
    wx.getUserInfo({
      complete: (res) => {
        console.log(res)
      },
    })
  },
  checkStatus:function(e){
    console.log(e)
    console.log('test')
    wx.getSetting({
      complete: (res) => {
        console.log(res)
      },
    })
  },
 
 


})