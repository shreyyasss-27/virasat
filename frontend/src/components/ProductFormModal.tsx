import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProductStore } from "@/store/useProductStore";
import { useMediaStore } from "@/store/useMediaStore";
import MediaUpload from "./MediaUpload.tsx";
import { X } from "lucide-react";

export function ProductFormModal({ isOpen, onClose, initialData }: any) {
  const { createProduct, updateProduct, isSaving } = useProductStore();
  const { mediaList, resetMedia } = useMediaStore();

  const emptyForm = {
    name: "",
    category: "",
    price: 0,
    stock: 0,
    description: "",
    image: {
      mediaId: null as string | null,
      url: "",
      altText: ""
    },
  };

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm);
    }
  }, [initialData, isOpen]);

  // Watch for new uploads
  useEffect(() => {
    if (mediaList.length > 0) {
      const latestMedia = mediaList[0];
      console.log(mediaList)
      
      setFormData((prev) => ({
        ...prev,
        image: {
          mediaId: latestMedia._id,
          url: latestMedia.url,
          altText: prev.name || "Product Image" // Fallback to product name
        },
      }));
    }
  }, [mediaList]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const clearImage = () => {
    setFormData((prev) => ({
      ...prev,
      image: { mediaId: null, url: "", altText: "" },
    }));
    resetMedia();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await updateProduct(initialData._id, formData);
    } else {
      await createProduct(formData);
    }
    handleClose();
  };

  const handleClose = () => {
    resetMedia(); 
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
            </div>
          </div>

          {/* Single Image Section */}
          <div className="space-y-2 border-t pt-2">
            <Label>Product Image</Label>
            
            {!formData.image.url ? (
              <MediaUpload module="heritageBazzar" type="image" />
            ) : (
              <div className="relative h-40 w-full">
                <img 
                  src={formData.image.url} 
                  alt={formData.image.altText} 
                  className="h-full w-full object-cover rounded-md border" 
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>

          <Button type="submit" className="w-full" disabled={isSaving || !formData.image.url}>
            {isSaving ? "Processing..." : initialData ? "Save Changes" : "List Product"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}