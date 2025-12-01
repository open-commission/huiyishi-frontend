<script>
  export let userValue;
  
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  function handleLogout() {
    dispatch('logout');
  }
</script>

<header class="header">
  <div class="header-content">
    <h1>会议室预约系统</h1>
    {#if userValue}
      <div class="user-info">
        <span>欢迎, {userValue.username}!</span>
        <button on:click={handleLogout} class="logout-btn">退出</button>
      </div>
    {/if}
  </div>
</header>

<style>
  .header {
    background-color: white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    padding: 0 20px;
  }
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }
  
  .header h1 {
    margin: 0;
    font-size: 1.5rem;
    color: #333;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  
  .logout-btn {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #c0392b;
  }
</style>