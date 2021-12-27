import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJson = window.localStorage.getItem('loggedBlogappUser');

    if (loggedUserJson) {
      const user = JSON.parse(loggedUserJson);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="texts"
          name="Usernmae"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>
      </div>

      <div>
        password
        <input
          type="password"
          name="Password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
      </div>
      <button type="submit">Login</button>
    </form>
  );

  const blogList = () => {
    return blogs.map((blog) => <Blog key={blog.id} blog={blog} />);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  return (
    <div>
      <Notification message={errorMessage} />
      {user === null ? (
        <div>
          <h2>log into application</h2>
          {loginForm()}
        </div>
      ) : (
        <div>
          <h2>blogs</h2>
          {blogList()}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default App;
