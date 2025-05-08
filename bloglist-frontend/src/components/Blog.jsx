import { useState } from 'react'

const Blog = ({ blog, handleSubmit, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  const changeVisible = () => {
    setVisible(!visible)
  }
  return (
    <div className='blogStyle'>
      {blog.title}, {blog.author}
      <div style={hideWhenVisible}>
        <button onClick={changeVisible}>view</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          <button onClick={() => setVisible(false)}>hide</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          {blog.likes} <button onClick={() => handleSubmit(blog)}>like</button>
        </div>
        <div>
          {blog.user?.name}
        </div>
        {blog.user && user && user.username === blog.user.username && (
          <div>
            <button onClick={() => handleRemove(blog)}>remove</button>
          </div>
        )}
      </div>
    </div>
  )
}



export default Blog