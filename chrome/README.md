# ToolLink助手（ToolLinkHelper）  
ToolLink助手：默认包括常用的在线字符串编解码、代码压缩、美化、JSON格式化、正则表达式、时间转换工具、二维码生成与解码等工具，也可以后续自定义增加。  

## 安装方式：  
  - Google市场（由于经费问题，后续再补上）
    - Link：  
  - 开发者模式（每次需要手动升级）
    - Clone整个目录。  
    - 在扩展程序中开启“开发者模式”。  
    - 选择“加载已解压的扩展程序”，定位到chrome文件夹即可。  
## 框架说明：  
  - 图标使用了这个项目，第一版参照此项目实现：[https://github.com/anttribe/DevTookit](https://github.com/anttribe/DevTookit) 
  - 开发框架使用FeHelper这个项目，灵感也来自此框架，命名空间全改了，框架的版权属于这个项目：[https://github.com/zxlie/FeHelper](https://github.com/zxlie/FeHelper)  
  - 由于FeHelper是高度集成工具到插件的，后续增加一些自定义工具不太方便，所以就单独剥离整个框架，去除所有工具，改造成只管理在线工具的插件。  
  - ToolLink只包含最简单的配置和展示框架，且支持自定义的数据源，后续可以自行在GitHub上新建自己的数据源来进行插件的配置。  
  - FeHelper的框架基于模块化和Chrome的Background模式的消息机制封装进行开发的，没有太多的第三方框架，基本是纯JavaScript实现，所以学习起来非常的好入手。  
## 自定义数据源添加方式说明：  
参考这个文件[https://github.com/easonjim/HTML-DEV-ToolLink/blob/master/datasource.json](https://github.com/easonjim/HTML-DEV-ToolLink/blob/master/datasource.json)写一份自己的，并在插件的配置页面选择自己的数据源文件即可。  
数据源文件的存放方式可以是GitHub，也可以是自己的私有服务器等等。  
## 效果展示：  
![img](https://raw.githubusercontent.com/easonjim/HTML-DEV-ToolLink/master/static/img/chrome/1.jpg)  
![img](https://raw.githubusercontent.com/easonjim/HTML-DEV-ToolLink/master/static/img/chrome/2.jpg)  
![img](https://raw.githubusercontent.com/easonjim/HTML-DEV-ToolLink/master/static/img/chrome/3.jpg)
![img](https://raw.githubusercontent.com/easonjim/HTML-DEV-ToolLink/master/static/img/chrome/4.jpg)  
