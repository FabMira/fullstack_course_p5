import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'


test('<BlogForm /> calls createBlog with correct details', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByPlaceholderText('Title of the blog')
  const authorInput = screen.getByPlaceholderText('Author of the blog')
  const urlInput = screen.getByPlaceholderText('Url of the blog')
  const createButton = screen.getByText('create')
  await user.type(titleInput, 'Testing Blog Title')
  await user.type(authorInput, 'Testing Blog Author')
  await user.type(urlInput, 'https://testingblog.com')
  await user.click(createButton)
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing Blog Title')
  expect(createBlog.mock.calls[0][0].author).toBe('Testing Blog Author')
  expect(createBlog.mock.calls[0][0].url).toBe('https://testingblog.com')
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing Blog Title',
    author: 'Testing Blog Author',
    url: 'https://testingblog.com'
  })
})