import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    user: {
      name: 'Test User',
      username: 'testuser'
    },
  }
  render(<Blog blog={blog} />)
  const element = screen.getByText('Test Blog, Test Author')
  expect(element).toBeDefined()
})

test('renders url and likes when view button is clicked', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    user: {
      name: 'Test User',
      username: 'testuser'
    },
    url: 'http://testurl.com',
    likes: 5,
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} changeVisible={mockHandler}/>)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(mockHandler.mock.calls).toHaveLength(1)
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    title: 'Test Blog',
    author: 'Test Author',
    user: {
      name: 'Test User',
      username: 'testuser'
    },
    url: 'http://testurl.com',
    likes: 5,
  }

  const mockHandler = vi.fn()
  render(<Blog blog={blog} handleSubmit={mockHandler} changeVisible={() => {}} />)
  const user = userEvent.setup()
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
  expect(mockHandler.mock.calls[0][0]).toEqual(blog)
})