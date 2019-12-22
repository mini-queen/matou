# matou

#### 介绍
便利码头小程序(mpvue)


#### 小程序汇总
	

    * 组件类：
		1.加减框 画左右两个操作按钮和中间数字框，抛出reduce和add事件(有时需numHandler事件)，供外部调用，逻辑都由外部(调用者)去处理
		2.toast  解决小程序toast文本最多显示 7 个汉字长度问题
		3.自定义swiper 通过bannerChange获取当前banner的索引，然后写逻辑样式；解决ui样式和原生不统一问题
		4.checkbox 将input包裹在div中，display:none; 点击div抛出change事件，通过传入的checked值来控制class的打勾效果
		5.radio 通过background-clip: content-box;用纯css画出radio样式，选中未选中通过background-color设置
		6.自定义头部 main.json需设置 "navigationStyle": "custom"
		标题栏高度：self.titleBarHeight = ((wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2) + wx.getMenuButtonBoundingClientRect().height
		7.时间线 时间子元素div(relative定位)，伪元素作为左侧线，包含一个图标(absolute定位)和对应的内容
		8.tabs tab-header部分动画：根据选中的index添加active的class，通过style的translateX实现;tab-centent部分动画：用swiper实现，current属性和change事件
		9.省市区县四级联动 
			内容列表用scroll-view包裹，纵向滑动。首先默认获取省级数据填充，选中某个省份调用接口用市级数据替换省级数据;点击头部label根据
			之前存储的省市区code重新调用接口，填充列表
		10.城市按字母索引列表
			左侧城市列表：用scroll-view包裹纵向滑动，scroll-with-animation="true"控制过渡动画，scroll-into-view对应子元素id;
			右侧字母列表：点击元素切换scroll-into-view对应的值
			注意设置scroll-view的高度，否则会有不能联动的bug
		11.左滑删除
			设置元素的touchStart和touchEnd事件，根据滑动的距离starX和endX的差值改变当前列表item的元素tag，
			通过tag改变css样式translateX(滑出元素的width) 并在元素本身加上过渡效果。
			最外层的元素是子元素100vw加上滑出元素的宽度之和，注意最外层需要width100vw并overflow：hidden，否则有左右滑动的bug
		12.高仿支付弹框
			画出6个密码输入框和0-9/x 十个键构成的键盘页面，
			其中<input type="text" :disabled="true" :value="index" :password="true" v-if="pwdArr.length > index"> 6个密码框最关键
			input不能输入数据，其value值0-5并不作为实际键盘输入的值，通过键盘输入的数字给pwdArr添加元素，pwdArr.length > index 刚好可以让密码框显示的点
			和pwdArr的元素保持一致;通过x键让pwdArr.pop(),去除元素;当用户输入的值也就是pwdArr的长度为6时关闭弹框进行下一步逻辑。
			
		
	* 功能类：
		1.生成二维码  使用weapp-qrcode.js插件 对width和height做好适配，否则会有识别不了二维码的问题
		2.上拉列表加载 两种方法：通过小程序onReachBottom方法去判断用户上拉触底; 用scroll-view包裹列表内容，通过其bindscrolltolower事件去判断触底
		3.下拉刷新 需要在json文件里配置"enablePullDownRefresh": true 然后调用onPullDownRefresh方法去请求数据，数据请求完成时，延时处理wx.stopPullDownRefresh()
		4.富文本解析  使用mpvue-wxparse插件 需要将插件css样式引入否则报错;渲染 Markdown时需引入marked插件将md转为html才能使用
		5.canvas生成海报 
			通过wx.getSystemInfo取到屏幕的宽高，给canvas设置合适尺寸 <canvas canvas-id="mycanvas" :style="{width: screenWidth, height: screenHeight}"/>
			
			相关api
			let context = wx.createCanvasContext('mycanvas') 获取canvas实例
			context.fillRect(0, 0, w, h) 绘制区域
			context.drawImage(this.bgImg, 0, 0, w, h) 其中bgImg是从wx.getImageInfo({src:'线上图片'})得到的本地路径path
			context.lineWidth = 1 边框大小
			context.strokeStyle = '#787878' 边框颜色
			context.fillStyle = '#fff' 填充颜色
			context.strokeRect(x, y, w, h) 绘制带边框区域
			//绘制文字
			context.setFillStyle('#333') 颜色
			context.setTextAlign('center') 居中
			context.setFontSize(18) 字号 // 注意，canvas不支持字体划线，如需划线，用条线自行定位
			context.fillText(this.name, this.screenWidth / 2, y) 绘制内容     this.screenWidth / 2 保持在canvas居中
			context.stroke()
			
			生成好的图片保存到本地
			wx.canvasToTempFilePath({canvasId: 'mycanvas'}) id为canvas标签canvas-id的值
			获取到canvas的路径tempFilePath
			然后wx.saveImageToPhotosAlbum({filePath: tempFilePath}) 保存本地图片
			
		6.地图：
			地图定位：
				先用wx.getLocation(type为gcj02) 获取latitude经度，longitude维度 //如果定位失败，需要先在app.json的permission中添加"scope.userLocation"
				然后去腾讯位置服务平台申请开发者密钥key并授权小程序appid
				调用地图逆地址api
			地图基本展示：
				<map :latitude="latitude" :longitude="longitude" :markers="markers" :show-location="true" @markertap="markertap" @callouttap="callouttap"></map>
				其中经纬度是必须，其他属性可选
				markers标记点(地图上的小气球); show-location显示带有方向的当前定位点
				markertap事件 点击标记点时触发; callouttap事件 点击标记点对应的气泡时触发
				this.mapCtx = wx.createMapContext('map') 获取map实例，this.mapCtx.includePoints 调整位置 展示所有marker，
				this.mapCtx.getCenterLocation 获取地图的中心位置，this.mapCtx.moveToLocation 移动地图到某个位置
			地图marker自定义：
				markers: [{
					id: 1,  //标记点id，最好是和地址id保持一致，有利于调用markertap事件时，获取地址id去处理逻辑
					latitude: 39.732494, //维度
					longitude: 116.348215, //经度
					width: 15, //标注图标宽度 最好和iconPath对应的图片的宽高比保持一致
					height: 21, //标注图标高度 最好和iconPath对应的图片的宽高比保持一致
					name: '店铺', //标注点名 当有callout时可以忽略
					iconPath: '/static/images/map-marker.png', //显示的图标
					callout: { //标记点上方的气泡窗口
					  content: '店铺', //气泡窗口的文本
					  color: '#999', // 文本颜色
					  fontSize: '14', //文字大小
					  borderColor: '#cecece', //边框颜色
					  borderRadius: 8, //边框圆角
					  borderWidth: '1', //边框宽度
					  display: 'ALWAYS', //常显  'BYCLICK'为点击显示
					  bgColor: '#ffffff', //背景色
					  padding: 10 //文本边缘留白
					}
				  }]
			地图搜索：
				1> qqmapsdk.search 侧重于地点搜索周边
					传参： keyword(关键词'酒店' '餐饮' '娱乐' '学校' 等)，region(城市名) page_size(返回列表个数) filter(搜索指定分类category=公交站)
					返回：地址列表
				2> qqmapsdk.getSuggestion 侧重于模糊地点查询
					和search接口传参略有差别(见文档)
					传参： keyword(关键词，任意地点)，region(城市名) page_size(返回列表个数) filter(搜索指定分类category=公交站)
					返回：地址列表
	
			地图逆地址编码：
				qqmapsdk.reverseGeocoder({location: {latitude,longitude}) 得到地址信息
			地图地址解析：
				与逆地址相反，qqmapsdk.geocoder({address}) 得到地址经纬度坐标
			
			补充：虽然高德地图和百度地图都有相关小程序api，功能上可以使用；但微信小程序不支持第三方地图控件，而且腾讯地图支持的功能更全，优先考虑腾讯地图
		7.渐变背景
			background-image: linear-gradient(@colorA, @colorB);
		8.gif图
			和正常图片的引用一致，如果只播放一次就停止，就是ui那边gif图制作有问题，和前端无关
		9.倒计时列表
			下单时间+30分钟-当前时间，用setInterval去实现，注意页面关闭时clear掉;如果页面不实时更新的话，用this.$forceUpdate()
		10.微信支付 
			先调用支付订单(结算)接口，传入商品信息(数量，价格，id等)/地址信息/支付类型/用户信息 
			调用wx.requestPayment 传入：
				timeStamp 时间戳(根据支付订单接口返回的信息)
				nonceStr 随机串(后端返回)
				package prepay_id(后端返回)
				signType 'MD5'
				paySign 签名(后端返回)
			支付成功之后，跳转支付成功页（查看订单/回到首页）
			支付取消，跳转订单详情页（待支付状态）
		11.登录授权功能 
			授权
				先从本地storage获取token，如果不存在调取接口查询，如果查不到就跳转登录页面(或弹出授权弹框)，如果存在就跳转页面,如果查到就更新token后跳转
				<button open-type="getUserInfo"  @getuserinfo="getInfo">微信登录</button> 在getInfo函数中获取userInfo并调用
				wx.login拿到loginCode通过这两个参数(code,info)去调用后端登录接口拿到token，存到storage后跳转
		12.微信分享
			给 button 组件设置属性 open-type="share",在用户点击按钮后触发 Page.onShareAppMessage 事件
			想要禁用某个页面的分享功能，需要调用wx.hideShareMenu 且页面里不能有onShareAppMessage事件
		13.小程序分包
			为了解决小程序2M大小限制，需要使用分包。分包之后，总共大小不能超过8M，注意每一个包大小仍然不能超过2M
			通过在 app.json subpackages 字段声明项目分包结构,将页面目录也划分为主包和子包（主包是tabBar的页面;子包一般为每个tab页面对应的关联页面）
			
		14.图片点击预览功能 点击图片用e.target.dataset.src来获取img属性data-src的值，用wx.previewImage方法，设置current和urls
		15.图片上传和拍照  wx.chooseimage  ios无法调用的问题：sourceType: ['album','camera']必须写为这两个值，否则ios无效
	* bug类：
		1.左右滑动问题 一定是因为页面某些元素的宽度>100vw;可以通过给最外层设置width100wh,overflowhidden，也可以找到超过100vw的元素重新设宽
