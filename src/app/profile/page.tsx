"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import MainContent from "@/components/MainContent"

interface Recipe {
  id: string
  title: string
  author: string
  rating: number
  createdAt: string
}

export default function Profile() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }

    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || "",
        email: session.user?.email || ""
      }))
      
      // Fetch user's recipes
      fetchUserRecipes()
    }
  }, [session, status, router])

  const fetchUserRecipes = async () => {
    try {
      const response = await fetch("/api/profile/recipes")
      if (response.ok) {
        const data = await response.json()
        setUserRecipes(data.recipes)
      }
    } catch (error) {
      console.error("Failed to fetch user recipes:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const updateData: any = {}
      
      // Only include fields that have changed
      if (formData.name !== session?.user?.name) {
        updateData.name = formData.name
      }
      
      if (formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          setError("New passwords do not match")
          setIsLoading(false)
          return
        }
        if (formData.newPassword.length < 6) {
          setError("New password must be at least 6 characters long")
          setIsLoading(false)
          return
        }
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      if (Object.keys(updateData).length === 0) {
        setMessage("No changes to save")
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage("Profile updated successfully!")
        setIsEditing(false)
        
        // Update session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.user.name,
            email: data.user.email,
          }
        })
        
        // Clear password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }))
      } else {
        const data = await response.json()
        setError(data.error || "Failed to update profile")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (status === "loading") {
    return (
      <MainContent>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </MainContent>
    )
  }

  if (status === "unauthenticated") {
    return null // Will redirect in useEffect
  }

  return (
    <MainContent>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              {session?.user?.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name || "Profile"}
                  className="w-16 h-16 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                <p className="text-gray-600">Manage your account settings</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
              </div>

              {/* Change Password */}
              {isEditing && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          minLength={6}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false)
                        setError("")
                        setMessage("")
                        // Reset form data to original values
                        setFormData(prev => ({
                          ...prev,
                          name: session?.user?.name || "",
                          email: session?.user?.email || "",
                          currentPassword: "",
                          newPassword: "",
                          confirmPassword: ""
                        }))
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                      {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* User's Recipes */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">My Recipes</h2>
              <Link
                href="/recipes/new"
                className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add New Recipe
              </Link>
            </div>
          </div>
          
          <div className="px-6 py-6">
            {userRecipes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">You haven't created any recipes yet.</p>
                <Link
                  href="/recipes/new"
                  className="text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Create your first recipe →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {userRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div>
                      <h3 className="font-medium text-gray-900">{recipe.title}</h3>
                      <p className="text-sm text-gray-500">
                        Rating: {recipe.rating}/5 • Created: {new Date(recipe.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        href={`/recipes/${recipe.id}`}
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                      >
                        View
                      </Link>
                      <Link
                        href={`/recipes/${recipe.id}/edit`}
                        className="text-gray-600 hover:text-gray-500 text-sm font-medium"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainContent>
  )
} 