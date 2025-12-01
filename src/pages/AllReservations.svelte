<script>
  import { reservations } from '../lib/stores.js';
  import { reservationsApi } from '../lib/api.js';
  import { onMount } from 'svelte';
  
  let reservationsValue = [];
  let isLoading = true;
  let error = null;
  
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
      
      // 获取所有预约数据
      const reservationsData = await reservationsApi.getAllReservations();
      reservations.set(reservationsData);
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
    <h2>所有预约</h2>
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
    <div class="reservations-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>会议室</th>
            <th>预约人</th>
            <th>开始时间</th>
            <th>结束时间</th>
            <th>创建时间</th>
          </tr>
        </thead>
        <tbody>
          {#each reservationsValue as reservation}
            <tr>
              <td>{reservation.id}</td>
              <td>{reservation.roomName}</td>
              <td>{reservation.username}</td>
              <td>{formatDate(reservation.startTime)}</td>
              <td>{formatDate(reservation.endTime)}</td>
              <td>{formatDate(reservation.createdAt)}</td>
            </tr>
          {:else}
            <tr>
              <td colspan="6" class="empty-row">暂无预约记录</td>
            </tr>
          {/each}
        </tbody>
      </table>
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
  
  .reservations-table {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
  }
  
  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #555;
  }
  
  tr:hover {
    background-color: #f5f5f5;
  }
  
  .empty-row {
    text-align: center;
    color: #999;
    font-style: italic;
  }
  
  @media (max-width: 768px) {
    .reservations-table {
      overflow-x: auto;
    }
    
    table {
      min-width: 600px;
    }
  }
</style>