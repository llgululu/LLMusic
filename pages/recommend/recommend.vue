<template>
	<view class="recommend">
		<view class="recommend-body">
			<view class="play-all-button">
				<u-icon @click="playAllSongs" space="20" size="50" labelColor="#3c9cff" color="#3c9cff" labelSize="36"
					label="播放全部" name="play-circle-fill"></u-icon>
			</view>
			<view class="one-song" v-for="(item, index) in childSongLists.music_list" :key="index">
				<view @click="sendToFather(index)" class="song-info">
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
		</view>
		<u-loading-page iconSize="38" fontSize="38" :loading="loadingStatus"></u-loading-page>
	</view>
</template>

<script>
	var App = require("@/common.js");
	export default {
		props: {
			fatherSongListsId: String,
			fatherCurrnt: Number
		},
		mounted() {
			let _this = this;
			App._get("/api/recommend/getRecommendedData", {}, res => {
				_this.childSongLists = res.data["data"]["playlist"]
				// console.log("123:" + _this.fatherSongListsId)
				// console.log("456:" + _this.childSongLists.id)
				if (_this.fatherSongListsId == _this.childSongLists.id) {
					_this.childCurrentMusic = _this.fatherCurrnt
				}
				setTimeout(() => {
					_this.loadingStatus = false
				}, 600)
			});
		},
		watch: {
			fatherCurrnt(newVal) {
				console.log(newVal)
				let _this = this;
				if (_this.fatherSongListsId == _this.childSongLists.id) {
					_this.childCurrentMusic = newVal
				} else if (_this.childCurrentMusic != -1) {
					_this.childCurrentMusic = -1
				}
			}
		},
		data() {
			return {
				loadingStatus: true,
				childCurrentMusic: -1,
				childSongLists: {
					id: "3",
					music_list: [{
							music_id: "1",
							music_cover: "https://p1.music.126.net/w1pQ83qhoVMJ_eMpRyoAtA==/109951166200199773.jpg",
							music_singer: "Goose house",
							music_name: "光るなら",
							music_time: "04:14",
							is_like: true
						}, {
							music_id: "2",
							music_cover: "https://p1.music.126.net/_zYzyYUidI7mfXeHKiSS0g==/109951166701711136.jpg",
							music_singer: "胡彦斌",
							music_name: "One Night in Shang Hai",
							music_time: "04:02",
							is_like: false
						},
						{
							music_id: "3",
							music_cover: "https://p1.music.126.net/_zYzyYUidI7mfXeHKiSS0g==/109951166701711136.jpg",
							music_singer: "胡彦斌",
							music_name: "One Night in Shang Hai",
							music_time: "04:02",
							is_like: false
						},
					]
				},
			}
		},
		methods: {
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
					if(res.data["data"]["success"]){
						this.childSongLists.music_list[index].is_like = change
					}
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
			sendToFather(index) {
				this.childCurrentMusic = index
				console.log(index)
				var data = {
					childSongListsId: this.childSongLists.id,
					index: index
				}
				this.$emit("getChild", data)
			},
			playAllSongs() {
				if (this.childSongLists.music_list.length == 0) {
					uni.showToast({
						icon: "none",
						title: "没有歌曲"
					})
				} else {
					this.childCurrentMusic = 0
					var data = {
						childSongListsId: this.childSongLists.id,
						index: 0
					}
					this.$emit("getChild", data)
				}

			}
		}
	}
</script>

<style>
	.recommend {
		padding-top: 20rpx;
	}

	.recommend-body {
		padding-left: 20rpx;
		padding-right: 20rpx;
	}

	.play-all-button {
		padding-bottom: 20rpx;
	}

	.one-song {
		border-top: 2rpx solid #c8c9cc;
		display: flex;
		justify-content: space-between;
		padding-top: 16rpx;
		padding-bottom: 16rpx;
	}

	.song-info {
		display: flex;
		justify-content: flex-start;
	}

	.song-button-group {
		display: flex;
	}

	.play-button {
		display: flex;
		padding-right: 20rpx;
	}

	.song-name-singer {
		padding-top: 12rpx;
		padding-left: 16rpx;
	}
</style>