const dummy = (blogs) => {
  return 1
}

const total_likes = (blogs) => {
  if (blogs.length == 0) {
    return 0
  } else {
    return blogs.reduce(function(sum, blog) {
      return sum + blog.likes
    }, 0)
  }
}

function favorite_blog(blogs) {
  if (blogs.length == 0) {
    return null
  } else {
    const most_liked = blogs.reduce((most_liked, blog) => {
      return blog.likes > most_liked.likes ? blog : most_liked
    }, blogs[0])
    return most_liked
  }
}

const most_blogs = (blogs) => {
  const map1 = new Map()
  blogs.forEach(function (blog) {
    const count = map1.get(blog.author) || 0
    map1.set(blog.author, count + 1)
  })

  const result = [...map1.entries()].reduce((a, e) => e[1] > a[1] ? e : a)
  return result
}

const most_likes = (blogs) => {
  const map1 = new Map()
  blogs.forEach(function (blog) {
    const count = map1.get(blog.author) || 0
    map1.set(blog.author, count + blog.likes)
  })

  const result = [...map1.entries()].reduce((a, e) => e[1] > a[1] ? e : a)
  return result
}
module.exports = {
  dummy,
  total_likes,
  favorite_blog,
  most_blogs,
  most_likes
}
