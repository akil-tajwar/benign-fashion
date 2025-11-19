


"use client"
import '.././globals.css'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Edit2, Save, X, Camera, Leaf, Award, Heart, Star } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  name: string
  email: string
  phone: string
  address: string
  city: string
  zipCode: string
  joinDate: string
  totalOrders: number
  favoriteCategory: string
  avatar: string
}

const mockProfile: UserProfile = {
  name: "Sarah Johnson",
  email: "sarah.johnson@email.com",
  phone: "+1 (555) 123-4567",
  address: "123 Green Valley Road",
  city: "Portland, OR",
  zipCode: "97201",
  joinDate: "2023-06-15",
  totalOrders: 24,
  favoriteCategory: "Fresh Produce",
  avatar: "/woman-profile.png",
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile>(mockProfile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background">
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-background to-primary/5">
        <div className="absolute inset-0 bg-[url('/organic-pattern.svg')] opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <User className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Account Settings</span>
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-4 font-display">Your Organic Profile</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage your sustainable lifestyle preferences and account details
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="lg:col-span-1 organic-shadow-lg bg-gradient-to-br from-card to-secondary/20 organic-border overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-primary"></div>

            <CardHeader className="text-center pb-6 bg-gradient-to-b from-background/50 to-transparent">
              <div className="relative mx-auto mb-6">
                <div className="relative flex w-32 h-32 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary/20 to-primary/10 organic-shadow-lg">
                  {profile.avatar ? (
                    <Image
                    height={48}
                    width={48}
                      src={profile.avatar || "/placeholder.svg"}
                      alt={profile.name}
                      className="aspect-square w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex w-full h-full items-center justify-center text-3xl font-bold text-primary font-display">
                      {profile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 p-0 bg-card organic-border hover:bg-secondary/50"
                >
                  <Camera className="w-5 h-5" />
                </Button>
              </div>
              <CardTitle className="text-2xl text-foreground font-display mb-2">{profile.name}</CardTitle>
              <p className="text-muted-foreground font-medium">{profile.email}</p>
              <Badge className="mt-3 bg-primary/10 text-primary border-primary/20 px-4 py-1">
                <Leaf className="w-4 h-4 mr-2" />
                Organic Member
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gradient-to-br from-secondary/40 to-background/60 rounded-xl organic-border">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground font-display">{profile.totalOrders}</p>
                  <p className="text-xs text-muted-foreground font-medium">Orders</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-secondary/40 to-background/60 rounded-xl organic-border">
                  <div className="w-10 h-10 mx-auto mb-2 bg-primary/10 rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground font-display">4.9</p>
                  <p className="text-xs text-muted-foreground font-medium">Rating</p>
                </div>
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Member since</span>
                  <span className="text-sm font-semibold text-foreground">
                    {new Date(profile.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium">Favorite Category</span>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-foreground">{profile.favoriteCategory}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2 organic-shadow-lg bg-gradient-to-br from-card to-secondary/20 organic-border overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-primary"></div>

            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-background/50 to-secondary/30">
              <CardTitle className="text-2xl text-foreground font-display">Personal Information</CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-6 organic-border hover:bg-secondary/50"
                >
                  <Edit2 className="w-5 h-5" />
                  <span className="font-medium">Edit Profile</span>
                </Button>
              ) : (
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-6 organic-border hover:bg-secondary/50 bg-transparent"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleSave}
                    className="flex items-center space-x-2 px-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Changes</span>
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className="p-8 space-y-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="name" className="flex items-center space-x-2 text-foreground font-medium">
                    <User className="w-5 h-5 text-primary" />
                    <span>Full Name</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full h-12 organic-border focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <div className="h-12 px-4 py-3 bg-secondary/30 rounded-lg organic-border">
                      <p className="text-foreground font-semibold">{profile.name}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="flex items-center space-x-2 text-foreground font-medium">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>Email Address</span>
                  </Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="w-full h-12 organic-border focus:ring-primary/20 focus:border-primary"
                    />
                  ) : (
                    <div className="h-12 px-4 py-3 bg-secondary/30 rounded-lg organic-border">
                      <p className="text-foreground font-semibold">{profile.email}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="flex items-center space-x-2 text-foreground font-medium">
                  <Phone className="w-5 h-5 text-primary" />
                  <span>Phone Number</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={editedProfile.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full h-12 organic-border focus:ring-primary/20 focus:border-primary"
                  />
                ) : (
                  <div className="h-12 px-4 py-3 bg-secondary/30 rounded-lg organic-border">
                    <p className="text-foreground font-semibold">{profile.phone}</p>
                  </div>
                )}
              </div>

              <Separator className="bg-border/50" />

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-foreground font-display flex items-center space-x-3">
                  <MapPin className="w-6 h-6 text-primary" />
                  <span>Delivery Address</span>
                </h3>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="address" className="text-foreground font-medium">
                      Street Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={editedProfile.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="w-full h-12 organic-border focus:ring-primary/20 focus:border-primary"
                      />
                    ) : (
                      <div className="h-12 px-4 py-3 bg-secondary/30 rounded-lg organic-border">
                        <p className="text-foreground font-semibold">{profile.address}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-foreground font-medium">
                        City, State
                      </Label>
                      {isEditing ? (
                        <Input
                          id="city"
                          value={editedProfile.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          className="w-full h-12 organic-border focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <div className="h-12 px-4 py-3 bg-secondary/30 rounded-lg organic-border">
                          <p className="text-foreground font-semibold">{profile.city}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="zipCode" className="text-foreground font-medium">
                        ZIP Code
                      </Label>
                      {isEditing ? (
                        <Input
                          id="zipCode"
                          value={editedProfile.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                          className="w-full h-12 organic-border focus:ring-primary/20 focus:border-primary"
                        />
                      ) : (
                        <div className="h-12 px-4 py-3 bg-secondary/30 rounded-lg organic-border">
                          <p className="text-foreground font-semibold">{profile.zipCode}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8 organic-shadow-lg bg-gradient-to-br from-card to-secondary/20 organic-border overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-primary via-primary/60 to-primary"></div>

          <CardHeader className="bg-gradient-to-r from-background/50 to-secondary/30">
            <CardTitle className="text-2xl text-foreground font-display">Account Settings</CardTitle>
            <p className="text-muted-foreground">Manage your preferences and account security</p>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col space-y-2 organic-border hover:bg-secondary/50 bg-transparent"
              >
                <User className="w-6 h-6 text-primary" />
                <span className="font-medium">Change Password</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col space-y-2 organic-border hover:bg-secondary/50 bg-transparent"
              >
                <Mail className="w-6 h-6 text-primary" />
                <span className="font-medium">Notifications</span>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-16 flex-col space-y-2 organic-border hover:bg-secondary/50 bg-transparent"
              >
                <Leaf className="w-6 h-6 text-primary" />
                <span className="font-medium">Preferences</span>
              </Button>
            </div>

            <Separator className="bg-border/50" />

            <div className="flex justify-between items-center p-6 bg-gradient-to-r from-destructive/5 to-destructive/10 rounded-xl organic-border">
              <div className="space-y-2">
                <h4 className="font-bold text-foreground">Delete Account</h4>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all organic journey data
                </p>
              </div>
              <Button variant="destructive" size="lg" className="px-6">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
