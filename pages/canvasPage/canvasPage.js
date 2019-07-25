// pages/canvasPage/canvasPage.js
import colorGradual from "./colorGradual";

let p_width = 375;
let p_height = 200;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    northwest:[],
    southeast:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const mapCtx = wx.createMapContext("map");
    mapCtx.getRegion({
      complete:(res)=> {
        console.log(res);
        let northwest = [res.southwest.longitude, res.northeast.latitude];
        let southeast = [res.northeast.longitude, res.southwest.latitude];
        this.northwest = northwest;
        this.southeast = southeast;
        this.scale_x = p_width / (southeast[0] - northwest[0]);
        this.scale_y = p_height / (southeast[1] - northwest[1]);
        this.drawCanvas();
        console.log(this.scale_x, this.scale_y,northwest);
        
        // this.setData({
        //   northwest,
        //   southeast,
        //   scale_x,
        //   scale_y
        // });
      }
    });
    
    
    // this.getColorGradual();
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
    grd.addColorStop(1, "rgba(255,10,0,1)");
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
          console.log(res.data.toString());
          // this.drawCanvas();
        }
      });
    });
  },
  drawCanvas() {
    let ctx = wx.createCanvasContext("cvs");
    ctx.clearRect(0, 0, p_width, p_height);
    let i = 0;
    
    while (i < 10) {
      i++;
      // debugger
      let x = Math.random() * p_width;
      let y = Math.random() * p_height;
      x = 110 + ((Math.random() - 0.5) * 5) / 2;
      y = 30 + ((Math.random() - 0.5) * 5) / 2;
      x = (x - this.northwest[0])*this.scale_x;
      y = (y - this.northwest[1])*this.scale_y;
      console.log(x,y);
      
      let grd = ctx.createCircularGradient(x, y, 55);
      grd.addColorStop(0, "#000000");
      grd.addColorStop(1, "rgba(0,0,0,0)");
      ctx.setFillStyle(grd);
      ctx.arc(x , y, 55, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.draw(true, () => {
      // return
      this.drawGradual("cvs");
    });

    // ctx.fillRect(0, 0, 500, 5000)
    // ctx.stroke()
    // ctx.draw()
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
        // console.log(colorGradual);
        // console.log(imgData);

        // return
        let t = new Date().getTime();
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
            console.log(res);
            console.log(new Date().getTime() - t);
          }
        });
      }
    });
  },

  handleResetBtn() {
    this.drawCanvas();
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