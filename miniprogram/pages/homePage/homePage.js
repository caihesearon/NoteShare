import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // notes: [{ 
    //   id: 1,                                   //卡片的编号  以及热度的排行
    //   clickNum:1000,                            //点击量   
    //   collectNum:10000,                           //收藏量
    //   content: "Harbor is a pig, big pig!",   //知识标题的    
    //   subject: "计算机",                       //笔记的分类属性
    //   knowledgePointOne: "",                  //知识点1
    //   knowledgePointTwo: "链表链表",            //知识点2
    // },
    //   {
    //     id: 2,
    //     clickNum:2233,
    //     collectNum:0, 
    //     content: "我只有一点点的笔记",
    //     subject: "计算机",
    //     knowledgePointOne: "数组",
    //     knowledgePointTwo: "面对对象",
    //   },
    //   {
    //     id: 3,
    //     clickNum:123,
    //     collectNum:2342, 
    //     content: "我差不多有那麽一点的笔记，但是我的笔记并不是很多是，所以呢我还是只有一点点笔记",
    //     subject: "计算机",
    //     knowledgePointTwo: "数组",
    //   },
    //   {
    //     id: 4,
    //     clickNum:23,
    //     collectNum:234, 
    //     content: "optionPublic is one big",
    //     subject: "计算机",
    //     knowledgePointOne: "数组",
    //     knowledgePointTwo: "作用域作用域",
    //   },
    //   {
    //     id: 5,
    //     clickNum:23,
    //     collectNum:234, 
    //     content: "我只有一点点的笔记",
    //     subject: "计算机",
    //     knowledgePointOne: "数组",
    //   },
    //   {
    //     id: 6,
    //     clickNum:23,
    //     collectNum:10987000, 
    //     content: "我差不多有那麽一点的笔记，但是我的笔记并不是很多是，所以呢我还是只有一点点笔记",
    //     subject: "计算机计算机",
    //     knowledgePointOne: "数组",
    //   }

    // ],
    notes: [],
    // 热度的小图标  小火焰
    // fire: "https://ae01.alicdn.com/kf/Hadc5c9645cdc42cd80e1cee4d4360837t.jpg",
    //背景卡片
    // cardBg: "https://ae01.alicdn.com/kf/He8d68c34fbfe4ec6b0e11ca893fbad09F.jpg",
    // 点击量的小图标
    clickIcon: "https://ae01.alicdn.com/kf/H57700e88fbe646508fb02fec0bc7b7c2T.jpg",
    // 收藏笔记的小图标
    collectIcon: "https://ae01.alicdn.com/kf/H8fa1fffc244644c7adcb86d4fcf96f2aH.jpg",
    // 学科分类的小图标
    subjectIcon: "https://ae01.alicdn.com/kf/H1db1534054194cac9b7c6c92f9e4f8c4J.jpg",
    // 公开笔记的小图标
    optionPublic: "https://ae01.alicdn.com/kf/Hc8c59b6d8aba4c23a241f34b455ce6157.jpg",
    // 私有笔记的小图标
    optionPrivate: "https://ae01.alicdn.com/kf/H324e08dce6ea4a019638a0913b0484f5z.jpg",
    // 删除笔记的小图标
    optionDelete: "https://ae01.alicdn.com/kf/He83b7aee60764286b7dc4708a2f2eb14k.jpg",
    // 置顶笔记的小图标
    optionSettop: "https://ae01.alicdn.com/kf/Hed56b5104a784116be8976084a0b8c7dW.jpg",
    // 创建笔记的加号图片
    createNoteIcon: "https://ae01.alicdn.com/kf/H79b5423685c04109978652401e664e49b.jpg",
    // 对笔记的操作的加号图片
    addIcon: "https://ae01.alicdn.com/kf/Ha11f36b99ccb4b6b930908729a7dc660y.jpg",
    addIconadd: "https://ae01.alicdn.com/kf/Ha11f36b99ccb4b6b930908729a7dc660y.jpg",
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
    isCancel: false, //是否取消收藏属性
    showMyNotes: true, //展示我的笔记属性
    showPublicNotes: false, //展示公共笔记属性
    showCollectNotes: false, //展示收藏笔记属性
    currNote:{},//保存当前点击的卡片信息和数组下标
  },  
  onShow: function (options) {
    //查询数据库获取我的的所有笔记 所有笔记中包括公开笔记  -- by hecai
    //判断本地是否存在我的笔记数据key为userAllNotes 存在就不调用数据库 不存在查询数据库并将数据加入到本地    
    
    if(this.data.notes.length == 0){//当前页面有就不用获取数据
      // console.log('onShow1')
      let notes = wx.getStorageSync('userAllNotes')
      // console.log(notes)
      if(notes != ''){
        //将数据设置到当前页面
        // console.log('onShow2')
      }else{
        // console.log('onShow3')
        this.getMyAllNote()
      }
    }
    //查询收藏的笔记
    //判断本地是否存在收藏笔记key为userLoveNotes


  },
  //获取我的所有笔记 -- by hecai
  getMyAllNote(){
    const that = this
    db.collection('userNotes')
      .orderBy('createTime','desc')
      .get().then(res=>{
      console.log(res.data)
      that.setData({
        notes: res.data
      })
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
  // 点击公开/私有笔记的操作
  public: function (e) {
    this.setData({
      isPopping: true
    })
    this.takeback(null);
    //根据获取的_id对数据库中的数据进行修改 根据index修改本地数组notes中的公开属性 -- by hecai
    const {_id} = this.data.currNote.item
    console.log('笔记的id号：'+_id)
    const {index} = this.data.currNote
    console.log('笔记的id号：'+_id)
    console.log('index: ' + index)
    console.log(e)
  },
  // 点击删除笔记的操作
  delete: function (e) {
    this.setData({
      isPopping: true
    })
    this.takeback(null);
    //根据_id对数据库中的数据进行删除 根据index对本地notes数组进行删除 -- by hecai
    const {_id} = this.data.currNote.item
    const {index} = this.data.currNote
    console.log('笔记的id号：'+_id)
    console.log('index: ' + index)
    console.log("点击了删除笔记")
    console.log(e)
  },
  // 点击置顶笔记的操作
  settop: function (e) {
    this.setData({
      isPopping: true
    })
    this.takeback(null);
    console.log("点击的置顶笔记")
    console.log(e)
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
    wx.showLoading({
      title: '别急鸭...'
    })
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
    if (event.detail.title === "我的笔记") {
      this.takeback(null);
      this.setData({
        showMyNotes: true,
        showPublicNotes: false,
        showCollectNotes: false,
      })
    } else if (event.detail.title === "公开笔记") {
      this.takeback(null);
      this.setData({
        showMyNotes: false,
        showPublicNotes: true,
        showCollectNotes: false,
      })

    } else if (event.detail.title === "收藏笔记") {
      this.takeback(null);
      this.setData({
        showMyNotes: false,
        showPublicNotes: false,
        showCollectNotes: true,
      })
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
  // 点击创建笔记
  createNotes(e) {
    console.log("我点击了")
    wx.navigateTo({
      url: '../createNote/createNote',
    })
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