const db = wx.cloud.database()
/**
 * 对于添加收藏操作的数据库操作
 * @param {笔记的唯一标识} noteId 
 */
function addLoveNote(noteId){
    db.collection('userLoveNote').add({
      data:{
        noteId:noteId,
        createTime: db.serverDate()
      }
    }).then(res=>{
      wx.cloud.callFunction({
        name: 'upCountByType',
        data:{
          type: 'loveClick',
          _id: noteId,
          count: 1          
        }
      })
    })    
}
/**
 * 取消收藏笔记的数据库操作
 * @param {笔记的唯一标识} noteId 
 */
function removeLoveNote(noteId){
  db.collection('userLoveNote').where({
    noteId: noteId
  }).remove().then(res=>{    
    wx.cloud.callFunction({
      name: 'upCountByType',
      data:{
        type: 'loveClick',
        _id: noteId,
        count: -1
      }
    })
  })
}

/**
 * 获取当前用户是否收藏了该笔记
 * @param {笔记的唯一标识} noteId 
 */
function getLoveCount(noteId){  
  return new Promise(resolve => {
    db.collection('userLoveNote').where({     
        noteId:noteId      
    }).count().then(res =>{      
      resolve(res.total)
    })    
  })
}

/**
 * 将对笔记的点击、点赞操作进行本地操作
 * @param {笔记的唯一id作为key} key 
 */
function setLocalStorage(key){  
  const time = Date.parse(new Date())
  const value = formatTime(time, 'Y-M-D')
  wx.setStorageSync(key, value)
}

/**
 * 判断笔记的点击、点赞操作是否过期
 * @param {笔记的唯一id作为key} key 
 */
function getLocalStorage(key){
  const value = wx.getStorageSync(key)||null
  if(value == null){//如果为null就说明今天还没有对点击、点赞操作过
    console.log('test')
    return true
  }else{
    //value格式为2020-05-09
    //得到今天的时间
    let curr = formatTime(Date.parse(new Date), 'Y-M-D')
    let beforeDate = value.split('-')
    let currDate = curr.split('-')
    for(let i in beforeDate){
      //如果有一个不相同就说明已经不是今天的点击操作了 可以继续点击
      if(Number(beforeDate[i]) != Number(currDate[i])){
        return true
      }      
    }
    //如果都相同就不能继续为点击加一或者点赞
    return false
  }
}

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
*/
function formatTime(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));
  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
function formatNumber(n) {
  n = n.toString();  
  return n[1] ? n : '0' + n;
}
//设置笔记内容显示
function setContent(that, html){
  wx.createSelectorQuery()
    .select("#editor")
    .context(function (res) {
      that.editorCtx = res.context
      res.context.setContents({ //用于初始化富文本的内容 日后的编辑中可以使用
        html: that.data.html
      })
    })
    .exec();
}

module.exports = {
  setLocalStorage,
  getLocalStorage,
  addLoveNote,
  getLoveCount,
  removeLoveNote,
  setContent
}