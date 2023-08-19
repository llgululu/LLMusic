module.exports = {
	baseURL: "http://localhost:8003",
	playCountFormat(playCount) {
		var countStr = playCount + ""
		if (countStr.length > 8) {
			return parseInt(playCount / 100000000) + '亿'
		} else if (countStr.length > 4) {
			return parseInt(playCount / 10000) + '万'
		} else {
			return playCount
		}
	},
	listFormatOneToThree(list) {
		// 将一维数组 转换为3个元素为一数组的新数组 ArrayList<List<Object>>
		var newList = []
		var index = parseInt(list.length / 3);
		var index1 = list.length % 3;
		for (let i = 0; i < index; i++) {
			var childList = []
			for (let j = 0; j < 3; j++) {
				childList.push(list[3 * i + j])
			}
			newList.push(childList)
		}
		var childList1 = []
		for (let i = 0; i < index1; i++) {
			childList1.push(list[3 * index + i])
		}
		if (childList1.length != 0) {
			newList.push(childList1)
		}
		return newList
	},
	_get(url, param, success) {
		let _this = this;
		param = param || {}
		uni.getStorage({
			key: 'token',
			success: function(tokenRes) {
				// console.log(tokenRes.data);
				uni.$u.http.get(_this.baseURL + url, {
					params: param,
					header: {
						token: tokenRes.data
					},
				}).then(res => {
					// console.log(res.data)
					if (res.data["code"] == 2) {
						_this.wxLogin(succ => {
							let token = uni.getStorageSync('token');
							uni.$u.http.get(_this.baseURL + url, {
								params: param,
								header: {
									token: token
								},
							}).then(res => {
								success(res);
							}).catch(err => {
								console.log(err)
								uni.showToast({
									icon: "error",
									title: "网络错误"
								})
							})
						})
					} else {
						success(res);
					}

				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: "error",
						title: "网络错误"
					})
				})
			},
			fail() {
				_this.wxLogin(suc => {
					let token = uni.getStorageSync('token');
					uni.$u.http.get(_this.baseURL + url, {
						params: param,
						header: {
							token: token
						},
					}).then(res => {
						// console.log(res.data)
						if (res.data["code"] == 2) {
							_this.wxLogin(succ => {
								let token = uni.getStorageSync('token');
								uni.$u.http.get(_this.baseURL + url, {
									params: param,
									header: {
										token: token
									},
								}).then(res => {
									success(res);
								}).catch(err => {
									console.log(err)
									uni.showToast({
										icon: "error",
										title: "网络错误"
									})
								})
							})
						} else {
							success(res);
						}
					}).catch(err => {
						console.log(err)
						uni.showToast({
							icon: "error",
							title: "网络错误"
						})
					})
				})
			}
		})
	},
	wxLogin(suc) {
		let _this = this;
		let token = uni.getStorageSync('token') || ""
		wx.login({
			provider: 'weixin',
			onlyAuthorize: true,
			success: (logincode) => {
				uni.$u.http.get(_this.baseURL + "/login/user/login", {
					params: {
						code: logincode.code
					},
					header: {
						token: token
					},
				}).then(res => {
					uni.setStorageSync("collectionPlaylistId", res.data["data"]["playlistId"])
					uni.setStorageSync("token", res.data["data"]["token"])
					suc(res)
				}).catch(err => {
					console.log(err)
					uni.showToast({
						icon: "error",
						title: "网络错误"
					})
				})
			},
			fail(err) {
				uni.showToast({
					icon: "error",
					title: "网络错误",
				})
				uni.clearStorageSync();
			}
		})
	},
	_test(url, parms, suc) {
		uni.$u.http.get(this.baseURL + url, {
			params: parms
		}).then(res => {
			suc(res)
		}).catch(err => {
			console.log(err)
			uni.showToast({
				icon: "error",
				title: "网络错误"
			})
		})
	}
}