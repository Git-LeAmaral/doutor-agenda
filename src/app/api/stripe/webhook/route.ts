import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      throw new Error("Stripe secret key not found");
    }
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      throw new Error("Stripe signature not found");
    }
    const text = await request.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Stripe webhook event type:', event.type);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Checkout session data:', {
          id: session.id,
          subscription: session.subscription,
          customer: session.customer,
          mode: session.mode
        });
        
        if (session.mode === 'subscription' && session.subscription) {
          // Buscar a subscription para obter os metadados
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          
          console.log('Subscription data from checkout:', {
            id: subscription.id,
            customer: subscription.customer,
            status: subscription.status,
            metadata: subscription.metadata
          });
          
          const userId = subscription.metadata.userId;
          if (!userId) {
            console.log('No userId found in subscription metadata');
            break;
          }
          
          const stripeCustomerId = subscription.customer as string;
          const stripeSubscriptionId = subscription.id;
          
          console.log('Updating user with checkout data:', {
            userId,
            stripeSubscriptionId,
            stripeCustomerId,
            plan: 'essential'
          });
          
          await db.update(usersTable).set({
            stripeSubscriptionId,
            stripeCustomerId,
            plan: 'essential',
          })
          .where(eq(usersTable.id, userId));
          
          console.log('User updated successfully from checkout.session.completed');
        }
        break;
      }
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log('Subscription created:', {
          id: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          metadata: subscription.metadata
        });
        
        const userId = subscription.metadata.userId;
        if (!userId) {
          console.log('No userId found in metadata for subscription.created');
          break;
        }
        
        const stripeCustomerId = subscription.customer as string;
        const stripeSubscriptionId = subscription.id;
        
        console.log('Updating user with subscription.created data:', {
          userId,
          stripeSubscriptionId,
          stripeCustomerId,
          plan: 'essential'
        });
        
        await db.update(usersTable).set({
          stripeSubscriptionId,
          stripeCustomerId,
          plan: 'essential',
        })
        .where(eq(usersTable.id, userId));
        
        console.log('User updated successfully from customer.subscription.created');
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log('Subscription updated:', {
          id: subscription.id,
          customer: subscription.customer,
          status: subscription.status,
          metadata: subscription.metadata
        });
        
        const userId = subscription.metadata.userId;
        if (!userId) {
          console.log('No userId found in metadata');
          break;
        }
        
        // Se a subscription foi ativada, atualizar o usuário
        if (subscription.status === 'active') {
          await db.update(usersTable).set({
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            plan: 'essential',
          })
          .where(eq(usersTable.id, userId));
          
          console.log('User updated from subscription.updated event');
        }
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        
        console.log('Subscription deleted:', {
          id: subscription.id,
          metadata: subscription.metadata
        });
        
        if (!subscription.id) {
          throw new Error('Subscription ID not found');
        }
        
        const userId = subscription.metadata.userId;
        if (!userId) {
          throw new Error('User ID not found in subscription metadata');
        }
        
        await db
          .update(usersTable)
          .set({
            stripeSubscriptionId: null,
            stripeCustomerId: null,
            plan: null,
          })
          .where(eq(usersTable.id, userId));
          
        console.log('User subscription removed');
        break;
      }
      default:
        console.log('Unhandled webhook event type:', event.type);
    }
    
    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
};