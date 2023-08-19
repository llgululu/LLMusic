<template>
	<view class="body">
		<u-list @scrolltolower="scrolltolower" :height="screenHeight+'px'">
			<u-list-item v-for="(item, index) in childSongLists.music_list" :key="index">
				<view class="one-song">
					<view @click="playOneMusic(index)" class="song-info">
						<view class="song-cover">
							<u--image radius="10" :showLoading="true" :src="item.music_cover" width="120"
								height="120"></u--image>
						</view>
						<view class="song-name-singer">
							<u--text :color="childCurrentMusic==index ? '#3c9cff':''" lines="1" size="34"
								:text="item.music_name"></u--text>
							<u--text :color="childCurrentMusic==index ? '#3c9cff':''" lines="1" size="28"
								:text="item.music_singer"></u--text>
						</view>
					</view>
					<view class="song-button-group">
						<view class="play-button">
							<u-icon @click="downloadMusic(index)" size="50" name="download"></u-icon>
						</view>
						<u-icon @click="collectOrCancelMusic(index)" :color="item.is_like ? 'red':''" size="50"
							:name="item.is_like ? 'heart-fill':'heart'"></u-icon>
					</view>
				</view>
			</u-list-item>
		</u-list>
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
				childCurrentMusic: -1,
				loadingStatus: true,
				hasMore: false,
				screenHeight: 0,
				page: 0,
				key: "海阔天空",
				totalSongCount: 0,
				childSongLists: {
					id: "searchSong",
					name: "加载中...",
					cover: "https://p2.music.126.net/c-u3kOlkVTUf4JdeDHDdEw==/109951163291871252.jpg",
					updateTime: "",
					creator: "llgululu",
					cat: "",
					playCount: "",
					loveCount: "",
					chatCount: "",
					introduction: "",
					songsNumber: "0",
					music_list: []
				},
			}
		},
		mounted() {
			this.setScorllHeight()
			let key = uni.getStorageSync('searchKeywords') || "海阔天空"
			this.key = key
			this.loadMore()
		},
		methods: {
			loadMore() {
				App._get("/api/searchSong/getSearchSongResult", {
					keywords: this.key,
					page: this.page
				}, res => {
					this.hasMore = res.data["data"]["songsHasMore"];
					this.childSongLists.songsNumber = Number(this.childSongLists.songsNumber) + Number(res.data["data"]["childSongLists"].songsNumber)
					// console.log(this.childSongLists.songsNumber)
					this.childSongLists.music_list = this.childSongLists.music_list.concat(res.data["data"][
						"childSongLists"
					].music_list)
					this.totalSongCount = res.data["data"]["totalSongCount"]
					this.loadingStatus = false
				});
			},
			scrolltolower() {
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
			playOneMusic(index) {
				var data = {
					id: this.childSongLists.id,
					songsNumber: "1",
					music_list: [
						this.childSongLists.music_list[index]
					]
				}
				// console.log(data)
				this.$emit("playOneMusic", data)
			},
			downloadMusic(index) {
				App._get("/api/music/getMusicURLById", {
					id: this.childSongLists.music_list[index].music_id
				}, res => {
					const downloadTask = uni.downloadFile({
						url: res.data["data"]["url"], //仅为示例，并非真实的资源
						success: (downloadRes) => {
							if (downloadRes.statusCode === 200) {
								console.log('下载成功');
								uni.saveFile({
									tempFilePath: downloadRes.tempFilePath,
									success: (saveRes) => {
										uni.hideLoading()
										uni.showToast({
											icon: "success",
											title: "下载成功！"
										})
										console.log('保存成功' + saveRes.savedFilePath);
									}
								})
							}
						},
						fail: (err) => {
							uni.hideLoading()
							uni.showModal({
								title: '提示',
								content: '下载失败，可以通过浏览器链接下载，是否复制链接自行去浏览器下载？',
								success: (modalRes) => {
									if (modalRes.confirm) {
										this.copywa(res.data["data"]["url"])
									} else if (modalRes.cancel) {
										console.log('用户点击取消');
									}
								}
							});
							console.log(err)
						}
					});
					downloadTask.onProgressUpdate((downloadTaskRes) => {
						uni.showLoading({
							title: '下载进度' + downloadTaskRes.progress + '%'
						})
						if (downloadTaskRes.progress > 50) {
							downloadTask.abort();
						}
					});

				});
			},
			copywa(content) {
				uni.setClipboardData({
					data: content,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
						});
					},
					fail() {
						uni.showToast({
							title: '复制失败了',
						});
					}
				});
			},
			collectOrCancelMusic(index) {
				let musicId = this.childSongLists.music_list[index].music_id
				let op;
				let change;
				if (this.childSongLists.music_list[index].is_like) {
					op = "del"
					change = false
				} else {
					op = "add"
					change = true
				}
				let playlistId = uni.getStorageSync('collectionPlaylistId');
				App._get("/api/music/collectOrCancelMusic", {
					musicId: musicId,
					playlistId: playlistId,
					op: op
				}, res => {
					if (res.data["data"]["success"]) {
						this.childSongLists.music_list[index].is_like = change
					}
				});
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
				this.screenHeight = uni.getSystemInfoSync().windowHeight -
					playerHeight - statusBarHeight - 44 - uni.$u.getPx(uni.$u.getPx('20rpx', true))
			}
		}


	}
</script>

<style>
	.body {
		padding: 0 20rpx 20rpx 20rpx;
	}

	.one-song {
		/* border-top: 1rpx solid #c8c9cc; */
		border-bottom: 1rpx solid #c8c9cc;
		display: flex;
		justify-content: space-between;
		padding-top: 16rpx;
		padding-bottom: 16rpx;
	}

	.song-info {
		display: flex;
		justify-content: flex-start;
	}

	.song-name-singer {
		padding-top: 12rpx;
		padding-left: 16rpx;
	}

	.song-button-group {
		display: flex;
	}

	.play-button {
		display: flex;
		padding-right: 20rpx;
	}
</style>