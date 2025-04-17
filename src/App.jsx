import { useState, useEffect } from 'react'
import { Blog, BlogForm, LoginForm, Notification  } from './components'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('notification')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    title : '',
    author: '',
    url   : ''
  })
  const [loginVisible, setLoginVisible] = useState(false)

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginVisible(false);
    // Handle login logic here
    try {
      const user = await loginService.login({
        username, password
      })
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user)
      )
    } catch (error) {
      setNotificationMessage('Wrong credentials');
      setNotificationClass('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass('notification')
      }, 5000);
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll();
        setBlogs(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      window.localStorage.clear();
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // blogService.setToken(user.token)
    }
  }, [])

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>New blog</button>
        </div>
        <div style={showWhenVisible}>
        <p>{user.name} logged in</p>
          <BlogForm
            onSubmit={addBlog}
            formData={formData}
            handleChange={handleBlogChange}
          />
          <button onClick={() => setLoginVisible(false)}>Cancel</button>
        </div>
      </div>
    )
  }

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: formData.title,
      author: formData.author,
      url: formData.url
    }

    try {
      const req = await blogService.create(newBlog)
      setBlogs(blogs.concat(req))
      setFormData({
        title: '',
        author: '',
        url: ''
      })
      setNotificationMessage(`a new blog ${newBlog.title}, by ${newBlog.author} added.`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationMessage('Error saving new blog');
      setNotificationClass('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass('notification')
      }, 5000);
    }
    
  }

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notificationMessage} className={notificationClass} />

      {!user ? loginForm() : blogForm()}

      {blogs.map(blog => <Blog key={blog.id} blog={blog} />)}

    </div>
  )
}

export default App