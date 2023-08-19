<template>
	<view>
		<view class="app-navbar">
			<u-navbar bgColor="#3c9cff" :placeholder="true" titleStyle="color:white" :title="navbarTitle">
				<view @click="returnTO" :style="navbarReturnShow ? '':'display:none'" class="u-nav-slot" slot="left">
					<u-icon color="white" name="arrow-left" size="32"></u-icon>
				</view>
			</u-navbar>
		</view>
		<view :style="'margin-bottom:'+musicPlayerHeight+'px'" class="other-pages">
			<home v-if="pageName=='index'" @getChild="getChild" @pageTo="pageTo" ref="home"></home>
			<recommend v-if="pageName=='recommend'" @getChild="getChild" @changePlaylistId="changePlaylistId"
				:fatherSongListsId="songLists.id" :fatherCurrnt="current_music" ref="recommend"></recommend>
			<playlistPiazza v-if="pageName=='playlistPiazza'" @pageTo="pageTo" :playerHeight="musicPlayerHeight"
				ref="playlistPiazza"></playlistPiazza>
			<playlist v-if="pageName=='playlist'" @getChild="getChild" :playerHeight="musicPlayerHeight"
				:fatherSongListsId="songLists.id" :fatherCurrnt="current_music" ref="playlist"></playlist>
			<rankingList v-if="pageName=='rankingList'" @pageTo="pageTo" ref="rankingList"></rankingList>
			<search v-if="pageName=='search'" @pageTo="pageTo" @playOneMusic="playOneMusic" ref="search"></search>
			<searchPlaylist v-if="pageName=='searchPlaylist'" @pageTo="pageTo" :playerHeight="musicPlayerHeight"
				ref="searchPlaylist"></searchPlaylist>
			<searchSong v-if="pageName=='searchSong'" @playOneMusic="playOneMusic" :playerHeight="musicPlayerHeight"
				ref="searchSong"></searchSong>
			<instruction v-if="pageName=='instruction'" ref="instruction"></instruction>
		</view>

		<view class="music-list-popup">
			<u-popup :round="25" :show="popupShow" @close="closePopup">
				<view class="popup">
					<view class="popup-content-content">
						<view class="music-list-title">
							<view>
								<u--text @click="getPopupTitleHeight" :bold="true" size="40" text="当前播放"></u--text>
							</view>
							<u--text size="28" :text="'('+songLists.music_list.length+')'"></u--text>
						</view>
						<u-line color="#2979ff"></u-line>
						<scroll-view lower-threshold="35" @scrolltolower="playerScrolltolower"
							:style="'height:'+musiclistPopupHeight+'px'" scroll-y="true" class="music-list-content">
							<view v-for="(item, index) in showList" :key="index">
								<u-cell :arrow="false">
									<view @click="choseOnePlay(index)" slot="title" class="musiclist-slot-info">
										<u-icon v-if="index==current_music" color="#2979ff" size="36"
											:name="isPlay ? 'volume':'volume-off'"></u-icon>
										<view class="musiclist-name">
											<u--text :type="index==current_music ? 'primary':''" :lines="1" size="36"
												:bold="true" :text="item.music_name"></u--text>
										</view>
										<u--text :type="index==current_music ? 'primary':''" :lines="1" size="28"
											:text="item.music_singer"></u--text>
									</view>
									<u-icon @click="removeOneFromMusicList(index)" slot="right-icon"
										name="close"></u-icon>
								</u-cell>
							</view>
						</scroll-view>
					</view>
				</view>
			</u-popup>
		</view>
		<view class="music-player">
			<view class="music-line-progress">
				<u-line-progress height="12" :showText="false" :percentage="value"
					activeColor="#3c9cff"></u-line-progress>
			</view>
			<view class="music-player-interface">
				<view class="music-cover">
					<image
						:src="songLists.songsNumber=='0'? songLists.cover:songLists.music_list[current_music].music_cover">
					</image>
				</view>
				<view class="music-info">
					<view class="music-name-time">
						<view class="music-name">
							<u--text :lines="1" :bold="true" size="40"
								:text="songLists.songsNumber=='0'? '暂无歌曲':songLists.music_list[current_music].music_name"></u--text>
						</view>
						<view class="music-time">
							<u--text size="24" align="right" v-if="songLists.songsNumber!='0'"
								:text="songLists.music_list[current_music].music_time"></u--text>
						</view>
					</view>
					<u--text v-if="songLists.songsNumber!='0'" :lines="1" type="info" size="28"
						:text="songLists.music_list[current_music].music_singer"></u--text>
					<view class="player-button-group">
						<view class="right-hidden">
							<u-icon size="50" name="list-dot"></u-icon>
						</view>
						<view class="pre-player-button">
							<u-icon @click="preMusic" size="50" name="play-left"></u-icon>
						</view>
						<view class="music-play-button">
							<u-icon @click="musicPlayOrStop" size="75" :name="player_states_icon"></u-icon>
						</view>
						<view class="next-player-button">
							<u-icon @click="nextMusic" size="50" name="play-right"></u-icon>
						</view>
						<view class="open-music-list">
							<u-icon @click="openPopup" size="50" name="list-dot"></u-icon>
						</view>
					</view>

				</view>
			</view>
		</view>
	</view>

