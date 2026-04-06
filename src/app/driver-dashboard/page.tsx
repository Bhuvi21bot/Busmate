"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UserPlus, Wallet, User, Route, Upload, Loader2, Bus, DollarSign, Clock, CreditCard, CheckCircle, FileText, Settings, ArrowUpRight, ArrowDownRight, TrendingUp, Bell, Mail, Smartphone, Shield, Globe, Moon, Sun, Plus, X, Download, Star, MessageSquare, LogIn, UserCheck } from "lucide-react"
import { VscHome, VscCalendar } from "react-icons/vsc"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Dock from "@/components/Dock"
import ClickSpark from "@/components/ClickSpark"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import Link from "next/link"

interface DriverProfile {
  id: number
  name: string
  contact: string
  address: string
  city: string
  district: string
  license: string
  vehicle: string
  bloodGroup: string
  email: string | null
  status: string
  applicationNumber: string
  appliedDate: string
  approvedDate: string | null
  createdAt: string
  updatedAt: string
}

interface DriverWallet {
  id: number
  driverId: number
  totalEarnings: number
  pendingPayouts: number
  lastPayoutAmount: number | null
  lastPayoutDate: string | null
  status: string
  createdAt: string
  updatedAt: string
}

interface DriverRide {
  id: number
  driverId: number
  rideNumber: string
  date: string
  route: string
  fare: number
  passengerCount: number
  status: string
  createdAt: string
}

interface WalletTransaction {
  id: number
  driverId: number
  walletId: number
  type: 'credit' | 'debit' | 'withdrawal' | 'refund' | 'ride_earning'
  amount: number
  balanceAfter: number
  description: string
  referenceNumber: string
  rideId: number | null
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
  ride: {
    rideNumber: string
    date: string
    route: string
    fare: number
    passengerCount: number
    status: string
  } | null
}

interface DriverReview {
  id: number
  driverId: number
  customerId: number
  customerName: string
  rating: number
  comment: string
  rideId: number | null
  createdAt: string
  ride: {
    rideNumber: string
    route: string
    date: string
  } | null
}

