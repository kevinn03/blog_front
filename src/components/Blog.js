import React, { useState } from 'react';
const Blog = ({ blog, updateLike, removeBlog }) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? '' : 'none' };
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const showBlog = () => {
    return (
      <div>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={toggleVisibility}>
            {visible ? 'hide' : 'view'}
          </button>
        </div>
        <div style={showWhenVisible}>
          <div>{blog.url}</div>
          <div>
            likes:{blog.likes}{' '}
            <button
              onClick={() => {
                return updateLike(blog);
              }}
            >
              like
            </button>
          </div>
          <div>{blog.user.name}</div>
          <div>
            <button
              onClick={() => {
                removeBlog(blog);
              }}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    );
  };
  return <div style={blogStyle}>{showBlog()}</div>;
};

export default Blog;
