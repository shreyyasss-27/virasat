import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter,
  Eye, 
  Edit, 
  Trash2,
  X
} from "lucide-react";
import { toast } from "sonner";

type AdminOrderItem = {
  name?: string;
  category?: string;
  quantity?: number;
  price?: number;
};

type AdminOrder = {
  _id: string;
  status?: string;
  createdAt?: string;
  totalAmount?: number;
  items?: AdminOrderItem[];
  phoneNumber?: string;
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminOrder>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/orders", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }
      const data = await response.json();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order._id || "").toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.items || []).some((item) => (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.firstName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.lastName || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || (order.status || "PENDING") === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: AdminOrder) => {
    setSelectedOrder(order);
    toast.info(`Viewing order #${order._id}`);
  };

  const handleEditOrder = (order: AdminOrder) => {
    setIsEditing(true);
    setEditForm({
      status: order.status || "PENDING",
      totalAmount: order.totalAmount,
      phoneNumber: order.phoneNumber,
      shippingAddress: order.shippingAddress
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder) return;
    
    try {
      const response = await fetch(`/api/admin/orders/${selectedOrder._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(o => o._id === selectedOrder._id ? { ...o, ...updatedOrder } : o));
        toast.success("Order updated successfully");
        setIsEditing(false);
        setSelectedOrder(null);
        setEditForm({});
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleDeleteOrder = (order: AdminOrder) => {
    if (window.confirm(`Are you sure you want to delete order #${order._id}?`)) {
      // Delete order via API
      fetch(`/api/admin/orders/${order._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setOrders(orders.filter((o: any) => o._id !== order._id));
          toast.success(`Deleted order #${order._id}`);
          setSelectedOrder(null);
        } else {
          toast.error(data.message || "Failed to delete order");
        }
      })
      .catch(() => {
        toast.error("Failed to delete order");
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-500";
      case "PROCESSING": return "bg-blue-500";
      case "SHIPPED": return "bg-green-500";
      case "DELIVERED": return "bg-green-600";
      case "CANCELLED": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">Manage orders and track shipments</p>
        </div>
        <Button variant="outline" onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer name, or product..."
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
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setStatusFilter("ALL")}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order: any) => (
                <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">Order #{order._id}</h3>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Customer</p>
                          <p className="text-sm">
                            {order.user?.firstName} {order.user?.lastName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {order.user?.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Amount</p>
                          <p className="text-lg font-bold">₹{order.totalAmount?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Items ({order.items?.length || 0})</p>
                        <div className="space-y-2">
                          {order.items?.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-2 border-b">
                              <div className="flex-1">
                                <p className="text-sm font-medium">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.category} • Qty: {item.quantity}
                                </p>
                              </div>
                              <p className="text-sm font-bold">₹{item.price?.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium">Shipping Address</p>
                        <div className="text-sm text-muted-foreground">
                          {order.shippingAddress?.street}, {order.shippingAddress?.city}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.shippingAddress?.state}, {order.shippingAddress?.pincode}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteOrder(order)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Order" : "Order Details"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedOrder(null);
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
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={editForm.status || "PENDING"}
                      onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      className="w-full p-2 border rounded-md bg-background text-foreground"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Amount</label>
                    <Input
                      value={editForm.totalAmount || ""}
                      onChange={(e) => setEditForm({...editForm, totalAmount: parseFloat(e.target.value)})}
                      placeholder="Total amount"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input
                      value={editForm.phoneNumber || ""}
                      onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                      placeholder="Phone number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Street</label>
                    <Input
                      value={editForm.shippingAddress?.street || ""}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        shippingAddress: { ...editForm.shippingAddress, street: e.target.value }
                      })}
                      placeholder="Street address"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">City</label>
                    <Input
                      value={editForm.shippingAddress?.city || ""}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        shippingAddress: { ...editForm.shippingAddress, city: e.target.value }
                      })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <Input
                      value={editForm.shippingAddress?.state || ""}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        shippingAddress: { ...editForm.shippingAddress, state: e.target.value }
                      })}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Pincode</label>
                    <Input
                      value={editForm.shippingAddress?.pincode || ""}
                      onChange={(e) => setEditForm({
                        ...editForm, 
                        shippingAddress: { ...editForm.shippingAddress, pincode: e.target.value }
                      })}
                      placeholder="Pincode"
                    />
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Order ID</p>
                      <p className="text-sm">{selectedOrder._id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Status</p>
                      <Badge className={getStatusColor(selectedOrder.status || "PENDING")}>
                        {selectedOrder.status || "PENDING"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Date</p>
                      <p className="text-sm">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total Amount</p>
                      <p className="text-lg font-bold">₹{selectedOrder.totalAmount?.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Customer Information</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm">Name</p>
                        <p className="text-sm">{selectedOrder.user?.firstName} {selectedOrder.user?.lastName}</p>
                      </div>
                      <div>
                        <p className="text-sm">Email</p>
                        <p className="text-sm">{selectedOrder.user?.email}</p>
                      </div>
                      <div>
                        <p className="text-sm">Phone</p>
                        <p className="text-sm">{selectedOrder.phoneNumber || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Shipping Address</p>
                    <div className="text-sm text-muted-foreground">
                      {selectedOrder.shippingAddress?.street}<br />
                      {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.pincode}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Order Items</p>
                    <div className="space-y-2">
                      {(selectedOrder.items || []).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} ({item.quantity}x)</span>
                          <span>₹{item.price?.toLocaleString()}</span>
                        </div>
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
                  <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleEditOrder(selectedOrder)}>
                    Edit Order
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
