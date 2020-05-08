const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
const _ = db.command

//所有 根据关键字  进行访问量、点赞量和收藏量的排序
exports.main = async (event, context) => {
  const {
    key,
    countType
  } = event
  const noteTitle = `titleInfo.noteTitle`
  const pointA = `titleInfo.pointA`
  const pointB = `titleInfo.pointB`
  return await db.collection('userNotes')
    .where(_.or([{
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
    .orderBy(countType, "desc")
    .get()

}