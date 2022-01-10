import React, { useState } from 'react';

const CreateForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const createBlog = (e) => {
    e.preventDefault();
    handleCreate(title, author, url);
    setTitle('');
    setAuthor('');
    setUrl('');
  };
  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={createBlog}>
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
    </div>
  );
};

export default CreateForm;
