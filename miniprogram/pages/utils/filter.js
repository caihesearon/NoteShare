/**
 * 登录拦截器
 * @param {*} pageObj 
 */
function identityFilter(status) {    
    wx.showModal({
      title: '登录提示',
      content: '您需要登录后才能体验全部功能!',
      cancelText: '暂不登录',
      confirmText: '立即登录',
      success(res) {
        if (res.confirm) {
          //跳转到登陆页 
          wx.switchTab({
            url: '/pages/me/me'
          })
        } else if (res.cancel) {
          if(status == 0){
            //如果status=0则在创建页面 不做任何操作   
          }else{
            //返回
            wx.navigateBack({            
              delta: 1
            })
          }         
        }
      }
    })
}
/**
 * 登录检查拦截
 * status 判断从哪个页面进去
 * 0 -- 创建页面
 * 
 */
function loginCheck(status){
  return new Promise(resolve=>{
    wx.getSetting({
      success(res){      
        //没有登录则提醒        
        if(!res.authSetting['scope.userInfo']){               
          identityFilter(status)      
          return resolve(false);
        }else{
          return resolve(true);
        }
      }
    })
  })  
}
function checkGuide(){
  const value = wx.getStorageSync("GuideStatus")      
  //如果已经引导过了
  if(value){    
    return false
  }else{    
    //没有引导 并且在最后一步设置为false
    return true
  }
}

exports.identityFilter = identityFilter;
exports.loginCheck = loginCheck;
exports.checkGuide = checkGuide;