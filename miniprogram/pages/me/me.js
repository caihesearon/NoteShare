const db = wx.cloud.database()
const app = getApp()
Page({
  data: {
    // avatarUrl:"https://ae01.alicdn.com/kf/Hc0cdd9585b754635a427ed0cc0d8464bh.jpg",//用户头像
    avatarUrl:"https://ae01.alicdn.com/kf/H42b44bc5b78645e2a6e967c830d80a7cA.jpg",
    nickName:'',//用户昵称
    isShow: true, //判断授权按钮是否显示
    noteCount:0, //笔记数量
    openCount: 0,//公开数量
    loveCount:0, //收藏数量
    iconOne:"https://ae01.alicdn.com/kf/H9a673d4d3eac4ca9b9e647f0d5d1e488S.jpg",
    iconTwo:"https://ae01.alicdn.com/kf/H5d13394f2db24ecab7bda0f5b6f19228p.jpg",
    iconThree:"https://ae01.alicdn.com/kf/H7dbdb6d073cd41af899910d435a92c30f.jpg",
    iconFour:"https://ae01.alicdn.com/kf/H3e79694f985b405dae62e5905e5f9f6eT.jpg",
    iconFive:"https://ae01.alicdn.com/kf/H2c80a515e25f4c5c8e36a76af9939015L.jpg",
    show:false,    //是否展示遮罩层
    showOneBox:true,  //第一张图片的展示属性
    showTwoBox:false,  //第二张图片的展示属性
    showThreeBox:false, //第三张图片的展示属性
    showFourBox:false,  //第四张图片的展示属性
    clickCount:1,       //点击遮罩层的次数
    // 5张图片的地址
    p1:"https://ae01.alicdn.com/kf/H958d3a3308874fe8bd1b7a0529403a994.jpg",     
    p2:"https://ae01.alicdn.com/kf/H258ae643141641a9b5a8e5780d0c2c24W.jpg",
    p3:"https://ae01.alicdn.com/kf/H08d44ac8358040a6b56de025329cf3677.jpg",
    p4:"https://ae01.alicdn.com/kf/H3e7ccf3db5ca41c2b2a689b278c52ba8a.jpg",
    p5:"https://ae01.alicdn.com/kf/H4d602350f1a04676bd287deff5be2696y.jpg",
  },
  // 遮罩层单击事件
  onClickShow() {
    const that = this
    const count = that.data.clickCount
    //通过count的数值来判断用户点击蔗渣层的次数
   if(count == 1){
    that.setData({ 
      showOneBox: false,
      showTwoBox: true,
      showThreeBox: false, 
      showFourBox:false,
      clickCount:2
    });
   }
   if(count == 2){
    that.setData({ 
      showOneBox: false,
      showTwoBox: false,
      showThreeBox: true, 
      showFourBox:false,
      clickCount:3
    });
   }
   if(count == 3){
    that.setData({ 
      showOneBox: false,
      showTwoBox: false,
      showThreeBox: false, 
      showFourBox: true,
      clickCount:4
    });
   }
   if(count == 4){
    that.setData({ 
      show:false,
      clickCount:1
    });
   }
   //设置为true 表明已经引导过了 不需要再引导了
   wx.setStorageSync('GuideStatus', true);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      show: app.globalData.show
    })
    var that = this
    wx.getSetting({
      success(res) {
        //若该用户已授权，获取其昵称和头像
        if(res.authSetting['scope.userInfo']){          
          that.setData({
            isShow: false            
          })
          that.getData()    
          that.getNoteCount()
        }
      }
    })
  },
  //获取头像和昵称 和 笔记数量
  getData(){
    var that = this
    wx.getUserInfo({
      success:function(res){
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName:res.userInfo.nickName,                
        })
      }
    })   
  },
  //获取用户的笔记数量
  getNoteCount(){
    const that = this
    db.collection('userNotes').count().then(res=>{      
      that.setData({
        noteCount: res.total
      })
    })
    db.collection('userNotes')
    .where({
      isOpen: true
    }).count().then(res=>{      
      that.setData({
        openCount: res.total
      })
    })
    db.collection('userLoveNote').count().then(res=>{      
      that.setData({
        loveCount: res.total
      })
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
        that.getNoteCount()
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
  },
  onPullDownRefresh(){
    this.getNoteCount()
  }
})