import { useState } from "react"

const Blog = ({ blog, handleSubmit, handleRemove, user }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }
  return (
    <div>
      <div className="blogStyle" style={hideWhenVisible}>
          {blog.title}, {blog.author}<button onClick={() => setVisible(true)}>view</button>
      </div>
      <div className="blogStyle" style={showWhenVisible}>
          <div>
            {blog.title}, {blog.author}<button onClick={() => setVisible(false)}>hide</button>
          </div>
          <div>
            {blog.url}
          </div>
          <div>
            {blog.likes} <button onClick={() => handleSubmit(blog)}>like</button>
          </div>
          <div>
            {blog.user.name} 
          </div>
          {user && user.username === blog.user.username && (
          <div>
          <button onClick={() => handleRemove(blog)}>remove</button>
          </div>
          )}
        </div>
    </div> 
  ) 
}
  

export default Blog