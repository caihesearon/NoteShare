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
    show: false,  //显示遮罩层
    optText:'展开',
    first_click: false, //第一次下拉框的显示状态
    state: false, //下拉框的状态
    iscollect:false, 
    isclickPost:false,
    icon:{   
      collectTextOne : '收藏',
      collectOne : "https://ae01.alicdn.com/kf/Hf932f5c771c04d9b8789ea5537bb821fK.jpg",
      collectTextTwo : '已收藏',
      collectTwo : "https://ae01.alicdn.com/kf/Hba174d8d3ed84e749217c21748120db5r.jpg",
      clickPostTextOne:'点赞',
      clickPostOne: "https://ae01.alicdn.com/kf/H013854eb2705462898a6cb4b816da90e1.jpg",
      clickPostTextTwo:'已点赞',
      clickPostTwo:"https://ae01.alicdn.com/kf/H75824d8df35d4e9cb15db73a088ee152l.jpg",
      rewardText:'打赏',
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

  //收藏和取消收藏
  onClickCollect(){
    console.log("收藏和取消收藏")
    const iscollect = this.data.iscollect
    if(!iscollect){
      wx.showToast({
        title: '收藏成功',
      })
      this.setData({
        iscollect : true,
      })
    }else{
      wx.showToast({
        title: '已取消收藏',
      })
      this.setData({
        iscollect : false
      })
    }
  },
//点赞和取消点赞
onClickpost(){
    console.log("点赞和取消点赞")
    const isclickPost = this.data.isclickPost
    if(!isclickPost){
      wx.showToast({
        title: '点赞成功',
      })
      this.setData({
        isclickPost : true,
      })
    }else{
      wx.showToast({
        title: '已取消点赞',
      })
      this.setData({
        isclickPost : false
      })
    }
  },

  // 点击显示和展开详情知识点信息
  openOpt(e){
    var list_state = this.data.state,
        first_state = this.data.first_click,
        optText = this.data.optText;
        let that = this
      if (!first_state) {
        this.setData({
          first_click: true,
          optText:"收起"
        });
      }
      if (!list_state) {
        this.setData({
          state: true,  
          optText:"收起"
        });
      } else {
        this.setData({
          state: false,
          optText:"展开",
        });
        setTimeout(function () {
           that.setData({
          first_click: false,
        })},550)
       
      }
    
  },
  // 点击获取本笔记的打赏二维码
    onClickShow() {
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
      console.log("我点击了第一个")
      const {school} = app.globalData
      const {noteDetail} = app.globalData
      let that = this
      const {avatarUrl} = app.globalData
       console.log(avatarUrl)
      that.setData({ 
        show: true,
        avatarIcon:avatarUrl,
        nickName:noteDetail.nickName,
        school:school,
        rewardImage: rewardPath,
        
      });
    },
// 点击隐藏
    onClickHide() {
      this.setData({
         show: false 
        });
    },
  onLoad: function (e) { 
    // 获取的从其父级页面传过来的属性值
    const {way} = e             //表示显示学科分类和知识点
    const {isShowBtn} = e       //显示按钮模块的属性
    const {isShowBtnOne} = e    //显示第一个按钮即编辑按钮的属性
    const {isShowBtnTwo} = e    //显示第二个按钮即显示进入个人主页的按钮
    const {isShowOptBar} = e    //显示底部对于笔记操作的区域
    const {noteDetail} = app.globalData    
    console.log(noteDetail)    
    this.setData({
      titleInfo: noteDetail.titleInfo,
      html: noteDetail.html,
      currTime: noteDetail.currTime,
      likeCount: noteDetail.likeCount,
      loveCount: noteDetail.loveCount,
      clickCount: noteDetail.clickCount,
      nickName:noteDetail.nickName,
      // 将从父级页面接收到的值传递给前端
      way:way,
      isShowBtn:isShowBtn,
      isShowBtnOne:isShowBtnOne,
      isShowBtnTwo:isShowBtnTwo,
      isShowOptBar
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
  },
  // 进入他人主页
  toHerPage(){
    wx.navigateTo({
      url: '../personalPage/personalPage',
    })
  }
 
})