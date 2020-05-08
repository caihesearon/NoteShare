const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
const _ = db.command
const $ = db.command.aggregate
// 根据左下拉框和输入框的关键字来对笔记进行排序输出
exports.main = async (event, context) => {
  //key 输入框关键字  sortType 排序规则--》1-》推荐 2-》最新
  const {
    key,
    sortType
  } = event
  const noteTitle = `titleInfo.noteTitle`
  const pointA = `titleInfo.pointA`
  const pointB = `titleInfo.pointB`
  if (sortType == 1) {
    return await db.collection('userNotes')
      .aggregate()
      .match(_.or([{
          noteCategory: db.RegExp({
            regexp: ".*" + key,
            options: 'i'
          })
        },
        {
          [noteTitle]: db.RegExp({
            regexp: ".*" + key,
            options: 'i'
          })
        },
        {
          [pointA]: db.RegExp({
            regexp: ".*" + key,
            options: 'i'
          })
        }, {
          [pointB]: db.RegExp({
            regexp: ".*" + key,
            options: 'i'
          })
        }
      ]).and({
        isOpen: true
      }))
      .addFields({
        recommend:$.add(['$clickCount','$likeCount','$loveCount'])
      })
      .sort({
        recommend:-1
      })
      .end()
  } else {
    return await db.collection('userNotes')
  }
}