</template>

<script>
	var App = require("@/common.js");
	const innerAudioContext = uni.createInnerAudioContext();
	import home from "@/pages/index/index.vue"; //首页
	import recommend from "@/pages/recommend/recommend.vue"
	import playlistPiazza from "@/pages/playlist/playlistPiazza.vue"
	import playlist from "@/pages/playlist/playlist.vue"
	import rankingList from "@/pages/rankingList/rankingList.vue"
	import search from "@/pages/search/search.vue"
	import searchPlaylist from "@/pages/search/searchPlaylist.vue"
	import searchSong from "@/pages/search/searchSong.vue"
	import instruction from "@/pages/instruction/instruction.vue"
	export default {
		components: {
			home,
			recommend,
			playlistPiazza,
			playlist,
			rankingList,
			search,
			searchPlaylist,
			searchSong,
			instruction
		},
		data() {
			return {
				musicPlayerHeight: 110,
				musiclistPopupHeight: 300,
				pageName: 'index',
				songLists: {
					id: "initial",
					name: "加载中",
					cover: "https://p1.music.126.net/jWE3OEZUlwdz0ARvyQ9wWw==/109951165474121408.jpg",
					updateTime: "",
					creator: "",
					cat: "",
					playCount: "",
					loveCount: "",
					chatCount: "",
					introduction: "",
					songsNumber: "0",
					music_list: []
				},
				navbarReturnShow: false,
				popupShow: false,
				value: 0,
				music_play_time: 0,
				current_music: 0,
				isPlay: false,
				navbarTitle: "LL-Music",
				player_states_icon: "play-circle",
				showList: [],
				showListIndex: 0,
				returnPageIndexList: [],
				pageMapList: [{
						name: "index",
						title: "LL-Music",
						isReturnButtonShow: false,
					},
					{
						name: "recommend",
						title: "每日推荐",
						isReturnButtonShow: true,
					},
					{
						name: "playlistPiazza",
						title: "歌单广场",
						isReturnButtonShow: true,
					},
					{
						name: "playlist",
						title: "歌单",
						isReturnButtonShow: true,
					},
					{
						name: "rankingList",
						title: "排行榜",
						isReturnButtonShow: true,
					},
					{
						name: "playlist",
						title: "收藏",
						isReturnButtonShow: true,
					},
					{
						name: "search",
						title: "搜索",
						isReturnButtonShow: true,
					},
					{
						name: "searchSong",
						title: "单曲搜索",
						isReturnButtonShow: true,
					},
					{
						name: "searchPlaylist",
						title: "歌单搜索",
						isReturnButtonShow: true,
					},
					{
						name: "instruction",
						title: "介绍说明",
						isReturnButtonShow: true,
					}
				]
			}
		},
		mounted() {
			this.getMusicPlayerHeight()
		},
		onLoad() {
			let _this = this;
			App.wxLogin(res => {
				App._get("/api/playlist/getPlaylistInformation", {
					id: res.data["data"]["playlistId"]
				}, su => {
					this.showList.length = 0;
					this.showListIndex = 0;
					this.songLists = su.data["data"]["playlist"]
					this.loadmore()
				})
			})
			// _this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
			// 	innerAudioContext.src = res
			// })
			const loadDuration = function() {
				setTimeout(() => {
					if (innerAudioContext.duration === 0) {
						loadDuration();
					} else {
						_this.getMusicTime()
						// _this.music_play_time = innerAudioContext.duration.toFixed(0)
						// console.log('可以播放了', _this.music_play_time)
					}
				}, 100);
			};
			//   ..音频可以播放 取音频时常并计算
			innerAudioContext.onCanplay(loadDuration)
			// 音频播放事件
			innerAudioContext.onPlay(() => {
				_this.player_states_icon = "pause-circle"
				_this.isPlay = true
				console.log('开始播放');
			})
			// 音频暂停事件
			innerAudioContext.onPause(() => {
				_this.player_states_icon = "play-circle"
				_this.isPlay = false
				console.log('暂停播放');
			})
			//监听播放时间 及 计算播放进度
			innerAudioContext.onTimeUpdate(() => {
				//播放时间
				var time = innerAudioContext.currentTime.toFixed(0)
				// console.log(time)
				_this.value = time / _this.music_play_time * 100
			})
			// 音频加载中事件，当音频因为数据不足，需要停下来加载时会触发
			innerAudioContext.onWaiting(() => {
				uni.showToast({
					icon: "loading",
					title: "加载中...",
				})
				console.log('数据加载中...');
				// console.log(innerAudioContext.src)
			})
			innerAudioContext.onError((res) => {
				console.log(res.errMsg);
				console.log(res.errCode);
				uni.showToast({
					icon: "error",
					title: res.errMsg,
				})
			});
			innerAudioContext.onEnded(() => {
				_this.nextMusic()
				console.log('播放结束');
			})
		},
		methods: {
			loadmore() {
				if (this.showListIndex == Number(this.songLists.songsNumber)) {
					uni.showToast({
						icon: "none",
						title: "到底了..."
					})
				} else {
					let initial = this.showListIndex;
					let endIndex = 30;
					if (initial + 30 >= Number(this.songLists.songsNumber)) {
						endIndex = Number(this.songLists.songsNumber)
					} else {
						endIndex = initial + 30
					}
					// console.log("end:" + endIndex)
					for (let i = initial; i < endIndex; i++) {
						this.showList.push(this.songLists.music_list[i])
						this.showListIndex = this.showListIndex + 1
					}
				}
				// console.log(this.showList)
				// console.log(this.showListIndex)
			},
			playerScrolltolower() {
				// console.log('到底部了');
				this.loadmore()
			},
			getMusicTime() {
				let musicStr = this.songLists.music_list[this.current_music].music_time
				let time_arr = musicStr.split(":")
				let min = Number(time_arr[0])
				let se = Number(time_arr[1])
				this.music_play_time = 60 * min + se
				console.log('可以播放了', this.music_play_time)
			},
			getMusicUrl(id, success) {
				App._get("/api/music/getMusicURLById", {
					id: id
				}, res => {
					// this.rSongList_list = res.data["data"]["id"]
					success(res.data["data"]["url"])
				});
			},
			scrolltolower() {
				uni.showToast({
					icon: 'none',
					title: '已经到底了'
				})
			},
			returnTO() {
				let _this = this;
				var index = _this.returnPageIndexList.pop()
				// console.log(index)
				_this.pageName = _this.pageMapList[index].name
				_this.navbarReturnShow = _this.pageMapList[index].isReturnButtonShow
				_this.navbarTitle = _this.pageMapList[index].title
			},
			pageTo(e) {
				let _this = this;
				var to = e.to
				_this.returnPageIndexList.push(e.from)
				_this.pageName = _this.pageMapList[to].name
				_this.navbarReturnShow = _this.pageMapList[to].isReturnButtonShow
				_this.navbarTitle = _this.pageMapList[to].title
				// console.log(e)
			},
			getChild(e) {
				let _this = this;
				// 这里最开始用的 = 浅拷贝，导致父页面修改后，子页面跟着修改
				// 所以这里选择深克隆 
				// console.log(e)
				let b = uni.$u.deepClone(e);
				_this.getPlaylistInfo(b.childSongListsId, b.index)
			},
			playOneMusic(e) {
				let b = uni.$u.deepClone(e);
				this.showList.length = 0;
				this.showListIndex = 0;
				this.songLists = b;
				this.loadmore()
				// console.log(this.songLists)
				this.current_music = 0;
				this.getMusicUrl(this.songLists["music_list"][this.current_music].music_id, res => {
					if (res == null) {
						uni.showToast({
							icon: "none",
							title: "该音乐不能播放"
						})
					} else {
						innerAudioContext.src = res
						innerAudioContext.play()
					}

				})
			},
			changePlaylistId(e) {
				this.songLists.id = "change"
			},
			getPlaylistInfo(id, current) {
				let url = "";
				let params = {};
				if (id == "recommendedSongsInIndex") {
					url = "/api/index/getRecommendedData"
				} else if (id == "recommendedSongsInRecommended") {
					url = "/api/recommend/getRecommendedData"
				} else {
					url = "/api/playlist/getPlaylistInformation";
					params = {
						id: id
					}
				}
				App._get(url, params, res => {
					this.showList.length = 0;
					this.showListIndex = 0;
					this.songLists = res.data["data"]["playlist"];
					this.loadmore()
					// console.log(this.songLists)
					this.current_music = current;
					this.getMusicUrl(this.songLists["music_list"][this.current_music].music_id, res => {
						if (res == null) {
							uni.showToast({
								icon: "none",
								title: "该音乐不能播放"
							})
						} else {
							innerAudioContext.src = res
							innerAudioContext.play()
						}
					})
				});
			},
			choseOnePlay(index) {
				// console.log(index)
				let _this = this;
				if (_this.isPlay && index == _this.current_music) {
					innerAudioContext.pause()
					console.log("pause", index)
				} else {
					_this.current_music = index;
					_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
						if (res == null) {
							uni.showToast({
								icon: "none",
								title: "该音乐不能播放"
							})
						} else {
							innerAudioContext.src = res
							innerAudioContext.play()
						}
					})
					console.log("play", index)
				}

			},
			removeOneFromMusicList(index) {
				let _this = this;
				if (index < _this.current_music) {
					_this.songLists.music_list.splice(index, 1)
					_this.current_music = _this.current_music - 1
				} else if (index == _this.current_music) {
					if (_this.songLists.music_list.length == 1) {
						uni.showToast({
							icon: "error",
							title: "已是最后一首"
						})
					} else if (index < _this.songLists.music_list.length - 1) {
						if (_this.isPlay) {
							innerAudioContext.pause()
							_this.songLists.music_list.splice(index, 1)
							_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
								if (res == null) {
									uni.showToast({
										icon: "none",
										title: "该音乐不能播放"
									})
								} else {
									innerAudioContext.src = res
									innerAudioContext.play()
								}
							})
						} else {
							_this.songLists.music_list.splice(index, 1)
							_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
								if (res == null) {
									uni.showToast({
										icon: "none",
										title: "该音乐不能播放"
									})
								} else {
									innerAudioContext.src = res
								}
							})
						}
					} else {
						if (_this.isPlay) {
							innerAudioContext.pause()
							_this.songLists.music_list.splice(index, 1)
							_this.current_music = 0;
							_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
								if (res == null) {
									uni.showToast({
										icon: "none",
										title: "该音乐不能播放"
									})
								} else {
									innerAudioContext.src = res
									innerAudioContext.play()
								}
							})
						} else {
							_this.songLists.music_list.splice(index, 1)
							_this.current_music = 0;
							_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
								if (res == null) {
									uni.showToast({
										icon: "none",
										title: "该音乐不能播放"
									})
								} else {
									innerAudioContext.src = res
								}
							})
						}
					}

				} else {
					_this.songLists.music_list.splice(index, 1)
				}
				_this.songLists.id = "remove";
				console.log("remove", index)
			},
			closePopup() {
				this.popupShow = false
			},
			openPopup() {
				this.popupShow = true
				setTimeout(() => {
					this.getPopupTitleHeight()
				}, 310)

			},
			nextMusic() {
				let _this = this;
				if (_this.songLists.songsNumber == "0") {
					uni.showToast({
						icon: "none",
						title: "无音乐可播放"
					})
				} else {
					innerAudioContext.pause()
					if (_this.current_music < _this.songLists.music_list.length - 1) {
						_this.current_music = _this.current_music + 1
					} else {
						_this.current_music = 0
					}
					console.log("下一首")
					_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
						if (res == null) {
							uni.showToast({
								icon: "none",
								title: "该音乐不能播放"
							})
						} else {
							innerAudioContext.src = res
							innerAudioContext.play()
						}
					})
				}

			},
			preMusic() {
				let _this = this;
				if (_this.songLists.songsNumber == "0") {
					uni.showToast({
						icon: "none",
						title: "无音乐可播放"
					})
				} else {
					innerAudioContext.pause()
					if (_this.current_music > 0) {
						_this.current_music = _this.current_music - 1
					} else {
						_this.current_music = _this.songLists.music_list.length - 1
					}
					console.log("上一首")
					_this.getMusicUrl(_this.songLists.music_list[_this.current_music].music_id, res => {
						if (res == null) {
							uni.showToast({
								icon: "none",
								title: "该音乐不能播放"
							})
						} else {
							innerAudioContext.src = res
							innerAudioContext.play()
						}
					})
				}

			},
			musicPlayOrStop() {
				if (this.songLists.songsNumber == "0") {
					uni.showToast({
						icon: "none",
						title: "无音乐可播放"
					})
				} else {
					if (this.isPlay) {
						innerAudioContext.pause()
					} else {
						this.getMusicUrl(this.songLists.music_list[this.current_music].music_id, res => {
							if (res == null) {
								uni.showToast({
									icon: "none",
									title: "该音乐不能播放"
								})
							} else {
								innerAudioContext.src = res
								innerAudioContext.play()
							}
						})
					}
				}
			},
			getPopupTitleHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select(".music-list-title").boundingClientRect(data => {
					this.musiclistPopupHeight = uni.$u.getPx(uni.$u.getPx('780rpx', true)) - data.height
					// console.log(this.musiclistPopupHeight)
					// console.log(JSON.stringify(data))
				}).exec()
			},
			getMusicPlayerHeight() {
				const query = uni.createSelectorQuery().in(this);
				query.select(".music-player").boundingClientRect(data => {
					this.musicPlayerHeight = data.height
				}).exec()
			}
		}
	}
