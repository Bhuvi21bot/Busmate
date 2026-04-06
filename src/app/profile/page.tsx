"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { User, Wallet, Settings, Edit, Save, X, Loader2, Bell, Mail, Smartphone, Plus, Download, ArrowUpRight, ArrowDownRight, TrendingUp, DollarSign, FileText, Bus, Star, MessageSquare, ThumbsUp, MapPin, Calendar, Ticket, XCircle } from "lucide-react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CustomerProfile {
  id: number
  userId: string
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  pincode: string | null
  emergencyContact: string | null
  emergencyContactName: string | null
  createdAt: string
  updatedAt: string
}

interface CustomerWallet {
  id: number
  userId: string
  balance: number
  totalSpent: number
  totalAdded: number
  status: string
  createdAt: string
  updatedAt: string
}

interface WalletTransaction {
  id: number
  userId: string
  type: string
  amount: number
  balanceAfter: number
  description: string
  referenceId: string | null
  createdAt: string
}

interface CustomerSettings {
  id: number
  userId: string
  notificationsEnabled: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  rideReminders: boolean
  promotionalEmails: boolean
  language: string
  theme: string
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: number
  userId: string
  pickup: string
  dropoff: string
  vehicleType: string
  datetime: string
  passengers: number
  seats: string[]
  fare: number
  paymentId: string | null
  orderId: string | null
  status: string
  paymentStatus: string
  confirmationCode: string
  createdAt: string
  updatedAt: string
}

