// 引入Echarts官方组件
import * as echarts from '../../miniprogram_npm/ec-canvas/echarts.js';
//引入中国地图经纬度等信息的js文件
import geoJson from './China.js';
//引入api接口的请求文件
import  globaUrls, { netWork }  from './getData.js';
//全局化that 方便后续函数使用Page对象
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 头部背景图片
    mapActive:0,
    isDisable:false,
    headerimage:"https://p.pstatp.com/origin/ff7b0001437ff9034c91",
    // 功能卡片区域
    utils_one:"https://p.pstatp.com/origin/fefd0001fcbabcc04c3e",
    utils_two:"https://p.pstatp.com/origin/fffb0000883ffb4ce499",
    utils_three:"https://p.pstatp.com/origin/fe5a000194f98d8e88c0",
    utils_four:"https://p.pstatp.com/origin/fef4000185f0d1879223",

    // 地图加载之前的图片
    LodingImage:"https://shop.io.mi-img.com/app/shop/img?id=shop_57bcaac97dbdadd7412945ce41ae4d30.jpeg",

    ecMap:{
      onInit:initChartMap,   //初始化地图1数据
    },
    list:[],                      //用于存储当前的地图加载数据的对象数组
    //没有任何感染者的地图的数据
    //需要有二个个个地图切换 当用户加载进去默认显示第一个
    isShowMapOne:true,
    isShowMapTwo:false,
    isShowMapThree:false,
    // 开发提示的弹出层 展示属性
    show: false,
    currDate:'',//当前时间
  },
  deving(e){
    this.setData({
      show:true
    })
  },
  // 关闭事件
  onClose() {
    this.setData({ close: false });
  },

  /* 通过点击Tabs来切换不同的地图*/ 
  MaponChange(event){
    if (event.detail.title === "当前确诊"  ) {
      this.setData({
        isShowMapOne:false,
        isShowMapTwo:true,
        isShowMapThree:false,
        isDisable:true,
      })
      that.ShowDataOne();
    }
    if (event.detail.title === "累计确诊") {
      this.setData({
        isShowMapOne:false,
        isShowMapTwo:false,
        isShowMapThree:true,
        isDisable:true,
      })
      that.ShowDataTwo(); 
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const date = new Date()
    const formatDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`  
    that = this;              //将当前的page对象赋给全局变量that
    var type = "currentData"; //直接声明当前 的请求 的数据类型
    that.setData({
      type:type
    });
    if(type === "currentData"){
      // console.log("我进来 了");
      netWork.getcurrentData({
        success:function (res) {
          // console.log(res)
          that.setData({
            items : res.results[0],
            currDate: formatDate
          });
        }
      })      
    }
    setTimeout(function () {  
      that.ShowDataOne();
    },1500)
  },
  onReady : function(options){
    
  },
  // 获取数据的函数
  ShowDataOne:function (params) {
    that.data.list = [];
    netWork.getallAreaData({
      success:function (res) {
        // console.log(res)
        /**
         * 这里每次成功回调都重新声明dat对象的原因是因为如果再外面
         * 声明的话 每次在成功回调后赋值所用到的都是同一个地址，
         * 而导致list对象数组中只有一个值。
         */
        var dat = {
          name:'',
          value:1
        }
          dat.name = res.provinceShortName;
          dat.value = res.currentConfirmedCount;
        //将获取的数据push到list数组中
        that.data.list.push(dat);  
       //打印获取到的数据
      //  console.log(res.provinceShortName,res.currentConfirmedCount);
      }
    })
  },
   // 获取数据的函数2
   ShowDataTwo:function (params) {
    that.data.list = [];
    netWork.getallAreaData({
      success:function (res) {
        /**
         * 这里每次成功回调都重新声明dat对象的原因是因为如果再外面
         * 声明的话 每次在成功回调后赋值所用到的都是同一个地址，
         * 而导致list对象数组中只有一个值。
         */
        var dat = {
          name:'',
          value:-1
        }
          dat.name = res.provinceShortName;
          dat.value = res.confirmedCount;     
        //将获取的数据push到list数组中
        that.data.list.push(dat);  
       //打印获取到的数据
      //  console.log(res.provinceShortName,res.currentConfirmedCount);
      }
    })
  },
    // 点击中间的小图标 跳转
    enterTips(e){
      wx.navigateTo({
        url: 'epidemicTips/epidemicTips',
      })
    },
})

 //获取像素比  
 const getPixelRatio = () => {
  let pixelRatio = 0
  wx.getSystemInfo({
    success: function (res) {
      pixelRatio = res.pixelRatio
    },
    fail: function () {
      pixelRatio = 0
    }
  })
  return pixelRatio
}
var dpr = getPixelRatio();
/*初始化地图函数*/
/**
/**
 * 全国疫情分布地图(中国)
 */
function initChartMap(canvas, width, height) {
  let myMap = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // 设备像素比  为了防止在设备上加载图片出现模糊
  });
  canvas.setChart(myMap);
  echarts.registerMap('china', geoJson);  // 绘制中国地图

  // 点击每个省时显示的小标签
  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: [
        10,  // 上
        15, // 右
        8,  // 下
        15, // 左
      ],
      extraCssText: 'box-shadow: 2px 2px 10px rgba(21, 126, 245, 0.35);',
      textStyle: {
        fontFamily: "'Microsoft YaHei', Arial, 'Avenir', Helvetica, sans-serif",
        color: '#FFFFFF',
        fontSize: 12,
      },
      formatter: `{b} :  {c}确诊`
    },
    geo: [
      {
        // 地理坐标系组件
        map: "china",
        roam: false, // 可以缩放和平移
        aspectScale: 0.8, // 比例
        layoutCenter: ["50%", "38%"], // position位置
        layoutSize: 370, // 地图大小，保证了不超过 370x370 的区域
        label: {
          // 图形上的文本标签
          normal: {
            show: true,
            textStyle: {
              color: "rgba(0, 0, 0, 1)",
              fontSize: '8',
            }
          },
          emphasis: { // 高亮时样式(字体的颜色)
            color: "#660000"
          }
        },
        // 南海诸岛的显示
        itemStyle: {
          // 图形上的地图区域
          normal: {
            borderColor: "rgba(0,0,0,0.5)",
            areaColor: "white"
          }
        }
      }
    ],
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    // 左下角显示区域
    visualMap: {
      type: "piecewise",
      left: "5%",
      top: '70%',
      itemWidth: 5,
      itemHeight: 12,
      itemGap: 0,
      inRange: {
        symbol: 'rect'
      },
      pieces: [
        { min: 10000, color: "#660000" },
        { min: 1000, max: 9999, color: "#990000" },
        { min: 100, max: 999, color: "#CC6666" },
        { min: 10, max: 99, color: "#CC9999" },
        { min: 1, max: 9, color: "#FFCCCC" },
        { value: 0, color: "#F3F0F0" }
      ],
      textStyle: {
        fontSize: 11,
        color: "rgba(102,102,102,1)"
      }
    },
    series: [
      {
        type: 'map',
        mapType: 'china',
        geoIndex: 0,
        roam: true, // 鼠标是否可以缩放
        scaleLimit: { //滚轮缩放的极限控制
          min: 1,
          max: 2
        },
        label: {
          normal: {
            show: true
          },
          emphasis: {
            textStyle: {
              color: '#fff'
            }
          }
        },
        data: that.data.list   // 数据的渲染
      }]
  };

  /*这里设置延时函数的作用是因为 setOption执行后地图就开始加载，但是
    此时list 为空，所以需要延时执行绘制方法 以保证在数据获取以后再绘制地图
  */
    wx.showLoading({
      title :'别急鸭...'
    })
    setTimeout(function () {  
      wx.hideLoading();
      myMap.setOption(option);    
    },2500)
  return myMap
}
