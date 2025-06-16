import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const getUserBlogs = async (token) => {
  const config = {
  headers: {
    Authorization: `Bearer ${token}`,
  },
}

const response = await axios.get(`${baseUrl}/myblogs`, config)
return response.data
}

const postBlog = async (blog, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

export default { getAll, getUserBlogs, postBlog }