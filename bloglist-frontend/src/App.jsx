import { useState, useEffect, useRef } from 'react'
import { Blog, BlogForm, LoginForm, Notification } from './components'
import blogService from './services/blogs'
import loginService from './services/login'
import Toggable from './components/Toggable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationClass, setNotificationClass] = useState('notification')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()

  const handleLogin = async (event) => {
    event.preventDefault()
    setLoginVisible(false)
    // Handle login logic here
    try {
      const user = await loginService.login({
        username, password
      })

      blogService.setToken(user.token)
      setUser(user)
      setNotificationMessage(`User ${username} successfully logged in`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
      window.localStorage.setItem(
        'loggedBlogAppUser',
        JSON.stringify(user)
      )
    } catch (error) {
      setNotificationMessage('Wrong credentials')
      setNotificationClass('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass('notification')
      }, 5000)
    }
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      }
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault()
      window.localStorage.clear()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
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

  const addBlog = async (blogObject) => {
    setNotificationMessage(null)
    try {
      const req = await blogService.create(blogObject)
      setBlogs(blogs.concat(req))
      blogFormRef.current.toggleVisibility()
      setNotificationMessage(`a new blog ${req.title}, by ${req.author} added.`)
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)
    } catch (error) {
      setNotificationMessage('Error saving new blog')
      setNotificationClass('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass('notification')
      }, 5000)
    }

  }

  const updateBlog = async (blog) => {
    const blogToUpdate = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    try {
      await blogService.update(blogToUpdate, blog.id)
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    } catch (error) {
      setNotificationMessage(`Error updating the blog ${blog.title}`)
      setNotificationClass('error')
      setTimeout(() => {
        setNotificationMessage(null)
        setNotificationClass('notification')
      }, 5000)
    }



  }

  const removeBlog = async (blog) => {
    if( window.confirm(`Remove blog ${blog.title} by ${blog.author}?`) ) {
      try {
        await blogService.remove(blog)
        const blogs = await blogService.getAll()
        setBlogs(blogs)
        setNotificationMessage(`The blog ${blog.title}, was deleted.`)
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      } catch (error) {
        setNotificationMessage(`Error deleting the blog ${blog.title}`)
        setNotificationClass('error')
        setTimeout(() => {
          setNotificationMessage(null)
          setNotificationClass('notification')
        }, 5000)
      }
    }
  }

  return (
    <div>
      <h1>Blogs</h1>

      <Notification message={notificationMessage} className={notificationClass} />

      {!user && loginForm()}
      {user && <div>
        <Toggable buttonLabel="New blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Toggable>
      </div>
      }

      {blogs
        .sort((blogA, blogB) => blogB.likes - blogA.likes )
        .map(blog => <Blog
          key={blog.id}
          blog={blog}
          handleSubmit={updateBlog}
          handleRemove={removeBlog}
          user={user}
        />)}

    </div>
  )
}

export default App