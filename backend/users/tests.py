from django.test import TestCase
from django.urls import reverse
from users.models import User


class ForgotPasswordFlowTests(TestCase):
    def test_user_can_reset_password_with_new_password(self):
        user = User.objects.create_user(
            username='recoveruser',
            email='recover@example.com',
            password='oldpassword123'
        )

        response = self.client.post(
            reverse('forgot_password'),
            {
                'username': 'recoveruser',
                'new_password': 'newpassword456',
                'confirm_password': 'newpassword456',
            },
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertTrue(user.check_password('newpassword456'))

    def test_reset_fails_for_unknown_username(self):
        response = self.client.post(
            reverse('forgot_password'),
            {
                'username': 'missinguser',
                'new_password': 'newpassword456',
                'confirm_password': 'newpassword456',
            },
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 404)
