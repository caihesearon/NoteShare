// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: 'cloud-test-tnjps'
  }
)

//实现根据图片的fileId对图片进行审核
exports.main = async (event, context) => {
  const {fileID} = event
  //通过fileID获取buffer流
  const res = await cloud.downloadFile({
    fileID: fileID
  })
  const buffer = res.fileContent
  try{
    var result = await cloud.openapi.security.imgSecCheck({
      media:{
        header: {
          'Content-Type': 'application/octet-stream'
        },
        contentType: 'image/png',
        value: buffer
      }
    })
    console.log(result)
    //审核不通过会直接抛异常 所以不用判断errCode
    //审核通过 根据fileID获取永久https链接并返回
    const https = await cloud.getTempFileURL({
      fileList: [fileID]
    })    
    return https.fileList[0].tempFileURL    
  }catch(err){ 
    await cloud.deleteFile({
      fileList: [fileID]
    })
    return ''
  }

}