</script>

<style>
	.other-pages {
		margin-bottom: 210rpx;
	}

	.music-player {
		background-color: white;
		position: fixed;
		width: 100%;
		left: 0;
		bottom: 0;
		/* iphonex 等安全区设置，底部安全区适配 */
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */

	}

	.music-player-interface {
		display: flex;
		height: 200rpx;
		flex-direction: row;
	}

	.music-cover {
		position: relative;
		width: 200rpx;
		height: 200rpx;
	}

	.music-cover image {
		width: 200rpx;
		height: 200rpx;
	}

	.player-button-group {
		display: flex;
		justify-content: center;
	}

	.pre-player-button,
	.next-player-button,
	.music-play-button {
		padding: 0 20rpx;
		display: flex;
		align-item: center;
	}

	.right-hidden {
		opacity: 0;
	}

	.right-hidden,
	.open-music-list {
		padding: 0 20rpx;
		display: flex;
		align-item: center;
	}

	.music-info {
		background-color: #f3f4f6;
		width: 100%;
		border-top: 2rpx solid #c8c9cc;
		padding: 20rpx 30rpx 0 30rpx;
	}

	.music-time {
		display: flex;
	}

	.music-name-time {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.popup {
		width: 100%;
		height: 800rpx;
		padding: 20rpx 20rpx 0 0;
	}

	/* .music-list-content {
		height: 200rpx;
	} */

	.musiclist-name {
		padding-right: 20rpx;
	}

	.music-list-title {
		padding-bottom: 20rpx;
		display: flex;
		flex-direction: row;
		justify-content: flex-start
	}

	.musiclist-slot-info {
		display: flex;
		flex-direction: row;
		justify-content: flex-start
	}

	.popup-content-content {
		padding: 20rpx;
	}
</style>