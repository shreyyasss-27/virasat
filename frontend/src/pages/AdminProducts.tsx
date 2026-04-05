import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Package, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  Filter,
  X
} from "lucide-react";
import { toast } from "sonner";

type AdminProduct = {
  _id: string;
  name: string;
  price?: number;
  category?: string;
  stock?: number;
  status?: string;
  image?: string;
  seller?: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  createdAt?: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<AdminProduct>>({});
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/products", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data?.products) ? data.products : []);
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "ALL" || (product.status || "ACTIVE") === statusFilter;
    const matchesCategory = categoryFilter === "ALL" || (product.category || "") === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleViewProduct = (product: AdminProduct) => {
    setSelectedProduct(product);
    toast.info(`Viewing ${product.name}`);
  };

  const handleEditProduct = (product: AdminProduct) => {
    setIsEditing(true);
    setEditForm({
      name: product.name,
      price: product.price,
      category: product.category,
      stock: product.stock,
      status: product.status || "ACTIVE"
    });
  };

  const handleSaveEdit = async () => {
    if (!selectedProduct) return;
    
    try {
      const response = await fetch(`/api/admin/products/${selectedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedProduct = await response.json();
        setProducts(products.map(p => p._id === selectedProduct._id ? { ...p, ...updatedProduct } : p));
        toast.success("Product updated successfully");
        setIsEditing(false);
        setSelectedProduct(null);
        setEditForm({});
      } else {
        toast.error("Failed to update product");
      }
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditForm({});
  };

  const handleDeleteProduct = (product: AdminProduct) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      setProducts(products.filter(p => p._id !== product._id));
      toast.success(`Deleted ${product.name}`);
      setSelectedProduct(null);
    }
  };

  const handleToggleStatus = (product: AdminProduct) => {
    const currentStatus = product.status || "ACTIVE";
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    
    console.log("handleToggleStatus called:", {
      productId: product._id,
      currentStatus,
      newStatus,
      apiUrl: `/api/admin/products/${product._id}/status`
    });
    
    // Update status via API
    fetch(`/api/admin/products/${product._id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    })
    .then(response => {
      console.log("API response status:", response.status);
      return response.json();
    })
    .then(data => {
      console.log("API response data:", data);
      if (data.success) {
        setProducts(products.map(p => 
          p._id === product._id ? { ...p, status: newStatus } : p
        ));
        toast.success(`Product status changed to ${newStatus}`);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    })
    .catch(error => {
      console.error("API call error:", error);
      toast.error("Failed to update product status");
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE": return "bg-green-500";
      case "INACTIVE": return "bg-red-500";
      case "SOLD": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-muted-foreground">Manage products and inventory</p>
        </div>
        <Button onClick={() => window.history.back()}>
          Back to Dashboard
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or category..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
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
                    <option value="SOLD">Sold</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border rounded-md bg-background text-foreground"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setStatusFilter("ALL");
                    setCategoryFilter("ALL");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Products Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={product.image || ""} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <Badge className={`w-2 h-2 rounded-full ${getStatusColor(product.status || "ACTIVE")}`}></Badge>
                      <span className="text-xs ml-2">{product.status || "ACTIVE"}</span>
                    </div>
                    <p className="text-2xl font-bold">₹{(product.price ?? 0).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock}</p>
                    <p className="text-xs text-muted-foreground">
                      Seller: {product.seller?.firstName} {product.seller?.lastName}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewProduct(product)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(product)}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteProduct(product)}
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

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border">
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Product" : "Product Details"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedProduct(null);
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
                    <label className="text-sm font-medium">Name</label>
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      placeholder="Product name"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price</label>
                    <Input
                      value={editForm.price || ""}
                      onChange={(e) => setEditForm({...editForm, price: parseFloat(e.target.value)})}
                      placeholder="Price"
                      type="number"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      placeholder="Category"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Stock</label>
                    <Input
                      value={editForm.stock || ""}
                      onChange={(e) => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                      placeholder="Stock quantity"
                      type="number"
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
                      <option value="SOLD">Sold</option>
                    </select>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Name</label>
                      <p className="text-lg">{selectedProduct.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price</label>
                      <p className="text-lg font-bold">₹{selectedProduct.price?.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <p>{selectedProduct.category || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Stock</label>
                      <p>{selectedProduct.stock || "N/A"}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Status</label>
                      <Badge className={getStatusColor(selectedProduct.status || "ACTIVE")}>
                        {selectedProduct.status || "ACTIVE"}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Created</label>
                      <p>{selectedProduct.createdAt ? new Date(selectedProduct.createdAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium">Seller</label>
                    <p>{selectedProduct.seller?.firstName} {selectedProduct.seller?.lastName}</p>
                    <p className="text-sm text-muted-foreground">{selectedProduct.seller?.email}</p>
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
                  <Button variant="outline" onClick={() => setSelectedProduct(null)}>
                    Close
                  </Button>
                  <Button onClick={() => handleEditProduct(selectedProduct)}>
                    Edit Product
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
