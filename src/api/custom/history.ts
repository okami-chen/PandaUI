import request from '@/utils/request';

// 查询History列表
export function listHistory(query:any) {
	return request({
		url: '/custom/history/list',
		method: 'get',
		params: query
	})
}

// 查询History详细
export function getHistory(id:number) {
	return request({
		url: '/custom/history/' + id,
		method: 'get'
	})
}

// 新增History
export function addHistory(data:any) {
	return request({
		url: '/custom/history',
		method: 'post',
		data: data
	})
}

// 修改History
export function updateHistory(data:any) {
	return request({
		url: '/custom/history',
		method: 'put',
		data: data
	})
}

// 删除History
export function delHistory(id: string) {
	return request({
		url: '/custom/history/' + id,
		method: 'delete'
	})
}