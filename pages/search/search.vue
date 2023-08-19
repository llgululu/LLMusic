<template>
	<view class="serach">
		<view class="search-songs">
			<view class="search-songs-title">
				<u--text :bold="true" size="40" text="单曲"></u--text>
			</view>
			<view class="search-songs-list">
				<view class="one-song" v-for="(item, index) in childSongLists.music_list" :key="index">
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
			</view>
			<view v-if="Number(totalSongNumber) > 8" class="search-songs-more">
				<u-icon size="28" @click="viewAllSong" color="black" labelSize="28" labelPos="left"
					:label="'查看全部'+totalSongNumber+'首单曲'" name="arrow-right"></u-icon>
			</view>
			<view class="warning-no-data" v-if="Number(childSongLists.songsNumber) == 0&&Number(totalSongNumber)==0">
				<u-icon size="40" labelSize="40" label="数据为空!" name="warning"></u-icon>
			</view>
		</view>
		<view class="search-playlists">
			<view class="search-playlist-title">
				<u--text :bold="true" size="40" text="歌单"></u--text>
			</view>
			<view class="search-playlist-list">
				<view @click="viewPlaylist(index)" v-for="(item,index) in playlistlist.list" :key="index"
					class="one-playlist">
					<view class="playlist-cover">
						<u--image radius="10" :src="item.cover" width="120" height="120"></u--image>
					</view>
					<view class="playlist-name-introduction">
						<u--text lines="1" size="34" :text="item.name"></u--text>
						<u--text lines="1" size="26" :text="item.introduction"></u--text>
					</view>
				</view>
			</view>
			<view v-if="Number(totalPlaylistNumber) > 8" class="search-playlist-more">
				<u-icon size="28" @click="viewAllPlaylist" color="black" labelSize="28" labelPos="left"
					:label="'查看全部'+totalPlaylistNumber+'个歌单'" name="arrow-right"></u-icon>
			</view>
			<view class="warning-no-data"
				v-if="Number(playlistlist.playlistCount) == 0&&Number(totalPlaylistNumber)==0">
				<u-icon size="40" labelSize="40" label="数据为空!" name="warning"></u-icon>
			</view>
		</view>
		<u-loading-page iconSize="38" fontSize="38" :loading="loadingStatus"></u-loading-page>
	</view>
</template>

<script>
	var App = require("@/common.js");
	export default {
		data() {
			return {
				childCurrentMusic: -1,
				loadingStatus: true,
				totalPlaylistNumber: "0",
				totalSongNumber: "0",
				childSongLists: {
					id: "initialSearch",
					name: "加载中...",
					cover: "https://p2.music.126.net/c-u3kOlkVTUf4JdeDHDdEw==/109951163291871252.jpg",
					creator: "llgululu",
					songsNumber: "0",
					music_list: []
				},
				playlistlist: {
					playlistCount: "0",
					list: []
				}
			}
		},
		mounted() {
			let key = uni.getStorageSync('searchKeywords') || "海阔天空";
			App._get("/api/search/getSearchResult", {
				keywords: key
			}, res => {
				this.totalPlaylistNumber = res.data["data"]["totalPlaylistCount"]
				this.totalSongNumber = res.data["data"]["totalSongCount"]
				this.childSongLists = res.data["data"]["childSongLists"]
				this.playlistlist = res.data["data"]["playlistlist"]
				this.loadingStatus = false
			})
		},
		methods: {
			viewAllSong() {
				var data = {
					from: "6",
					to: "7"
				}
				this.$emit("pageTo", data)
			},
			viewAllPlaylist() {
				var data = {
					from: "6",
					to: "8"
				}
				this.$emit("pageTo", data)
			},
			viewPlaylist(index) {
				var data = {
					from: "6",
					to: "3"
				}
				uni.setStorageSync('playlistId', this.playlistlist.list[index].id);
				uni.setStorageSync('playlistType', "normal");
				this.$emit("pageTo", data)
			},
			playOneMusic(index) {
				var data = {
					id: this.childSongLists.id,
					songsNumber: "1",
					music_list: [
						this.childSongLists.music_list[index]
					]
				}
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
		}
	}
</script>

<style>
	.serach {
		padding: 0 20rpx 20rpx 20rpx;
	}

	.search-songs-title,
	.search-playlist-title {
		padding: 20rpx 0;
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

	.search-songs-more,
	.search-playlist-more {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid #c8c9cc;
		display: flex;
		justify-content: center;
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

	.warning-no-data {
		display: flex;
		justify-content: center;
		padding: 20rpx 0;
	}
</style>