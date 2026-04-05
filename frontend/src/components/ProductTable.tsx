import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Package } from "lucide-react"; // Added Package icon for placeholder
import { useProductStore } from "@/store/useProductStore";

export function ProductTable({ products, onEdit }: { products: any[], onEdit: (p: any) => void }) {
  const { deleteProduct, isSaving } = useProductStore();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* Added Image Column Head */}
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">No products found.</TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product._id}>
                {/* Image Preview Cell */}
                <TableCell>
                  <div className="h-12 w-12 rounded-md border bg-muted flex items-center justify-center overflow-hidden">
                    {product.image?.url ? (
                      <img 
                        src={product.image.url} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="font-medium">{product.description}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="icon" onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    disabled={isSaving}
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this product?")) {
                        deleteProduct(product._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}