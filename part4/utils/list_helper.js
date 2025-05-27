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

function most_likes(blogs) {
  if (blogs.length == 0) {
    return null
  } else {
    const most_liked = blogs.reduce((most_liked, blog) => {
      return blog.likes > most_liked.likes ? blog : most_liked
    }, blogs[0])
    return most_liked
  }
}

module.exports = {
  dummy,
  total_likes,
  most_likes
}
