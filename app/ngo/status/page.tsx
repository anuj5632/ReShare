"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Clock, AlertCircle, CheckCircle, Eye } from "lucide-react"
import Link from "next/link"
// RoleSelector removed from this page; sign-in UI now lives on the landing page

export default function NGOStatusPage() {
  // Mock verification data
  const verificationStatus = {
    organizationName: "Green Earth Community",
    status: "pending" as const,
    submittedDate: "2024-10-31",
    daysRemaining: 7,
    progress: 30,
    checklist: [
      { item: "Documents Received", completed: true },
      { item: "Initial Review", completed: false },
      { item: "Verification", completed: false },
      { item: "Approval", completed: false },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-600"
      case "approved":
        return "text-green-600"
      case "rejected":
        return "text-destructive"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-8 h-8" />
      case "approved":
        return <CheckCircle className="w-8 h-8" />
      case "rejected":
        return <AlertCircle className="w-8 h-8" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">

      {/* Header */}
      <div className="bg-primary/10 border-b border-primary/20 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold">ReShare</h1>
          </div>
          <h2 className="text-xl font-semibold">NGO Verification Status</h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {verificationStatus.organizationName}
              <span className={`flex items-center gap-2 text-lg ${getStatusColor(verificationStatus.status)}`}>
                {getStatusIcon(verificationStatus.status)}
              </span>
            </CardTitle>
            <CardDescription>Application Status & Verification Progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Status Badge */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-900">Pending Verification</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    Your organization is being verified. Approximately {verificationStatus.daysRemaining} days
                    remaining.
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold">Verification Timeline</h3>
              <div className="space-y-3">
                {verificationStatus.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        item.completed ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {item.completed ? "✓" : idx + 1}
                    </div>
                    <span className={item.completed ? "line-through text-muted-foreground" : ""}>{item.item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">Overall Progress</p>
                <p className="text-sm text-muted-foreground">{verificationStatus.progress}%</p>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all"
                  style={{ width: `${verificationStatus.progress}%` }}
                />
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/10 rounded-lg">
              <div>
                <p className="text-xs text-muted-foreground">Submitted Date</p>
                <p className="font-semibold">October 31, 2024</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expected Completion</p>
                <p className="font-semibold">November 7, 2024</p>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Our team will review your documents and organization details</li>
                <li>✓ We may reach out for additional information if needed</li>
                <li>✓ You'll receive an email notification once verification is complete</li>
                <li>✓ Upon approval, you can start claiming donations immediately</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" className="flex-1 bg-transparent">
                <Eye className="w-4 h-4 mr-2" />
                View Application
              </Button>
              <Link href="/ngo/dashboard" className="flex-1">
                <Button className="w-full">Continue to Dashboard</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-semibold text-sm mb-1">How long does verification take?</p>
              <p className="text-sm text-muted-foreground">Typically 10 business days from submission date.</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">Can I edit my application?</p>
              <p className="text-sm text-muted-foreground">
                You can view and update certain information in your application.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">What if verification is rejected?</p>
              <p className="text-sm text-muted-foreground">
                We'll provide specific reasons and you can reapply with corrections.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
