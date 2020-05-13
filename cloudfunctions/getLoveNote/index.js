const cloud = require('wx-server-sdk')

cloud.init( {
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
/**
 * 根据传入的noteId数组获取用户收藏的笔记
 * 返回数组对象
 */
exports.main = async (event, context) => {
  let {loveNoteArr} = event  
  for(let i = 0; i < loveNoteArr.length; i++){
    //获取收藏的笔记ID
    let noteId = loveNoteArr[i].noteId
    loveNoteArr[i] = (await db.collection('userNotes').doc(noteId).get()).data
  }
  return loveNoteArr
}