<script>
  import { onMount } from 'svelte';
  import { user } from '../lib/stores.js';
  import { authApi } from '../lib/api.js';
  
  let username = '';
  let password = '';
  let cardNumber = '';
  let errorMessage = '';
  let isLoading = false;
  
  onMount(async () => {
    // 检查是否有token
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // 这里可以添加token验证逻辑
        // 如果token有效，直接跳转到主页面
        // 目前我们简化处理，要求重新登录
      } catch (error) {
        console.error('Token validation failed:', error);
      }
    }
  });
  
  async function handleLogin() {
    if (!username || !password) {
      errorMessage = '请输入用户名和密码';
      return;
    }
    
    isLoading = true;
    errorMessage = '';
    
    try {
      const credentials = { username, password };
      if (cardNumber) {
        credentials.cardNumber = cardNumber;
      }
      
      const response = await authApi.login(credentials);
      
      // 保存token（如果API返回）
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // 更新用户状态
      user.set({ username });
      
      // 跳转到主页
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error);
      errorMessage = error.message || '登录失败，请检查用户名和密码';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="login-container">
  <div class="login-form">
    <h2>用户登录</h2>
    
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleLogin}>
      <div class="form-group">
        <label for="username">用户名:</label>
        <input 
          type="text" 
          id="username" 
          bind:value={username} 
          placeholder="请输入用户名"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="password">密码:</label>
        <input 
          type="password" 
          id="password" 
          bind:value={password} 
          placeholder="请输入密码"
          required
        />
      </div>
      
      <div class="form-group">
        <label for="cardNumber">卡号 (可选):</label>
        <input 
          type="text" 
          id="cardNumber" 
          bind:value={cardNumber} 
          placeholder="请输入卡号"
        />
      </div>
      
      <button 
        type="submit" 
        class="login-btn" 
        disabled={isLoading}
      >
        {isLoading ? '登录中...' : '登录'}
      </button>
    </form>
    
    <div class="register-link">
      <p>还没有账号？<a href="#" on:click|preventDefault={() => window.location.href = '/register'}>立即注册</a></p>
    </div>
  </div>
</div>

<style>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: #f0f2f5;
  }
  
  .login-form {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .login-form h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
  }
  
  .form-group input {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 16px;
    box-sizing: border-box;
  }
  
  .form-group input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
  
  .login-btn {
    width: 100%;
    padding: 12px;
    background-color: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .login-btn:hover:not(:disabled) {
    background-color: #2980b9;
  }
  
  .login-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #e74c3c;
    background-color: #fdf2f2;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .register-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .register-link a {
    color: #3498db;
    text-decoration: none;
  }
  
  .register-link a:hover {
    text-decoration: underline;
  }
</style>