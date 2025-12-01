<script>
  import { user, activeMenu } from './lib/stores.js';
  import Layout from './components/Layout.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Rooms from './pages/Rooms.svelte';
  import MyReservations from './pages/MyReservations.svelte';
  import AllReservations from './pages/AllReservations.svelte';
  
  // 简单的路由处理
  let currentPage = typeof window !== 'undefined' ? window.location.pathname : '/';
  let userValue = null;
  
  // 订阅用户状态变化
  const unsubscribeUser = user.subscribe(value => {
    userValue = value;
  });
  
  // 检查本地存储中的用户信息
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      // 简化处理：如果有token就认为已登录
      user.set({ username: '用户' }); // 实际应用中应该从token解析或API获取用户名
    }
    
    // 初始化当前页面路径
    currentPage = window.location.pathname;
    
    // 监听浏览器前进后退
    window.addEventListener('popstate', () => {
      currentPage = window.location.pathname;
    });
  }
  
  // 监听菜单变化以更新页面
  activeMenu.subscribe((value) => {
    switch (value) {
      case 'dashboard':
        currentPage = '/';
        break;
      case 'rooms':
        currentPage = '/rooms';
        break;
      case 'reservations':
        currentPage = '/my-reservations';
        break;
      case 'all-reservations':
        currentPage = '/all-reservations';
        break;
    }
    
    // 更新浏览器地址栏但不刷新页面
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', currentPage);
    }
  });
  
  // 监听URL变化
  if (typeof window !== 'undefined') {
    const handleUrlChange = () => {
      currentPage = window.location.pathname;
    };
    
    window.addEventListener('popstate', handleUrlChange);
  }
</script>

<Layout {currentPage}>
  {#if currentPage === '/login'}
    <Login />
  {:else if currentPage === '/register'}
    <Register />
  {:else if !userValue && currentPage !== '/login' && currentPage !== '/register'}
    <!-- 显示登录页面而不是提示 -->
    <Login />
  {:else if currentPage === '/' || currentPage === '/dashboard'}
    <Dashboard />
  {:else if currentPage === '/rooms'}
    <Rooms />
  {:else if currentPage === '/my-reservations'}
    <MyReservations />
  {:else if currentPage === '/all-reservations'}
    <AllReservations />
  {:else}
    <div>
      <h1>404 - 页面未找到</h1>
      <p>您访问的页面不存在。</p>
    </div>
  {/if}
</Layout>

<!-- 隐藏原始内容 -->
<div style="display: none;">
  <main>
    <div>
      <a href="https://vite.dev" target="_blank" rel="noreferrer">
        <img src="/vite.svg" class="logo" alt="Vite Logo" />
      </a>
      <a href="https://svelte.dev" target="_blank" rel="noreferrer">
        <img src="./assets/svelte.svg" class="logo svelte" alt="Svelte Logo" />
      </a>
    </div>
    <h1>Vite + Svelte</h1>

    <div class="card">
    </div>

    <p>
      Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
    </p>

    <p class="read-the-docs">
      Click on the Vite and Svelte logos to learn more
    </p>
  </main>

  <style>
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.svelte:hover {
      filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    .read-the-docs {
      color: #888;
    }
  </style>
</div>