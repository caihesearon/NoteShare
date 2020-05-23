//index.js
//获取应用实例
var WxSearch = require('../../components/wxSearch/wxSearch.js')
const filter = require('../utils/filter.js')
var app = getApp()
Page({
  data: {
    // keys: [], //保存所有的关键字
    disabled: false, //input框是否禁用
    /**
     * 所有 -- 搜索到的所有笔记 按点击量排序
     * 推荐（近期 点赞+收藏+访问最多  -- 同一数量按时间排序
     * 最新 不管点赞
     * 
     * 点击（热度
     * 收藏
     * 点赞
     * 
     */
    option1: [{
        text: '默认',
        value: 0
      },
      {
        text: '推荐',
        value: 1
      },
      {
        text: '最新',
        value: 2
      }
    ],
    option2: [{
        text: '访问量',
        value: 'a'
      },
      {
        text: '点赞量',
        value: 'b'
      },
      {
        text: '收藏量',
        value: 'c'
      }
    ],
    value: '', //用户输入的key关键字
    value1: 0, //左边下拉框的值
    value2: 'a', //右边下拉框的值
    isSelect: false, //右边的是否可以选择
    notes: [],
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['计算机', '理工', '外语', '文史', '管理', '艺术', '心理', '经历']);
    //WxSearch.initMindKeys(['weappdev.com','微信小程序开发','微信开发','微信小程序']);
    //本地有关键字就不用查数据库
    if (app.globalData.Searchkeys == null) {
      this.getNoteSearchKeys()
    } else {
      WxSearch.initMindKeys(app.globalData.Searchkeys);
    }
  },

  //点击搜索按钮
  wxSearchFn: function (e) {
    var that = this
    //获取输入框搜索关键字   
    const value = this.data.value
    console.log(value)
    if (value != '') {
      //点击搜索不为 所有 时
      if (this.data.value1 != 0) {        
        this.getNoteBySortType(value, this.data.value1)
      } else {
        let countType = this.getCountType(this.data.value2)
        this.getNoteByAnyCount(value, countType);
      }
    }
    WxSearch.wxSearchAddHisKey(that);
  },
  //根据关键字搜索笔记
  changeLeft: function (e) {
    const {
      detail
    } = e
    this.setData({
      value1: detail
    })
    //如果左边下拉框的值不为所有
    if (detail !== 0) {
      this.setData({
        isSelect: true
      })
      if (this.data.value != '') {
        if (detail == 1) { //推荐
          this.getNoteBySortType(this.data.value, detail)
        } else if (detail == 2) { //最新
          this.getNoteByAnyCount(this.data.value, 'createTime')
        }
      }
    } else { //查所有 -- 参数为value2
      this.setData({
        isSelect: false
      })
      //如果输入框为空就不进行搜索 
      if (this.data.value != '') {
        let countType = this.getCountType(this.data.value2)
        this.getNoteByAnyCount(this.data.value, countType)
      }
    }
  },
  changeRight: function (e) {
    const {
      detail
    } = e
    this.setData({
      value2: detail
    })
    //获取当前输入框是否有值
    console.log('key为')
    console.log(this.data.value)
    if (this.data.value != '') {
      let countType = this.getCountType(detail)
      this.getNoteByAnyCount(this.data.value, countType)
    }
  },
  //通过搜索关键字key和左边下拉款的类型进行获取笔记 不包括 《所有》
  getNoteBySortType: function (key, sortType) {
    wx.showLoading({
      title: '搜索中',
    })
    wx.cloud.callFunction({
      name: 'getNoteBySortType',
      data: {
        key: key,
        sortType: sortType
      }
    }).then(res => {
      wx.hideLoading()
      console.log(res.result.list)
      // console.log(res)
      this.setData({
        notes: res.result.list
      })
    })
  },
  //通过搜索关键字key和排序规则countType获取笔记 -》针对 《所有》下拉框
  getNoteByAnyCount: function (key, countType) {
    wx.showLoading({
      title: '搜索中',
    })
    wx.cloud.callFunction({
      name: 'getNoteByAnyCount',
      data: {
        key: key,
        countType: countType
      }
    }).then(res => {
      //需要给当前页面重新赋值笔记内容
      console.log('调用成功！！！')
      console.log(res.result.data)
      wx.hideLoading()
      this.setData({
        notes: res.result.data
      })
    })
  },
  //获取所有的key
  getNoteSearchKeys: function () {
    wx.cloud.callFunction({
      name: 'getNoteSearchKey'
    }).then(res => {
      // console.log(res)
      let arr = res.result.data
      let keys = []
      //进行去重
      for (let i = 0; i < arr.length; i++) {
        let noteTitle = arr[i].titleInfo.noteTitle
        let pointA = arr[i].titleInfo.pointA
        let pointB = arr[i].titleInfo.pointB
        if (keys.indexOf(noteTitle) == -1) {
          keys.push(noteTitle)
        }
        if (pointA != '' && keys.indexOf(pointA) == -1) {
          keys.push(pointA)
        }
        if (pointB != '' && keys.indexOf(pointB) == -1) {
          keys.push(pointB)
        }
      }
      // console.log(keys)
      WxSearch.initMindKeys(keys)
      app.globalData.Searchkeys = keys
    })
  },
  wxSearchInput: function (e) {
    const {
      value
    } = e.detail
    this.setData({
      value: value
    })
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    const {
      key
    } = e.target.dataset
    this.setData({
      value: key
    })
    console.log(this.data.value)
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    const {
      key
    } = e.target.dataset
    this.setData({
      value: key
    })
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },
  getCountType: function (detail) {
    if (detail == 'a') {
      return 'clickCount'
    } else if (detail == 'b') {
      return 'likeCount'
    } else {
      return 'loveCount'
    }
  },
  disabledInput: function () {
    this.setData({
      disabled: true
    })
  },
  useInput: function () {
    this.setData({
      disabled: false
    })
  },
    //进入详情页面
    toDetailPage:function(e){
      filter.loginCheck(0).then(res=>{
        if(res){
          //获取点击的卡片的详细信息
          const {item} = e.currentTarget.dataset
          // console.log(item)
          //将笔记的详情放入全局中
          app.globalData.noteDetail = item
          console.log(app.globalData.noteDetail)
          wx.navigateTo({
            url: '../noteDetail/noteDetail?way=1&isShowOptBar=true&isShowBtn=true&isShowBtnTwo=true',
          })
        }
      })
     
    },
})