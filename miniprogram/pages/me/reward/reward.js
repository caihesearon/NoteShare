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
    const {rewardPath,dataid} = app.globalData  
    console.log(rewardPath)
   if(that.data.choosePicture != ''){ 
     //第一步：将数据库中的路径置空
    db.collection('noteUser').doc(dataid).update({
      data:{
        rewardPath: ''
      }
    }).then(res=>{
      wx.showToast({
        title: '移除成功',
        icon:'success'
      })
      that.setData({
        choosePicture: '',
      })
      // 将用户缓存中的打赏码路径删除掉 防止用户没有刷新而会继续加载之前缓存中的二维码
      app.globalData.rewardPath = ""
      //第二步：根据fileId删除云存储中的图片
      wx.cloud.deleteFile({
        fileList: [rewardPath]
      })
    })   
    }
  },
  // 选择要上传的打赏码
  chooseimage: function () {   
    var that = this;  
    //如果有打赏就先删除后再上传
    if(that.data.choosePicture != ''){
      //第二步：根据fileId删除云存储中的图片
      wx.cloud.deleteFile({
        fileList: [that.data.choosePicture]
      })
    }
   
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
            wx.hideLoading()
            that.setData({
              choosePicture:tempFilePaths,
              btnWord:"点击更换"
            })
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
      },fail(err){
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '图片添加失败！请重新添加！',
          showCancel: false,
          success(res) {}
        })
      }
    })   
  }      
}) 