interface Review {
  id: number
  userId: string
  driverId: number | null
  bookingId: number
  rating: number
  comment: string | null
  createdAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<CustomerProfile | null>(null)
  const [wallet, setWallet] = useState<CustomerWallet | null>(null)
  const [walletBalance, setWalletBalance] = useState<number>(0)
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [settings, setSettings] = useState<CustomerSettings | null>(null)
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loadingSettings, setLoadingSettings] = useState(false)
  
  // Review states
  const [reviews, setReviews] = useState<Review[]>([])
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    bookingId: "",
    driverId: "",
    rating: 5,
    comment: ""
  })
  const [submittingReview, setSubmittingReview] = useState(false)

  // Edit mode states
  const [editMode, setEditMode] = useState(false)
  const [profileForm, setProfileForm] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    emergencyContact: "",
    emergencyContactName: ""
  })
  const [savingProfile, setSavingProfile] = useState(false)

  // Add money dialog state
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false)
  const [addMoneyAmount, setAddMoneyAmount] = useState("")
  const [addingMoney, setAddingMoney] = useState(false)
  const [razorpayScriptLoaded, setRazorpayScriptLoaded] = useState(false)

  // Cancel booking state
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null)

  // Set active tab from URL parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && ['profile', 'wallet', 'bookings', 'settings', 'reviews'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Load Razorpay checkout script
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      setRazorpayScriptLoaded(true)
    }
    script.onerror = () => {
      toast.error("Failed to load payment gateway")
    }
    document.body.appendChild(script)

    return () => {
      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')
      if (existingScript) {
        document.body.removeChild(existingScript)
      }
    }
  }, [])

  // Fetch data on component mount (no auth required)
  useEffect(() => {
    fetchProfile()
    fetchWalletBalance()
    fetchTransactions()
    fetchBookings()
    fetchSettings()
    fetchReviews()
  }, [])

  // Fetch profile data
  const fetchProfile = async () => {
    setLoadingProfile(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/profile', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      const data = await response.json()

      if (response.ok) {
        setProfile(data)
        setProfileForm({
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          pincode: data.pincode || "",
          emergencyContact: data.emergencyContact || "",
          emergencyContactName: data.emergencyContactName || ""
        })
      }
    } catch (error) {
      console.error("Failed to fetch profile")
    } finally {
      setLoadingProfile(false)
    }
  }

  const fetchWalletBalance = async () => {
    setLoadingWallet(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/wallet-balance', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setWalletBalance(data.balance || 0)
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance")
    } finally {
      setLoadingWallet(false)
    }
  }

  const fetchTransactions = async () => {
    setLoadingTransactions(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/wallet-transactions?limit=50', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      const data = await response.json()
      if (response.ok && Array.isArray(data)) {
        setTransactions(data)
      }
    } catch (error) {
      console.error("Failed to fetch transactions")
    } finally {
      setLoadingTransactions(false)
    }
  }

  const fetchBookings = async () => {
    setLoadingBookings(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/bookings?limit=50', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      const data = await response.json()
      if (response.ok && data.bookings) {
        const parsedBookings = data.bookings.map((booking: any) => ({
          ...booking,
          seats: typeof booking.seats === 'string' ? JSON.parse(booking.seats) : booking.seats
        }))
        setBookings(parsedBookings)
      }
    } catch (error) {
      console.error("Failed to fetch bookings")
    } finally {
      setLoadingBookings(false)
    }
  }

  const fetchSettings = async () => {
    setLoadingSettings(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/settings', {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      const data = await response.json()
      if (response.ok) {
        setSettings(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings")
    } finally {
      setLoadingSettings(false)
    }
  }

  const fetchReviews = async () => {
    setLoadingReviews(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch(`/api/reviews`, {
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })
      const data = await response.json()
      if (response.ok && Array.isArray(data)) {
        setReviews(data)
      }
    } catch (error) {
      console.error("Failed to fetch reviews")
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
      return
    }

    setCancellingBookingId(bookingId)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        }
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Booking cancelled successfully")
        fetchBookings()
      } else {
        toast.error(data.error || "Failed to cancel booking")
      }
    } catch (error) {
      toast.error("An error occurred while cancelling booking")
    } finally {
      setCancellingBookingId(null)
    }
  }

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(profileForm)
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Profile updated successfully!")
        setProfile(data)
        setEditMode(false)
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleAddMoney = async () => {
    const amount = parseFloat(addMoneyAmount)
    if (isNaN(amount) || amount < 100) {
      toast.error("Please enter a valid amount (minimum ₹100)")
      return
    }

    if (!razorpayScriptLoaded) {
      toast.error("Payment gateway is loading. Please try again.")
      return
    }

    setAddingMoney(true)
    try {
      const token = localStorage.getItem("bearer_token")
      
      const orderResponse = await fetch('/api/razorpay/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          notes: {
            description: 'Wallet recharge'
          }
        })
      })

      const orderData = await orderResponse.json()
      
      if (!orderResponse.ok || !orderData.success) {
        toast.error(orderData.error || "Failed to create payment order")
        setAddingMoney(false)
        return
      }

      const options = {
        key: orderData.keyId,
        order_id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Bus Mate",
        description: "Add money to wallet",
        image: "/logo.png",
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
        },
        theme: {
          color: "#4ade80"
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            })

            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              const balanceResponse = await fetch('/api/wallet-balance', {
                headers: {
                  'Authorization': `Bearer ${token || ''}`
                }
              })
              const balanceData = await balanceResponse.json()
              const currentBalance = balanceData.balance || 0

              const walletResponse = await fetch('/api/wallet-transactions', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token || ''}`
                },
                body: JSON.stringify({
                  type: 'credit',
                  amount,
                  balanceAfter: currentBalance + amount,
                  description: `Added via Razorpay - Payment ID: ${response.razorpay_payment_id}`,
                  referenceId: response.razorpay_payment_id
                })
              })

              if (walletResponse.ok) {
                toast.success(`₹${amount} added successfully!`)
                setShowAddMoneyDialog(false)
                setAddMoneyAmount("")
                fetchWalletBalance()
                fetchTransactions()
              } else {
                const walletData = await walletResponse.json()
                toast.error(walletData.error || "Failed to update wallet")
              }
            } else {
              toast.error("Payment verification failed")
            }
          } catch (error) {
            toast.error("An error occurred while processing payment")
          } finally {
            setAddingMoney(false)
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled")
            setAddingMoney(false)
          }
        }
      }

      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      toast.error("An error occurred while initiating payment")
      setAddingMoney(false)
    }
  }

  const handleUpdateSettings = async (updatedSettings: Partial<CustomerSettings>) => {
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/customers/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify(updatedSettings)
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Settings updated successfully!")
        setSettings(data)
      } else {
        toast.error(data.error || "Failed to update settings")
      }
    } catch (error) {
      toast.error("An error occurred while updating settings")
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewForm.bookingId) {
      toast.error("Please select a booking")
      return
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error("Rating must be between 1 and 5")
      return
    }

    setSubmittingReview(true)
    try {
      const token = localStorage.getItem("bearer_token")
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          bookingId: parseInt(reviewForm.bookingId),
          driverId: reviewForm.driverId ? parseInt(reviewForm.driverId) : null,
          rating: reviewForm.rating,
          comment: reviewForm.comment || null,
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Review submitted successfully!")
        setReviewForm({ bookingId: "", driverId: "", rating: 5, comment: "" })
        fetchReviews()
      } else {
        toast.error(data.error || "Failed to submit review")
      }
    } catch (error) {
      toast.error("An error occurred while submitting review")
    } finally {
      setSubmittingReview(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      confirmed: "bg-green-500/20 text-green-500",
      cancelled: "bg-red-500/20 text-red-500",
      completed: "bg-blue-500/20 text-blue-500",
      pending: "bg-yellow-500/20 text-yellow-500",
      paid: "bg-green-500/20 text-green-500",
      refunded: "bg-orange-500/20 text-orange-500",
      active: "bg-green-500/20 text-green-500"
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[status as keyof typeof colors] || "bg-muted"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'credit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />
      case 'debit':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'
            } ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
            onClick={() => interactive && onChange?.(star)}
          />
        ))}
      </div>
    )
  }

  const getVehicleTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'government-bus': 'Government Bus',
      'private-bus': 'Private Bus',
      'chartered-bus': 'Chartered Bus',
    }
    return labels[type] || type
  }

  return (
    <ClickSpark
      sparkColor="#4ade80"
      sparkSize={12}
      sparkRadius={25}
      sparkCount={12}
      duration={600}
    >
      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">My Account</h1>

              <div className="space-y-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <Avatar className="h-24 w-24 border-4 border-primary/20">
                        <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=Guest" />
                        <AvatarFallback className="text-2xl">G</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold mb-2">Guest User</h2>
                        <p className="text-muted-foreground mb-1">guest@example.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="profile">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </TabsTrigger>
                    <TabsTrigger value="bookings">
                      <Ticket className="h-4 w-4 mr-2" />
                      Bookings
                    </TabsTrigger>
                    <TabsTrigger value="wallet">
                      <Wallet className="h-4 w-4 mr-2" />
                      Wallet
                    </TabsTrigger>
                    <TabsTrigger value="reviews">
                      <Star className="h-4 w-4 mr-2" />
                      Reviews
                    </TabsTrigger>
                    <TabsTrigger value="settings">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <CardTitle>Personal Information</CardTitle>
                          {!editMode ? (
                            <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" onClick={() => {
                                setEditMode(false)
                                if (profile) {
                                  setProfileForm({
                                    phone: profile.phone || "",
                                    address: profile.address || "",
                                    city: profile.city || "",
                                    state: profile.state || "",
                                    pincode: profile.pincode || "",
                                    emergencyContact: profile.emergencyContact || "",
                                    emergencyContactName: profile.emergencyContactName || ""
                                  })
                                }
                              }}>
                                <X className="h-4 w-4 mr-2" />
                                Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveProfile} disabled={savingProfile}>
                                {savingProfile ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4 mr-2" />
                                )}
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        {loadingProfile ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : (
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label>Full Name</Label>
                              <Input value="Guest User" disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input value="guest@example.com" disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <Input
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter your phone number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>PIN Code</Label>
                              <Input
                                value={profileForm.pincode}
                                onChange={(e) => setProfileForm({ ...profileForm, pincode: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter PIN code"
                              />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label>Address</Label>
                              <Textarea
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                                disabled={!editMode}
                                rows={3}
                                placeholder="Enter your complete address"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>City</Label>
                              <Input
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter city"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>State</Label>
                              <Input
                                value={profileForm.state}
                                onChange={(e) => setProfileForm({ ...profileForm, state: e.target.value })}
                                disabled={!editMode}
                                placeholder="Enter state"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Emergency Contact</Label>
                              <Input
                                value={profileForm.emergencyContact}
                                onChange={(e) => setProfileForm({ ...profileForm, emergencyContact: e.target.value })}
                                disabled={!editMode}
                                placeholder="Emergency contact number"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Emergency Contact Name</Label>
                              <Input
                                value={profileForm.emergencyContactName}
                                onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                                disabled={!editMode}
                                placeholder="Emergency contact person name"
                              />
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Bookings Tab */}
                  <TabsContent value="bookings" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>My Bookings</CardTitle>
                        <CardDescription>View and manage your bus bookings</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingBookings ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : bookings.length === 0 ? (
                          <div className="text-center py-12">
                            <Ticket className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No bookings yet</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Book your first ride to see it here
                            </p>
                            <Button className="mt-4" onClick={() => router.push('/booking')}>
                              Book Now
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {bookings.map((booking) => (
                              <Card key={booking.id} className="border-2">
                                <CardContent className="p-6">
                                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex-1 space-y-3">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-bold text-lg mb-1">
                                            {booking.pickup} → {booking.dropoff}
                                          </h3>
                                          <p className="text-sm text-muted-foreground">
                                            Confirmation Code: <span className="font-mono font-semibold text-primary">{booking.confirmationCode}</span>
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2">
                                          <Calendar className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{formatDateTime(booking.datetime)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Bus className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{getVehicleTypeLabel(booking.vehicleType)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <User className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">{booking.passengers} Passenger{booking.passengers > 1 ? 's' : ''}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Ticket className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm">Seats: {Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats}</span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center gap-3 pt-2">
                                        {getStatusBadge(booking.status)}
                                        {getStatusBadge(booking.paymentStatus)}
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-3">
                                      <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total Fare</p>
                                        <p className="text-2xl font-bold text-primary">{formatCurrency(booking.fare)}</p>
                                      </div>
                                      
                                      {booking.status === 'confirmed' && (
                                        <Button
                                          variant="destructive"
                                          size="sm"
                                          onClick={() => handleCancelBooking(booking.id)}
                                          disabled={cancellingBookingId === booking.id}
                                        >
                                          {cancellingBookingId === booking.id ? (
                                            <>
                                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                              Cancelling...
                                            </>
                                          ) : (
                                            <>
                                              <XCircle className="h-4 w-4 mr-2" />
                                              Cancel Booking
                                            </>
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {booking.paymentId && (
                                    <div className="mt-4 pt-4 border-t">
                                      <p className="text-xs text-muted-foreground">
                                        Payment ID: {booking.paymentId} | Order ID: {booking.orderId}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Wallet Tab */}
                  <TabsContent value="wallet" className="space-y-6">
                    {/* Wallet Balance Cards */}
                    <div className="grid md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold">{formatCurrency(walletBalance)}</div>
                          <p className="text-xs text-muted-foreground mt-2">Available for rides</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-blue-500">
                            {transactions.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">All time</p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-500">
                            {bookings.length}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">Lifetime rides</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <Button onClick={() => setShowAddMoneyDialog(true)} className="flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Money
                      </Button>
                    </div>

                    {/* Transaction History */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Transaction History</CardTitle>
                        <CardDescription>Your recent wallet transactions</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingTransactions ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : transactions.length === 0 ? (
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No transactions yet</p>
                            <p className="text-sm text-muted-foreground mt-2">Add money to get started</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {transactions.map((transaction) => (
                              <div
                                key={transaction.id}
                                className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <div className="mt-1">{getTransactionIcon(transaction.type)}</div>
                                  <div>
                                    <p className="font-medium">{transaction.description}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {formatDateTime(transaction.createdAt)}
                                    </p>
                                    {transaction.referenceId && (
                                      <p className="text-xs text-primary mt-1">
                                        Ref: {transaction.referenceId}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`font-bold ${
                                    transaction.type === 'credit'
                                      ? 'text-green-500'
                                      : 'text-red-500'
                                  }`}>
                                    {transaction.type === 'credit' ? '+' : '-'}
                                    {formatCurrency(transaction.amount)}
                                  </p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Balance: {formatCurrency(transaction.balanceAfter)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="space-y-6">
                    {/* Submit New Review */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Rate Your Experience</CardTitle>
                        <CardDescription>Share your feedback about your recent rides</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-2">
                          <Label>Select Booking</Label>
                          <Select
                            value={reviewForm.bookingId}
                            onValueChange={(value) => setReviewForm({ ...reviewForm, bookingId: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose a completed booking..." />
                            </SelectTrigger>
                            <SelectContent>
                              {bookings
                                .filter(b => b.status === 'completed')
                                .map((booking) => (
                                  <SelectItem key={booking.id} value={booking.id.toString()}>
                                    {booking.pickup} → {booking.dropoff} ({formatDate(booking.datetime)})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Your Rating</Label>
                          <div className="flex items-center gap-3">
                            {renderStars(reviewForm.rating, true, (rating) => 
                              setReviewForm({ ...reviewForm, rating })
                            )}
                            <span className="text-sm text-muted-foreground">
                              ({reviewForm.rating} out of 5 stars)
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Your Review (Optional)</Label>
                          <Textarea
                            value={reviewForm.comment}
                            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                            placeholder="Share your experience..."
                            rows={4}
                          />
                        </div>

                        <Button 
                          onClick={handleSubmitReview} 
                          disabled={submittingReview || !reviewForm.bookingId}
                          className="w-full"
                        >
                          {submittingReview ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="h-4 w-4 mr-2" />
                              Submit Review
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>

                    {/* My Reviews History */}
                    <Card>
                      <CardHeader>
                        <CardTitle>My Reviews</CardTitle>
                        <CardDescription>Your previously submitted reviews</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingReviews ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : reviews.length === 0 ? (
                          <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No reviews submitted yet</p>
                            <p className="text-sm text-muted-foreground mt-2">
                              Complete a ride to leave a review
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {reviews.map((review) => {
                              const booking = bookings.find(b => b.id === review.bookingId)
                              return (
                                <div
                                  key={review.id}
                                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h4 className="font-semibold">
                                        {booking ? `${booking.pickup} → ${booking.dropoff}` : 'Booking'}
                                      </h4>
                                      <p className="text-sm text-muted-foreground">
                                        Booking #{review.bookingId}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      {renderStars(review.rating)}
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {formatDateTime(review.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  {review.comment && (
                                    <div className="bg-muted/30 rounded-lg p-3 mt-3">
                                      <p className="text-sm italic">"{review.comment}"</p>
                                    </div>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Settings Tab */}
                  <TabsContent value="settings" className="space-y-6">
                    {loadingSettings ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        {/* Notifications Settings */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage your notification preferences</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Push Notifications</p>
                                  <p className="text-sm text-muted-foreground">Receive push notifications</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.notificationsEnabled}
                                onCheckedChange={(checked) => handleUpdateSettings({ notificationsEnabled: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Email Notifications</p>
                                  <p className="text-sm text-muted-foreground">Receive email updates</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.emailNotifications}
                                onCheckedChange={(checked) => handleUpdateSettings({ emailNotifications: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Smartphone className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">SMS Notifications</p>
                                  <p className="text-sm text-muted-foreground">Receive SMS alerts</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.smsNotifications}
                                onCheckedChange={(checked) => handleUpdateSettings({ smsNotifications: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Ride Reminders</p>
                                  <p className="text-sm text-muted-foreground">Get reminders for upcoming rides</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.rideReminders}
                                onCheckedChange={(checked) => handleUpdateSettings({ rideReminders: checked })}
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Mail className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">Promotional Emails</p>
                                  <p className="text-sm text-muted-foreground">Receive offers and promotions</p>
                                </div>
                              </div>
                              <Switch
                                checked={settings?.promotionalEmails}
                                onCheckedChange={(checked) => handleUpdateSettings({ promotionalEmails: checked })}
                              />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Appearance Settings */}
                        <Card>
                          <CardHeader>
                            <CardTitle>Appearance</CardTitle>
                            <CardDescription>Customize your app appearance</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-6">
                            <div className="space-y-2">
                              <Label>Theme</Label>
                              <Select
                                value={settings?.theme}
                                onValueChange={(value) => handleUpdateSettings({ theme: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Language</Label>
                              <Select
                                value={settings?.language}
                                onValueChange={(value) => handleUpdateSettings({ language: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="hi">Hindi</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Add Money Dialog */}
        <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>
                Enter the amount you want to add. Payment will be processed securely via Razorpay.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount (min ₹100)"
                  value={addMoneyAmount}
                  onChange={(e) => setAddMoneyAmount(e.target.value)}
                  min="100"
                  disabled={addingMoney}
                />
                <p className="text-xs text-muted-foreground">
                  Minimum amount: ₹100
                </p>
              </div>
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="text-sm font-medium">Payment Methods Available:</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>✓ UPI (Google Pay, PhonePe, Paytm)</p>
                  <p>✓ Credit/Debit Cards</p>
                  <p>✓ Net Banking</p>
                  <p>✓ Wallets</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddMoneyDialog(false)
                  setAddMoneyAmount("")
                }}
                disabled={addingMoney}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddMoney} 
                disabled={addingMoney || !razorpayScriptLoaded}
              >
                {addingMoney ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : !razorpayScriptLoaded ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Gateway...
                  </>
                ) : (
                  "Proceed to Pay"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />
      </div>
    </ClickSpark>
  )
}