<script>
  import { rooms, reservations } from '../lib/stores.js';
  import { roomsApi, reservationsApi } from '../lib/api.js';
  import { onMount } from 'svelte';
  
  let roomsValue = [];
  let reservationsValue = [];
  let isLoading = true;
  let error = null;
  
  const unsubscribeRooms = rooms.subscribe(value => {
    roomsValue = value;
  });
  
  const unsubscribeReservations = reservations.subscribe(value => {
    reservationsValue = value;
  });
  
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    try {
      isLoading = true;
      error = null;
      
      // 获取会议室数据
      const roomsData = await roomsApi.getAllRooms();
      rooms.set(roomsData);
      
      // 获取所有预约数据
      const reservationsData = await reservationsApi.getAllReservations();
      reservations.set(reservationsData);
    } catch (err) {
      console.error('Failed to load data:', err);
      error = '加载数据失败: ' + (err.message || '未知错误');
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="dashboard">
  <h2>仪表盘</h2>
  
  {#if isLoading}
    <div class="loading">加载中...</div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadData}>重新加载</button>
    </div>
  {:else}
    <div class="stats">
      <div class="stat-card">
        <h3>会议室总数</h3>
        <p class="stat-number">{roomsValue.length}</p>
      </div>
      
      <div class="stat-card">
        <h3>总预约数</h3>
        <p class="stat-number">{reservationsValue.length}</p>
      </div>
    </div>
    
    <div class="sections">
      <div class="section">
        <h3>会议室概览</h3>
        <div class="rooms-list">
          {#each roomsValue as room}
            <div class="room-item {room.available ? 'available' : 'unavailable'}">
              <div class="room-header">
                <h4>{room.name}</h4>
                <span class="status-badge {room.available ? 'status-available' : 'status-unavailable'}">
                  {room.available ? '可用' : '不可用'}
                </span>
              </div>
              <p>{room.description || '暂无描述'}</p>
              {#if room.available}
                <div class="room-stats">
                  <span>温度: {room.temperature?.toFixed(1)}°C</span>
                  <span>湿度: {room.humidity?.toFixed(1)}%</span>
                </div>
              {/if}
            </div>
          {:else}
            <p>暂无会议室信息</p>
          {/each}
        </div>
      </div>
      
      <div class="section">
        <h3>最近预约</h3>
        <div class="reservations-list">
          {#each reservationsValue.slice(0, 5) as reservation}
            <div class="reservation-item">
              <div class="reservation-header">
                <h4>{reservation.roomName}</h4>
                <span>{reservation.username}</span>
              </div>
              <div class="reservation-details">
                <p>开始时间: {reservation.startTime}</p>
                <p>结束时间: {reservation.endTime}</p>
              </div>
            </div>
          {:else}
            <p>暂无预约信息</p>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    padding: 20px;
  }
  
  .dashboard h2 {
    margin-top: 0;
    color: #333;
  }
  
  .loading, .error {
    text-align: center;
    padding: 40px;
  }
  
  .error button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .stats {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .stat-card {
    flex: 1;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    text-align: center;
  }
  
  .stat-card h3 {
    margin-top: 0;
    color: #666;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: #3498db;
    margin: 10px 0 0;
  }
  
  .sections {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    .sections {
      grid-template-columns: 1fr;
    }
  }
  
  .section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .section h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .rooms-list, .reservations-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .room-item, .reservation-item {
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #eee;
  }
  
  .room-item.available {
    background-color: #f2fff2;
    border-color: #d4f5d4;
  }
  
  .room-item.unavailable {
    background-color: #fff2f2;
    border-color: #f5d4d4;
  }
  
  .room-header, .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .room-header h4, .reservation-header h4 {
    margin: 0;
    color: #333;
  }
  
  .status-badge {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: bold;
  }
  
  .status-available {
    background-color: #2ecc71;
    color: white;
  }
  
  .status-unavailable {
    background-color: #e74c3c;
    color: white;
  }
  
  .room-stats {
    display: flex;
    gap: 15px;
    margin-top: 10px;
    font-size: 0.9rem;
    color: #666;
  }
  
  .reservation-details p {
    margin: 5px 0;
    color: #666;
    font-size: 0.9rem;
  }
</style>