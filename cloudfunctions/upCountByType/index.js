const cloud = require('wx-server-sdk')
cloud.init({
  env: 'cloud-test-tnjps'
})
const db = cloud.database()
const _ = db.command
/**
 * 对笔记进行点击量的加一 addClick
 * 对笔记进行点赞量的加一和减一 addLike subLike
 * 对笔记进行收藏量的加一和减一 addLove subLove
 */
exports.main = async (event, context) => {
  const {type,_id,count} = event

  if(type == 'addClick'){
    //对笔记点击量加一
    return await db.collection('userNotes').doc(_id).update({
      data:{
        clickCount: _.inc(1)
      }
    })
  }else if(type == 'likeClick'){        
    return await db.collection('userNotes').doc(_id).update({
      data:{
        likeCount: _.inc(count)
      }
    })
  }else if(type == 'loveClick'){
    return await db.collection('userNotes').doc(_id).update({
      data:{
        loveCount: _.inc(count)
      }
    })
  }
}