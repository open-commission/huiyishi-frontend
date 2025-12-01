<script>
  import { myReservations } from '../lib/stores.js';
  import { reservationsApi } from '../lib/api.js';
  import { onMount } from 'svelte';
  
  let reservationsValue = [];
  let isLoading = true;
  let error = null;
  
  const unsubscribeReservations = myReservations.subscribe(value => {
    reservationsValue = value;
  });
  
  onMount(async () => {
    await loadData();
  });
  
  async function loadData() {
    try {
      isLoading = true;
      error = null;
      
      // 获取我的预约数据
      const reservationsData = await reservationsApi.getUserReservations();
      myReservations.set(reservationsData);
    } catch (err) {
      console.error('Failed to load reservations:', err);
      error = '加载预约数据失败: ' + (err.message || '未知错误');
    } finally {
      isLoading = false;
    }
  }
  
  function formatDate(dateString) {
    // 简单的日期格式化函数
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN');
  }
</script>

<div class="reservations-page">
  <div class="header">
    <h2>我的预约</h2>
    <button class="refresh-btn" on:click={loadData} disabled={isLoading}>
      {isLoading ? '刷新中...' : '刷新'}
    </button>
  </div>
  
  {#if isLoading && reservationsValue.length === 0}
    <div class="loading">加载中...</div>
  {:else if error}
    <div class="error">
      <p>{error}</p>
      <button on:click={loadData}>重新加载</button>
    </div>
  {:else}
    <div class="reservations-list">
      {#each reservationsValue as reservation}
        <div class="reservation-card">
          <div class="reservation-header">
            <h3>{reservation.roomName}</h3>
            <span class="reservation-id">ID: {reservation.id}</span>
          </div>
          
          <div class="reservation-details">
            <div class="detail-row">
              <span class="label">预约人:</span>
              <span class="value">{reservation.username}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">开始时间:</span>
              <span class="value">{formatDate(reservation.startTime)}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">结束时间:</span>
              <span class="value">{formatDate(reservation.endTime)}</span>
            </div>
            
            <div class="detail-row">
              <span class="label">创建时间:</span>
              <span class="value">{formatDate(reservation.createdAt)}</span>
            </div>
          </div>
        </div>
      {:else}
        <div class="empty-state">
          <p>暂无预约记录</p>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .reservations-page {
    padding: 20px;
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  
  .header h2 {
    margin: 0;
    color: #333;
  }
  
  .refresh-btn {
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .refresh-btn:hover:not(:disabled) {
    background-color: #2980b9;
  }
  
  .refresh-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  
  .loading, .error, .empty-state {
    text-align: center;
    padding: 40px;
  }
  
  .error button, .empty-state button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .reservations-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .reservation-card {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 20px;
  }
  
  .reservation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .reservation-header h3 {
    margin: 0;
    color: #333;
  }
  
  .reservation-id {
    color: #999;
    font-size: 0.9rem;
  }
  
  .reservation-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  @media (max-width: 768px) {
    .reservation-details {
      grid-template-columns: 1fr;
    }
  }
  
  .detail-row {
    display: flex;
    justify-content: space-between;
  }
  
  .label {
    color: #666;
    font-weight: 500;
  }
  
  .value {
    color: #333;
    font-weight: 500;
  }
</style>