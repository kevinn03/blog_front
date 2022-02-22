import React, { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import CreateForm from './components/CreateForm';
import LoginForm from './components/LoginForm';
import './index.css';

const App = () => {
  const [blogs, setBlogs] = useState([]);

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
  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);

      handleNotification(`${user.name} has successfully logged in`, 'success');
    } catch (exception) {
      handleNotification('Wrong username or password', 'fail');
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    blogService.setToken(null);
  };

  const loginForm = () => {
    return (
      <div>
        <Notification message={errorMessage} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );
  };

  const handleCreate = async (title, author, url) => {
    try {
      const blog = { title, author, url, user };

      const newBlog = await blogService.create(blog);

      setBlogs(blogs.concat(newBlog));
      handleNotification(
        `A new blog ${newBlog.title} by ${newBlog.author} added`,
        'success'
      );
    } catch (exception) {
      handleNotification(`${exception.response.data.error}`, 'fail');
    }
  };
  const createBlogForm = () => {
    return (
      <div>
        <Notification message={errorMessage} />
        <h2>blogs</h2>

        <p>
          {`${user.name} logged in`}{' '}
          <button onClick={handleLogout}>Logout</button>
        </p>

        <Togglable buttonLabel={'create new blog'}>
          <CreateForm handleCreate={handleCreate}></CreateForm>
        </Togglable>
      </div>
    );
  };

  const updateLike = async (blog) => {
    const newObject = {
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
      id: blog.id,
    };
    const result = await blogService.edit(newObject);

    const newBlogs = blogs.filter((blogEle) => blogEle.id !== blog.id);
    newBlogs.push(result);
    setBlogs(newBlogs);
  };

  const removeBlog = async (blog) => {
    try {
      alert(`Remove blog ${blog.title} by ${blog.author}`);
      await blogService.remove(blog.id);
      const newBlogs = blogs.filter((ele) => ele.id !== blog.id);
      setBlogs(newBlogs);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div>
      {user === null ? (
        <div>{loginForm()}</div>
      ) : (
        <div>
          {createBlogForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                updateLike={updateLike}
                removeBlog={removeBlog}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
