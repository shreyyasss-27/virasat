import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Shield, 
  Filter,
  X
} from "lucide-react";
import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";

type AdminUser = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  roles: string[];
  status?: string;
  createdAt?: string;
  phoneNumber?: string;
  bio?: string;
  profilePic?: {
    mediaId: string | null;
    url: string;
  };
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  bankDetails?: {
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  iSOnboarded?: boolean;
  updatedAt?: string;
};

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminUser>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get("/admin/users");
      setUsers(Array.isArray(data?.users) ? data.users : []);
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.lastName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || (user.status || "ACTIVE") === statusFilter;
    const matchesRole = roleFilter === "ALL" || user.roles.includes(roleFilter);
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleViewUser = (user: AdminUser) => {
    console.log("handleViewUser called with:", user);
    setSelectedUser(user);
    toast.info(`Viewing ${user.firstName || ""} ${user.lastName || ""}`.trim());
  };

  const handleEditUser = (user: AdminUser) => {
    console.log("handleEditUser called with:", user);
    setIsEditing(true);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      bio: user.bio || "",
      status: user.status || "ACTIVE"
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    
    try {
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUsers(users.map(u => u._id === selectedUser._id ? { ...u, ...updatedUser } : u));
        toast.success("User updated successfully");
        setIsEditing(false);
        setSelectedUser(null);
        setEditForm({});
      } else {
        toast.error("Failed to update user");
      }
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleToggleStatus = (user: AdminUser) => {
    const currentStatus = user.status || "ACTIVE";
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    // Update status via API
    fetch(`/api/admin/users/${user._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setUsers(users.map((u) => 
          u._id === user._id ? { ...u, status: newStatus } : u
        ));
        toast.success(`User status changed to ${newStatus}`);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    })
    .catch(() => {
      toast.error("Failed to update user status");
    });
  };

  const handleDeleteUser = (user: AdminUser) => {
    if (window.confirm(`Are you sure you want to delete ${(user.firstName || "")} ${(user.lastName || "")}?`.trim())) {
      // Delete user via API
      fetch(`/api/admin/users/${user._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setUsers(users.filter((u) => u._id !== user._id));
          toast.success(`Deleted ${(user.firstName || "")} ${(user.lastName || "")}`.trim());
          setSelectedUser(null);
        } else {
          toast.error(data.message || "Failed to delete user");
        }
      })
      .catch(() => {
        toast.error("Failed to delete user");
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500";
      case "INACTIVE": return "bg-red-500";
      case "SUSPENDED": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 border rounded-lg bg-muted/50">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="SUSPENDED">Suspended</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Role</label>
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="ALL">All Roles</option>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EXPERT">Expert</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setRoleFilter("ALL");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {(user.firstName || "").charAt(0)}{(user.lastName || "").charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium">{user.firstName || ""} {user.lastName || ""}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                      <div className="flex gap-1 mt-1">
                        {user.roles.map((role: string) => (
                          <Badge key={role} variant="secondary" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className={`w-2 h-2 rounded-full ${getStatusColor(user.status || "ACTIVE")}`}></Badge>
                        <span className="text-xs">{user.status || "ACTIVE"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewUser(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(user)}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteUser(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit User" : "User Details"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedUser(null);
                  setIsEditing(false);
                  setEditForm({});
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              {isEditing ? (
                // Edit Form
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      value={editForm.firstName || ""}
                      onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      value={editForm.lastName || ""}
                      onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                      placeholder="Last name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      value={editForm.email || ""}
                      onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      value={editForm.phoneNumber || ""}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">Bio</label>
                    <textarea
                      value={editForm.bio || ""}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="User bio"
                      className="w-full p-2 border rounded-md bg-background text-foreground"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={editForm.status || "ACTIVE"}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full p-2 border rounded-md bg-background text-foreground"
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="SUSPENDED">Suspended</option>
                    </select>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-lg">{selectedUser.firstName || ""} {selectedUser.lastName || ""}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-lg">{selectedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Phone</label>
                      <p>{selectedUser.phoneNumber || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge className={getStatusColor(selectedUser.status || "ACTIVE")}>
                        {selectedUser.status || "ACTIVE"}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Onboarded</label>
                      <p>{selectedUser.iSOnboarded ? "Yes" : "No"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Created</label>
                      <p>{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Bio</label>
                    <p className="text-sm">{selectedUser.bio || "No bio provided"}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Address</label>
                    <div className="text-sm text-muted-foreground">
                      {selectedUser.address?.street || "No street"}<br />
                      {selectedUser.address?.city || "No city"}, {selectedUser.address?.state || "No state"} {selectedUser.address?.pincode || "No pincode"}<br />
                      {selectedUser.address?.country || "No country"}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Roles</label>
                    <div className="flex gap-1">
                      {selectedUser.roles.map((role: string) => (
                        <Badge key={role} variant="secondary">{role}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="sticky bottom-0 bg-background border-t px-6 py-4 flex justify-end gap-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEdit}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setSelectedUser(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleEditUser(selectedUser)}>
                    Edit User
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
