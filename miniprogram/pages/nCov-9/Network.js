const globalUrls = {
      // 所有信息
      allInformation : "https://lab.isaaclin.cn/nCoV",

      //病毒研究情况以及全国疫情概览，可指定返回数据为最新发布数据或时间序列数据
      currentData: "https://lab.isaaclin.cn/nCoV/api/overall",

      // 返回数据库内有数据条目的国家、省份、地区、直辖市列表
      allProvince: "https://lab.isaaclin.cn/nCoV/api/provinceName",

      //中国所有省份、地区或直辖市及世界其他国家的所有疫情信息变化的时间序列数据（精确到市），能够追溯确诊/疑似感染/治愈/死亡人数的时间序列
      allAreaData: "https://lab.isaaclin.cn/nCoV/api/area",

      // 返回所有与疫情有关的新闻信息，包含数据来源以及数据来源链接
      news: "https://lab.isaaclin.cn/nCoV/api/news",

      // 返回与疫情有关的谣言以及丁香园的辟谣
      /*1. /nCoV/api/rumors?page=1&num=10&rumorType=1
      返回第2页可信信息，每页10则，即返回所有可信信息的第11至20则。*/ 
      aumors: "https://lab.isaaclin.cn/nCoV/api/rumors",
      
}


export {globalUrls}