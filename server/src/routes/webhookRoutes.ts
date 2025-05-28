import express from 'express';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/clerk-sdk-node';
import User from '../models/User';

const router = express.Router();

// Verify webhook signature
const verifyWebhook = (req: express.Request) => {
  console.log('=== WEBHOOK VERIFICATION START ===');
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  console.log('Webhook secret exists:', !!WEBHOOK_SECRET);

  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  console.log('Webhook headers:', { svix_id, svix_timestamp, svix_signature });

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error('Missing webhook headers');
    throw new Error('Error occurred -- no svix headers');
  }

  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(JSON.stringify(req.body), {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;

    console.log('Webhook verified successfully:', evt.type);
    console.log('=== WEBHOOK VERIFICATION END ===');
    return evt;
  } catch (error) {
    console.error('Webhook verification failed:', error);
    throw error;
  }
};

// Handle webhook events
router.post('/clerk', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log('=== WEBHOOK REQUEST RECEIVED ===');
  try {
    // Parse the raw body
    const rawBody = req.body.toString();
    console.log('Raw body:', rawBody);
    req.body = JSON.parse(rawBody);
    
    const evt = verifyWebhook(req);
    console.log('Processing webhook event:', evt.type);
    console.log('Full event data:', JSON.stringify(evt.data, null, 2));

    // Handle user creation/update
    if (evt.type === 'user.created' || evt.type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, username } = evt.data;
      console.log('User data from webhook:', { 
        id, 
        email_addresses, 
        first_name, 
        last_name,
        username 
      });

      // Get primary email
      const primaryEmail = email_addresses.find(email => email.id === evt.data.primary_email_address_id);
      if (!primaryEmail) {
        console.error('No primary email found for user:', id);
        throw new Error('No primary email found');
      }

      const userData = {
        clerkId: id,
        email: primaryEmail.email_address,
        firstName: first_name || username || 'User',
        lastName: last_name || ''
      };

      console.log('Attempting to save user data:', userData);

      try {
        // Create or update user in our database
        const user = await User.findOneAndUpdate(
          { clerkId: id },
          userData,
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true 
          }
        );

        console.log('User saved to database successfully:', JSON.stringify(user, null, 2));
      } catch (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }
    }

    // Handle user deletion
    if (evt.type === 'user.deleted') {
      console.log('Deleting user:', evt.data.id);
      await User.findOneAndDelete({ clerkId: evt.data.id });
      console.log('User deleted successfully');
    }

    res.json({ received: true, message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(400).json({ error: 'Webhook error', details: errorMessage });
  }
});

export default router; 