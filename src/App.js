import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import './index.css';
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

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

  const handleNotification = (msg, className) => {
    setErrorMessage(msg);
    const note = document.querySelector('.note');
    note.classList.toggle('hide');
    note.classList.toggle(className);

    setTimeout(() => {
      setErrorMessage(null);
      note.classList.toggle('hide');
      note.classList.toggle(className);
    }, 5000);
  };

  const loginForm = () => {
    if (user === null) {
      return (
        <div>
          <h2>log into application</h2>
          <Notification message={errorMessage} />
          <br></br>
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
        </div>
      );
    }

    return (
      <div>
        <h2>blogs</h2>

        <Notification message={errorMessage} />

        <br></br>
        <Notification message={`${user.name} logged in`} />
        <button onClick={handleLogout}>Logout</button>
        <br></br>
        <form onSubmit={handleCreate}>
          <div>
            Title:
            <input
              type="text"
              name="Title"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
            ></input>
          </div>
          <div>
            Author:
            <input
              type="text"
              name="Author"
              value={author}
              onChange={(event) => {
                setAuthor(event.target.value);
              }}
            ></input>
          </div>
          <div>
            Url:
            <input
              type="text"
              name="Url"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
              }}
            ></input>
          </div>
          <button type="submit">Create </button>
        </form>
        <br></br>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    );
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
      handleNotification(`${user.name} has successfully logged in`, 'success');
    } catch (exception) {
      handleNotification('Wrong username or password', 'fail');
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    try {
      const blog = { title, author, url, user };
      const newBlog = await blogService.create(blog);
      setTitle('');
      setAuthor('');
      setUrl('');
      setBlogs(blogs.concat(newBlog));
      handleNotification(
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      );
    } catch (exception) {
      handleNotification(`${exception.response.data.error}`, 'fail');
    }
  };

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  return <div>{loginForm()}</div>;
};

export default App;
