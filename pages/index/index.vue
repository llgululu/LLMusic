<template>
	<view class="index">
		<view class="index-search">
			<u-search height="64" placeholder="请输入歌曲名" @search="goSearch" :showAction="false"
				v-model="keyword"></u-search>
		</view>
		<view class="index-swiper">
			<u-swiper :indicator="true" radius="20" height="260" :list="swiperList"></u-swiper>
		</view>
		<view class="index-grid-tab">
			<u-grid @click="gridClick" :border="false" col="5">
				<u-grid-item v-for="(listItem,listIndex) in gridList" :key="listIndex">
					<u-icon :customStyle="{paddingTop:10+'rpx'}" :name="listItem.name" :size="66"></u-icon>
					<text class="grid-text">{{listItem.title}}</text>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="index-recommended-song-list">
			<view class="index-recommended-song-list-title">
				<view>
					<u--text :bold="true" size="36" text="推荐歌单"></u--text>
				</view>
				<u-icon size="36" color="black" name="arrow-right"></u-icon>
			</view>
			<view class="index-recommended-song-scroll-list">
				<u-scroll-list :indicator="false">
					<view @click="rSongListClick(index)" class="index-recommended-song-scroll-list-content"
						v-for="(item, index) in rSongList_list" :key="index">
						<view class="index-recommended-song-cover">
							<u--image radius="20" :showLoading="true" :src="item.picUrl" width="228"
								height="228"></u--image>
							<view class="song-list-playcount">
								<u-icon labelColor="white" color="white" :label="playCountFormat(item.playCount)"
									name="play-right-fill"></u-icon>
							</view>
							<view class="song-list-playButton">
								<u-icon size="50" color="white" name="play-right-fill"></u-icon>
							</view>
						</view>
						<u--text lines="2" size="28" :text="item.name"></u--text>
					</view>
				</u-scroll-list>
			</view>
		</view>
		<view class="index-recommended-songs">
			<view class="index-recommended-songs-title">
				<view>
					<u--text :bold="true" size="36" text="推荐单曲"></u--text>
				</view>
				<u-icon size="36" color="black" name="arrow-right"></u-icon>
			</view>
			<view class="index-recommended-songs-scorll">
				<u-scroll-list :indicator="false">
					<view style="min-width: 600rpx;" v-for="(item, index) in listFormat(childSongLists.music_list)"
						:key="index">
						<view class="index-recommended-songs-contents">
							<view @click="rSongsClick(3*index+ind)" v-for="(ite, ind) in item" :key="ind"
								class="index-recommended-one-song">
								<view class="index-recommended-one-song-info">
									<view class="index-recommended-songs-cover">
										<u--image radius="14" :showLoading="true" :src="ite.music_cover" width="120"
											height="120"></u--image>
									</view>
									<view class="index-recommended-songs-name-artists">
										<u--text lines="1" :bold="true" size="32" :text="ite.music_name"></u--text>
										<u--text lines="1" size="28" :text="ite.music_singer"></u--text>
									</view>
								</view>
								<view class="index-recommended-songs-play-button">
									<u-icon size="50"
										name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=dbb95c6b60ab8d76836ad81bd1881d80"></u-icon>
								</view>
							</view>
						</view>

					</view>
				</u-scroll-list>
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
				loadingStatus: true,
				childSongLists: {
					id: "2",
					music_list: [{
						music_id: "1",
						music_cover: "https://p1.music.126.net/w1pQ83qhoVMJ_eMpRyoAtA==/109951166200199773.jpg",
						music_src: "https://lvhaonan.blob.core.windows.net/music/2.mp3?sp=r&st=2023-07-17T05:38:04Z&se=2023-08-31T13:38:04Z&spr=https&sv=2022-11-02&sr=b&sig=GeOzBHpJnJHPx7QaK8ohMgbBuM75fXN71gHm5UODaAs%3D",
						music_singer: "Goose house",
						music_name: "光るなら",
						music_time: "04:14",
						is_like: true
					}, {
						music_id: "2",
						music_cover: "https://p1.music.126.net/_zYzyYUidI7mfXeHKiSS0g==/109951166701711136.jpg",
						music_src: "https://lvhaonan.blob.core.windows.net/music/1.flac?sp=r&st=2023-07-17T05:41:21Z&se=2023-08-31T13:41:21Z&spr=https&sv=2022-11-02&sr=b&sig=OjuVxSSbfVVD1PqncL6TLTY%2Byi6EDwdd%2BEpd5lUzHzk%3D",
						music_singer: "胡彦斌",
						music_name: "One Night in Shang Hai",
						music_time: "04:02",
						is_like: false
					}, {
						music_id: "3",
						music_cover: "https://p1.music.126.net/w1pQ83qhoVMJ_eMpRyoAtA==/109951166200199773.jpg",
						music_src: "https://lvhaonan.blob.core.windows.net/music/2.mp3?sp=r&st=2023-07-17T05:38:04Z&se=2023-08-31T13:38:04Z&spr=https&sv=2022-11-02&sr=b&sig=GeOzBHpJnJHPx7QaK8ohMgbBuM75fXN71gHm5UODaAs%3D",
						music_singer: "Goose house",
						music_name: "光るなら",
						music_time: "04:14",
						is_like: false
					}, {
						music_id: "4",
						music_cover: "https://p1.music.126.net/_zYzyYUidI7mfXeHKiSS0g==/109951166701711136.jpg",
						music_src: "https://lvhaonan.blob.core.windows.net/music/1.flac?sp=r&st=2023-07-17T05:41:21Z&se=2023-08-31T13:41:21Z&spr=https&sv=2022-11-02&sr=b&sig=OjuVxSSbfVVD1PqncL6TLTY%2Byi6EDwdd%2BEpd5lUzHzk%3D",
						music_singer: "胡彦斌",
						music_name: "One Night in Shang Hai",
						music_time: "04:02",
						is_like: true
					}],
				},
				rSongList_list: [{
						id: 2219770152,
						playCount: 26083436,
						name: "还记得你的梦想吗？别让你的梦只有想",
						picUrl: "https://p2.music.126.net/c-u3kOlkVTUf4JdeDHDdEw==/109951163291871252.jpg"
					},
					{
						id: 2105681544,
						playCount: 66730376,
						name: "日系/无前奏：开口即跪 一秒沦陷",
						picUrl: "https://p2.music.126.net/-bT1aNnjdESQwlw38D5eJg==/109951164323807218.jpg"
					},
					{
						id: 2340621859,
						playCount: 24696312,
						name: "[国电新势力] 网易电子音乐人精选",
						picUrl: "https://p2.music.126.net/qA0W0aER7LxB99iTOMQZcA==/109951166153828602.jpg"
					},
					{
						id: 2075587022,
						playCount: 28962018,
						name: "助眠辑 | 自然音，伴灵动乐符萦绕耳畔",
						picUrl: "https://p2.music.126.net/sixunTcvD_IXeVqxZnpHkA==/109951163452086313.jpg"
					},
					{
						id: 1982066521,
						playCount: 25412796,
						name: "假如能回到过去，你想做什么",
						picUrl: "https://p2.music.126.net/kZb9DO4vykqiYEx0HHx86w==/109951163065542645.jpg"
					},
					{
						id: 2821115454,
						playCount: 60138372,
						name: "[一周原创发现] XMASwu(吴骜)陪你看一场永恒的烟火",
						picUrl: "https://p2.music.126.net/iMRatrLaDG7dfI4eHxoM1A==/109951168721829218.jpg"
					},
					{
						id: 2821115454,
						playCount: 60138372,
						name: "[一周原创发现] XMASwu(吴骜)陪你看一场永恒的烟火",
						picUrl: "https://p2.music.126.net/iMRatrLaDG7dfI4eHxoM1A==/109951168721829218.jpg"
					},
				],
				gridList: [{
						name: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=f5a59850686edd348c6eccd7aa307b42',
						title: '推荐'
					},
					{
						name: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=e1ced18b0c241dbcbe81206dd5547faf',
						title: '歌单'
					},
					{
						name: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=248117d18631e197fd9ae0655b5b033f',
						title: '排行'
					},
					{
						name: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=55a0ea29dd694b45291e12a92ae61334',
						title: '收藏'
					},
					{
						name: 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=917afd52cf21ed807ae14674bb943d8c',
						title: '说明'
					},

				],
				keyword: '',
				swiperList: [
					'https://cdn.uviewui.com/uview/swiper/swiper2.png',
					'https://cdn.uviewui.com/uview/swiper/swiper3.png',
				],
				pagesList: [
					"1",
					"2",
					"4",
					"5",
					"9"
				]

			}
		},
		mounted() {
			App._get("/api/index/getRecommendedData", {}, res => {
				this.rSongList_list = res.data["data"]["recommendedPlaylists"]
				this.childSongLists = res.data["data"]["playlist"]
				this.loadingStatus = false
			});
		},
		methods: {
			goSearch(e) {
				if (e === "") {
					uni.showToast({
						icon: "none",
						title: "输入框为空!"
					})
				} else {
					var data = {
						from: "0",
						to: "6"
					}
					uni.setStorageSync('searchKeywords', e);
					this.$emit("pageTo", data)
				}
				console.log(e)
			},
			listFormat(list) {
				return App.listFormatOneToThree(list)
			},
			rSongsClick(index) {
				console.log(index)
				var data = {
					childSongListsId: this.childSongLists.id,
					index: index
				}
				this.$emit("getChild", data)
			},
			gridClick(index) {
				// console.log(index)
				var data = {
					from: "0",
					to: this.pagesList[index]
				}
				if (this.pagesList[index] == "5") {
					uni.setStorageSync('playlistId', uni.getStorageSync('collectionPlaylistId'));
					uni.setStorageSync('playlistType', "collction");
				}
				this.$emit("pageTo", data)
			},
			rSongListClick(index) {
				// console.log(this.rSongList_list[index].id)
				uni.setStorageSync('playlistId', this.rSongList_list[index].id);
				uni.setStorageSync('playlistType', "normal");
				var data = {
					from: "0",
					to: "3"
				}
				this.$emit("pageTo", data)
			},
			playCountFormat(playCount) {
				return App.playCountFormat(playCount);
			}
		}
	}
