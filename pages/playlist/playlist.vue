<template>
	<view class="playlist-body">
		<view class="playlist-info">
			<view class="playlist-cover">
				<u--image :showLoading="true" :src="playlistinfo.cover" radius="20" width="230rpx"
					height="230rpx"></u--image>
			</view>
			<view class="playlist-introduction">
				<u--text lines="1" size="38" bold :text="playlistinfo.name"></u--text>
				<view v-if="playlistinfo.updateTime!=''" class="playlist-updateTime">
					<u--text size="28" :text="playlistinfo.updateTime+' 更新'"></u--text>
				</view>
				<view class="playlist-creator">
					<view class="playlist-creator-by">
						<u--text size="28" text="by"></u--text>
					</view>
					<view class="playlist-creator-author">
						<u--text size="28" lines="1" type="primary" :text="playlistinfo.creator"></u--text>
					</view>
				</view>
				<view v-if="playlistinfo.cat!=''" class="playlist-cat">
					<u--text size="28" lines="1" type="warning" :text="playlistinfo.cat"></u--text>
				</view>
				<view v-if="playlistinfo.playCount!=''" class="playlist-data">
					<view class="playlist-data-playCount">
						<u-icon name="kefu-ermai" :label="playCountFormat(playlistinfo.playCount)"
							labelSize="28"></u-icon>
					</view>
					<view class="playlist-data-loveCount">
						<u-icon name="heart" :label="playCountFormat(playlistinfo.loveCount)" labelSize="28"></u-icon>
					</view>
					<view class="playlist-data-chatCount">
						<u-icon name="chat" :label="playCountFormat(playlistinfo.chatCount)" labelSize="28"></u-icon>
					</view>
				</view>
				<view class="playlist-introduction-text">
					<u--text @click="openPopup" suffixIcon="arrow-right" iconStyle="font-size: 7px" size="28" lines="1"
						:text="playlistinfo.introduction"></u--text>
				</view>
			</view>
		</view>
		<view class="playlist-songlist">
			<view class="playlist-songlist-button">
				<view class="songlist-title-number">
					<view class="songlist-title">
						<u--text size="38" bold text="歌曲列表"></u--text>
					</view>
					<view class="songlist-totalCountNumber">
						<u--text size="26" :text="playlistinfo.songsNumber+'首歌'"></u--text>
					</view>
				</view>
				<view class="songlist-playButton">
					<u-button @click="playAllMusics" icon="play-right" shape="circle" type="primary" size="small"
						text="播放全部"></u-button>
				</view>
			</view>
			<view class="songlist">
				<u-list @scrolltolower="scrolltolower" :height="screenHeight+'px'">
					<u-list-item v-for="(item, index) in showList" :key="index">
						<view class="songlist-song">
							<view class="song-index">
								<u--text align="center" size="28" :text="index+1"></u--text>
							</view>
							<view class="song-info">
								<view class="song-name-singer" @click="playOneMusic(index)">
									<u--text :color="childCurrentMusic==index ? '#3c9cff':''" lines="1" bold size="36"
										:text="item.music_name"></u--text>
									<u--text :color="childCurrentMusic==index ? '#3c9cff':''" lines="1" size="28"
										:text="item.music_singer"></u--text>
								</view>
								<view class="song-button-group">
									<view class="play-button">
										<u-icon @click="downloadMusic(index)" size="50" name="download"></u-icon>
									</view>
									<u-icon @click="collectOrCancelMusic(index)" :color="item.is_like ? 'red':''"
										size="50" :name="item.is_like ? 'heart-fill':'heart'"></u-icon>
								</view>
							</view>
						</view>
					</u-list-item>
				</u-list>

			</view>
		</view>
		<view class="playlist-information-introduction">
			<u-popup round="20" :safeAreaInsetTop="true" :show="popupShow" mode="top" @close="PopupClose">
				<view class="popupContent">
					<view class="popupContent-cover-name">
						<view class="popupContent-cover">
							<u--image radius="20" :src="playlistinfo.cover" width="300rpx" height="300rpx"></u--image>
						</view>
						<view class="popupContent-name">
							<u--text size="34" :text="playlistinfo.name"></u--text>
						</view>
					</view>
					<u-line></u-line>
					<view class="popupContent-creator-cat-introduction">
						<view class="popupContent-creator-cat">
							<view class="popupContent-creator">
								<view style="padding-right: 10rpx;"><u--text size="28" text="创建人:"></u--text></view>
								<u--text size="28" type="primary" :text="playlistinfo.creator"></u--text>
							</view>
							<view class="popupContent-cat" v-if="playlistinfo.cat!=''">
								<view style="padding-right: 10rpx;"><u--text size="28" text="标签:"></u--text></view>
								<u--text size="28" type="warning" :text="playlistinfo.cat"></u--text>
							</view>
						</view>

						<scroll-view :style="'height: '+popupContentIntroductionHeight+'px'" scroll-y="true"
							class="popupContent-introduction">
							<u--text size="28" :text="playlistinfo.introduction"></u--text>
						</scroll-view>
					</view>
				</view>
			</u-popup>
		</view>
		<u-loading-page iconSize="38" fontSize="38" :loading="loadingStatus"></u-loading-page>
	</view>
