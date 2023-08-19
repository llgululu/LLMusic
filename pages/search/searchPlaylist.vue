<template>
	<view class="body">
		<u-list @scrolltolower="scrolltolower" :height="screenHeight+'px'">
			<u-list-item v-for="(item, index) in playlistlist.list" :key="index">
				<view @click="viewPlaylist(index)" class="one-playlist">
					<view class="playlist-cover">
						<u--image radius="10" :src="item.cover" width="120" height="120"></u--image>
					</view>
					<view class="playlist-name-introduction">
						<u--text lines="1" size="34" :text="item.name"></u--text>
						<u--text lines="1" size="26" :text="item.introduction"></u--text>
					</view>
				</view>
			</u-list-item>
		</u-list>
		<u-loading-page iconSize="38" fontSize="38" :loading="loadingStatus"></u-loading-page>
	</view>
</template>

<script>
	var App = require("@/common.js");
	export default {
		props: {
			playerHeight: {
				type: Number,
				default: 110
			}
		},
		data() {
			return {
				loadingStatus: true,
				hasMore: false,
				screenHeight: 0,
				totalPlaylist: 0,
				page: 0,
				key: "海阔天空",
				playlistlist: {
					playlistCount: "0",
					list: []
				}
			}
		},
		mounted() {
			this.setScorllHeight()
			let key = uni.getStorageSync('searchKeywords') || "海阔天空"
			this.key = key
			this.loadMore()
		},
		methods: {
			viewPlaylist(index) {
				var data = {
					from: "8",
					to: "3"
				}
				// console.log(this.playlistlist.list[index].name)
				uni.setStorageSync('playlistId', this.playlistlist.list[index].id);
				uni.setStorageSync('playlistType', "normal");
				this.$emit("pageTo", data)
			},
			loadMore() {
				App._get("/api/searchPlaylist/getSearchPlaylistResult", {
					keywords: this.key,
					page: this.page
				}, res => {
					this.hasMore = res.data["data"]["playlistHasMore"];
					this.playlistlist.playlistCount = Number(this.playlistlist.playlistCount) + Number(res.data[
						"data"][
						"playlistlist"
					].playlistCount)
					// console.log(this.playlistlist.playlistCount)
					this.playlistlist.list = this.playlistlist.list.concat(res.data["data"]["playlistlist"].list)
					this.totalPlaylist = res.data["data"]["totalPlaylistCount"]
					this.loadingStatus = false
				});
			},
			scrolltolower() {
				// console.log("next")
				if (this.hasMore) {
					this.page = this.page + 1
					this.loadMore()
				} else {
					uni.showToast({
						icon: "none",
						title: "到底了"
					})
				}
			},
			setScorllHeight() {
				//音乐播放器高度
				var playerHeight = this.playerHeight
				// console.log(playerHeight)
				// 顶部状态栏 高度
				var statusBarHeight = uni.getSystemInfoSync().statusBarHeight
				// 苹果底部安全区域高度
				// var safeArea = uni.getSystemInfoSync().safeAreaInsets.bottom
				// 其中 44为顶部导航的固定高度   另外为.body的padding-top 10
				this.screenHeight = uni.getSystemInfoSync().windowHeight  -
					playerHeight - statusBarHeight - 44 - uni.$u.getPx(uni.$u.getPx('20rpx', true))
			}
		}
	}
</script>

<style>
	.body {
		padding: 0 20rpx 20rpx 20rpx;
	}

	.one-playlist {
		border-bottom: 1rpx solid #c8c9cc;
		display: flex;
		padding-top: 16rpx;
		padding-bottom: 16rpx;
	}

	.playlist-name-introduction {
		padding-top: 12rpx;
		padding-left: 16rpx;
	}
</style>