</script>

<style>
	.index {
		padding: 0 20rpx 20rpx 20rpx;
	}

	.index-swiper,
	.index-search,
	.index-grid-tab,
	.index-recommended-song-list,
	.index-recommended-songs,
	.index-recommended-songs-scorll,
	.index-recommended-song-scroll-list {
		padding-top: 20rpx;
	}

	.grid-text {
		font-size: 14px;
	}

	.index-recommended-song-list-title,
	.index-recommended-songs-title {
		display: flex;
		padding-bottom: 10rpx;
	}

	.index-recommended-songs-contents {
		/* min-width: 90%; */
		display: flex;
		flex-direction: column;
	}

	.index-recommended-one-song-info {
		display: flex;
	}

	.index-recommended-songs-name-artists {
		padding-left: 20rpx;
		padding-right: 40rpx;
		padding-top: 20rpx;
	}

	.index-recommended-song-cover {
		position: relative;
	}

	.index-recommended-songs-play-button {
		float: right;
		display: flex;
	}

	.index-recommended-one-song {
		/* 	padding: 20rpx 0; */
		padding-right: 40rpx;
		padding-bottom: 10rpx;
		display: flex;
		justify-content: space-between;
	}

	.song-list-playcount {
		position: absolute;
		right: 10rpx;
		top: 10rpx;
	}

	.song-list-playButton {
		position: absolute;
		right: 10rpx;
		bottom: 10rpx;
	}

	.index-recommended-song-scroll-list-content {
		padding-left: 10rpx;
		padding-right: 10rpx;
	}
</style>