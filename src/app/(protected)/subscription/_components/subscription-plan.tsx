"use client"

import {loadStripe} from "@stripe/stripe-js"
import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAction } from "next-safe-action/hooks"

import { createStripeCheckout } from "@/actions/create-stripe-checkout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription,CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SubscriptionCardProps {
  active?: boolean;
  userEmail?: string;
}

export function SubscriptionPlan({ active = false, userEmail }: SubscriptionCardProps) {
  const router = useRouter();
  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({data}) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) {
        throw new Error("Stripe not found");
      }
      if (!data?.sessionId) {
        throw new Error("Session ID not found");
      }
      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      })
    }
  })
  const features = [
    "Cadastro de até 3 médicos",
    "Agendamentos ilimitados",
    "Métricas básicas",
    "Cadastro de pacientes",
    "Confirmação manual",
    "Suporte via e-mail",
  ]

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute()
  };

  const handleManagePlanClick = () => {
    router.push(`${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}?prefilled_email=${userEmail}`)
  }

  return (
    <Card className="w-full max-w-sm bg-white border border-gray-200 relative">
      {active && (
        <Badge
          variant="secondary"
          className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
        >
          Atual
        </Badge>
      )}

      <CardHeader className="pb-4">
        <CardTitle className="text-2xl font-bold text-gray-900">Essential</CardTitle>
        <CardDescription className="text-gray-600 text-sm leading-relaxed">
          Para profissionais autônomos ou pequenas clínicas
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="mb-8">
          <span className="text-4xl font-bold text-gray-900">R$59</span>
          <span className="text-gray-500 ml-2">/ mês</span>
        </div>

        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white stroke-[3]" />
              </div>
              <span className="text-gray-700 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        <Button 
            className="w-full bg-white text-gray-900 border border-gray-300 hover:bg-gray-50" 
            variant="outline"
            onClick={active ? handleManagePlanClick : handleSubscribeClick}
            disabled={createStripeCheckoutAction.isExecuting}
          >
            {createStripeCheckoutAction.isExecuting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              active ? "Gerenciar assinatura" : "Fazer assinatura"
            )}
        </Button>
      </CardFooter>
    </Card>
  )
}
