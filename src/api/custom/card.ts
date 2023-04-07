import request from '@/utils/request';

// 查询Card列表
export function listCard(query:any) {
	return request({
		url: '/custom/card/list',
		method: 'get',
		params: query
	})
}

// 查询Card详细
export function getCard(id:number) {
	return request({
		url: '/custom/card/' + id,
		method: 'get'
	})
}

// 新增Card
export function addCard(data:any) {
	return request({
		url: '/custom/card',
		method: 'post',
		data: data
	})
}

// 修改Card
export function updateCard(data:any) {
	return request({
		url: '/custom/card',
		method: 'put',
		data: data
	})
}

// 删除Card
export function delCard(id: string) {
	return request({
		url: '/custom/card/' + id,
		method: 'delete'
	})
}