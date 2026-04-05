import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Package, Settings, BarChart3, Shield, Database } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/stats", {
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });
      
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }
      
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(`Failed to fetch stats: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewUsers = () => {
    navigate("/admin/users");
    toast.info("Navigating to user management");
  };

  const handleViewProducts = () => {
    navigate("/admin/products");
    toast.info("Navigating to product management");
  };

  const handleViewOrders = () => {
    navigate("/admin/orders");
    toast.info("Navigating to order management");
  };

  const handleManagePermissions = () => {
    navigate("/admin/permissions");
    toast.info("Navigating to permission management");
  };

  const handleProductSettings = () => {
    navigate("/admin/product-settings");
    toast.info("Navigating to product settings");
  };

  const handleOrderSettings = () => {
    navigate("/admin/order-settings");
    toast.info("Navigating to order settings");
  };

  const handleSettings = () => {
    navigate("/admin/settings");
    toast.info("Navigating to admin settings");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your platform and monitor performance</p>
        </div>
        <Button variant="outline" onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">{stats.totalUsers || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">+10% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">{stats.totalProducts || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">{stats.totalOrders || 0}</div>
            )}
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold">₹{(stats.totalRevenue || 0).toLocaleString()}</div>
            )}
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleViewUsers}>
              <Users className="mr-2 h-4 w-4" />
              View All Users
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleManagePermissions}>
              <Shield className="mr-2 h-4 w-4" />
              Manage Permissions
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleViewProducts}>
              <Package className="mr-2 h-4 w-4" />
              View All Products
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleProductSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Product Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" onClick={handleViewOrders}>
              <BarChart3 className="mr-2 h-4 w-4" />
              View All Orders
            </Button>
            <Button variant="outline" className="w-full justify-start" onClick={handleOrderSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Order Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>New user registration: <strong>john@example.com</strong></span>
              <span className="text-muted-foreground">2 minutes ago</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>New product added: <strong>Handicraft Item</strong></span>
              <span className="text-muted-foreground">5 minutes ago</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>New order: <strong>Order #1234</strong></span>
              <span className="text-muted-foreground">8 minutes ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}