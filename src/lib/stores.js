import { writable } from 'svelte/store';

// 用户认证状态存储
export const user = writable(null);

// 当前选中的菜单项
export const activeMenu = writable('dashboard');

// 会议室数据存储
export const rooms = writable([]);

// 所有预约数据存储
export const reservations = writable([]);

// 用户预约数据存储
export const myReservations = writable([]);