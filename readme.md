# 小程序热力图

基于小程序canvas画布+原生map组件实现

配置参数

```js
/*
points: [{        //热力点数组
  longitude: 103, //经度
  latitude: 30,   //纬度
  ratio: 0.5,     //热力点覆盖范围半径系数
  opacity: 0.9    //热力点最大透明度，控制热力点权重
}],
longitude: 110,   //地图中心点经度
latitude: 30,     //地图中心点纬度
mapScale: 7,      //地图缩放，同原生map
range: 50,        //热力点基础覆盖范围,单位px 
 */
```

WXML

```html
<!-- <heatMap>组件父节点必须定义宽高，<heatMap>组件将填充满父节点 -->
<view style="width:100vw;height:200px" wx:if="{{points.length>0}}">
  <heatMap points="{{points}}" longitude="{{longitude}}" latitude="{{latitude}}" mapScale="{{mapScale}}" range="{{range}}"></heatMap>
</view>

```

开发工具上渲染可能会出现画面撕裂，真机上显示正常  

![img](https://raw.githubusercontent.com/rover95/image/master/img/heatmap3.png)

小程序画布性能孱弱，热力图需要像素级操作，全屏或渲染大尺寸canvas会有卡顿，有待微信优化  
["避免设置过大的宽高，在安卓下会有crash的问题"](https://developers.weixin.qq.com/miniprogram/dev/component/canvas.html)  
