const app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //数据结构参考 previewNote.js
    titleInfo:{},
    html:'',
    currTime:'',
    isHide:true, // 是否显示二维码
    likeCount: 0,//点赞量
    loveCount: 0,//收藏量
    clickCount: 0,//点击量
  },
  onLoad: function (e) {
    const {noteDetail} = app.globalData    
    console.log(noteDetail)    
    this.setData({
      titleInfo: noteDetail.titleInfo,
      html: noteDetail.html,
      currTime: noteDetail.currTime,
      likeCount: noteDetail.likeCount,
      loveCount: noteDetail.loveCount,
      clickCount: noteDetail.clickCount
    })        
    
  },  
  //展示打赏码
  showRewardCode:function(){
    const {rewardPath} = app.globalData    
    //如果没有
    if(rewardPath == null || rewardPath == ''){      
      wx.showModal({
        title:'提示',
        content:'当前没有设置打赏码',
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
  toEditorPage:function(){
    wx.navigateTo({
      url: '../createNote/createNote?editor=true',
    })
  }
 
})