// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: cloud.DYNAMIC_CURRENT_ENV
  }
)
/**
 * 用户发帖内容和图片的审核
 * 用户评论的审核
 * msg: 文本内容
 * img：图片
 * fileId：传入图片的fileID
 */
exports.main = async (event, context) => {
  try{
    //定义临时变量保存检查返回的结果
    let msgR = false;
    let imgR = false;
    //检查图片内容是否违规
    if(event.img){      
      imgR = await cloud.openapi.security.imgSecCheck({
        media:{         
          header: {
            'Content-Type': 'application/octet-stream'
          },
          contentType: 'image/png',
          value: Buffer.from(event.img) 
        }
      })      
    }        
     //检查文本内容是否违规
     if(event.msg){
      msgR = await cloud.openapi.security.msgSecCheck({
        content: event.msg
      })      
    }    
    if(imgR != false) {
      return imgR
    }
    if(msgR != false){
      return msgR
    }
    // return {
    //   //如果一起返回msgR和imgR 则违规的返回值不一样 所以单个返回
    //   //因为违规返回的时候没有msgR 所以只返回errCode 方便判断
    //   // msgErrCode:msgR.errCode,
    //   // imgErrCode:imgR.errCode      
    //   msgR,
    //   imgR
    // }
  }catch(e){
    return e
  }

}