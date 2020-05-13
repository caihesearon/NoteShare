// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init( {
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
// 获取所有笔记的关键字 用于搜索
exports.main = async (event, context) => {  
  return await db.collection('userNotes')
  .field({
    titleInfo: true    
  }).get()
}