import util from '../utils/util.js'

const filter = require("../utils/filter.js")
const db = wx.cloud.database()
const app = getApp()
Page({

  data: {
    notes: [], //当前页面笔记
    //背景卡片
    // cardBg: "https://ae01.alicdn.com/kf/He8d68c34fbfe4ec6b0e11ca893fbad09F.jpg",
    // 点击量的小图标
    clickIcon: "https://ae01.alicdn.com/kf/H57700e88fbe646508fb02fec0bc7b7c2T.jpg",
    // 收藏笔记的小图标
    collectIcon: "https://ae01.alicdn.com/kf/H8fa1fffc244644c7adcb86d4fcf96f2aH.jpg",
    // 学科分类的小图标
    subjectIcon: "https://ae01.alicdn.com/kf/H1db1534054194cac9b7c6c92f9e4f8c4J.jpg",
    // 收藏的星星图标
    cancelColletIcon: "https://ae01.alicdn.com/kf/H80604b3e89aa4e5599c1526e40df9ad2A.jpg", //实心
    cancelColletIconOne: "https://ae01.alicdn.com/kf/H80604b3e89aa4e5599c1526e40df9ad2A.jpg", //实心
    cancelColletIconTwo: "https://ae01.alicdn.com/kf/Hf1f8d5c223324b009a1261293038e1101.jpg", //空心在点击取消收藏后显示
    // search:"https://ae01.alicdn.com/kf/Hbc3a151e2c4846c3aee1d1ce7b5d8215x.jpg",           //搜索按钮的小图标
    search:"https://ae01.alicdn.com/kf/He1bd2eeb65864525a1ca84306b14fa91T.jpg",
    epidemicImage:"https://ae01.alicdn.com/kf/Haa0d9a2a19b648f8a463ceb34ace28d0b.jpg",      //推荐阅读中疫情板块的展示卡片背景
    isShowHots:true,     //是否展示推荐信息的属性
    nowPage:'推荐',
    showMyNotes: true, //展示我的笔记属性
    currNote:{},//保存当前点击的卡片信息和数组下标
    recommend:[
      {
        _id:1,
        eventOpt:"enterEpidemicPage",
        url:"cloud://cloud-test-tnjps.636c-cloud-test-tnjps-1300299389/image/平安复学.png",
      },
      {
        _id:2,
        eventOpt:"",
        url:"cloud://cloud-test-tnjps.636c-cloud-test-tnjps-1300299389/image/bg2.png",
      }
    ],

  },  
  onShow: function (options) {        

    var that = this
    console.log(that.data.nowPage)    
    //每次进入知识海洋处于哪个版块就把当前版块的值赋值给notestrue
    this.getNotesByCondition(that.data.nowPage)  
  },

  //传入参数即为笔记查询条件
  getNotesByCondition(condition){
    var that = this
    //调用云函数查询笔记
    wx.cloud.callFunction({
      name:'getNotesByOne',
      data:{
        condition:condition
      }
    }).then(res => {
      that.setData({
        notes:res.result.data
      })
      console.log(res.result)
      //判断传入参数调用以便云函数条件查询
      if(condition == '推荐'){
        that.setData({
          notes:res.result.list
        })        
        app.globalData.recommendNotes = res.result.list        
      }else if(condition == "计算机"){
        app.globalData.computerNotes = res.result.data        
      }else if(condition == "理工"){
        app.globalData.scienceNotes = res.result.data       
      }else if(condition == "外语"){
        app.globalData.englishNotes = res.result.data       
      }else if(condition == "文史"){
        app.globalData.historyNotes = res.result.data       
      }else if(condition == "管理"){
        app.globalData.manageNotes = res.result.data       
      }else if(condition == "艺术"){
        app.globalData.art = res.result.data        
      }else if(condition == "心理"){
        app.globalData.psychologyNotes = res.result.data        
      }else if(condition == "经历"){
        app.globalData.experienceNotes = res.result.data       
      }
    })

  },  

  // 切换笔记分类
  chooseNotes(event) {
    var that = this
    // 设置推荐模块的展示
    if(event.detail.title == "推荐"){
      that.setData({
          isShowHots:true     
      })
    }else{
      that.setData({
        isShowHots:false     
      })
    }
    //每次切换判断全局中是否有对应值，有则直接赋值给notes，无则调用云函数获取
    if(event.detail.title === "推荐"){
      that.setData({
        nowPage:'推荐'
      })
      if(app.globalData.recommendNotes == null){
        that.getNotesByCondition("推荐")
      }else{
        that.setData({
          notes:app.globalData.recommendNotes
        })
      }
    }
    else if (event.detail.title === "计算机") {
      that.setData({
        nowPage:'计算机'
      })
      if(app.globalData.computerNotes == null){
        that.getNotesByCondition("计算机")
      }else{
        that.setData({
          notes:app.globalData.computerNotes
        })
      }
    } else if(event.detail.title === "理工") {
      that.setData({
        nowPage:'理工'
      })
      if(app.globalData.scienceNotes == null){
        that.getNotesByCondition("理工")
      }else{
        that.setData({
          notes:app.globalData.scienceNotes
        })
      }
    }else if(event.detail.title === "外语") {
      that.setData({
        nowPage:'外语'
      })
      if(app.globalData.englishNotes == null){
        that.getNotesByCondition("外语")
      }else{
        that.setData({
          notes:app.globalData.englishNotes
        })
      }
    }else if(event.detail.title === "文史") {
      that.setData({
        nowPage:'文史'
      })
      if(app.globalData.historyNotes == null){
        that.getNotesByCondition("文史")
      }else{
        that.setData({
          notes:app.globalData.historyNotes
        })
      }
    }else if(event.detail.title === "管理") {
      that.setData({
        nowPage:'管理'
      })
      if(app.globalData.manageNotes == null){
        that.getNotesByCondition("管理")
      }else{
        that.setData({
          notes:app.globalData.manageNotes
        })
      }
    }else if(event.detail.title === "艺术") {
      that.setData({
        nowPage:'艺术'
      })
      if(app.globalData.artNotes == null){
        that.getNotesByCondition("艺术")
      }else{
        that.setData({
          notes:app.globalData.arteNotes
        })
      }
    }else if (event.detail.title === "心理") {
      that.setData({
        nowPage:'心理'
      })
      if(app.globalData.psychologyNotes == null){
        that.getNotesByCondition("心理")
      }else{
        that.setData({
          notes:app.globalData.psychologyNotes
        })
      }
    }else if (event.detail.title === "经历") {
      that.setData({
        nowPage:'经历'
      })
      if(app.globalData.experienceNotes == null){
        that.getNotesByCondition("经历")
      }else{
        that.setData({
          notes:app.globalData.experienceNotes
        })
      }
    }   
  },

  //进入详情页面
  toDetailPage:function(e){
    filter.loginCheck(0).then(res=>{
      if(res){
        //点击后需要点击量加一        
        //获取点击的卡片的详细信息
        const {item} = e.currentTarget.dataset
        const {_id} = item
        const flag = util.getLocalStorage(_id)
        if(flag){
          //对一天已经点击过的笔记卡片进行记录 防止重复点击
          util.setLocalStorage(_id)
          wx.cloud.callFunction({
            name: 'upCountByType',
            data:{
              type: 'addClick',
              _id: _id
            }
          })
        }        
        //将笔记的详情放入全局中
        app.globalData.noteDetail = item    
        wx.navigateTo({
          url: '../noteDetail/noteDetail?way=1&isShowOptBar=true&isShowBtn=true&isShowBtnTwo=true',
        })
      }
    })
    
  },
  // 进入搜索页面
  searchNotes(){    
    wx.navigateTo({
      url: '../searchNote/searchNote',
    })
  },
  // 进入疫情页面
  enterEpidemicPage(){
    wx.navigateTo({
      url: '../nCov-9/nCov-9',
    })
  },

  //下拉刷新刷新当前页面的数据
  onPullDownRefresh: function () {
    var that = this;
    if(that.data.notes == '推荐'){
      that.getNotesByCondition('推荐')
    }else if(that.data.nowPage == '计算机'){
      that.getNotesByCondition('计算机')
    }else if(that.data.nowPage == '理工'){
      that.getNotesByCondition('理工')
    }else if(that.data.nowPage == '外语'){
      that.getNotesByCondition('外语')
    }else if(that.data.nowPage == '文史'){
      that.getNotesByCondition('文史')
    }else if(that.data.nowPage == '管理'){
      that.getNotesByCondition('管理')
    }else if(that.data.nowPage == '艺术'){
      that.getNotesByCondition('艺术')
    }else if(that.data.nowPage == '心理'){
      that.getNotesByCondition('心理')
    }else if(that.data.nowPage == '经历'){
      that.getNotesByCondition('经历')
    }
    wx.stopPullDownRefresh({
      complete: (res) => {
        console.log(res)
      },
    })
  },
  // // 滑动开始事件
  // touchStart(e){
  //   const that = this
  //   setTimeout(function(){
  //     that.tranright()
  //   },300)
  //   // console.log('滚起来', e);
    
  //   this.setData({
  //     scrollStop: false
  //   })
  // },
  // // 滑动结束事件
  // touchEnd(e){
  //   const that = this
  //   setTimeout(function(){
  //     that.tranleft()
  //   },3000)
  // //  console.log('停下来', e);
  //   this.setData({
  //     scrollStop: true
  //   })
  // },
  // // 右移动动画
  // tranright:function(e){
  //   const that = this
  //   var animationtran = wx.createAnimation({
  //     // 动画时长
  //     duration: 1000,
  //     // 动画的执行方式
  //     timingFunction: 'ease-out'
  //   })
  //   animationtran.translate(60,0).step()
  //   that.setData({
  //     tranXY: animationtran.export(),
  //   })
  // },
  // // 左移动动画
  // tranleft:function(e){
  //   // console.log("执行了")
  //   const that = this
  //   var animationtran = wx.createAnimation({
  //     // 动画时长
  //     duration: 500,
  //     // 动画的执行方式
  //     timingFunction: 'ease-out'
  //   })
  //   animationtran.translate(0,0).step()
  //   that.setData({
  //     tranXY: animationtran.export(),
  //   })
  // },
})