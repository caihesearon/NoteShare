import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
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
    // 菜单操作动画部分
    isPopping: false, //是否已经弹出
    animOption: {}, //旋转动画
    animPublic: {}, //item位移,透明度
    animDelete: {}, //item位移,透明度
    animSettop: {}, //item位移,透明度
    animcancelCollet: {}, //缩放
    nowPage:'计算机',
    showMyNotes: true, //展示我的笔记属性
    currNote:{},//保存当前点击的卡片信息和数组下标
  },  
  onShow: function (options) {
    var that = this
    //每次进入知识海洋处于哪个版块就把当前版块的值赋值给notes
    if(that.data.nowPage == "计算机"){
      this.getNotesByCondition("计算机")
    }else if(that.data.nowPage == "理工"){
      this.getNotesByCondition("理工")
    }else if(that.data.nowPage == "外语"){
      this.getNotesByCondition("外语")
    }else if(that.data.nowPage == "文史"){
      this.getNotesByCondition("文史")
    }else if(that.data.nowPage == "管理"){
      this.getNotesByCondition("管理")
    }else if(that.data.nowPage == "艺术"){
      this.getNotesByCondition("艺术")
    }else if(that.data.nowPage == "心理"){
      this.getNotesByCondition("心理")
    }else if(that.data.nowPage == "经历"){
      this.getNotesByCondition("经历")
    }
    
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
      //判断传入参数调用以便云函数条件查询
      if(condition == "计算机"){
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
      }else{
        app.globalData.experienceNotes = res.result.data
      }
    })
  },  

  //点击弹出
  option: function (e) {
    // 获取当前点击的标签的值
    let data = e.currentTarget;    
    //将获取到的当前卡片的信息保存到data中 ---by hecai    
    this.setData({
      currNote: data.dataset
    })    
    console.log(this.data.currNote)
    //---------------
    let dataNull = null;
    if (this.data.isPopping) {
      //缩回动画
      this.takeback(dataNull).then(resolve => {
        this.popp(data);
        this.setData({
          isPopping: false
        })
      });
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback(dataNull).then(resolve => {
        // this.takeback(data);
        this.setData({
          isPopping: true
        })
      });
    }
  },
 

  //弹出动画
  popp: function (data) {
    //plus顺时针旋转
    let idx = data.dataset.index;
    this.setData({
      tabIndex: idx,
    })
    var animationOption = wx.createAnimation({
      // 动画时长
      duration: 500,
      // 动画的执行方式
      timingFunction: 'ease-out'
    })
    var animationPublic = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationDelete = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationSettop = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    // 创建动画执行样式的对象
    animationOption.rotateZ(180).step();
    animationPublic.translate(25, -50).rotateZ(360).opacity(1).step();
    animationDelete.translate(-16, -32).rotateZ(360).opacity(1).step();
    animationSettop.translate(-30, 10).rotateZ(360).opacity(1).step();
    this.setData({
      // 导出动画队列
      animOption: animationOption.export(),
      animPublic: animationPublic.export(),
      animDelete: animationDelete.export(),
      animSettop: animationSettop.export(),
      addIcon: "https://ae01.alicdn.com/kf/H61b39dddd9624296ae33856dd9c38670R.jpg"
    })
  },
  //收回动画
  takeback: function (data) {
    let that = this
    return new Promise(resolve => {
      //plus逆时针旋转
      if (data != null) {
        // 根据传入 的data中的id值来执行哪一个具体的卡片  如果值位null则全部执行
        let idx = data.dataset.index;
        that.setData({
          tabIndex: idx
        })
      }
      var animationOption = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationPublic = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationDelete = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      var animationSettop = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease-out'
      })
      animationOption.rotateZ(0).step();
      animationPublic.translate(0, 0).rotateZ(0).opacity(0).step();
      animationDelete.translate(0, 0).rotateZ(0).opacity(0).step();
      animationSettop.translate(0, 0).rotateZ(0).opacity(0).step();
      that.setData({
        animOption: animationOption.export(),
        animPublic: animationPublic.export(),
        animDelete: animationDelete.export(),
        animSettop: animationSettop.export(),
        addIcon: "https://ae01.alicdn.com/kf/Ha11f36b99ccb4b6b930908729a7dc660y.jpg"
      })
      return resolve("");
    })

  },
  // // 取消收藏动画
  // 初始化动画
  timerAnimationInit() {
    this.data.animation = wx.createAnimation()
  },
  // 开始执行动画
  timerAnimationStart() {
    let iconUrl = this.data.cancelColletIconTwo
    this.data.animation.scale(2.0).step({
      duration: 700,
      timingFunction: 'ease'
    }).scale(1.0).step({
      duration: 300,
      timingFunction: 'ease'
    })
    this.setData({
      ani: this.data.animation.export(),
      cancelColletIcon: iconUrl
    })
  },
  // 结束动画
  aniEnd() {
    this.data.animation.scale(1.0).step({
      duration: 700,
      timingFunction: 'ease'
    })
    this.setData({
      ani: this.data.animation.export()
    })
  },


  // 切换笔记分类
  chooseNotes(event) {
    var that = this
    //每次切换判断全局中是否有对应值，有则直接赋值给notes，无则调用云函数获取
    if (event.detail.title === "计算机") {
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
  //取消收藏点击事件
  cancelCollet(e) {
    console.log(e)
    let idx = e.currentTarget.dataset.index;
    console.log(idx)
    this.setData({
      CollectIndex: idx,
    })
    this.timerAnimationInit()
    this.timerAnimationStart()
    Dialog.confirm({
      title: '提示',
      message: '是否取消收藏，确认后该笔记将移出收藏列表'
    }).then(() => {
      // on confirm
    }).catch(() => {
      // on cancel
    });
  },

  //进入详情页面
  toDetailPage:function(e){
    //获取点击的卡片的详细信息
    const {item} = e.currentTarget.dataset
    // console.log(item)
    //将笔记的详情放入全局中
    app.globalData.noteDetail = item
    console.log(app.globalData.noteDetail)
    wx.navigateTo({
      url: '../noteDetail/noteDetail',
    })
  }

})