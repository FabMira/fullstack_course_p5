const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')


describe('Blog App', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name      : 'testingUser',
        username  : 'testingUsername',
        password  : 'testingPassword'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', {name: 'log in'}).click()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'testingUsername', 'testingPassword')
      await expect(page.getByText('User testingUsername successfully logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'testingUsername', 'wrongPassword')
      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('Wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('User testingUsername successfully logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'testingUsername', 'testingPassword')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Test blog title', 'Test blog author', 'www.testblogurl.com')
      await expect(page.getByText('a new blog Test blog title, by Test blog author added.')).toBeVisible()
      await expect(page.getByText('Test blog title, Test blog author')).toBeVisible()
    })

    test('a new blog can be edited', async ({ page }) => {
      await createBlog(page, 'Test blog title', 'Test blog author', 'www.testblogurl.com', {name: 'testingUser', username: 'testingUsername'})
      await page.getByRole('button', {name: 'view'}).click()
      await page.getByRole('button', {name: 'like'}).click()
      await expect(page.getByText('1')).toBeVisible()
    })

    test('a blog can be deleted by its creator', async ({ page }) => {
      await createBlog(page, 'Test blog title', 'Test blog author', 'www.testblogurl.com')
      await expect(page.getByText('a new blog Test blog title, by Test blog author added.')).toBeVisible()
      await createBlog(page, 'Test blog title 2', 'Test blog author', 'www.testblogurl2.com')
      await expect(page.getByText('a new blog Test blog title 2, by Test blog author added.')).toBeVisible()
      await createBlog(page, 'Test blog title 3', 'Test blog author', 'www.testblogurl3.com')
      await expect(page.getByText('a new blog Test blog title 3, by Test blog author added.')).toBeVisible()
      const viewButtons = await page.getByRole('button', {name: 'view'}).all()
      await viewButtons[1].click()
      page.once('dialog', async dialog => await dialog.accept())
      await page.getByRole('button', {name: 'remove'}).click()
      await expect(page.getByText('Test blog title 2, Test blog author')).not.toBeVisible()
    })
  })

  describe('Delete button not visible', () => {
    beforeEach(async ({ page, request }, notVisible) => {
      const res = await request.post('http://localhost:3003/api/users', {
        data: {
          name      : 'testingUser2',
          username  : 'testingUsername2',
          password  : 'testingPassword2'
        }
      })

      await loginWith(page, 'testingUsername2', 'testingPassword2')
      await createBlog(page, 'Test blog title', 'Test blog author', 'www.testblogurl.com')
      await page.goto('http://localhost:5173')
    })
    
    test('delete button not visible when the current user did not created the blog', async ({ page }) => {
      await loginWith(page, 'testingUsername', 'testingPassword')
      await expect(page.getByText('User testingUsername successfully logged in')).toBeVisible()
      await expect(page.getByText('Test blog title, Test blog author')).toBeVisible()
      await page.getByRole('button', {name: 'view'}).click()
      await expect(page.getByRole('button', {name: 'remove'})).not.toBeVisible()
    })

  })

  describe('Sorted blogs', () => {
    beforeEach(async ({ page, request }) => {
      await loginWith(page, 'testingUsername', 'testingPassword')
      await createBlog(page, 'Test blog title', 'Test blog author', 'www.testblogurl.com')
      await createBlog(page, 'Test blog title 2', 'Test blog author', 'www.testblogurl2.com')
    })
    
    test('blogs sorted by most liked', async ({ page}) => {
      await page.waitForTimeout(500)
      const viewButtons = await page.getByRole('button', {name: 'view'}).all()
      await Promise.all(viewButtons.map((btn) => btn.click()))
      let likeButtons = await page.getByRole('button', { name: 'like' }).all()
      await likeButtons[0].click()
      await likeButtons[0].click()
      await likeButtons[0].click()
      likeButtons = await page.getByRole('button', {name: 'like'}).all()
      await likeButtons[1].click()
      await likeButtons[1].click()
      await likeButtons[1].click()
      await likeButtons[1].click()
      await likeButtons[1].click()
      await page.waitForTimeout(500)
      const blogsText = await page.locator('.blogStyle').allTextContents()
      expect(blogsText[0]).toContain('Test blog title 2')
      expect(blogsText[1]).toContain('Test blog title')
    })
  })
})