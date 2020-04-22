Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始笔记...',
    editorHeight: 300,
    // keyboardHeight: 0,
    // isIOS: false,
    scrollTop:0,//保存屏幕向上移动的距离  计算标题是否隐藏和按钮是否固定到顶部
    standTop:0,//设置一个标准 屏幕向上滑动多少后改变编辑按钮和编辑框的样式
    isFix:false,
    phoneHeight: 0,//手机屏幕高度
    hideBars:{  //是否显示和隐藏多个按钮
      textbar:true,
      linebar:true,
    }
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    })
  },
  onLoad() {
    // const platform = wx.getSystemInfoSync().platform
    // const isIOS = platform === 'ios'
    // this.setData({ isIOS})
    // const that = this
    // this.updatePosition(0)
    // let keyboardHeight = 0
    // wx.onKeyboardHeightChange(res => {
    //   if (res.height === keyboardHeight) return
    //   const duration = res.height > 0 ? res.duration * 1000 : 0
    //   keyboardHeight = res.height
    //   setTimeout(() => {
    //     wx.pageScrollTo({
    //       scrollTop: 0,
    //       success() {
    //         that.updatePosition(keyboardHeight)
    //         that.editorCtx.scrollIntoView()
    //       }
    //     })
    //   }, duration)

    // })
    const { windowHeight,windowWidth } = wx.getSystemInfoSync()
    //计算出手机屏幕的高度
    const phoneHeight = 750 * windowHeight/windowWidth;
    this.setData({
      phoneHeight:phoneHeight
    })
    
  },
  //监听页面滚动
  onPageScroll:function(e){
    // console.log(e.scrollTop)
    if(e.scrollTop > this.data.standTop){
      this.setData({
        isFix: true
      })
    }else{
      this.setData({
        isFix: false
      })
    }    
  },
  //编辑区聚焦时 隐藏顶部编辑区
  onEditorFocus:function(){
    this.setData({
      isFix: true
    })
  },//失去焦点时 显示顶部编辑区
  onEditorBlur:function(){
    this.setData({
      isFix: false
    })
  },//图片转文字
  picToText:function(){
    wx.chooseImage({
      complete: (res) => {},
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const { statusBarHeight, platform } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let { name, value } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {    
    const formats = e.detail    
    this.setData({ formats })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        that.editorCtx.insertImage({
          src: res.tempFilePaths[0],
          // data: {
          //   id: 'abcd',
          //   role: 'god'
          // },
          width: '100%',
          success: function () {
            console.log('insert image success')
          }
        })
      }
    })
  },
  showbar:function(event){
    const that = this;
    var name = event.target.dataset.name
    var hidebars = this.data.hideBars
    console.log(hidebars)
    for(var bars in hidebars){
      if(bars != name){
        hidebars[bars]=true;
      }
    }
    hidebars[name] = !hidebars[name]
    this.setData({
      hideBars:hidebars
    })
  }, 
  changeContent:function(e){
    file.content = e.detail.delta
    console.log(file)
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        // console.log("insert divider success");
      }
    });
  },
})
