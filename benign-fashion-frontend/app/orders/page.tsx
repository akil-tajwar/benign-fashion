

"use client"
import '.././globals.css'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, Truck, CheckCircle, Clock, Eye, ArrowRight, Leaf } from "lucide-react"
import Image from "next/image"

interface Order {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered"
  total: number
  items: {
    id: string
    name: string
    image: string
    quantity: number
    price: number
  }[]
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 89.5,
    items: [
      {
        id: "1",
        name: "Organic Tomatoes",
        image: "/organic-tomatoes.png",
        quantity: 2,
        price: 12.99,
      },
      {
        id: "2",
        name: "Free-Range Eggs",
        image: "/free-range-eggs.png",
        quantity: 1,
        price: 8.99,
      },
      {
        id: "3",
        name: "Organic Spinach",
        image: "/organic-spinach.png",
        quantity: 3,
        price: 15.99,
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 156.75,
    items: [
      {
        id: "4",
        name: "Grass-Fed Beef",
        image: "/grass-fed-beef.png",
        quantity: 1,
        price: 45.99,
      },
      {
        id: "5",
        name: "Organic Milk",
        image: "/organic-milk.png",
        quantity: 2,
        price: 6.99,
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-01-22",
    status: "processing",
    total: 67.25,
    items: [
      {
        id: "6",
        name: "Herbal Tea Blend",
        image: "/herbal-tea.jpg",
        quantity: 3,
        price: 18.99,
      },
    ],
  },
]

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
  processing: { color: "bg-blue-100 text-blue-800", icon: Package, label: "Processing" },
  shipped: { color: "bg-purple-100 text-purple-800", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-blue-100 text-blue-800", icon: CheckCircle, label: "Delivered" },
}

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('/organic-pattern.svg')] opacity-5"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Order History</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 font-display">Your Organic Journey</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Track your fresh, sustainable orders and discover the story behind each organic treasure
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8">
          {mockOrders.map((order, index) => {
            const statusInfo = statusConfig[order.status]
            const StatusIcon = statusInfo.icon

            return (
              <Card
                key={order.id}
                className="group hover:shadow-2xl transition-all duration-300 organic-border bg-card/80 backdrop-blur-sm overflow-hidden"
              >
                <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-primary"></div>

                <CardHeader className="pb-6 bg-gradient-to-r from-background/50 to-secondary/30">
                  <div className="flex items-start justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-bold text-foreground font-display">
                            Order #{order.id.split("-")[2]}
                          </CardTitle>
                          <p className="text-muted-foreground font-medium">
                            {new Date(order.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-3">
                      <Badge className={`${statusInfo.color} px-4 py-2 text-sm font-semibold`}>
                        <StatusIcon className="w-4 h-4 mr-2" />
                        {statusInfo.label}
                      </Badge>
                      <p className="text-3xl font-bold text-foreground font-display">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-8">
                  <div className="grid gap-6 mb-8">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center space-x-6 p-6 bg-gradient-to-r from-secondary/40 to-background/60 rounded-2xl organic-border group-hover:shadow-md transition-all"
                      >
                        <div className="relative">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-xl object-cover organic-shadow"
                          />
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                            {item.quantity}
                          </div>
                        </div>
                        <div className="flex-1 space-y-2">
                          <h4 className="text-lg font-semibold text-foreground">{item.name}</h4>
                          <p className="text-muted-foreground">Premium organic quality</p>
                          <div className="flex items-center space-x-2">
                            <Leaf className="w-4 h-4 text-primary" />
                            <span className="text-sm text-primary font-medium">Certified Organic</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground font-display">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center space-x-3 px-6 py-3 organic-border hover:bg-secondary/50 transition-all"
                    >
                      <Eye className="w-5 h-5" />
                      <span className="font-medium">View Details</span>
                    </Button>

                    {order.status === "delivered" && (
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-3 font-semibold"
                      >
                        <span>Reorder Items</span>
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {mockOrders.length === 0 && (
          <Card className="text-center py-20 organic-shadow-lg bg-gradient-to-br from-background to-secondary/30">
            <CardContent className="space-y-8">
              <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Package className="w-12 h-12 text-primary" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-bold text-foreground font-display">Your Organic Journey Awaits</h3>
                <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Discover our premium selection of fresh, sustainable organic products
                </p>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 py-4 text-lg font-semibold"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Explore Organic Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
