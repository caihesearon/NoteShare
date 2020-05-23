import Toast from '@vant/weapp/toast/toast';
let filter = require('../utils/filter.js');
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    formats: {},
    html: '', //保存笔记的html内容
    placeholder: '开始笔记...',
    editorHeight: 300,
    scrollTop: 0, //保存屏幕向上移动的距离  计算标题是否隐藏和按钮是否固定到顶部
    standTop: 0, //设置一个标准 屏幕向上滑动多少后改变编辑按钮和编辑框的样式
    isFix: false,
    phoneHeight: 0, //手机屏幕高度
    hideBars: { //是否显示和隐藏多个按钮
      textbar: true,
      linebar: true,
    },
    titleInfo: { //文章头部内容
      noteTitle: '',
      pointA: '',
      pointB: ''
    },
    isEditor: false, // 是否从个人笔记详情页面过来
  },
  onLoad(e) {    
    //登录拦截检查
    filter.loginCheck(0)
    const {
      windowHeight,
      windowWidth
    } = wx.getSystemInfoSync()
    //计算出手机屏幕的高度
    const phoneHeight = 750 * windowHeight / windowWidth;
    this.setData({
      phoneHeight: phoneHeight
    })
    const {editor} = e
    //如果是从个人详情页面进来的
    if(editor == "true"){            
      const {html, titleInfo} = app.globalData.noteDetail
      console.log(app.globalData.noteDetail)
      this.setData({
        titleInfo: titleInfo,
        html: html,
        isEditor: true
      })
      this.onEditorReady(html)
    }else{      
       //用于用户退出后再进来还有之前编辑的内容
      if (app.globalData.noteInfo.titleInfo != null || app.globalData.noteInfo.html != '') {        
        this.setData({
          titleInfo: app.globalData.noteInfo.titleInfo,
          html: app.globalData.noteInfo.html
        })
        this.onEditorReady(app.globalData.noteInfo.html)
      }else{        
        const noteInfo = {
          titleInfo:null,
          html:''
        }
        app.globalData.noteInfo = noteInfo
        // console.log(app.globalData.noteInfo)
      }
    }
   
  },
  //监听页面滚动
  onPageScroll: function (e) {
    // console.log(e.scrollTop)
    if (e.scrollTop > this.data.standTop) {
      this.setData({
        isFix: true
      })
    } else {
      this.setData({
        isFix: false
      })
    }
  },
  //编辑区聚焦时 隐藏顶部编辑区
  onEditorFocus: function () {
    this.setData({
      isFix: true
    })
  }, //失去焦点时 显示顶部编辑区
  onEditorBlur: function () {
    this.setData({
      isFix: false
    })
  }, //图片转文字
  picToText: function () {
    //在图片转文字之前需要先获取已编辑了的内容
    var that = this
    let {
      html
    } = this.data;
    // that.editorCtx.getContents({
    // success: function (res) {
    // html = res.html
    console.log(html)
    //调用图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths[0]
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths,
          encoding: 'base64',
          success: function (res) {
            that.getImgInfo(res.data, html)
          },
        })
      }
    })
    // }
    // })
  }, //根据图片的内容调用API获取图片文字
  getImgInfo: function (imageData, html) {
    wx.showLoading({
      title: '识别中...',
    })
    var that = this
    that.getBaiduToken().then(res => {
      console.log(res)
      //获取token
      const token = res.data.access_token
      console.log(token)
      const detectUrl = `https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=${token}` // baiduToken是已经获取的access_Token      
      wx.request({
        url: detectUrl,
        data: {
          image: imageData
        },
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 必须的        
        },
        success: function (res, resolve) {
          //将 res.data.words_result数组中的内容加入html标签中
          for (var i in res.data.words_result) {
            //获取所有转换的文字
            const val = res.data.words_result[i].words
            //拼接到html中并设置给富文本
            html += val + "<br>"
          }
          that.editorCtx.setContents({
            html: html
          })
          that.setData({
            html: html
          })
          console.log('识别后： ' + html)
          wx.hideLoading()
        },
        fail: function (res, reject) {
          console.log('get word fail：', res.data);
          wx.hideLoading()
        },
        complete: function () {
          wx.hideLoading()
        }

      })

    })
  }, //进入预览页面
  previewNote: function (e) {    

    filter.loginCheck(0).then(res=>{
      console.log(res)
      if(res){
        const that = this
    // 1、获取头部的标题信息
    const {
      value
    } = e.detail //this.data.titleInfo        
    if (value.noteTitle == '') {
      Toast('笔记标题不可以为空哦~~')
      return
    }
    //2、获取编辑器的内容
    this.editorCtx.getContents({
      success: (res) => {
        console.log(res)
        if (res.html == '<p><br></p>') {
          Toast('为笔记添加一点内容再看看吧~~')
          return
        }
        wx.showLoading({
          title: '内容审核中',
        })
        //拼接所有的内容
        let content = value.noteTitle + ' ' + value.pointA + ' ' + value.pointB + ' ' + res.html
        //对内容和标题进行内容审核
        wx.cloud.callFunction({
          name: 'ContentCheck',
          data: {
            msg: content
          }
        }).then(ress => {
          wx.hideLoading()
          //内容违规          
          if (ress.result.errCode != 0) {
            //警告提醒
            wx.showModal({
              title: '警告',
              content: '笔记内容存在违规行为！',
              showCancel: false,
            })
            return
          } else {          
            if(that.data.isEditor){
              console.log('保存修改')
              console.log(value)
              console.log(res.html)
              //修改数据库中的数据后 还需要修改本地app中的数据
              const {_id} = app.globalData.noteDetail
              console.log(_id)
              db.collection('userNotes')
                .where({
                  _id: _id
                })
                .update({
                  data:{
                    titleInfo: value,
                    html: res.html
                  }
                })
              app.globalData.notesFlag = false               
              //返回到首页
              wx.switchTab({
                url: '/pages/homePage/homePage',
              })
            }else{
              //将内容临时保存在app的全局变量中
              app.globalData.titleInfo = value;
              app.globalData.html = res.html
              wx.navigateTo({
                url: 'previewNote/previewNote?way=2'
              })
            }          
          }
        })
      },
      fail: (res) => {        
        console.log("fail：", res);
      }
    });
      }
    })        
  },

  onEditorReady(html) {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
      res.context.setContents({ //用于初始化富文本的内容 日后的编辑中可以使用
        html: html
      })
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)
  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
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
  }, //笔记中插入图片并上传 还有获取永久http地址
  insertImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        if (res.tempFiles[0] && res.tempFiles[0].size > 1024 * 1024) {
          wx.showToast({
            title: '图片不能大于1M',
            icon: 'none'
          })
          return;
        }
        // console.log(res)
        // console.log(res.tempFiles.size)
        //获取图片的本地临时路径
        const tempFilePaths = res.tempFilePaths[0]
        console.log('tempFilePaths临时路径： ' + tempFilePaths)
        // 正则表达式，获取文件扩展名
        let suffix = /\.[^\.]+$/.exec(tempFilePaths)[0];
        const tempPath = tempFilePaths.split('.')
        //去掉斜杠
        var temp = tempPath[tempPath.length - 2].split('/')
        //去掉 ：
        temp = temp[0].split(':')
        // 云存储路径
        const cloudPath = 'noteImg/could-img-' + new Date().getTime() + temp[0] + suffix
        console.log('cloudPath云路径: ' + cloudPath)
        wx.showLoading({
          title: '上传中',
        })
        //方案----------
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePaths,
          success(res) {            
            wx.hideLoading()
            console.log("上传成功： ")
            console.log(res)
            //获取fileID
            const fileID = res.fileID
            //上传成功 并根据fileID调用云函数审核图片
            wx.showLoading({
              title: '图片审核中',
            })
            wx.cloud.callFunction({
              name: 'imgCheck',
              data:{
                fileID: fileID
              },
              success(res){
                console.log('云函数调用成功！！')
                console.log(res)
                //审核不通过
                if(res.result == ""){
                  //警告提醒
                  wx.showModal({
                    title: '警告',
                    content: '图片内容存在违规行为！',
                    showCancel: false,
                    success(res) {}
                  })
                }else{
                  //设置富文本内容
                  that.editorCtx.insertImage({
                    src: res.result,
                    width: '100%',
                    success: function () {                      
                    }
                  })
                }
              },
              fail(err){
                wx.showToast({
                  title: '识别出了点小问题',
                  icon: 'none'
                })
              },
              complete(com){
                wx.hideLoading()
              }
            })
          },
          fail(err) {
            console.log('fail上传失败：  ' + err)
            wx.hideLoading()
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            })
          }
        })               
      }
    })
  },
  showbar: function (event) {
    const that = this;
    var name = event.target.dataset.name
    var hidebars = this.data.hideBars
    console.log(hidebars)
    for (var bars in hidebars) {
      if (bars != name) {
        hidebars[bars] = true;
      }
    }
    hidebars[name] = !hidebars[name]
    this.setData({
      hideBars: hidebars
    })
  },
  changeContent: function (e) {
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
  // 获取百度access_token  
  getBaiduToken: function () {
    return new Promise(resolve => {
      var apiKey = "AqLqM3WcMooRaIS4UuczX94h"
      var secKey = "afsKVYsLdrgpiMwyprLDTurX5x7BvrMk"
      var tokenUrl = `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${apiKey}&client_secret=${secKey}`
      var that = this;
      wx.request({
        url: tokenUrl,
        method: 'POST',
        dataType: 'json',
        header: {
          'content-type': 'application/json; charset-UTF-8'
        },
        success: function (res) {
          console.log("[BaiduToken获取成功]", res);
          return resolve(res)
          // that.setData({                
          // 	baiduToken: res.data.access_token            				})        
        },
        fail: function (res) {
          console.log("[BaiduToken获取失败]", res);
          return resolve(res)
        }
      })
    })
  },
  onContentChange: function (e) {
    const {
      html
    } = e.detail
    this.setData({
      html: html
    })
    if(!this.data.isEditor){
      app.globalData.noteInfo.html = html
    }
  },
  //页面卸载 用于获取用户是否保存编辑内容的临时内容
  onUnload: function (e) {  
    if(this.data.isEditor){
      return
    }
    const {
      titleInfo,
      html
    } = this.data    
    // console.log('卸载操作')
    if ((html == '<p><br></p>'&& titleInfo.noteTitle == '') || (html == '' && titleInfo.noteTitle == '')||(app.globalData.noteInfo.titleInfo == null && app.globalData.noteInfo.html == '')) {      
      return
    }
    wx.showModal({
      title: '提示',
      content: '需要保存已编辑的笔记吗？',
      confirmText: '保留下来',
      confirmColor: '#696969',
      cancelText: '狠心舍弃',
      cancelColor: '#DC143C',
      success(res) {
        if (res.confirm) {         
          const noteInfo = {
            titleInfo: titleInfo,
            html: html
          }
          app.globalData.noteInfo = noteInfo
          // console.log('保留操作')
          // console.log(app.globalData.noteInfo)
        } else {          
          app.globalData.noteInfo.titleInfo = null
          app.globalData.noteInfo.html = ''
        }
      }
    })
  },
  getNoteTitle: function (e) {
    const flag = this.data.isEditor
    if(!flag){
      this.setData({
        ['titleInfo.noteTitle']: e.detail.value
      })   
      if(app.globalData.noteInfo.titleInfo == null){
        app.globalData.noteInfo.titleInfo={}
      }
      app.globalData.noteInfo.titleInfo.noteTitle=e.detail.value
    }

    
  },
  getPointA: function (e) {
    const flag = this.data.isEditor
    if(!flag){
      this.setData({
        ['titleInfo.pointA']: e.detail.value
      })   
      if(app.globalData.noteInfo.titleInfo == null){
        app.globalData.noteInfo.titleInfo={}
      }
      app.globalData.noteInfo.titleInfo.pointA = e.detail.value
    }   
  },
  getPointB: function (e) {
    const flag = this.data.isEditor
    if(!flag){
      this.setData({
        ['titleInfo.pointB']: e.detail.value
      })
      if(app.globalData.noteInfo.titleInfo == null){
        app.globalData.noteInfo.titleInfo={}
      }
      app.globalData.noteInfo.titleInfo.pointB = e.detail.value
    }   
  }
})