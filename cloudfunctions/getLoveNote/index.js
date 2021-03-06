const cloud = require('wx-server-sdk')

cloud.init( {
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
/**
 * 根据传入的noteId数组获取用户收藏的笔记
 * 返回数组对象
 * 
 */
exports.main = async (event, context) => {
  
  let {loveNoteArr} = event    
  let resArr = []
  let len = 0;  
  for(let i = 0; i < loveNoteArr.length; i++){
    //获取收藏的笔记ID
    let noteId = loveNoteArr[i].noteId
    try {
      resArr[len]= (await db.collection('userNotes').doc(noteId).get()).data
    } catch (error) {
      //发生错误后立即删除所有人收藏这个笔记的记录
      await db.collection('userLoveNote').where({
        noteId: noteId
      }).remove()      
      continue
    }
    len = len+1    
  }
  return resArr
}