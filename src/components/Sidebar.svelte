<script>
  import { activeMenu } from '../lib/stores.js';
  
  export let active;
  
  const menuItems = [
    { id: 'dashboard', label: '仪表盘', icon: '📊' },
    { id: 'rooms', label: '会议室', icon: '🚪' },
    { id: 'reservations', label: '我的预约', icon: '📅' },
    { id: 'all-reservations', label: '所有预约', icon: '📋' },
  ];
  
  function handleMenuClick(itemId) {
    active = itemId;
    activeMenu.set(itemId);
  }
</script>

<div class="sidebar">
  <div class="logo">
    <h2>会议室预约系统</h2>
  </div>
  
  <nav class="menu">
    {#each menuItems as item}
      <button 
        class="menu-item {active === item.id ? 'active' : ''}"
        on:click={() => handleMenuClick(item.id)}
      >
        <span class="icon">{item.icon}</span>
        <span class="label">{item.label}</span>
      </button>
    {/each}
  </nav>
</div>

<style>
  .sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    height: 100vh;
    position: fixed;
    overflow-y: auto;
  }
  
  .logo {
    padding: 20px;
    text-align: center;
    border-bottom: 1px solid #34495e;
  }
  
  .logo h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  
  .menu {
    padding: 10px 0;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 15px 20px;
    border: none;
    background: transparent;
    color: #ecf0f1;
    cursor: pointer;
    text-align: left;
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  .menu-item:hover {
    background-color: #34495e;
  }
  
  .menu-item.active {
    background-color: #3498db;
  }
  
  .icon {
    margin-right: 10px;
    font-size: 1.2rem;
  }
</style>