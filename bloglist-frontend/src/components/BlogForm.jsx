import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [formData, setFormData] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: formData.title,
      author: formData.author,
      url: formData.url
    })
    setFormData({ title: '', author: '', url: '' })
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={addBlog}>
        <div>
          <label>Title:</label>
          <input
            data-testid='title'
            name="title"
            value={formData.title}
            onChange={handleBlogChange}
            placeholder='Title of the blog'
          />
        </div>
        <div>
          <label>Author:</label>
          <input
            data-testid='author'
            name="author"
            value={formData.author}
            onChange={handleBlogChange}
            placeholder='Author of the blog'
          />
        </div>
        <div>
          <label>Url:</label>
          <input
            data-testid='url'
            name="url"
            value={formData.url}
            onChange={handleBlogChange}
            placeholder='Url of the blog'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm