'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, X, CheckCircle, CreditCard, Lock } from 'lucide-react';
import Image from 'next/image';
import { prompts, type Prompt } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function MarketplacePage() {
  const [cart, setCart] = useState<Prompt[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const addToCart = (prompt: Prompt) => {
    if (!cart.find(p => p.id === prompt.id)) {
      setCart([...cart, prompt]);
    }
  };

  const removeFromCart = (promptId: string) => {
    setCart(cart.filter(p => p.id !== promptId));
  };

  const cartTotal = cart.reduce((sum, prompt) => sum + prompt.price, 0);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const completeOrder = () => {
    setOrderComplete(true);
    setTimeout(() => {
      setCart([]);
      setShowCheckout(false);
      setOrderComplete(false);
    }, 3000);
  };

  const topSellers = [...prompts].sort((a, b) => b.purchaseCount - a.purchaseCount).slice(0, 6);
  const trending = prompts.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-end mb-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="relative border-gray-700 text-gray-300">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Cart
                  {cart.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-indigo-600">
                      {cart.length}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md bg-gray-900 border-gray-800">
                <SheetHeader>
                  <SheetTitle className="text-gray-100">Shopping Cart ({cart.length})</SheetTitle>
                </SheetHeader>

                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-600 mb-4" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Browse prompts and add them to your cart
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto py-4 space-y-4">
                      {cart.map(prompt => (
                        <Card key={prompt.id} className="border-gray-800 bg-gray-800">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-sm font-medium text-gray-100 mb-1">{prompt.title}</h3>
                                <p className="text-xs text-gray-400">{prompt.domain}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(prompt.id)}
                                className="text-gray-400 hover:text-gray-100"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="border-gray-700 text-gray-400">{prompt.category}</Badge>
                              <p className="text-indigo-400 font-bold">${prompt.price}</p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <div className="border-t border-gray-800 pt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-300">Subtotal</span>
                        <span className="text-2xl font-bold text-indigo-400">${cartTotal.toFixed(2)}</span>
                      </div>
                      <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg" onClick={handleCheckout}>
                        <CreditCard className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">Marketplace</h1>
            <p className="text-gray-400">
              Purchase high-quality prompts and start creating immediately
            </p>
          </div>

          {/* Trending Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Trending Now</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {trending.map(prompt => (
                <MarketplaceCard
                  key={prompt.id}
                  prompt={prompt}
                  onAddToCart={addToCart}
                  inCart={cart.some(p => p.id === prompt.id)}
                />
              ))}
            </div>
          </div>

          {/* Top Sellers */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-4">Top Sellers</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {topSellers.map(prompt => (
                <MarketplaceCard
                  key={prompt.id}
                  prompt={prompt}
                  onAddToCart={addToCart}
                  inCart={cart.some(p => p.id === prompt.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-100">Checkout</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCheckout(false)}
                  className="text-gray-400"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {!orderComplete ? (
                <>
                  {/* Order Summary */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-100 mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      {cart.map(prompt => (
                        <div
                          key={prompt.id}
                          className="flex items-center justify-between py-2 border-b border-gray-800"
                        >
                          <div>
                            <p className="text-gray-100">{prompt.title}</p>
                            <p className="text-sm text-gray-400">{prompt.domain}</p>
                          </div>
                          <p className="text-gray-100 font-medium">${prompt.price}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4">
                      <span className="text-lg text-gray-100">Total</span>
                      <span className="text-2xl font-bold text-indigo-400">${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Payment Form */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-100">Payment Information</h3>
                    <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-blue-300">
                            This is a demo. In production, this would integrate with Paystack
                            for secure payment processing.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                      <Input placeholder="4242 4242 4242 4242" className="bg-gray-800 border-gray-700 text-gray-100" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                        <Input placeholder="MM / YY" className="bg-gray-800 border-gray-700 text-gray-100" />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-300 mb-2">CVC</label>
                        <Input placeholder="123" className="bg-gray-800 border-gray-700 text-gray-100" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Email</label>
                      <Input type="email" placeholder="you@example.com" className="bg-gray-800 border-gray-700 text-gray-100" />
                    </div>
                  </div>

                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg" onClick={completeOrder}>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Complete Purchase - ${cartTotal.toFixed(2)}
                  </Button>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-2">Order Complete!</h3>
                  <p className="text-gray-400 mb-4">
                    Your prompts have been added to your library
                  </p>
                  <p className="text-sm text-gray-500">
                    Receipt sent to your email
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}

interface MarketplaceCardProps {
  prompt: Prompt;
  onAddToCart: (prompt: Prompt) => void;
  inCart: boolean;
}

function MarketplaceCard({ prompt, onAddToCart, inCart }: MarketplaceCardProps) {
  const recommendedModel = prompt.models.find(m => m.recommended);

  return (
    <Card className="h-full border-2 border-gray-800 bg-gray-900 hover:border-indigo-500/50 transition-all">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          {/* Header */}
          <div className="mb-3">
            <Link href={`/prompt/${prompt.id}`}>
              <h3 className="text-lg font-bold text-gray-100 mb-1 hover:text-indigo-400 transition-colors">
                {prompt.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-400 line-clamp-2">{prompt.description}</p>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-indigo-600/20 text-indigo-400 border-indigo-600/30">{prompt.domain}</Badge>
            {prompt.featured && (
              <Badge variant="secondary" className="bg-yellow-600/20 text-yellow-400 border-yellow-600/30">
                Featured
              </Badge>
            )}
          </div>

          {/* Model Recommendation */}
          {recommendedModel && (
            <div className="bg-green-600/10 border border-green-600/30 rounded-lg p-2 mb-3">
              <p className="text-xs text-green-400">Best with {recommendedModel.name}</p>
            </div>
          )}

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <Image
              src={prompt.creator.avatar}
              alt={prompt.creator.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="text-sm text-gray-400">{prompt.creator.name}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-800 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-xl font-bold text-indigo-400">${prompt.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Purchases</p>
              <p className="text-gray-100 font-medium">{prompt.purchaseCount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={`/prompt/${prompt.id}`} className="flex-1">
              <Button variant="outline" className="w-full border-gray-700 text-gray-300 hover:bg-gray-800">
                View Details
              </Button>
            </Link>
            <Button
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              onClick={() => onAddToCart(prompt)}
              disabled={inCart}
            >
              {inCart ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  In Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
