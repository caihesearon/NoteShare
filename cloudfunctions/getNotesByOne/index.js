// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    condition
  } = event
  if (condition == '推荐') {
    return await db.collection('userNotes')
      .aggregate()
      .match(_.and({
        isOpen: true
      }))
      .addFields({
        recommend: $.add([$.multiply(['$loveCount', 10]), $.multiply(['$likeCount', 5]), '$clickCount'])
      })
      .sort({
        recommend: -1,
        createTime: -1
      })
      .end()
  } else {
    return await db.collection('userNotes').where({
      noteCategory: condition,
      isOpen: true
    }).orderBy('createTime', 'desc').get()
  }

}