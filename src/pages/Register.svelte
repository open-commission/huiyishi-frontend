<script>
  import { user } from '../lib/stores.js';
  import { authApi } from '../lib/api.js';
  
  let username = '';
  let password = '';
  let confirmPassword = '';
  let cardNumber = '';
  let errorMessage = '';
  let successMessage = '';
  let isLoading = false;
  
  async function handleRegister() {
    if (!username || !password) {
      errorMessage = '请输入用户名和密码';
      return;
    }
    
    if (password !== confirmPassword) {
      errorMessage = '两次输入的密码不一致';
      return;
    }
    
    isLoading = true;
    errorMessage = '';
    successMessage = '';
    
    try {
      const userData = { username, password };
      if (cardNumber) {
        userData.cardNumber = cardNumber;
      }
      
      await authApi.register(userData);
      
      successMessage = '注册成功！即将跳转到登录页面...';
      
      // 注册成功后自动跳转到登录页
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      errorMessage = error.message || '注册失败，请稍后重试';
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="register-container">
  <div class="register-form">
    <h2>用户注册</h2>
    
    {#if errorMessage}
      <div class="error-message">
        {errorMessage}
      </div>
    {/if}
    
    {#if successMessage}
      <div class="success-message">
        {successMessage}
      </div>
    {/if}
    
    <form on:submit|preventDefault={handleRegister}>
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
        <label for="confirmPassword">确认密码:</label>
        <input 
          type="password" 
          id="confirmPassword" 
          bind:value={confirmPassword} 
          placeholder="请再次输入密码"
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
        class="register-btn" 
        disabled={isLoading}
      >
        {isLoading ? '注册中...' : '注册'}
      </button>
    </form>
    
    <div class="login-link">
      <p>已有账号？<a href="#" on:click|preventDefault={() => window.location.href = '/login'}>立即登录</a></p>
    </div>
  </div>
</div>

<style>
  .register-container {
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
  
  .register-form {
    background: white;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
  }
  
  .register-form h2 {
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
  
  .register-btn {
    width: 100%;
    padding: 12px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  .register-btn:hover:not(:disabled) {
    background-color: #27ae60;
  }
  
  .register-btn:disabled {
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
  
  .success-message {
    color: #27ae60;
    background-color: #f2fdf2;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .login-link {
    text-align: center;
    margin-top: 20px;
  }
  
  .login-link a {
    color: #3498db;
    text-decoration: none;
  }
  
  .login-link a:hover {
    text-decoration: underline;
  }
</style>