import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import { prettyDOM } from '@testing-library/dom';
import Blog from './Blog';

describe('Blog', () => {
  let component;

  beforeEach(() => {
    const blog = {
      title: 'nba basketball',
      author: 'nba',
      likes: 10,
      url: 'nba.com',
      user: { name: 'kevin Nguyen' },
    };
    component = render(<Blog blog={blog} />);
  });
  test('blog only renders title and author by default', () => {
    const div = component.container.querySelector('.fullBlog');
    expect(div).toHaveStyle('display: none');
    console.log(prettyDOM(div));
  });
});