</template>

<script>
	var App = require("@/common.js");
	export default {
		props: {
			fatherSongListsId: String,
			fatherCurrnt: Number,
			playerHeight: {
				type: Number,
				default: 110
			}
		},
		data() {
			return {
				playlistType: "normal",
				loadingStatus: true,
				childCurrentMusic: -1,
				popupContentIntroductionHeight: 150,
				popupShow: false,
				playlistinfo: {
					id: "initial",
					name: "加载中...",
					cover: "https://p2.music.126.net/c-u3kOlkVTUf4JdeDHDdEw==/109951163291871252.jpg",
					updateTime: "",
					creator: "一只喵喵喵星人",
					cat: "",
					playCount: "",
					loveCount: "",
					chatCount: "",
					introduction: "",
					songsNumber: "0",
					music_list: []
				},
				screenHeight: 0,
				showList: [],
				showListIndex: 0
			}
		},
		mounted() {
			let playlistId = uni.getStorageSync('playlistId');
			this.playlistType = uni.getStorageSync('playlistType');
			this.showList.length = 0;
			this.showListIndex = 0;
			// console.log(playlistId)
			App._get("/api/playlist/getPlaylistInformation", {
				id: playlistId
			}, res => {
				this.playlistinfo = res.data["data"]["playlist"]
				this.loadmore()
				if (this.fatherSongListsId == this.playlistinfo.id) {
					this.childCurrentMusic = this.fatherCurrnt
				}
				uni.removeStorageSync('playlistId');
				uni.removeStorageSync('playlistType');
				this.setHeight()
				this.loadingStatus = false
			});

		},
		watch: {
			fatherCurrnt(newVal) {
				let _this = this;
				if (_this.fatherSongListsId == _this.playlistinfo.id) {
					_this.childCurrentMusic = newVal
				} else if (_this.childCurrentMusic != -1) {
					_this.childCurrentMusic = -1
				}
			}
		},
		methods: {
			collectOrCancelMusic(index) {
				let musicId = this.playlistinfo.music_list[index].music_id
				let op;
				let change;
				if (this.playlistinfo.music_list[index].is_like) {
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
						if (this.playlistType == "normal") {
							this.playlistinfo.music_list[index].is_like = change
						} else {
							if (this.playlistinfo.music_list[index].is_like) {
								var new_arr = this.playlistinfo.music_list.splice(index, 1)
								if (this.childCurrentMusic != -1) {
									this.childCurrentMusic = -1;
									this.changePlaylistId()
								}
								this.playlistinfo.songsNumber = this.playlistinfo.songsNumber - 1
							} else {
								this.playlistinfo.music_list[index].is_like = change
							}

						}
					}
				});
			},
			changePlaylistId() {
				this.$emit("changePlaylistId", "change")
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
					id: this.playlistinfo.music_list[index].music_id
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
						// if (downloadTaskRes.progress > 50) {
						// 	downloadTask.abort();
						// }
					});

				});
			},
			setHeight() {
				//音乐播放器高度
				var playerHeight = this.playerHeight
				// 顶部状态栏 高度
				var statusBarHeight = uni.getSystemInfoSync().statusBarHeight
				// 苹果安全区域高度
				// var safeArea = uni.getSystemInfoSync().safeAreaInsets.bottom
				// 其他区域高度 包括 .playlist-body的padding 
				var otherHeight = uni.$u.getPx(uni.$u.getPx(20 + 'rpx', true))
				// console.log('statusBarHeight:', statusBarHeight)
				// console.log('safeArea:', safeArea)
				// .playlist-info 的高度
				var playlistinfoHeight = 0;
				// .playlist-songlist-button 的高度
				var playlistButtonHeight = 0;
				const query = uni.createSelectorQuery().in(this);
				const query1 = uni.createSelectorQuery().in(this);
				query.select(".playlist-info").boundingClientRect(data => {
					playlistinfoHeight = data.height
					// console.log('playlistinfoHeight：', playlistinfoHeight)
					query1.select(".playlist-songlist-button").boundingClientRect(data1 => {
						playlistButtonHeight = data1.height
						// 其中 45px为顶部导航的固定高度
						this.screenHeight = uni.getSystemInfoSync().windowHeight -
							playlistinfoHeight -
							playerHeight - statusBarHeight - otherHeight - 45 - playlistButtonHeight
						// console.log(this.screenHeight)

					}).exec()
				}).exec()
			},
			playCountFormat(playCount) {
				return App.playCountFormat(playCount);
			},
			playAllMusics() {
				if (this.playlistinfo.music_list.length == 0) {
					uni.showToast({
						icon: "none",
						title: "没有歌曲"
					})
				} else {
					this.childCurrentMusic = 0
					var data = {
						childSongListsId: this.playlistinfo.id,
						index: 0
					}
					this.$emit("getChild", data)
				}

			},
			playOneMusic(index) {
				this.childCurrentMusic = index
				var data = {
					childSongListsId: this.playlistinfo.id,
					index: index
				}
				this.$emit("getChild", data)
			},
			loadmore() {
				if (this.showListIndex == Number(this.playlistinfo.songsNumber) && Number(this.playlistinfo.songsNumber) !=
					0) {
					uni.showToast({
						icon: "none",
						title: "到底了..."
					})
				} else {
					let initial = this.showListIndex;
					let endIndex = 30;
					if (initial + 30 >= Number(this.playlistinfo.songsNumber)) {
						endIndex = Number(this.playlistinfo.songsNumber)
					} else {
						endIndex = initial + 30
					}
					// console.log("end:" + endIndex)
					for (let i = initial; i < endIndex; i++) {
						this.showList.push(this.playlistinfo.music_list[i])
						this.showListIndex = this.showListIndex + 1
					}
				}
				// console.log(this.showList)
				// console.log(this.showListIndex)
			},
			scrolltolower() {
				this.loadmore()
			},
			openPopup() {
				this.popupShow = true
				setTimeout(() => {
					this.setPopupContentHeight()
				}, 310)
			},
			PopupClose() {
				this.popupShow = false
			},
			setPopupContentHeight() {
				const query2 = uni.createSelectorQuery().in(this);
				const query3 = uni.createSelectorQuery().in(this);
				var height1 = 0;
				var height2 = 0;
				var popupContent = uni.$u.getPx(uni.$u.getPx('830rpx', true))
				// console.log(popupContent)
				query2.select(".popupContent-cover-name").boundingClientRect(data => {
					// console.log(data)
					height1 = data.height
					query3.select(".popupContent-creator-cat").boundingClientRect(data1 => {
						// console.log(data1)
						height2 = data1.height
						this.popupContentIntroductionHeight = popupContent - height1 - height2
						// console.log(this.popupContentIntroductionHeight)
					}).exec()
				}).exec()
			}
		}
	}
