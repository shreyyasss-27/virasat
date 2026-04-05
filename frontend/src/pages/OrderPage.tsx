// import { useEffect } from "react";
// import { useOrderStore } from "@/store/useOrderStore";
// import { useAuthStore } from "@/store/useAuthStore";
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { ShoppingCart, Package } from "lucide-react";

// export default function OrderPage() {
//   const { authUser } = useAuthStore();
//   const { orders, fetchMyOrders, isLoading } = useOrderStore();

//   useEffect(() => {
//     if (authUser) fetchMyOrders();
//   }, [authUser, fetchMyOrders]);

//   if (!authUser) {
//     return <div className="text-center py-20 text-muted-foreground">Please log in to see your orders.</div>;
//   }

//   if (isLoading) {
//     return <div className="text-center py-20 text-muted-foreground">Loading your orders...</div>;
//   }

//   if (!orders || orders.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
//         <ShoppingCart className="w-12 h-12 text-muted-foreground" />
//         <h2 className="text-xl font-semibold">You have no orders</h2>
//         <p className="text-muted-foreground">
//           Start exploring our authentic crafts and add items to your cart!
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-6 py-10 space-y-6">
//       <h1 className="text-3xl font-bold text-center">My Orders</h1>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
//           {orders.map((order) => (
//             <Card key={order._id} className="border-border/60 hover:bg-accent/5 transition-colors">
//               <CardHeader>
//                 <CardTitle className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <Package className="h-5 w-5 text-muted-foreground" />
//                     <span className="text-base">Order #{order._id.slice(-6).toUpperCase()}</span>
//                   </div>
//                   <Badge
//                     className={`${
//                       order.orderStatus === "DELIVERED"
//                         ? "bg-green-600 hover:bg-green-700 text-white"
//                         : order.orderStatus === "SHIPPED"
//                         ? "bg-cyan-600 hover:bg-cyan-700 text-white"
//                         : order.orderStatus === "PENDING"
//                         ? "bg-yellow-500 hover:bg-yellow-600 text-white"
//                         : order.orderStatus === "CANCELLED"
//                         ? "bg-red-500 hover:bg-red-600 text-white"
//                         : order.orderStatus === "PAID"
//                         ? "bg-violet-500 hover:bg-violet-600 text-white"
//                         : "bg-muted text-muted-foreground"
//                     }`}
//                   >
//                     {order.orderStatus}
//                   </Badge>
//                 </CardTitle>
//                 <CardDescription>
//                   Placed on: {new Date(order.createdAt).toLocaleDateString()}
//                 </CardDescription>
//               </CardHeader>
              
//               <CardContent className="space-y-4">
//                 {/* Order Items Section */}
//                 <div className="space-y-2">
//                   {order.items.map((item: any, index: number) => (
//                     <div
//                       key={item._id || index} 
//                       className="flex justify-between items-center border-b pb-2 last:border-0"
//                     >
//                       <div className="flex items-center gap-4">
//                         <div>
//                           <p className="font-medium text-sm">{item.name}</p>
//                           <p className="text-xs text-muted-foreground">
//                             Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
//                           </p>
//                         </div>
//                       </div>
                      
//                       <span className="font-semibold text-sm">
//                         ₹{(item.price * item.quantity).toLocaleString()}
//                       </span>
//                     </div>
//                   ))}
//                 </div>

//                 {/* Summary Section */}
//                 <div className="border-t pt-4 space-y-2">
//                   <div className="flex justify-between font-bold text-base">
//                     <span>Total Amount:</span>
//                     <span>₹{order.totalAmount.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//     </div>
//   );
// }

import { useEffect } from "react";
import { useNavigate } from "react-router"; 
import { useOrderStore } from "@/store/useOrderStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; 
import { ShoppingCart, Package, ArrowLeft } from "lucide-react"; 

export default function OrderPage() {
  const { authUser } = useAuthStore();
  const { orders, fetchMyOrders, isLoading } = useOrderStore();
  const navigate = useNavigate(); 

  useEffect(() => {
    if (authUser) fetchMyOrders();
  }, [authUser, fetchMyOrders]);

  if (!authUser) {
    return <div className="text-center py-20 text-muted-foreground">Please log in to see your orders.</div>;
  }

  if (isLoading) {
    return <div className="text-center py-20 text-muted-foreground">Loading your orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
        <ShoppingCart className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">You have no orders</h2>
        <p className="text-muted-foreground">
          Start exploring our authentic crafts and add items to your cart!
        </p>
        {/* Added navigation here as well for empty state */}
        <Button onClick={() => navigate("/heritagebazzar")} variant="outline">
          Back to Bazaar
        </Button>
      </div>
    );
  }

  return (
    // Horizontal padding added: px-8 md:px-12
    <div className="container mx-auto px-8 md:px-12 py-10 space-y-6">
      
      {/* --- Go Back to Bazaar Button --- */}
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/heritagebazzar")} 
          className="gap-2 text-muted-foreground hover:text-foreground -ml-4"
        >
          <ArrowLeft size={18} />
          Back to Bazaar
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center">My Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
        {orders.map((order) => (
          <Card key={order._id} className="border-border/60 hover:bg-accent/5 transition-colors">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <span className="text-base">Order #{order._id.slice(-6).toUpperCase()}</span>
                </div>
                <Badge
                  className={`${
                    order.orderStatus === "DELIVERED"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : order.orderStatus === "SHIPPED"
                      ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                      : order.orderStatus === "PENDING"
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : order.orderStatus === "CANCELLED"
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : order.orderStatus === "PAID"
                      ? "bg-violet-500 hover:bg-violet-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {order.orderStatus}
                </Badge>
              </CardTitle>
              <CardDescription>
                Placed on: {new Date(order.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {order.items.map((item: any, index: number) => (
                  <div
                    key={item._id || index} 
                    className="flex justify-between items-center border-b pb-2 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <span className="font-semibold text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between font-bold text-base">
                  <span>Total Amount:</span>
                  <span>₹{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Details Section */}
              {order.isPaid && order.paymentMethod === "RAZORPAY" && (
                <div className="border-t pt-4 space-y-3">
                  <h4 className="font-semibold text-sm text-emerald-600 flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                    Payment Details
                  </h4>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-medium">Razorpay</span>
                    </div>
                    {order.razorpayPaymentId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment ID:</span>
                        <span className="font-mono text-xs">{order.razorpayPaymentId}</span>
                      </div>
                    )}
                    {order.razorpayOrderId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order ID:</span>
                        <span className="font-mono text-xs">{order.razorpayOrderId}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid On:</span>
                      <span className="font-medium">
                        {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}