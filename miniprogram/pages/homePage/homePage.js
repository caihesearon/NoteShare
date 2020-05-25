import Notify from '/@vant/weapp/notify/notify';

import util from '../utils/util.js'
const db = wx.cloud.database()
const app = getApp()
const filter = require("../utils/filter")
Page({

  /**
   * 页面的初始数据
   */
  data: {    
    notes: [], //该用户所有笔记
    opNotes: [], //该用户公开的笔记
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
    // createNoteIcon: "https://ae01.alicdn.com/kf/H79b5423685c04109978652401e664e49b.jpg",
    createNoteIcon:"https://ae01.alicdn.com/kf/H2fab0b857b3e42848d2d533ec0d03c1eW.jpg",
    // 对笔记的操作的加号图片
    addIcon: "https://ae01.alicdn.com/kf/Ha11f36b99ccb4b6b930908729a7dc660y.jpg",
    addIconadd: "https://ae01.alicdn.com/kf/Ha11f36b99ccb4b6b930908729a7dc660y.jpg",
    // 收藏的星星图标
    cancelColletIcon: "https://ae01.alicdn.com/kf/H80604b3e89aa4e5599c1526e40df9ad2A.jpg", //实心
    cancelColletIconOne: "https://ae01.alicdn.com/kf/H80604b3e89aa4e5599c1526e40df9ad2A.jpg", //实心
    cancelColletIconTwo: "https://ae01.alicdn.com/kf/Hf1f8d5c223324b009a1261293038e1101.jpg", //空心在点击取消收藏后显示
    p1:"https://ae01.alicdn.com/kf/Haad26d6c403a41f9b14def1a6b7a34249.jpg",
    p2:"https://ae01.alicdn.com/kf/H23a5b5009bd74f408882e9e97b99c086j.jpg",
    p3:"https://ae01.alicdn.com/kf/H85a53fc8677c4438a2cd1b81401bc0c9d.jpg",
    showOneBox:true,   //是否展示第一张图片的属性
    showTwoBox:false,   //是否展示第二张图片的属性
    // 菜单操作动画部分
    isPopping: false, //是否已经弹出
    animOption: {}, //旋转动画
    animPublic: {}, //item位移,透明度
    animDelete: {}, //item位移,透明度
    animSettop: {}, //item位移,透明度
    animcancelCollet: {}, //缩放
    tranXY:{},
    isCancel: false, //是否取消收藏属性
    showMyNotes: true, //展示我的笔记属性
    showPublicNotes: false, //展示公共笔记属性
    showCollectNotes: false, //展示收藏笔记属性
    currNote:{},//保存当前点击的卡片信息和数组下标
    scrollStop:false,
    show: false,         //遮罩层的展示属性
    clickCount:1,     //用户点击遮罩层的次数
  },  
  onLoad: function(){
    console.log('onLoad')
    const show  = app.globalData.show
    console.log(show)

    this.setData({
      show: show
    })    
    
  },
  onShow: function (options) {
    // this.setData({
    //   show: app.globalData.show
    // })
    var that = this
    //查询数据库获取我的的所有笔记 所有笔记中包括公开笔记  -- by hecai
    //判断本地是否存在我的笔记数据key为userAllNotes 存在就不调用数据库 不存在查询数据库并将数据加入到本地    
    if(app.globalData.notesFlag != true){
      console.log("进入")
      this.getMyAllNote();
    }    
  },
  // 遮罩层中 朕知道按钮 的点击事件
  onClickHide() {
    this.setData({ 
      showOneBox: false,
      showTwoBox: true,
      clickCount: 2
     });
  },
  // 遮罩层的点击事件
  onClickShowTwo(){
    const that = this
    const count = that.data.clickCount
    if(count == 2){
      that.setData({
        clickCount:3
      })
    }
    if(count == 3){
      that.setData({
        show:false,
        clickCount:1
      })
    }
  },
  //获取我的所有笔记 -- by hecai
  //首次进入小程序从数据库中获取我的所有笔记并将其加入数据库 -- by harbor
  getMyAllNote(){
    var that = this
    /*用户只需从数据库中获取一次数据将其加入全局，
    从而每次加载页面时通过notesFlag值判断是否
    需要访问数据库*/
    app.globalData.notesFlag = true
    //获取用户全部笔记
    db.collection('userNotes')
      .orderBy('createTime','desc')
      .get().then(res=>{
        //把从数据库中获取的所有笔记赋值给全局变量
        app.globalData.notesArr = res.data       
        that.setData({
          opNotes:[]
        })
        if(that.data.showMyNotes){
          that.setData({
            notes:res.data
          })
        }
        //遍历所有笔记，将公开笔记加入到opNotes和全局opNotesArr数组
        for(let i = 0; i < app.globalData.notesArr.length; i++){
          let temp = app.globalData.notesArr[i]
          //isOpen为true则为公开笔记
          if(temp.isOpen == true){
            temp.index = i
            that.data.opNotes.push(temp)
          }
        }        
        if(that.data.showPublicNotes){
          that.setData({
            notes:that.data.opNotes
          })
        }
        //将公开笔记同时加入全局
        app.globalData.opNotesArr = that.data.opNotes        
    })
    //异步获取用户收藏的所有笔记
    db.collection('userLoveNote')
    .orderBy('createTime','desc')
    .get().then(res=>{
      const len = res.data.length
      //判断是否有收藏的笔记
      if(len == 0){
        app.globalData.loveNoteArr = []
      }else{
        //获取所有的收藏笔记id
        let loveNoteArr = res.data
        wx.cloud.callFunction({
          name: 'getLoveNote',
          data:{
            loveNoteArr: loveNoteArr
          }
        }).then(res=>{
          if(that.data.showCollectNotes){
            that.setData({
              notes:res.result
            })
          }
          app.globalData.loveNoteArr = res.result                    
        })        
        
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
  // 点击公开/私有笔记的操作
  public: function (e) {
    var that = this
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
    console.log(that.data.notes[index].isOpen)
    //当在我的笔记页面点击时设置其为公开
    if(that.data.showMyNotes){
      //避免重复公开
      if(!that.data.notes[index].isOpen){
        console.log("执行")
        //更改数据库中isOpen属性为true
        db.collection('userNotes').doc(_id).update({
          data: {
            isOpen:true
          }
        })
        //把全局中此条数据的isOpen改为true
        app.globalData.notesArr[index].isOpen = true
        console.log(app.globalData.notesArr)
        //当前页面对应数据isOpen属性同步更新
        that.setData({
          notes:app.globalData.notesArr
        })
        //将其加入公开笔记数组
        var temp = that.data.notes[index]
        temp.index = index
        var array = []
        array[0] = temp
        for(var i = 1;i < that.data.opNotes.length+1;i++){
          array[i] = that.data.opNotes[i-1]
        }
        that.setData({
          opNotes:array
        })
        Notify({
          message: '公开成功',
          type: 'success'
        });
        //对应的公开笔记全局数组同步更新
        app.globalData.opNotesArr = that.data.opNotes
      }else{
        Notify({
          message: '已存在公开笔记中'
        });
      }
    }
    //当在公开笔记页面点击时设置其为私有
    else if(that.data.showPublicNotes){
      //更改数据库中isOpen属性为false
      db.collection('userNotes').doc(_id).update({
        data: {
          isOpen:false
        }
      })
      //全局笔记对应更新
      app.globalData.notesArr[that.data.notes[index].index].isOpen = false
      //删除页面notes数组的指定数据并赋值给页面notes
      that.data.notes.splice(index, 1)
      that.setData({
        notes:that.data.notes,
        opNotes:that.data.notes
      })
      Notify({
        message: '已取消公开',
        type: 'success'
      });
      //对应的公开笔记全局数组同步更新
      app.globalData.opNotesArr = that.data.opNotes
    }
  },
  // 点击删除笔记的操作
  delete: function (e) {
    var that = this
    this.setData({
      isPopping: true
    })
    this.takeback(null);
    wx.showModal({
      title:"删除提示",
      content:"是否删除此条笔记？",
      confirmText:"确认删除",
      cancelText:"我再想想",
      success:function(res){
        if(res.confirm){
          //根据_id对数据库中的数据进行删除 根据index对本地notes数组进行删除 -- by hecai
          const {_id} = that.data.currNote.item
          const {index} = that.data.currNote
          console.log('笔记的id号：'+_id)
          console.log('index: ' + index)
          //当在我的笔记页面进行删除
          if(that.data.showMyNotes){
            /*若公开笔记中也有此记录同时删除
            我的笔记页面删除index对应改变，因此
            公开笔记中大于index的index需要-1*/
            for(let i = 0; i < that.data.opNotes.length; i++){
              //index大于小标的需要进行-1操作，从而方便公开笔记界面的操作
              if(that.data.opNotes[i].index > index){
                that.data.opNotes[i].index = that.data.opNotes[i].index - 1;
              }else if(that.data.opNotes[i].index == index){
                //说明此条笔记是公开笔记，所以需删除公开笔记中对应的数据
                that.data.opNotes.splice(i,1)
                that.setData({
                  opNotes:that.data.opNotes
                })
              }
            }
            //全局对应更新
            app.globalData.opNotesArr = that.data.opNotes
            //删除页面notes数组的指定数据并赋值给页面notes
            that.data.notes.splice(index, 1)
            that.setData({
              notes:that.data.notes
            })
            //全局数组对应更新
            app.globalData.notesArr = that.data.notes
            //删除数据库数据
            db.collection('userNotes').doc(_id).remove()
          }
          //当在公开笔记页面进行删除
          else if(that.data.showPublicNotes){
            var temp = that.data.notes[index].index
            console.log(temp)
            console.log(that.data.notes[index])
            //删除页面notes数组的指定数据并赋值给页面notes
            that.data.notes.splice(index, 1)
            that.setData({
              notes:that.data.notes,
              opNotes:that.data.notes
            })
            //对应我的笔记中该数据也会删除，所以opNotes中存放的部分数据的index需要-1操作
            for(let i = 0; i < that.data.opNotes.length; i++){
              if(that.data.opNotes[i].index > temp){
                that.data.opNotes[i].index = that.data.opNotes[i].index-1
              }
            }
            //全局公开数组对应变化
            app.globalData.opNotesArr = that.data.opNotes
            app.globalData.notesArr.splice(temp,1)
            //删除数据库数据
            db.collection('userNotes').doc(_id).remove()
          }
          console.log(that.data.notes)
          console.log("点击了删除笔记")
          console.log(e)
        }
      }
    })
    
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
    // wx.showLoading({
    //   title: '别急鸭...'
    // })
    // setTimeout(function () {
    //   wx.hideLoading();
    // }, 1000)
    if (event.detail.title === "我的笔记") {
      console.log(app.globalData.notesArr)
      this.takeback(null);
      this.setData({
        showMyNotes: true,
        showPublicNotes: false,
        showCollectNotes: false,
        notes:app.globalData.notesArr
      })
    } else if (event.detail.title === "公开笔记") {
      this.takeback(null);
      this.setData({
        showMyNotes: false,
        showPublicNotes: true,
        showCollectNotes: false,
        notes:app.globalData.opNotesArr
      })
      
    } else if (event.detail.title === "收藏笔记") {
      filter.loginCheck(0).then(res=>{
        if(res){
          this.takeback(null);
          this.setData({
            showMyNotes: false,
            showPublicNotes: false,
            showCollectNotes: true,
            notes: app.globalData.loveNoteArr
          })
        }
      })
    }
  },
  //取消收藏点击事件
  cancelCollet(e) {   
    var that = this
    this.timerAnimationInit()
    this.timerAnimationStart()    
    const {index} = e.currentTarget.dataset
    const noteInfo = this.data.notes[index]    
    wx.showModal({
      title: '提示',
      content: '确定取消收藏',
      success (res) {
        if (res.confirm) {
          that.data.notes.splice(index, 1)
          that.setData({
            notes: that.data.notes
          })
          app.globalData.loveNoteArr = that.data.notes
          util.removeLoveNote(noteInfo._id)           
        } else if (res.cancel) {           
        }
      }
    })   
  },
  // 点击创建笔记
  createNotes(e) {
    console.log("我点击了")
    wx.navigateTo({
      url: '../createNote/createNote',
    })
    // wx.navigateTo({
    //   url: '../searchNote/searchNote',
    // })
  },
  //进入详情页面
  toDetailPage:function(e){
    //获取点击的卡片的详细信息
    const {item} = e.currentTarget.dataset
    //--------
    // console.log(item)
    //将笔记的详情放入全局中
    //app.globalData.noteDetail = item
    //console.log("wowowowoowo:")
    // console.log(app.globalData.noteDetail)
    // wx.navigateTo({
    //   url: '../noteDetail/noteDetail?way=1&isShowBtn=true&isShowBtnOne=true',
    // })
    //---------
    //如果是收藏板块
    if(this.data.showCollectNotes){
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
    }else{     
      // console.log(item)
      //将笔记的详情放入全局中
      app.globalData.noteDetail = item
      console.log(app.globalData.noteDetail)
      wx.navigateTo({
        url: '../noteDetail/noteDetail?way=1&isShowBtn=true&isShowBtnOne=true',
      })
    }      
  },
  onHide: function(){
    this.setData({
      show: false
    })
  }

})