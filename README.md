# llMusic uniapp微信小程序（仿网易云音乐），一个账号多人使用(这里仅是前端）

#### 介绍
    
🤗欢迎使用llMusic小程序🤗 正如小程序的名字，小程序的功能就是播放音乐。🤔为什么制作这款播放音乐的小程序？是因为现在很多音乐软件都是要vip的，很多歌都需要收费才能听。

这个小程序是通过网易云接口来获得音乐，只需要在后端数据库里面存vip账号的登录cookie，小程序端无需登录，即可实现多人使用，简单来说，就是一个账号多人使用且每个使用的人不需要账号登录🥰。

后端代码在这：👉（还未上传，哈哈）👈

#### 软件架构

👉前端技术：uniapp、uView👈

👉后端技术：Java、SpringBoot、MybatisPlus、Redis、Mysql👈


#### 软件截图

<img src="https://gitee.com/Gulu_Lv/llmusic-uniapp-we/raw/master/%E5%B1%95%E7%A4%BA%E5%9B%BE/%7BA759D580-2E3B-4834-B25C-3C832C63967E%7D.png"  height="450" alt="首页"/>

<img src="https://gitee.com/Gulu_Lv/llmusic-uniapp-we/raw/master/%E5%B1%95%E7%A4%BA%E5%9B%BE/%7B2F652C79-CE6A-4a4b-A04D-15DDD2F26A20%7D.png"  height="450" alt="首页"/>

<img src="https://gitee.com/Gulu_Lv/llmusic-uniapp-we/raw/master/%E5%B1%95%E7%A4%BA%E5%9B%BE/%7B8FD1A552-68AD-49ff-9E75-E8AF50FD3E80%7D.png"  height="450" alt="首页"/>


#### 安装教程

1.  将代码复制或者git下来。
2.  使用HBuildX打开，修改manifest.json中微信小程序配置的appid，修改common.js文件中的baseURL为你的域名 http://www.xxx.com
3.  然后打包为微信小程序提交就行

#### 使用说明

这里我将针对一些页面的一些功能进行说明。因为本人不才🥺，小程序仍有很多不足之处和可优化的地方...有能力者可自行优化...
1. 音乐播放列表的最初列表是收藏歌单里面的音乐，如果新用户或者收藏歌单没有音乐则会显示暂无歌曲且不可播放。
2. 榜单和收藏的实质就是歌单。
3. 首页、每日推荐页、歌单页这些页面点击某个音乐播放，不但播放点击的音乐，还会将播放器里面的音乐列表替换为这些页面对应的歌曲列表（全部替换），即不是播放指定一首，而是全部播放。
4. 单曲搜索页点击其中某一首音乐播放，会将播放器的音乐列表替换为这一首（仅一首），即只播放这一首。
5. 歌单广场页面，顶部连续下拉两次可切换到上一页内容，底部连续上拉两次可切换到下一页内容。
6. 下载失败原因可能有两种：一是小程序下载API对ios和Android系统有些不兼容的音乐格式；二是小程序对下载需要配置downloadFile接口，如果下载音乐的接口并未在配置里面则下载失败。下载失败可复制音乐的链接，自行去浏览器下载。
7. 点击爱心可将音乐收藏或者取消收藏，红心为收藏，反之则为未收藏。因为接口缓存的关系可能导致收藏了，但是收藏歌单未显示拥有。也可能存在取消收藏了，仍然存在。这种情况可稍后（10分钟）重新进入或者刷新小程序解决。

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request

#### 特别感谢

 [网易云音乐 NodeJS 版 API NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)

#### 我的其他小程序

###### 去水印小程序

<img src="https://gitee.com/Gulu_Lv/universal-watermark-removal/raw/master/gh_2a0a366062cd_430.jpg" width="200" height="200" alt="小程序码"/>

 
###### 壁纸小程序

<img src="https://gitee.com/Gulu_Lv/wechat-wallpaper-mini-program/raw/master/%E5%9B%BE%E7%89%87/%E5%8F%96%E5%A3%81%E7%BA%B8.jpg" width="200" height="200" alt="小程序码"/>

