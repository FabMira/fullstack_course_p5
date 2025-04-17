const BlogForm = ({ onSubmit, handleChange, formData }) => {
    return (
        <div>
            <h2>Create a new Blog</h2>

            <form onSubmit={onSubmit}>
                <div>
                    <label>Title:</label>
                    <input 
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Author:</label>
                    <input 
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Url:</label>
                    <input 
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default BlogForm