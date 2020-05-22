const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    // 笔记的具体内容
    notes: [],
    // 头像地址
    avatarImage:"https://ae01.alicdn.com/kf/Ha46df173a35b4abaa3bb4337635aaaf0U.jpg",
    // 正面卡片背景
    cardImageOne:"https://ae01.alicdn.com/kf/H85451709d9f9424190ecf5413e2461c5y.jpg",
    // 反面卡面背景
    cardImageTwo:"https://ae01.alicdn.com/kf/H9f4abbc48c384323b2c2f4cea7c1965cV.jpg",
    // 初始化时的动画效果
    animationMain:null,//正面动画效果
    animationBack:null,//背面动画效果

    nickName:"",
    identity:"",
    signature:"",
    school:"",
    email:"",
    publicCount:0,
    fontSizeOne:"1rem",
    fontSizeTwo:"1rem",
    notesBg: "https://ae01.alicdn.com/kf/H1589786633d14bdf877d9e6dab638e07F.jpg",
    subjectIcon: "https://shop.io.mi-img.com/app/shop/img?id=shop_630ab46718aaa0ea9632121d43defb39.png",

    // 点击量的小图标
    clickIcon:"https://ae01.alicdn.com/kf/Hd94f5569fff84b66b8f40302e4eda686q.jpg",
      // 收藏笔记的小图标
     collectIcon:"https://ae01.alicdn.com/kf/H2fe8478b707b481fba2418bf5b1c93b4j.jpg",
     // 学科分类的小图标
     subjectIcon: "https://ae01.alicdn.com/kf/H370e207e4e30404991c37f773471a29e8.jpg",

  },
  // 点击触发的效果
  rotateOption(e) {
    // 获取当前点击的卡片的id
   var id = e.currentTarget.dataset.id
  //  创建动画对象翻转动画对象
   this.animation_main = wx.createAnimation({
     duration:400,
     timingFunction:'linear'
    })
    // 创建返回动画对象
    this.animation_back = wx.createAnimation({
     duration:400,
     timingFunction:'linear'
    })

   // 点击正面 根据id来判断是那一张卡片  1 表示正面的卡片  2 表示反面的卡片
 
   if (id == 1) {
     console.log("点击正面")
    
    this.animation_main.opacity(0).step().rotateY(180).step()
    this.animation_back.opacity(0).step().rotateY(0).step().opacity(0.5).step().opacity(1).step()
    this.setData({
     animationMain: this.animation_main.export(),
     animationBack: this.animation_back.export(),
    })
   }
   // 点击背面翻转成正面
   else{
    console.log("点击背面")
    this.animation_main.opacity(0).step().rotateY(0).step().opacity(0.5).step().opacity(1).step()
    this.animation_back.opacity(0).step().rotateY(-180).step()
    this.setData({
     animationMain: this.animation_main.export(),
     animationBack: this.animation_back.export(),
    })
   }
  },


  // 在onshow方法中设置文字的大小随字数的多小而改变
  onShow:function(){
      var that = this
      const {noteDetail} = app.globalData 
      //获取当前用户所有信息
      var opid = noteDetail._openid
      //通过openid获取
      wx.cloud.callFunction({
        name:'getUserByOne',
        data:{
          opid:opid
        }
      }).then(res => {
        var temp = res.result.data[0]
        //给个人主页信息赋值
        that.setData({
          avatarImage:temp.avatarUrl,
          // nickName:"A0001会产生大13264677020",
          nickName:temp.nickName,
          signature:temp.signature,
          school:temp.school,
          identity:temp.identity,
          email:temp.email
        })
        // 微信能设置的最长名字 是 中文16位 英文32位,也就是说最大长度支持32个字节
        // let len = that.data.nickName.length;
        // 先计算字节大小
        var str = new String(that.data.nickName);  
        var bytesCount = 0;  
        for (var i = 0 ,n = str.length; i < n; i++) {  
            var c = str.charCodeAt(i);  
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
                bytesCount += 1;  
            } else {  
                bytesCount += 2;  
            }  
        }  
        console.log(bytesCount)
        // 再计算字体大小
        var fontSizeOne = bytesCount > 14 ? 1.8 * 6.8 / bytesCount + 'rem' : '1.7rem';
        var fontSizeTwo = bytesCount > 4 ? 3.0 * 5.0 / bytesCount + 'rem' : '3.0rem';
        that.setData({
          fontSizeOne : fontSizeOne,
          fontSizeTwo : fontSizeTwo
        })
      })
      //获取当前用户所有公开笔记
      wx.cloud.callFunction({
        name:'getNotesByOpid',
        data:{
          opid:opid
        }
      }).then(res => {
        that.setData({
          notes:res.result.data,
          publicCount:res.result.data.length
        })
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
      url: '../noteDetail/noteDetail?way=1&isShowOptBar=true',
    })
  },
 })
