<template>
	<view class="ranking-list">
		<view class="official-list">
			<u-icon size="36" labelSize="40" label="官方榜"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=a8a413ef77751c9104cb1a582083b71e"></u-icon>
			<view class="official-list-playlists">
				<view v-for="(item,index) in rankingListInfo.officialLists" @click="officialListClick(index)" :key="index" class="official-list-info">
					<view class="official-list-name-updateTime">
						<view class="official-list-name">
							<u--text bold color="white" size="42" :text="item.name"></u--text>
						</view>
						<view class="official-list-updateTime">
							<u--text color="white" size="20" :text="item.updateTime"></u--text>
						</view>
					</view>
					<view class="official-list-cover-top3">
						<view class="official-list-cover">
							<u--image radius="20" :src="item.cover" width="160rpx" height="160rpx"></u--image>
						</view>
						<view class="official-list-top3">
							<view v-for="(ite,ind) in item.top3Music" :key="ind" class="official-list-top3-music">
								<u--text lines="1" color="white" bold size="30" :text="ite"></u--text>
							</view>
						</view>
					</view>
				</view>
			</view>

		</view>
		<view class="other-list">
			<u-icon size="36" labelSize="40" label="其他榜"
				name="https://www.myazurepicture.llgulugulu.top/api/picture/getImageByte?pid=a1c98238d0a51c03b66698cddba7a29a"></u-icon>
			<view class="other-list-playlists">
				<view class="other-list-playlist" @click="otherListClick(index)" v-for="(item,index) in rankingListInfo.otherLists" :key="index">
					<view class="other-list-playlist-cover-updateTime">
						<view class="other-list-playlist-cover">
							<u--image radius="20" :src="item.cover" width="190rpx" height="190rpx"></u--image>
						</view>
						<view class="other-list-playlist-updateTime">
							<u--text align="center" lines="1" color="white" size="24" :text="item.updateTime"></u--text>
						</view>
					</view>
				</view>
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
				rankingListInfo: {
					officialLists: [{
							id: "19723756",
							name: "飙升榜",
							updateTime: "刚刚更新",
							cover: "https://p2.music.126.net/pcYHpMkdC69VVvWiynNklA==/109951166952713766.jpg",
							top3Music: [
								"1 予你 - 队长",
								"2 罗刹海市 - 刀郎",
								"3 怪就怪天气 - Zy"
							]
						},
						{
							id: "3779629",
							name: "新歌榜",
							updateTime: "刚刚更新",
							cover: "https://p1.music.126.net/wVmyNS6b_0Nn-y6AX8UbpQ==/109951166952686384.jpg",
							top3Music: [
								"1 罗刹海市 - 刀郎",
								"2 怪就怪天气 - Zy",
								"3 C级浪漫 - 法老/邓典果DDG/KnowKnow"
							]
						},
						{
							id: "3779629",
							name: "新歌榜",
							updateTime: "刚刚更新",
							cover: "https://p1.music.126.net/wVmyNS6b_0Nn-y6AX8UbpQ==/109951166952686384.jpg",
							top3Music: [
								"1 罗刹海市 - 刀郎",
								"2 怪就怪天气 - Zy",
								"3 C级浪漫 - 法老/邓典果DDG/KnowKnow"
							]
						},
						{
							id: "3779629",
							name: "新歌榜",
							updateTime: "刚刚更新",
							cover: "https://p1.music.126.net/wVmyNS6b_0Nn-y6AX8UbpQ==/109951166952686384.jpg",
							top3Music: [
								"1 罗刹海市 - 刀郎",
								"2 怪就怪天气 - Zy",
								"3 C级浪漫 - 法老/邓典果DDG/KnowKnow"
							]
						},
					],
					otherLists: [{
							id: "991319590",
							name: "云音乐说唱榜",
							updateTime: "每周五更新",
							cover: "https://p1.music.126.net/xNnQzUODQs50SJ2Sm4IVVA==/109951167976981051.jpg",
						},
						{
							id: "71384707",
							name: "云音乐古典榜",
							updateTime: "每周四更新",
							cover: "https://p1.music.126.net/urByD_AmfBDBrs7fA9-O8A==/109951167976973225.jpg",
						},
						{
							id: "991319590",
							name: "云音乐说唱榜",
							updateTime: "每周五更新",
							cover: "https://p1.music.126.net/xNnQzUODQs50SJ2Sm4IVVA==/109951167976981051.jpg",
						},
						{
							id: "71384707",
							name: "云音乐古典榜",
							updateTime: "每周四更新",
							cover: "https://p1.music.126.net/urByD_AmfBDBrs7fA9-O8A==/109951167976973225.jpg",
						},
						{
							id: "991319590",
							name: "云音乐说唱榜",
							updateTime: "每周五更新",
							cover: "https://p1.music.126.net/xNnQzUODQs50SJ2Sm4IVVA==/109951167976981051.jpg",
						},
						{
							id: "71384707",
							name: "云音乐古典榜",
							updateTime: "每周四更新",
							cover: "https://p1.music.126.net/urByD_AmfBDBrs7fA9-O8A==/109951167976973225.jpg",
						}
					]
				}
			}
		},
		mounted() {
			App._get("/api/rankingList/getRankingListInfo", {}, res => {
				this.rankingListInfo = res.data["data"]
				setTimeout(() => {
					this.loadingStatus = false
				}, 800)
			});
		},
		methods:{
			officialListClick(index){
				// console.log(this.rankingListInfo["officialLists"][index].id)
				uni.setStorageSync('playlistId', this.rankingListInfo["officialLists"][index].id);
				uni.setStorageSync('playlistType',"normal");
				var data = {
					from: "4",
					to: "3"
				}
				this.$emit("pageTo", data)
			},
			otherListClick(index){
				// console.log(this.rankingListInfo["otherLists"][index].id)
				uni.setStorageSync('playlistId', this.rankingListInfo["otherLists"][index].id);
				uni.setStorageSync('playlistType',"normal");
				var data = {
					from: "4",
					to: "3"
				}
				this.$emit("pageTo", data)
			}
		}
	}
</script>

<style>
	.ranking-list {
		padding: 20rpx 20rpx;
	}

	.official-list-info {
		margin-top: 20rpx;
		padding: 20rpx 30rpx;
		border-radius: 20rpx;
		background-color: #abb9c3;
	}

	.official-list-playlists {
		padding: 0 10rpx;
	}

	.official-list-name-updateTime {
		display: flex;
		justify-content: space-between;
	}

	.official-list-name {
		padding-left: 10rpx;
	}

	.official-list-cover-top3 {
		padding-top: 10rpx;
		padding-bottom: 10rpx;
		display: flex;
		flex-direction: row;
		align-items: center;
	}

	.official-list-top3 {
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.official-list-top3-music {
		padding-bottom: 3rpx;
	}

	.other-list {
		padding-top: 20rpx;
	}

	.other-list-playlists {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		padding-top: 20rpx;
	}

	.other-list-playlist {
		padding: 10rpx 0;
		width: 33.3%;
		display: flex;
		justify-content: center;
	}

	.other-list-playlist-cover-updateTime {
		position: relative;
	}

	.other-list-playlist-updateTime {
		position: absolute;
		bottom: 10rpx;
		width: 100%;
		/* padding-left: 35rpx; */
	}
</style>