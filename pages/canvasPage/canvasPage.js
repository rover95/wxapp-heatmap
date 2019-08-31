// pages/canvasPage/canvasPage.js
import colorGradual from "./colorGradual";

let p_width = 375;
let p_height = 300;
const range = 60;

let t ;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    p_width,
    p_height,
    mapScale: 7
  },
  ctx: wx.createCanvasContext("cvs"),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const systemInfo = wx.getSystemInfoSync();
    const mapCtx = wx.createMapContext("map");
    p_width = systemInfo.screenWidth;
    this.mapCtx = mapCtx;
    this.getMapRegion(()=>{
      this.points = this.getMapPoints();
      // this.drawCanvas(this.points);
    });
    this.getColorGradual();
  },
  //获取窗口坐标范围
  getMapRegion(fun){
    this.mapCtx.getRegion({
      complete: res => {
        let northwest = [res.southwest.longitude, res.northeast.latitude];
        let southeast = [res.northeast.longitude, res.southwest.latitude];
        this.northwest = northwest;
        this.southeast = southeast;
        this.scale_x = p_width / (southeast[0] - northwest[0]);
        this.scale_y = p_height / (southeast[1] - northwest[1]);
        if(fun){
          fun()
        }
        
      }
    });
  },
  // 绘制彩色渐变条
  getColorGradual() {
    let ctx = wx.createCanvasContext("color");
    let grd = ctx.createLinearGradient(0, 0, 256, 10);
    grd.addColorStop(0.2, "rgba(0,0,255,0.2)");
    grd.addColorStop(0.3, "rgba(43,111,231,0.3)");
    grd.addColorStop(0.4, "rgba(2,192,241,0.4)");
    grd.addColorStop(0.6, "rgba(44,222,148,0.6)");
    grd.addColorStop(0.8, "rgba(254,237,83,0.8)");
    grd.addColorStop(0.9, "rgba(255,118,50,0.9)");
    grd.addColorStop(1, "rgba(255,10,0,0.95)");
    ctx.setFillStyle(grd);
    ctx.fillRect(0, 0, 256, 10);
    ctx.draw(true, () => {
      wx.canvasGetImageData({
        canvasId: "color",
        x: 0,
        y: 0,
        width: 256,
        height: 1,
        complete: res => {
          console.log(res.data.toString()); //用于生成colorGradual.js
          // this.drawCanvas();
        }
      });
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
        ratio: Math.random()
      });
    }
    return points;
  },
  // 绘制叠加点透明通道
  drawCanvas(points) {
    t = new Date().getTime();
    let ctx = this.ctx;
    ctx.clearRect(0, 0, p_width, p_height);
    points.map(val => {
      let { ratio } = val;
      let x = (val.longitude - this.northwest[0]) * this.scale_x;
      let y = (val.latitude - this.northwest[1]) * this.scale_y;
      let grd = ctx.createCircularGradient(x, y, range * ratio);
      grd.addColorStop(0, "#000000");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.setFillStyle(grd);
      ctx.arc(x, y, range * ratio, 0, 2 * Math.PI);
      ctx.fill();
    });

    ctx.draw(true, () => {
      this.drawGradual("cvs");
    });
  },
  // 绘制渐变映射
  drawGradual(id) {
    wx.canvasGetImageData({
      canvasId: id,
      x: 0,
      y: 0,
      width: p_width,
      height: p_height,
      complete: res => {
        let imgData = res.data;
        for (let i = 3; i < imgData.length; i += 4) {
          let j = imgData[i] * 4;
          if (!j) {
            continue;
          }
          imgData[i - 1] = colorGradual[j + 2];
          imgData[i - 2] = colorGradual[j + 1];
          imgData[i - 3] = colorGradual[j];
        }
        wx.canvasPutImageData({
          canvasId: "cvs",
          x: 0,
          y: 0,
          data: imgData,
          width: p_width,
          height: p_height,
          complete(res) {
            console.log("渲染用时：" + (new Date().getTime() - t) + "ms");
          }
        });
      }
    });
  },
  //清空画布
  clearCanvas(){
    this.ctx.clearRect(0, 0, p_width, p_height);
  },
  //map视野变化
  handleRegionchange(e) {
    if (!this.points || e.type != "end") {
      return;
    }
    this.getMapRegion(()=>{
      this.drawCanvas(this.points);
    });
  },
  handleResetBtn() {
    let points = this.getMapPoints();
    this.drawCanvas(points);
  },
  handleScaleChange(e) {
    let { id } = e.currentTarget;
    let num = id == "less" ? -1 : 1;
    this.setData({
      mapScale: this.data.mapScale + num
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});