<script>
  import { user, activeMenu } from '../lib/stores.js';
  import Sidebar from './Sidebar.svelte';
  import Header from './Header.svelte';
  
  export let currentPage;
  
  let userValue;
  let activeMenuValue;
  
  const unsubscribeUser = user.subscribe(value => {
    userValue = value;
  });
  
  const unsubscribeActiveMenu = activeMenu.subscribe(value => {
    activeMenuValue = value;
  });

  function logout() {
    localStorage.removeItem('token');
    user.set(null);
  }
</script>

<div class="layout">
  {#if userValue}
    <Sidebar bind:active={activeMenuValue} />
  {/if}
  
  <div class="main-content">
    {#if userValue}
      <Header {userValue} on:logout={logout} />
    {/if}
    
    <div class="content">
      <slot></slot>
    </div>
  </div>
</div>

<style>
  .layout {
    display: flex;
    min-height: 100vh;
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100vw;
  }
  
  .content {
    flex: 1;
    background-color: #f5f5f5;
  }
  
  /* 当用户未登录时隐藏侧边栏和头部 */
  :global(.login-container),
  :global(.register-container) {
    flex: 1;
  }
</style>