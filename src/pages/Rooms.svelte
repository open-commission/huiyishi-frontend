<script>
  import { rooms } from '../lib/stores.js';
  import { roomsApi } from '../lib/api.js';
  import { onMount } from 'svelte';
  
  let roomsValue = [];
  let isLoading = true;
  let error = null;
  
  const unsubscribeRooms = rooms.subscribe(value => {
    roomsValue = value;
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
    } catch (err) {
      console.error('Failed to load rooms:', err);
      error = '加载会议室数据失败: ' + (err.message || '未知错误');
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="rooms-page">
  <h2>会议室列表</h2>
  
  {#if isLoading}
    <div class="loading">加载中...</div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadData}>重新加载</button>
    </div>
  {:else}
    <div class="rooms-grid">
      {#each roomsValue as room}
        <div class="room-card {room.available ? 'available' : 'unavailable'}">
          <div class="room-header">
            <h3>{room.name}</h3>
            <span class="status-badge {room.available ? 'status-available' : 'status-unavailable'}">
              {room.available ? '可用' : '不可用'}
            </span>
          </div>
          
          <p class="room-description">
            {room.description || '暂无描述'}
          </p>
          
          {#if room.available}
            <div class="room-environment">
              <div class="env-item">
                <span class="env-label">温度:</span>
                <span class="env-value">{room.temperature?.toFixed(1)}°C</span>
              </div>
              <div class="env-item">
                <span class="env-label">湿度:</span>
                <span class="env-value">{room.humidity?.toFixed(1)}%</span>
              </div>
              <div class="env-item">
                <span class="env-label">CO₂:</span>
                <span class="env-value">{room.co2?.toFixed(1)} ppm</span>
              </div>
              <div class="env-item">
                <span class="env-label">PM2.5:</span>
                <span class="env-value">{room.pm25?.toFixed(1)} μg/m³</span>
              </div>
              <div class="env-item">
                <span class="env-label">光照:</span>
                <span class="env-value">{room.illumination?.toFixed(1)} lux</span>
              </div>
            </div>
            
            <div class="room-devices">
              <div class="device-item">
                <span>舵机状态:</span>
                <span class="{room.servoStatus ? 'status-on' : 'status-off'}">
                  {room.servoStatus ? '开启' : '关闭'}
                </span>
              </div>
              <div class="device-item">
                <span>电机状态:</span>
                <span class="{room.motorStatus ? 'status-on' : 'status-off'}">
                  {room.motorStatus ? '开启' : '关闭'}
                </span>
              </div>
              <div class="device-item">
                <span>设备连接:</span>
                <span class="{room.deviceConnected ? 'status-connected' : 'status-disconnected'}">
                  {room.deviceConnected ? '已连接' : '未连接'}
                </span>
              </div>
            </div>
          {/if}
        </div>
      {:else}
        <p>暂无会议室信息</p>
      {/each}
    </div>
  {/if}
</div>

<style>
  .rooms-page {
    padding: 20px;
  }
  
  .rooms-page h2 {
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
  
  .rooms-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }
  
  .room-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
    border: 2px solid #eee;
  }
  
  .room-card.available {
    border-color: #d4f5d4;
  }
  
  .room-card.unavailable {
    border-color: #f5d4d4;
    opacity: 0.7;
  }
  
  .room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .room-header h3 {
    margin: 0;
    color: #333;
  }
  
  .room-description {
    color: #666;
    margin-bottom: 15px;
  }
  
  .room-environment {
    background-color: #f8f9fa;
    padding: 15px;
    border-radius: 6px;
    margin-bottom: 15px;
  }
  
  .env-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  .env-item:last-child {
    margin-bottom: 0;
  }
  
  .env-label {
    color: #666;
  }
  
  .env-value {
    font-weight: bold;
    color: #333;
  }
  
  .room-devices {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .device-item {
    flex: 1;
    min-width: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .device-item span:first-child {
    font-size: 0.8rem;
    color: #666;
    margin-bottom: 3px;
  }
  
  .status-on, .status-connected {
    color: #27ae60;
    font-weight: bold;
  }
  
  .status-off, .status-disconnected {
    color: #e74c3c;
    font-weight: bold;
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
</style>