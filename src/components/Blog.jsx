import { useState } from "react"

const Blog = ({ blog, user }) => {
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
            {blog.likes} <button>like</button>
          </div>
          <div>
            {user.name}
          </div>
        </div>
    </div> 
  ) 
}
  

export default Blog