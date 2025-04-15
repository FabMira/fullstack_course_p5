const Blog = ({ blog }) => (
  <div>
    <li className="blog">
    {blog.title} {blog.author}
    </li>
  </div>  
)

export default Blog