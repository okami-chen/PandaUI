import request from '@/utils/request';

// 查询Gbox列表
export function listGbox(query:any) {
	return request({
		url: '/custom/gbox/list',
		method: 'get',
		params: query
	})
}

// 查询Gbox详细
export function getGbox(id:number) {
	return request({
		url: '/custom/gbox/' + id,
		method: 'get'
	})
}

// 新增Gbox
export function addGbox(data:any) {
	return request({
		url: '/custom/gbox',
		method: 'post',
		data: data
	})
}

// 修改Gbox
export function updateGbox(data:any) {
	return request({
		url: '/custom/gbox',
		method: 'put',
		data: data
	})
}

// 删除Gbox
export function delGbox(id: string) {
	return request({
		url: '/custom/gbox/' + id,
		method: 'delete'
	})
}