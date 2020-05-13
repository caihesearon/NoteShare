// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env: 'cloud-test-tnjps'
  }
)

// 云函数入口函数
exports.main = async (event, context) => {
  const {opid} = event
  const db = cloud.database()
  return await db.collection('noteUser').where({
    _openid:opid
  }).get()
}