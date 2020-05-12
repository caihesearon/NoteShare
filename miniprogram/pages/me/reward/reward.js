const app = getApp()
const db = wx.cloud.database()
//引入登陆拦截器
let filter = require('../../utils/filter.js');
Page({   
  data: {    
    btnWord:"请上传收款二维码", //按钮文字
    choosePicture: '',  //被选中的照片路径
    addQRcodeIcon:"https://ae01.alicdn.com/kf/Hd5b243a1a2e24929918df0f348f849c90.jpg",
    fixQRcodeIcon:"https://ae01.alicdn.com/kf/H73ba63bdef954032ba4aca120643a44cA.jpg",
    removeQRcodeIcon:"https://ae01.alicdn.com/kf/Hb452c9b598a04b72b537b2f652b0aa53i.jpg",
   },
  onLoad: function (options) {   
    var that = this
    wx.getSetting({
      success(res) {
        //若该用户已授权，获取其昵称和头像
        if(!res.authSetting['scope.userInfo']){
          //进行登录拦截
          const flag = filter.identityFilter()            
        }else{
          if(app.globalData.rewardPath != "" && app.globalData.rewardPath != null){
            console.log("我进来了")
            that.setData({
              choosePicture:app.globalData.rewardPath,
              btnWord:"点击更换"
            })
          }
        }
      }
    })
  },
  // 移除二维码
  removeinage:function(){
    const that = this
    const choosePicture = that.data.choosePicture
    // 直接获取用户在授权时 存在app中的数据，然后在云数据库中进行置空操作
    const {rewardPath} = app.globalData  
   if(that.data.choosePicture != ''){ 
    //  因为一般用户无法直接修改云数据库  所以需要用云函数来操作
    wx.cloud.callFunction({
      name:'updataRewardPath',
      data:{
        docid:app.globalData.dataid,
        path:""
      },success:function(res){
        wx.showToast({
          title: '移除成功',
          icon:'success'
        })
        that.setData({
          choosePicture:"",
        })
        // 将用户缓存中的打赏码路径删除掉 防止用户没有刷新而会继续加载之前缓存中的二维码
        app.globalData.rewardPath = ""
        console.log(res)
      },fail:function(res){
        console.log(res)
      }
    })
  //   db.collection('noteUser').doc(rewardPath).update({
  //     data: {
  //       rewardPath : ""
  //     },
  //     success: res => {
  //       wx.showToast({
  //         title: '移除成功',
  //         icon:'success'
  //       })
  //       that.setData({
  //         choosePicture: '',
  //       })
  //     },
  //     fail: err => {
  //       icon: 'fail',
  //       console.error('[数据库] [更新记录] 失败：', err)
  //     }
  //   })
  // } else {
  //   wx.showToast({
  //     title: '没有可以删除的打赏码！',
  //   })
  }
  },
  // 选择要上传的打赏码
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