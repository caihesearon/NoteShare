import {
  globalUrls
} from './Network.js'

const app = getApp()

/*将请求的所有数据写成一个具体的方法来提供调用
  通过分类来调取getItemList 方法 然后 传入的params就是请求的数据的类型
*/ 
const netWork = {
  getallInformation: function (params) {
    params.type = "allInformation";
    this.getItemList(params);
  },
  getcurrentData: function (params) {
    params.type = "currentData";
    this.getItemList(params);
  },
  getallProvince: function (params) {
    params.type = "allProvince";
    this.getItemList(params);
  },
  getallAreaData: function (params) {
    params.type = "allAreaData";
    this.getChinaArea(params);
  },
  getnews: function (params) {
    params.type = "news";
    this.getItemList(params);
  },
  getaumors: function (params) {
    params.type = "aumors";
    this.getItemList(params);
  },


  /*返回中国地区的相关疫情信息*/
 /*返回中国地区的相关疫情信息*/
 getChinaArea:function(params){
  var url = globalUrls.allAreaData;
  wx.request({
    url: url,
    success: function (res) { 
      var data = res.data.results;
      if (params.success) {
          if(!data){    //每次在进入forEach后都要判断遍历的数组中有没有值，如果不判断则会出现 Cannot read property 'forEach' of undefined的错误
            return;
          }
          data.forEach(element => {
            if (element.countryName === "中国" && element.provinceShortName != "中国") {
                params.success(element);
            }
          });
      }
    }
  })
},

  getItemList:function (params) {
    var url = "";
    if(params.type === "allInformation"){
        url = globalUrls.allInformation;
    } else if (params.type === "currentData"){
        url = globalUrls.currentData;
    } else if (params.type === "allProvince"){
        url = globalUrls.allProvince;
    } else if (params.type === "news"){
        url = globalUrls.news;
    } else if (params.type === "aumors"){
        url = globalUrls.aumors;
    }

    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/json;charset=UTF-8;'
      },
      method:'GET',
      success:function (res) {
        var datalist = res.data;
        if(params.success){
          params.success(datalist);
        }
      }
    })
  }
}
export { netWork }