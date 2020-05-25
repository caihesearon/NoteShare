const db = wx.cloud.database()
const util = require("../../utils/util")
const filter = require("../../utils/filter")
const app = getApp()
Page({

  data: {
    notes: [], //该用户所有笔记   
    collectIcon: "https://ae01.alicdn.com/kf/H8fa1fffc244644c7adcb86d4fcf96f2aH.jpg", // 收藏笔记的小图标
    // 收藏的星星图标
    cancelColletIcon: "https://ae01.alicdn.com/kf/H80604b3e89aa4e5599c1526e40df9ad2A.jpg", //实心
    cancelColletIconOne: "https://ae01.alicdn.com/kf/H80604b3e89aa4e5599c1526e40df9ad2A.jpg", //实心
    cancelColletIconTwo: "https://ae01.alicdn.com/kf/Hf1f8d5c223324b009a1261293038e1101.jpg", //空心在点击取消收藏后显示
  },

  onLoad: function (options) {
    filter.loginCheck().then(res => {
      if (res) {
        const that = this
        //异步获取用户收藏的所有笔记
        db.collection('userLoveNote')
          .orderBy('createTime', 'desc')
          .get().then(res => {
            const len = res.data.length
            //判断是否有收藏的笔记
            if (len == 0) {
              console.log('kong')
            } else {
              //获取所有的收藏笔记id
              let loveNoteArr = res.data
              wx.cloud.callFunction({
                name: 'getLoveNote',
                data: {
                  loveNoteArr: loveNoteArr
                }
              }).then(res => {
                that.setData({
                  notes: res.result
                })
              })
            }
          })
      }
    })
  },
  toDetailPage: function (e) {
    console.log(e)
    const {
      item
    } = e.currentTarget.dataset
    const {
      _id
    } = item
    const flag = util.getLocalStorage(_id)
    if (flag) {
      //对一天已经点击过的笔记卡片进行记录 防止重复点击
      util.setLocalStorage(_id)
      wx.cloud.callFunction({
        name: 'upCountByType',
        data: {
          type: 'addClick',
          _id: _id
        }
      })
    }
    //将笔记的详情放入全局中
    app.globalData.noteDetail = item
    wx.navigateTo({
      url: '../../noteDetail/noteDetail?way=1&isShowOptBar=true&isShowBtn=true&isShowBtnTwo=true',
    })
  },
  //取消收藏点击事件
  cancelCollet(e) {
    var that = this
    const {
      index
    } = e.currentTarget.dataset
    const noteInfo = this.data.notes[index]
    wx.showModal({
      title: '提示',
      content: '确定取消收藏',
      success(res) {
        if (res.confirm) {
          that.data.notes.splice(index, 1)
          that.setData({
            notes: that.data.notes
          })
          app.globalData.loveNoteArr = that.data.notes
          util.removeLoveNote(noteInfo._id)
        } else if (res.cancel) {}
      }
    })
  }


})