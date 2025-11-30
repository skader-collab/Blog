from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from .models import Contact, Post


class ContactFormTests(TestCase):
	def test_contact_post_creates_contact_and_shows_success(self):
		url = reverse('cyber:contact')
		data = {
			'name': 'Test User',
			'email': 'test@example.com',
			'subject': 'Hello',
			'message': 'This is a test message.'
		}

		response = self.client.post(url, data)

		# Should render the same template with success context
		self.assertEqual(response.status_code, 200)
		self.assertTrue(response.context.get('success'))
		self.assertTrue(Contact.objects.filter(email='test@example.com', subject='Hello').exists())


class PostListTests(TestCase):
	def setUp(self):
		User = get_user_model()
		self.user = User.objects.create_user(username='author', password='password')

	def test_post_list_shows_published_posts(self):
		# create published and unpublished post
		Post.objects.create(author=self.user, title='Visible Post', published=True)
		Post.objects.create(author=self.user, title='Hidden Post', published=False)

		url = reverse('cyber:post_list')
		response = self.client.get(url)

		self.assertEqual(response.status_code, 200)
		page_obj = response.context.get('page_obj')
		self.assertIsNotNone(page_obj)
		titles = [p.title for p in page_obj.object_list]
		self.assertIn('Visible Post', titles)
		self.assertNotIn('Hidden Post', titles)
