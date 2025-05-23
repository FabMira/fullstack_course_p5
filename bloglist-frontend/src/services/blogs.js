import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async newBlog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(
    baseUrl,
    newBlog,
    config
  )
  return response.data
}

const update = async (blog, id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.put(
    `${baseUrl}/${id}`,
    blog,
    config
  )
  return response.data
}

const remove = async (blog) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(
    `${baseUrl}/${blog.id}`,
    config
  )
  return response.data
}

export default { getAll, create, setToken, update, remove }