export default function DriverDashboard() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get tab from URL query params
  const tabFromUrl = searchParams.get('tab')

  // Dock items - removed Settings
  const dockItems = [
    { icon: <VscHome size={20} />, label: 'Home', onClick: () => router.push('/') },
    { icon: <VscCalendar size={20} />, label: 'Booking', onClick: () => router.push('/booking') },
    { icon: <Wallet size={20} />, label: 'My Wallet', onClick: () => router.push('/driver-dashboard?tab=wallet') },
    { icon: <User size={20} />, label: 'Account', onClick: () => router.push('/profile') },
  ]

  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(tabFromUrl || "apply")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [licenseFile, setLicenseFile] = useState<File | null>(null)
  const [rcFile, setRcFile] = useState<File | null>(null)

  // State for profile, wallet, and rides
  const [profile, setProfile] = useState<DriverProfile | null>(null)
  const [wallet, setWallet] = useState<DriverWallet | null>(null)
  const [rides, setRides] = useState<DriverRide[]>([])
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])
  const [reviews, setReviews] = useState<DriverReview[]>([])
  const [loadingProfile, setLoadingProfile] = useState(false)
  const [loadingWallet, setLoadingWallet] = useState(false)
  const [loadingRides, setLoadingRides] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState(false)
  const [loadingReviews, setLoadingReviews] = useState(false)
  const [averageRating, setAverageRating] = useState(0)

  // Add money dialog state
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false)
  const [addMoneyAmount, setAddMoneyAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [addingMoney, setAddingMoney] = useState(false)

  // Withdraw money dialog state
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [bankDetails, setBankDetails] = useState({
    accountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: ""
  })
  const [withdrawing, setWithdrawing] = useState(false)

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    city: "",
    district: ""
  })

  // Update tab when URL changes
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl)
    }
  }, [tabFromUrl])

  // Fetch profile data
  const fetchProfile = async (license: string) => {
    if (!license) return

    setLoadingProfile(true)
    try {
      const response = await fetch(`/api/drivers/profile?license=${encodeURIComponent(license)}`)
      const data = await response.json()

      if (response.ok) {
        setProfile(data)
        setProfileForm({
          name: data.name,
          contact: data.contact,
          email: data.email || "",
          address: data.address,
          city: data.city,
          district: data.district
        })
        // If profile found, fetch wallet, rides, transactions, and reviews
        if (data.id) {
          fetchWallet(data.id)
          fetchRides(data.id)
          fetchTransactions(data.id)
          fetchReviews(data.id)
        }
      } else {
        toast.error(data.error || "Profile not found")
        setProfile(null)
      }
    } catch (error) {
      toast.error("Failed to fetch profile")
      setProfile(null)
    } finally {
      setLoadingProfile(false)
    }
  }

  // Fetch wallet data
  const fetchWallet = async (driverId: number) => {
    setLoadingWallet(true)
    try {
      const response = await fetch(`/api/drivers/wallet?driverId=${driverId}`)
      const data = await response.json()

      if (response.ok) {
        setWallet(data)
      } else {
        toast.error(data.error || "Wallet not found")
        setWallet(null)
      }
    } catch (error) {
      toast.error("Failed to fetch wallet data")
      setWallet(null)
    } finally {
      setLoadingWallet(false)
    }
  }

  // Fetch rides data
  const fetchRides = async (driverId: number) => {
    setLoadingRides(true)
    try {
      const response = await fetch(`/api/drivers/rides?driverId=${driverId}&limit=20`)
      const data = await response.json()

      if (response.ok) {
        setRides(data)
      } else {
        toast.error(data.error || "Failed to fetch rides")
        setRides([])
      }
    } catch (error) {
      toast.error("Failed to fetch ride history")
      setRides([])
    } finally {
      setLoadingRides(false)
    }
  }

  // Fetch transactions data
  const fetchTransactions = async (driverId: number) => {
    setLoadingTransactions(true)
    try {
      const response = await fetch(`/api/drivers/wallet/transactions?driverId=${driverId}&limit=50`)
      const data = await response.json()

      if (response.ok) {
        setTransactions(data)
      } else {
        toast.error(data.error || "Failed to fetch transactions")
        setTransactions([])
      }
    } catch (error) {
      toast.error("Failed to fetch transaction history")
      setTransactions([])
    } finally {
      setLoadingTransactions(false)
    }
  }

  // Fetch reviews data
  const fetchReviews = async (driverId: number) => {
    setLoadingReviews(true)
    try {
      const response = await fetch(`/api/drivers/reviews?driverId=${driverId}`)
      const data = await response.json()

      if (response.ok) {
        setReviews(data.reviews || [])
        setAverageRating(data.averageRating || 0)
      } else {
        toast.error(data.error || "Failed to fetch reviews")
        setReviews([])
      }
    } catch (error) {
      toast.error("Failed to fetch reviews")
      setReviews([])
    } finally {
      setLoadingReviews(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)

    try {
      const response = await fetch("/api/drivers/register", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccess(true)
        toast.success("Application submitted successfully!")
        toast.info(`Your application number is: ${data.application.applicationNumber}`)
        e.currentTarget.reset()
        setLicenseFile(null)
        setRcFile(null)

        setTimeout(() => {
          document.getElementById('successMessage')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      } else {
        toast.error(data.error || "Failed to submit application")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLicenseSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (licenseNumber.trim()) {
      fetchProfile(licenseNumber.trim())
    } else {
      toast.error("Please enter a license number")
    }
  }

  // Add money handler
  const handleAddMoney = async () => {
    if (!profile?.id) return
    
    const amount = parseFloat(addMoneyAmount)
    if (isNaN(amount) || amount < 100) {
      toast.error("Please enter a valid amount (minimum ₹100)")
      return
    }

    setAddingMoney(true)
    try {
      const response = await fetch('/api/drivers/wallet/add-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          amount,
          description: `Added money via ${paymentMethod.toUpperCase()}`,
          paymentMethod
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(`₹${amount} added successfully!`)
        setShowAddMoneyDialog(false)
        setAddMoneyAmount("")
        // Refresh wallet and transactions
        fetchWallet(profile.id)
        fetchTransactions(profile.id)
      } else {
        toast.error(data.error || "Failed to add money")
      }
    } catch (error) {
      toast.error("An error occurred while adding money")
    } finally {
      setAddingMoney(false)
    }
  }

  // Withdraw money handler
  const handleWithdraw = async () => {
    if (!profile?.id) return
    
    const amount = parseFloat(withdrawAmount)
    if (isNaN(amount) || amount < 500) {
      toast.error("Please enter a valid amount (minimum ₹500)")
      return
    }

    if (!bankDetails.accountNumber || !bankDetails.ifscCode || !bankDetails.accountHolderName) {
      toast.error("Please fill in all bank details")
      return
    }

    setWithdrawing(true)
    try {
      const response = await fetch('/api/drivers/wallet/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          amount,
          bankDetails
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Withdrawal request submitted successfully!")
        toast.info("Your withdrawal will be processed within 2-3 business days")
        setShowWithdrawDialog(false)
        setWithdrawAmount("")
        setBankDetails({ accountNumber: "", ifscCode: "", accountHolderName: "", bankName: "" })
        // Refresh wallet and transactions
        fetchWallet(profile.id)
        fetchTransactions(profile.id)
      } else {
        toast.error(data.error || "Failed to process withdrawal")
      }
    } catch (error) {
      toast.error("An error occurred while processing withdrawal")
    } finally {
      setWithdrawing(false)
    }
  }

  // Update profile handler
  const handleUpdateProfile = async () => {
    if (!profile?.id) return

    setEditingProfile(true)
    try {
      const response = await fetch('/api/drivers/profile/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          driverId: profile.id,
          ...profileForm
        })
      })

      const data = await response.json()
      if (response.ok) {
        toast.success("Profile updated successfully!")
        setProfile(data)
      } else {
        toast.error(data.error || "Failed to update profile")
      }
    } catch (error) {
      toast.error("An error occurred while updating profile")
    } finally {
      setEditingProfile(false)
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
      pending: "bg-yellow-500/20 text-yellow-500",
      approved: "bg-green-500/20 text-green-500",
      rejected: "bg-red-500/20 text-red-500",
      active: "bg-green-500/20 text-green-500",
      completed: "bg-green-500/20 text-green-500",
      cancelled: "bg-red-500/20 text-red-500",
      failed: "bg-red-500/20 text-red-500"
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
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-orange-500" />
      case 'refund':
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />
      case 'ride_earning':
        return <TrendingUp className="h-4 w-4 text-primary" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-500 text-yellow-500"
                : "text-muted-foreground"
            }`}
          />
        ))}
      </div>
    )
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
              <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">Driver Dashboard</h1>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
                  <TabsTrigger value="apply" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Apply
                  </TabsTrigger>
                  <TabsTrigger value="profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="wallet" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Wallet
                  </TabsTrigger>
                  <TabsTrigger value="rides" className="flex items-center gap-2">
                    <Route className="h-4 w-4" />
                    Rides
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex items-center gap-2">
                    <Star className="h-4 w-4" />
                    Reviews
                  </TabsTrigger>
                </TabsList>

                {/* Apply Tab - Keep existing form */}
                <TabsContent value="apply">
                  <Card>
                    <CardHeader>
                      <CardTitle>Apply as Driver</CardTitle>
                      <CardDescription>Fill in your details to register as a driver</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input id="name" name="name" required placeholder="Enter your full name" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number *</Label>
                            <Input id="contact" name="contact" required placeholder="10-digit mobile number" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="your.email@example.com" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="license">License Number *</Label>
                            <Input id="license" name="license" required placeholder="e.g., DL1234567890" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="vehicle">Vehicle Type *</Label>
                            <Select name="vehicle" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Government Bus">Government Bus</SelectItem>
                                <SelectItem value="Private Bus">Private Bus</SelectItem>
                                <SelectItem value="Chartered Bus">Chartered Bus</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="bloodGroup">Blood Group *</Label>
                            <Select name="bloodGroup" required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select blood group" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address *</Label>
                            <Textarea id="address" name="address" required placeholder="Enter your complete address" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input id="city" name="city" required placeholder="Enter your city" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="district">District *</Label>
                            <Input id="district" name="district" required placeholder="Enter your district" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>Upload License Copy *</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                              <Input
                                type="file"
                                name="licenseFile"
                                accept="image/*,.pdf"
                                required
                                onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="licenseFile"
                              />
                              <label htmlFor="licenseFile" className="cursor-pointer">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {licenseFile ? licenseFile.name : "Click to upload license copy"}
                                </p>
                              </label>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Upload Vehicle RC Copy *</Label>
                            <div className="border-2 border-dashed rounded-lg p-6 text-center">
                              <Input
                                type="file"
                                name="rcFile"
                                accept="image/*,.pdf"
                                required
                                onChange={(e) => setRcFile(e.target.files?.[0] || null)}
                                className="hidden"
                                id="rcFile"
                              />
                              <label htmlFor="rcFile" className="cursor-pointer">
                                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  {rcFile ? rcFile.name : "Click to upload RC copy"}
                                </p>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox id="terms" required />
                          <label htmlFor="terms" className="text-sm">
                            I agree to the terms and conditions
                          </label>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </form>

                      {showSuccess && (
                        <motion.div
                          id="successMessage"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="mt-6 p-4 bg-green-500/20 border border-green-500 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <p className="font-semibold text-green-500">Application Submitted Successfully!</p>
                          </div>
                          <p className="text-sm mt-2 text-muted-foreground">
                            Your application is under review. You'll be notified once it's processed.
                          </p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Profile Tab */}
                <TabsContent value="profile">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Search Profile</CardTitle>
                        <CardDescription>Enter your license number to view your profile</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleLicenseSearch} className="flex gap-4">
                          <Input
                            placeholder="Enter license number"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            className="flex-1"
                          />
                          <Button type="submit" disabled={loadingProfile}>
                            {loadingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>

                    {profile && (
                      <Card>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>Profile Information</CardTitle>
                              <CardDescription>Your driver profile details</CardDescription>
                            </div>
                            {getStatusBadge(profile.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="edit-name">Full Name</Label>
                              <Input
                                id="edit-name"
                                value={profileForm.name}
                                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-contact">Contact Number</Label>
                              <Input
                                id="edit-contact"
                                value={profileForm.contact}
                                onChange={(e) => setProfileForm({ ...profileForm, contact: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-email">Email</Label>
                              <Input
                                id="edit-email"
                                type="email"
                                value={profileForm.email}
                                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>License Number</Label>
                              <Input value={profile.license} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Vehicle Type</Label>
                              <Input value={profile.vehicle} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Blood Group</Label>
                              <Input value={profile.bloodGroup} disabled />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="edit-address">Address</Label>
                              <Textarea
                                id="edit-address"
                                value={profileForm.address}
                                onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-city">City</Label>
                              <Input
                                id="edit-city"
                                value={profileForm.city}
                                onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit-district">District</Label>
                              <Input
                                id="edit-district"
                                value={profileForm.district}
                                onChange={(e) => setProfileForm({ ...profileForm, district: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Application Number</Label>
                              <Input value={profile.applicationNumber} disabled />
                            </div>
                            <div className="space-y-2">
                              <Label>Applied Date</Label>
                              <Input value={formatDate(profile.appliedDate)} disabled />
                            </div>
                          </div>
                          
                          <Button onClick={handleUpdateProfile} disabled={editingProfile} className="w-full">
                            {editingProfile ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              "Update Profile"
                            )}
                          </Button>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </TabsContent>

                {/* Wallet Tab */}
                <TabsContent value="wallet">
                  {!profile ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Please search your profile first to view wallet</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {/* Wallet Balance Cards */}
                      <div className="grid md:grid-cols-3 gap-6">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold">{formatCurrency(wallet?.totalEarnings || 0)}</div>
                            {wallet?.lastPayoutDate && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Last payout: {formatDate(wallet.lastPayoutDate)}
                              </p>
                            )}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payouts</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-orange-500">
                              {formatCurrency(wallet?.pendingPayouts || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Processing withdrawals</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Last Payout</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold text-green-500">
                              {formatCurrency(wallet?.lastPayoutAmount || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">Previous withdrawal</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4">
                        <Button onClick={() => setShowAddMoneyDialog(true)} className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Money
                        </Button>
                        <Button onClick={() => setShowWithdrawDialog(true)} variant="outline" className="flex-1">
                          <Download className="h-4 w-4 mr-2" />
                          Withdraw
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
                                      {transaction.ride && (
                                        <p className="text-xs text-primary mt-1">
                                          Ride: {transaction.ride.rideNumber} - {transaction.ride.route}
                                        </p>
                                      )}
                                      <p className="text-xs text-muted-foreground mt-1">
                                        Ref: {transaction.referenceNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`font-bold ${
                                      transaction.type === 'credit' || transaction.type === 'refund' || transaction.type === 'ride_earning'
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    }`}>
                                      {transaction.type === 'credit' || transaction.type === 'refund' || transaction.type === 'ride_earning' ? '+' : '-'}
                                      {formatCurrency(transaction.amount)}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Balance: {formatCurrency(transaction.balanceAfter)}
                                    </p>
                                    {getStatusBadge(transaction.status)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>

                {/* Rides Tab */}
                <TabsContent value="rides">
                  {!profile ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Route className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Please search your profile first to view rides</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Ride History</CardTitle>
                        <CardDescription>Your completed and ongoing rides</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {loadingRides ? (
                          <div className="text-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                          </div>
                        ) : rides.length === 0 ? (
                          <div className="text-center py-8">
                            <Bus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                            <p className="text-muted-foreground">No rides yet</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {rides.map((ride) => (
                              <div
                                key={ride.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                              >
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <p className="font-bold">{ride.rideNumber}</p>
                                    {getStatusBadge(ride.status)}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-1">{ride.route}</p>
                                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <span>📅 {formatDate(ride.date)}</span>
                                    <span>👥 {ride.passengerCount} passengers</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-2xl font-bold text-primary">{formatCurrency(ride.fare)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Reviews Tab */}
                <TabsContent value="reviews">
                  {!profile ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Star className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">Please search your profile first to view reviews</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {/* Rating Summary Card */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Rating Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="text-center">
                              <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
                              <div className="flex justify-center mb-2">
                                {renderStars(Math.round(averageRating))}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                              </p>
                            </div>
                            <div className="flex-1 w-full space-y-2">
                              {[5, 4, 3, 2, 1].map((star) => {
                                const count = reviews.filter(r => r.rating === star).length
                                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                                return (
                                  <div key={star} className="flex items-center gap-3">
                                    <span className="text-sm w-12">{star} star</span>
                                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                      <div
                                        className="h-full bg-yellow-500 transition-all duration-300"
                                        style={{ width: `${percentage}%` }}
                                      />
                                    </div>
                                    <span className="text-sm w-12 text-right text-muted-foreground">{count}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Reviews List */}
                      <Card>
                        <CardHeader>
                          <CardTitle>Customer Reviews</CardTitle>
                          <CardDescription>Feedback from your passengers</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {loadingReviews ? (
                            <div className="text-center py-8">
                              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                            </div>
                          ) : reviews.length === 0 ? (
                            <div className="text-center py-8">
                              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                              <p className="text-muted-foreground">No reviews yet</p>
                              <p className="text-sm text-muted-foreground mt-2">
                                Complete rides to receive reviews from customers
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {reviews.map((review) => (
                                <div
                                  key={review.id}
                                  className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                                >
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <p className="font-semibold">{review.customerName}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDateTime(review.createdAt)}
                                      </p>
                                    </div>
                                    {renderStars(review.rating)}
                                  </div>
                                  {review.comment && (
                                    <p className="text-sm mb-3">{review.comment}</p>
                                  )}
                                  {review.ride && (
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                      <Bus className="h-3 w-3" />
                                      <span>Ride: {review.ride.rideNumber}</span>
                                      <span>•</span>
                                      <span>{review.ride.route}</span>
                                      <span>•</span>
                                      <span>{formatDate(review.ride.date)}</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </section>

        {/* Add Money Dialog */}
        <Dialog open={showAddMoneyDialog} onOpenChange={setShowAddMoneyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Money to Wallet</DialogTitle>
              <DialogDescription>Enter the amount you want to add to your wallet</DialogDescription>
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
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="wallet">Wallet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddMoneyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMoney} disabled={addingMoney}>
                {addingMoney ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Add Money"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Withdraw Money Dialog */}
        <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Money</DialogTitle>
              <DialogDescription>Enter withdrawal details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="withdraw-amount">Amount (₹)</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  placeholder="Enter amount (min ₹500)"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Account Number</Label>
                <Input
                  id="account-number"
                  placeholder="Enter account number"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ifsc-code">IFSC Code</Label>
                <Input
                  id="ifsc-code"
                  placeholder="Enter IFSC code"
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-holder">Account Holder Name</Label>
                <Input
                  id="account-holder"
                  placeholder="Enter account holder name"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank Name (Optional)</Label>
                <Input
                  id="bank-name"
                  placeholder="Enter bank name"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowWithdrawDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Withdraw"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Footer />

        <Dock 
          items={dockItems}
          panelHeight={68}
          baseItemSize={50}
          magnification={70}
        />
      </div>
    </ClickSpark>
  )
}