</script>

<style>
	.playlist-body {
		padding-top: 20rpx;
		padding-left: 10rpx;
		padding-right: 10rpx;
	}

	.playlist-info {
		display: flex;
	}

	/* 	.playlist-cover{
		display: flex;
		flex-direction: column;
		justify-content: center;
	} */

	.playlist-introduction {
		padding: 0 20rpx;
	}

	.playlist-creator,
	.playlist-data {
		display: flex;
		padding-top: 6rpx;
	}

	.playlist-creator-author,
	.playlist-data-loveCount,
	.playlist-data-chatCount {
		padding-left: 10rpx;
	}

	.playlist-updateTime,
	.playlist-cat,
	.playlist-introduction-text {
		padding-top: 6rpx;
	}

	.songlist-title-number {
		display: flex;
	}

	.songlist-title {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.songlist-totalCountNumber {
		padding-left: 16rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.playlist-songlist-button {
		padding-top: 20rpx;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.songlist-song {
		padding: 10rpx 0;
		display: flex;
	}

	.song-index {
		width: 10%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.song-info {
		width: 90%;
		display: flex;
		justify-content: space-between;
	}

	.song-name-singer {
		min-width: 60%;
		padding-left: 10rpx;
	}

	.song-button-group {
		display: flex;
		padding-right: 20rpx;
	}


	.play-button {
		display: flex;
		padding-right: 20rpx;
		flex-direction: column;
		justify-content: center;
	}

	.popupContent {
		padding-top: 40rpx;
		height: 850rpx;
	}

	.popupContent-cover-name {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.popupContent-name {
		padding-top: 20rpx;
		padding-bottom: 20rpx;
	}

	.popupContent-creator-cat-introduction {
		padding: 0 80rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		/* align-items: center; */
	}

	.popupContent-creator-cat {
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.popupContent-creator,
	.popupContent-cat {
		padding-top: 8rpx;
		padding-bottom: 8rpx;
		display: flex;
		flex-direction: row;
	}
</style>