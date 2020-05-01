const app = getApp()
const db = wx.cloud.database()
//引入登陆拦截器
let filter = require('../../utils/filter.js');
Page({   
  data: {    
    btnWord:"请上传收款二维码", //按钮文字
    choosePicture: ''  //被选中的照片路径
   },
  onLoad: function (options) {   
    var that = this
    wx.getSetting({
      success(res) {
        //若该用户已授权，获取其昵称和头像
        if(!res.authSetting['scope.userInfo']){
          //进行登录拦截
          const flag = filter.identityFilter()  
          if(flag){
            this.page = 0 
            this.getMyPostList(true)
          }
        }else{
          if(app.globalData.rewardPath != "" && app.globalData.rewardPath != null){
            that.setData({
              choosePicture:app.globalData.rewardPath,
              btnWord:"点击更换"
            })
          }
        }
      }
    })
  },
  chooseimage: function () {   
    var that = this;  
    wx.showActionSheet({     
      itemList: ['从相册中选择'],          
      success: function (res) {      
        if (!res.cancel) {      
          //相冊中选择 
          if (res.tapIndex == 0) {       
            that.chooseWxImage('album')      
          } 
        }     
      }    
    })     
  },     
  chooseWxImage: function (type) {   
    const that = this;   
    wx.chooseImage({
      count:1,     
      sizeType: ['compressed'],
      success: function (res) {
        // console.log(res)
        // console.log(res.tempFiles.size)
        //获取图片的本地临时路径
        const tempFilePaths = res.tempFilePaths[0]
        // 正则表达式，获取文件扩展名
        let suffix = /\.[^\.]+$/.exec(tempFilePaths)[0];
        const tempPath = tempFilePaths.split('.')
        //去掉斜杠
        var temp = tempPath[tempPath.length - 2].split('/')
        //去掉 ：
        temp = temp[0].split(':')
        // 云存储路径
        const cloudPath = 'rewardImg/could-img-' + new Date().getTime() + temp[0] + suffix
        wx.showLoading({
          title: '上传中',
        })
        //通过图片的临时图片地址获取图片文件的buffer
        wx.getFileSystemManager().readFile({
          filePath: tempFilePaths,
          success: buffer => {
            //调用云函数检查图片是否违规
            wx.cloud.callFunction({
              name: 'ContentCheck',
              data: {
                img: buffer.data
              },
              success(json) {
                //图片违规
                if (json.result.errCode != '0') {
                  wx.hideLoading()
                  //警告提醒
                  wx.showModal({
                    title: '警告',
                    content: '图片内容存在违规行为！',
                    showCancel: false,
                    success(res) {}
                  })
                  // console.log('图片违规')
                } else {
                  wx.hideLoading()
                  that.setData({
                    choosePicture:tempFilePaths,
                    btnWord:"点击更换"
                  })
                  //图片正常 上传并获取永久http链接
                  // console.log('图片正常')
                  //需要先上传了图片
                  wx.cloud.uploadFile({
                    cloudPath: cloudPath,
                    filePath: tempFilePaths
                  }).then(res => {
                    const fileID = res.fileID
                    app.globalData.rewardPath = fileID
                    db.collection('noteUser').doc(app.globalData.dataid).update({
                      data: {
                        //将路径更新到数据库
                        rewardPath: fileID
                      }
                    }).then(res => {
                      console.log(res)
                    })
                  }).catch(error => {
                    wx.hideLoading()
                    wx.showModal({
                      title: '提示',
                      content: '图片添加失败！请重新添加！',
                      showCancel: false,
                      success(res) {}
                    })
                  })
                }
              }
            })
          }
        })
      }
    })   
  }      
}) 