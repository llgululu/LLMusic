<template>
	<view class="body">
		<u--text bold size="38" text="介绍"></u--text>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent1"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent2"></u--text>
		</view>
		<u--text bold size="38" text="技术栈"></u--text>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent3"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent4"></u--text>
		</view>
		<u--text bold size="38" text="使用说明"></u--text>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent5"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent6"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent7"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent8"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent9"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent10"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent11"></u--text>
		</view>
		<view class="introduction-content">
			<u--text size="30" :text="introductionContent12"></u--text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				introductionContent1: "🤗欢迎使用llMusic小程序🤗 正如小程序的名字，小程序的功能就是播放音乐。🤔为什么制作这款播放音乐的小程序？是因为现在很多音乐软件都是要vip的，很多歌都需要收费才能听。",
				introductionContent2: "这个小程序是通过网易云接口来获得音乐，只需要在后端数据库里面存vip账号的登录cookie，小程序端无需登录，即可实现多人使用，简单来说，就是一个账号多人使用且每个使用的人不需要账号登录🥰。",
				introductionContent3: "👉前端技术：uniapp、uView👈",
				introductionContent4: "👉后端技术：Java、SpringBoot、MybatisPlus、Redis、Mysql👈",
				introductionContent5: "这里我将针对一些页面的一些功能进行说明。因为本人不才🥺，小程序仍有很多不足之处和可优化的地方...",
				introductionContent6: "1. 音乐播放列表的最初列表是收藏歌单里面的音乐，如果新用户或者收藏歌单没有音乐则会显示暂无歌曲且不可播放。",
				introductionContent7: "2. 榜单和收藏的实质就是歌单。",
				introductionContent8: "3. 首页、每日推荐页、歌单页这些页面点击某个音乐播放，不但播放点击的音乐，还会将播放器里面的音乐列表替换为这些页面对应的歌曲列表（全部替换），即不是播放指定一首，而是全部播放。",
				introductionContent9: "4. 单曲搜索页点击其中某一首音乐播放，会将播放器的音乐列表替换为这一首（仅一首），即只播放这一首。",
				introductionContent10: "5. 歌单广场页面，顶部连续下拉两次可切换到上一页内容，底部连续上拉两次可切换到下一页内容。",
				introductionContent11: "6. 下载失败原因可能有两种：一是小程序下载Api对ios和Android系统有些不兼容的音乐格式；二是小程序对下载需要配置downloadFile接口，如果下载音乐的接口并未在配置里面则下载失败。下载失败可复制音乐的链接，自行去浏览器下载。",
				introductionContent12: "7. 点击爱心可将音乐收藏或者取消收藏，红心为收藏，反之则为未收藏。因为接口缓存的关系可能导致收藏了，但是收藏歌单未显示拥有。也可能存在取消收藏了，仍然存在。这种情况可稍后（10分钟）重新进入或者刷新小程序解决。",
				introductionContent13: "",
			}
		}
	}
</script>

<style>
	.body {
		padding: 20rpx 20rpx 0 20rpx;
	}

	.introduction-content {
		padding-top: 5rpx;
		padding-bottom: 5rpx;
		text-indent: 2em;
	}
</style>