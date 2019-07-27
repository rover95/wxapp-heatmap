//index.js

Page({
  data: {
    points: [],
    longitude: 110, //经度
    latitude: 30,   //纬度
    mapScale: 7,    //地图缩放，同原生map
    range: 50,      //热力点基础覆盖范围,单位px
  },

  onLoad: function() {
    this.setData({
      points: this.getMapPoints()
    });
  },
  handleResetBtn() {
    this.setData({
      points:[]
    })
    let points = this.getMapPoints();
    this.setData({
      points
    });
  },
  handleScaleChange(e) {
    let { id } = e.currentTarget;
    let num = id == "less" ? -1 : 1;
    this.setData({
      mapScale: this.data.mapScale + num
    });
  },
  // 创建热力点
  getMapPoints() {
    let points = [];
    let i = 0;
    while (i < 40) {
      i++;
      let x = 110 + ((Math.random() - 0.5) * 15) / 2;
      let y = 30 + ((Math.random() - 0.5) * 5) / 2;
      points.push({
        longitude: x,
        latitude: y,
        ratio: Math.random(),
        opacity: Math.random()
      });
    }
    return points;
  }
});
