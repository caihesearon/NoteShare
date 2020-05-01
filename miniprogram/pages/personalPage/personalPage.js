Page({
  data: {
    // 笔记的具体内容
    notes: [{
      id: 1,                                   //卡片的编号  以及热度的排行
      clickNum:1000,                            //点击量   
      collectNum:10000,                           //收藏量
      content: "Harbor is a pig, big pig!",   //知识标题的    
      subject: "计算机",                       //笔记的分类属性
      knowledgePointOne: "我只有一点点的笔记",                  //知识点1
      knowledgePointTwo: "链表链表链表链链表链表链表链表表",            //知识点2
    },
      {
        id: 2,
        clickNum:2233,
        collectNum:0, 
        content: "我只有一点点的笔记",
        subject: "计算机",
        knowledgePointOne: "数组",
        knowledgePointTwo: "面对对象",
      },
      {
        id: 3,
        clickNum:123,
        collectNum:2342, 
        content: "我差不多有那麽一点的笔记，但是我的笔记并不是很多是，所以呢我还是只有一点点笔记",
        subject: "计算机",
        knowledgePointTwo: "数组",
      },
      {
        id: 4,
        clickNum:23,
        collectNum:234, 
        content: "optionPublic is one big",
        subject: "计算机",
        knowledgePointOne: "数组",
        knowledgePointTwo: "作用域作用域",
      },
      {
        id: 5,
        clickNum:23,
        collectNum:234, 
        content: "我只有一点点的笔记",
        subject: "计算机",
        knowledgePointOne: "数组",
      },
      {
        id: 6,
        clickNum:23,
        collectNum:10987000, 
        content: "我差不多有那麽一点的笔记，但是我的笔记并不是很多是，所以呢我还是只有一点点笔记",
        subject: "计算机计算机",
        knowledgePointOne: "数组",
      }

    ],
    // 头像地址
    avatarImage:"https://ae01.alicdn.com/kf/Ha46df173a35b4abaa3bb4337635aaaf0U.jpg",
    // 正面卡片背景
    cardImageOne:"https://ae01.alicdn.com/kf/H85451709d9f9424190ecf5413e2461c5y.jpg",
    // 反面卡面背景
    cardImageTwo:"https://ae01.alicdn.com/kf/H9f4abbc48c384323b2c2f4cea7c1965cV.jpg",
    // 初始化时的动画效果
    animationMain:null,//正面动画效果
    animationBack:null,//背面动画效果
    
    nickName:"Harbor",
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
      console.log(this.data.nickName.length)
      let len = this.data.nickName.length;
      var fontSizeOne = len > 7 ? 1.8 * 6.8 / len + 'rem' : '1.7rem';
      var fontSizeTwo = len > 2 ? 2.5 * 3 / len + 'rem' : '2.5rem';
      this.setData({
        fontSizeOne : fontSizeOne,
        fontSizeTwo : fontSizeTwo
      })
  },
 })
