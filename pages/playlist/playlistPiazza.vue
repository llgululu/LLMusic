<template>
	<view class="plsylist">
		<view class="playlist-category-tabs">
			<u-tabs lineWidth="40" lineHeight="6" :current="tabs_index" :list="listFormat()" @change="tabsChange">
				<view slot="right" style="padding-left: 4px;" @tap="openPopup">
					<u-icon name="grid" size="42" bold></u-icon>
				</view>
			</u-tabs>
		</view>

		<view class="playlist-list">
			<u-list :preLoadScreen="1.5" :scrollWithAnimation="true" @scroll="scroll" :scrollTop="scrollDefaultTop"
				lowerThreshold="1" upperThreshold="1" :height="screenHeight+'px'" @scrolltolower="scrolltolower"
				@scrolltoupper="scrolltoupper">
				<u-list-item v-for="(item, index) in listFormat1(playlist_list)" :key="index">
					<view class="playlist-list-row">
						<view class="row-col-4" v-for="(ite, ind) in item" :key="ind">
							<view class="row-col-4-con" @click="playlistClick(3*index+ind)">
								<view class="playlist-cover">
									<u--image radius="20" :src="ite.picUrl" width="198rpx" height="198rpx"></u--image>
									<view class="playlist-playCount">
										<u-icon labelSize="20rpx" size="20rpx" labelColor="white" color="white"
											:label="playCountFormat(ite.playCount)" name="play-right-fill"></u-icon>
									</view>
								</view>
								<view class="playlist-title">
									<u--text size="30" align="center" lines="2" :text="ite.name"></u--text>
								</view>
							</view>
						</view>
					</view>
				</u-list-item>
			</u-list>
		</view>
		<view class="playlist-category-popus">
			<u-popup :safeAreaInsetTop="true" :round="25" mode="top" :show="popupShow" @close="closePopup">
				<scroll-view scroll-y="true" class="popup">
					<view v-for="(item,index) in category_list" :key="index" class="big-classification-category">
						<view class="big-classification-title">
							<u--text type="primary" size="36" bold :text="'#'+item.title+'#'"></u--text>
						</view>
						<view class="little-categories-body">
							<view v-for="(ite,ind) in item.categories" :key="ind" class="little-category">
								<view class="little-category-button">
									<u-button
										:icon="ite.hot ? 'https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=26093e179b64fb10b6a186336d3283ef':''"
										@click="tabsChange(ite)" :type="ite.index==tabs_index ? 'primary':''" plain
										shape="circle" :text="ite.name"></u-button>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</u-popup>
		</view>
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
				scrollCurrentTop: 10,
				scrollDefaultTop: 10,
				popupShow: false,
				playlist_list: [{
						id: 2219770152,
						playCount: "24696312",
						name: "还记得你的梦想吗？别让你的梦只有想",
						picUrl: "https://p2.music.126.net/c-u3kOlkVTUf4JdeDHDdEw==/109951163291871252.jpg"
					},
					{
						id: 2105681544,
						playCount: "66730376",
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
					}
				],
				category_list: [{
						title: "官方",
						categories: [{
							name: "全部",
							hot: false,
							index: "0"
						}]
					},
					{
						title: "语种",
						categories: [{
								name: "华语",
								hot: true,
								index: "1"
							},
							{
								name: "欧美",
								hot: false,
								index: "2"
							},
							{
								name: "日语",
								hot: false,
								index: "3"
							},
							{
								name: "韩语",
								hot: false,
								index: "4"
							},
							{
								name: "粤语",
								hot: false,
								index: "5"
							},
						]
					},
					{
						title: "风格",
						categories: [{
								name: "流行",
								hot: true,
								index: "6"
							},
							{
								name: "摇滚",
								hot: true,
								index: "7"
							},
							{
								name: "民谣",
								hot: true,
								index: "8"
							},
							{
								name: "电子",
								hot: true,
								index: "9"
							}
						]
					},
					{
						title: "场景",
						categories: [{
								name: "清晨",
								hot: false,
								index: "10"
							},
							{
								name: "夜晚",
								hot: true,
								index: "11"
							},
							{
								name: "学习",
								hot: true,
								index: "12"
							},
							{
								name: "工作",
								hot: false,
								index: "13"
							},
							{
								name: "午休",
								hot: false,
								index: "14"
							}
						]
					}

				],
				tabs_index: 0,
				screenHeight: "0",
				lowerTemp: 0,
				upperTemp: 0,
				totalPage: 1,
				currentPage: 0,

			}
		},
		mounted() {
			App._get("/api/playlistPiazza/getDataPagePlaylistPiazza", {}, res => {
				this.category_list = res.data["data"]["category_list"]
				this.getPlaylistByCategory()
				this.setHeight()
				setTimeout(() => {
					this.loadingStatus = false
				}, 800)
			});

		},
		methods: {
			setHeight() {
				var playerHeight = this.playerHeight
				var statusBarHeight = uni.getSystemInfoSync().statusBarHeight
				// var safeArea = uni.getSystemInfoSync().safeAreaInsets.bottom
				// console.log('statusBarHeight:', statusBarHeight)
				// console.log('safeArea:', safeArea)
				this.screenHeight = uni.getSystemInfoSync().windowHeight - 2 * 44 - uni.$u.getPx(playerHeight) -
					statusBarHeight
				// console.log(this.screenHeight)
			},
			getPlaylistByCategory() {
				let list = this.listFormat();
				// console.log(list[this.tabs_index].name)
				let cat = list[this.tabs_index].name;
				App._get("/api/playlistPiazza/getPlaylistByCategory", {
					cat: cat,
					page: this.currentPage
				}, res => {
					this.playlist_list = res.data["data"]["playlist_list"]
					this.totalPage = res.data["data"]["totalPage"]
				});
			},
			playlistClick(index) {
				// console.log(this.playlist_list[index].id)
				uni.setStorageSync('playlistId', this.playlist_list[index].id);
				uni.setStorageSync('playlistType', "normal");
				var data = {
					from: "2",
					to: "3"
				}
				this.$emit("pageTo", data)
			},
			scroll(e) {
				this.scrollCurrentTop = e
				// console.log(e)
			},
			scrolltoupper() {
				let _this = this
				if (_this.currentPage == 0) {
					uni.showToast({
						icon: "error",
						title: "已经到顶"
					})
					_this.topNumberChange()
				} else {
					if (_this.upperTemp < 1) {
						_this.upperTemp = _this.upperTemp + 1
						uni.showToast({
							icon: 'none',
							title: '再拉一次，切换上一页',
							mask: true,
							duration: 800
						})
						_this.topNumberChange()
					} else {
						uni.showLoading({
							title: "加载中...",
							mask: true
						})
						_this.currentPage = _this.currentPage - 1;
						_this.getPlaylistByCategory()
						setTimeout(() => {
							_this.topNumberChange()
							_this.upperTemp = 0
							uni.hideLoading()
						}, 800)
					}
				}


			},
			scrolltolower() {
				let _this = this
				if (_this.currentPage == _this.totalPage) {
					uni.showToast({
						icon: "error",
						title: "已经到底"
					})
					_this.scrollDefaultTop = _this.scrollCurrentTop - 10;
				} else {
					if (_this.lowerTemp < 1) {
						_this.lowerTemp = _this.lowerTemp + 1
						uni.showToast({
							icon: 'none',
							title: '再拉一次，切换下一页',
							mask: true,
							duration: 800
						})
						_this.scrollDefaultTop = _this.scrollCurrentTop - 10;
					} else {
						uni.showLoading({
							title: "加载中...",
							mask: true
						})
						_this.currentPage = _this.currentPage + 1;
						_this.getPlaylistByCategory()
						setTimeout(() => {
							_this.topNumberChange()
							_this.lowerTemp = 0;
							uni.hideLoading()
						}, 800)
					}
				}
			},
			listFormat() {
				let _this = this;
				var newList = [];
				for (let i = 0; i < _this.category_list.length; i++) {
					for (let j = 0; j < _this.category_list[i].categories.length; j++) {
						newList.push(_this.category_list[i].categories[j])
					}
				}
				return newList;
			},
			closePopup() {
				this.popupShow = false
			},
			openPopup() {
				this.popupShow = true
			},
			topNumberChange() {
				if (this.scrollDefaultTop == 10) {
					this.scrollDefaultTop = 10.1
				} else if (this.scrollDefaultTop == 10.1) {
					this.scrollDefaultTop = 10.2
				} else if (this.scrollDefaultTop == 10.2) {
					this.scrollDefaultTop = 10.3
				} else {
					this.scrollDefaultTop = 10
				}
			},
			tabsChange(e) {
				let _this = this
				if (_this.tabs_index != e.index) {
					_this.tabs_index = e.index
					_this.currentPage = 0
					_this.getPlaylistByCategory()
					_this.topNumberChange()
					_this.upperTemp = 0
					_this.lowerTemp = 0
				}
			},
			playCountFormat(playCount) {
				return App.playCountFormat(playCount);
			},
			listFormat1(list) {
				return App.listFormatOneToThree(list)
			}
		}
	}
</script>

<style>
	/deep/ .u-tabs__wrapper__nav__line {
		left: 21rpx;
	}

	.popup {
		width: 100%;
		height: 800rpx;
		padding: 20rpx 0;
	}

	.little-categories-body {
		display: flex;
		flex-wrap: wrap;
		padding: 10rpx 0;
	}

	.big-classification-title {
		padding: 0 20rpx;
	}

	.little-category {
		width: 25%;

	}

	.little-category-button {
		padding: 10rpx 10rpx;
	}

	.playlist-list-row {
		display: flex;
		flex-wrap: wrap;
	}

	.row-col-4 {
		width: 33.3%;
	}

	.row-col-4-con {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 20rpx 16rpx;
	}

	.playlist-cover {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: center;
	}

	.playlist-playCount {
		position: absolute;
		top: 12rpx;
		right: 24rpx;
	}

	.playlist-title {
		padding: 10rpx 14rpx;
	}
</style>