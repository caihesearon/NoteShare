
const cloud = require('wx-server-sdk')

cloud.init( {
  env: 'cloud-test-tnjps'
})
const db = cloud.database()

/**
 * 根据openId获取用户信息
 */
exports.main = async (event, context) => {
  const {_openid} = event
  return await db.collection('noteUser').where({
    _openid: _openid
  }).get()
  
}