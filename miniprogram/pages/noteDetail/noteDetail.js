import util from '../utils/util.js'
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    //数据结构参考 previewNote.js
    titleInfo: {},
    html: '',
    currTime: '',
    isHide: true, // 是否显示二维码
    likeCount: 0, //点赞量
    loveCount: 0, //收藏量
    clickCount: 0, //点击量
    show: false, //显示遮罩层
    optText: '展开',
    first_click: false, //第一次下拉框的显示状态
    state: false, //下拉框的状态
    iscollect: false,
    isclickPost: false,
    icon: {
      collectTextOne: '收藏',
      collectOne: "https://ae01.alicdn.com/kf/Hf932f5c771c04d9b8789ea5537bb821fK.jpg",
      collectTextTwo: '已收藏',
      collectTwo: "https://ae01.alicdn.com/kf/Hba174d8d3ed84e749217c21748120db5r.jpg",
      clickPostTextOne: '点赞',
      clickPostOne: "https://ae01.alicdn.com/kf/H013854eb2705462898a6cb4b816da90e1.jpg",
      clickPostTextTwo: '已点赞',
      clickPostTwo: "https://ae01.alicdn.com/kf/H75824d8df35d4e9cb15db73a088ee152l.jpg",
      rewardText: '打赏',
      reward: "https://ae01.alicdn.com/kf/H67faa92f81864c8c9fbc28270b421221C.jpg",
      fontSize:'1rem',
    },
    // 表示页面跳转的方式
    way:0,
    // enterProperties:{
    //   isShowOptBar:false,
    //   isShowBtn:false,
    //   isShowBtnOne:false,
    //   isShowBtnTwo:false,
    // },    
  },
  onLoad: function (e) {    
     // 获取的从其父级页面传过来的属性值
    const {way} = e             //表示显示学科分类和知识点
    const {isShowBtn} = e       //显示按钮模块的属性
    const {isShowBtnOne} = e    //显示第一个按钮即编辑按钮的属性
    const {isShowBtnTwo} = e    //显示第二个按钮即显示进入个人主页的按钮
    const {isShowOptBar} = e    //显示底部对于笔记操作的区域
    const {noteDetail} = app.globalData      
    //util.setContent(this, noteDetail.html)  
    this.setData({
      titleInfo: noteDetail.titleInfo,
      html: noteDetail.html,
      currTime: noteDetail.currTime,
      likeCount: noteDetail.likeCount,
      loveCount: noteDetail.loveCount,
      clickCount: noteDetail.clickCount,
      nickName:noteDetail.nickName,
      noteCategory:noteDetail.noteCategory,
      // 将从父级页面接收到的值传递给前端
      way:way,
      isShowBtn:isShowBtn,
      isShowBtnOne:isShowBtnOne,
      isShowBtnTwo:isShowBtnTwo,
      isShowOptBar
    })    
    //进入详情页面后需要判断该笔记今天是否已经给过赞了
    const {_id} = noteDetail
    //根据_id获取是否已经收藏了该笔记
    util.getLoveCount(_id).then(res=>{
      if(res >= 1){
        this.setData({
          iscollect: true
        })
      }
    })    
    const flag = util.getLocalStorage('like'+_id)
    if(flag){//今天没有点过赞      
      wx.removeStorageSync('like'+_id)
    }else{//今天已经点过赞了
      this.setData({
        isclickPost: true
      })
    }    
  },
  //收藏和取消收藏
  onClickCollect() {
    console.log("收藏和取消收藏")
    app.globalData.notesFlag = false
    const iscollect = this.data.iscollect
    //获取笔记Id
    const {_id} = app.globalData.noteDetail
    if (!iscollect) {
      wx.showToast({
        title: '收藏成功',
      })
      this.setData({
        iscollect: true,
        loveCount: this.data.loveCount+1
      })      
      util.addLoveNote(_id)      
    } else {
      wx.showToast({
        title: '已取消收藏',
      })
      this.setData({
        iscollect: false,
        loveCount: this.data.loveCount-1
      })
      util.removeLoveNote(_id)
    }
  },
  


  //点赞和取消点赞
  onClickpost() {
    console.log("点赞和取消点赞")
    const {_id} = app.globalData.noteDetail
    //将_id设置为特殊点赞标识 避免和点击冲突
    const likeId = 'like'+_id
    console.log(_id)
    const isclickPost = this.data.isclickPost
    if (!isclickPost) {
      wx.showToast({
        title: '点赞成功',
      })
      this.setData({
        isclickPost: true,
        likeCount: this.data.likeCount+1
      })
      //根据id+like进行点赞操作
      util.setLocalStorage(likeId)
      this.upLikeCount(_id,1)
      //数据库操作
    } else {
      wx.showToast({
        title: '已取消点赞',
      })
      this.setData({
        isclickPost: false,
        likeCount: this.data.likeCount-1
      })
      wx.removeStorageSync(likeId)
      //数据库操作
      this.upLikeCount(_id,-1)
    }
  },
  //对于点赞操作的数据库修改
  upLikeCount: function(_id, count){
    wx.cloud.callFunction({
      name: 'upCountByType',
      data:{
        type: 'likeClick',
        _id: _id,
        count: count
      }
    })
  },
  // 点击显示和展开详情知识点信息
  // openOpt(e) {
  //   var list_state = this.data.state,
  //     first_state = this.data.first_click,
  //     optText = this.data.optText;
  //   let that = this
  //   if (!first_state) {
  //     this.setData({
  //       first_click: true,
  //       optText: "收起"
  //     });
  //   }
  //   if (!list_state) {
  //     this.setData({
  //       state: true,
  //       optText: "收起"
  //     });
  //   } else {
  //     this.setData({
  //       state: false,
  //       optText: "展开",
  //     });
  //     setTimeout(function () {
  //       that.setData({
  //         first_click: false,
  //       })
  //     }, 550)
  //   }
  // },
  // 点击获取本笔记的打赏二维码
  onClickShow() {
     /**
     * 打赏需要获取当前笔记创建者的openid
     * 根据openid获取是否设置了打赏码
     */
    wx.showLoading({
      title: '加载中',
    })
    const that = this
    const {_openid,nickName} = app.globalData.noteDetail    
    wx.cloud.callFunction({
      name: 'getNoteUserInfo',
      data:{
        _openid: _openid
      }
    }).then(res => {
      wx.hideLoading()
      //用户信息
      const userInfo = res.result.data[0]
      if(userInfo.rewardPath == ''){
        wx.showModal({
          title: '提示',
          content: '该用户没有设置打赏码',
          showCancel: false
        })
      }else{
        that.setData({
          show: true,
          nickName: nickName,
          avatarIcon: userInfo.avatarUrl,
          school: userInfo.school,
          rewardImage: userInfo.rewardPath,
        });
      }
    })  
  
  },
  // 点击隐藏
  onClickHide() {
    this.setData({
      show: false
    });
  },
 
  //展示打赏码
  showRewardCode: function () {
    const {
      rewardPath
    } = app.globalData
    //如果没有
    if (rewardPath == null || rewardPath == '') {
      wx.showModal({
        title: '提示',
        content: '当前没有设置打赏码',
        showCancel: false
      })
      return
    }
    wx.previewImage({
      current: rewardPath, // 当前显示图片的http链接
      urls: [rewardPath] // 需要预览的图片http链接列表
    })
  },
  //进入编辑页面
  toEditorPage: function () {
    wx.navigateTo({
      url: '../createNote/createNote?editor=true',
    })
  },
  // 进入他人主页
  toHerPage() {
    wx.navigateTo({
      url: '../personalPage/personalPage',
    })
  }

})