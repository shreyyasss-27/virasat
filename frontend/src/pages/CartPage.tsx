// import { useEffect, useState, type ChangeEvent } from "react";
// import { useCartStore } from "@/store/useCartStore";
// import { useOrderStore } from "@/store/useOrderStore";
// import { useUserStore } from "@/store/useUserStore";

// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
// import { toast } from "sonner";
// import { useNavigate } from "react-router";

// export default function CartPage() {
//   const { cart, fetchCart, removeFromCart, addToCart, clearCart, isLoading } =
//     useCartStore();
//   console.log(cart)
//   const { createOrder, markAsPaid, isLoading: isOrderLoading } = useOrderStore() as any;
//   const { userProfile, fetchUserProfile } = useUserStore();

//   const navigate = useNavigate();

//   const [showCheckout, setShowCheckout] = useState(false);

//   // Shipping form state – matches backend shippingAddress schema
//   const [form, setForm] = useState({
//     street: "",
//     city: "",
//     state: "",
//     pinCode: "",
//     country: "",
//   });

//   // Load cart + user profile on mount
//   useEffect(() => {
//     fetchCart();
//     fetchUserProfile();
//   }, [fetchCart, fetchUserProfile]);

//   // Prefill delivery address from user profile (if present)
//   useEffect(() => {
//     if (userProfile?.address) {
//       console.log(userProfile)
//       setForm({
//         street: userProfile.address.street || "",
//         city: userProfile.address.city || "",
//         state: userProfile.address.state || "",
//         pinCode: userProfile.address.pincode || "",
//         country: userProfile.address.country || "",
//       });
//     }
//   }, [userProfile]);

//   if (isLoading)
//     return (
//       <div className="text-center py-20 text-muted-foreground">
//         Loading your cart...
//       </div>
//     );

//   if (!cart || cart.items.length === 0)
//     return (
//       <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
//         <ShoppingCart className="w-12 h-12 text-muted-foreground" />
//         <h2 className="text-xl font-semibold">Your cart is empty</h2>
//         <p className="text-muted-foreground">
//           Start exploring our authentic crafts and add items to your cart!
//         </p>
//       </div>
//     );

//   const handleQuantityChange = async (productId: string, value: string) => {
//     const qty = parseInt(value, 10);
//     if (isNaN(qty) || qty < 1) {
//       toast.error("Quantity must be at least 1");
//       return;
//     }
//     await addToCart(productId, qty);
//   };

//   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleProceedCheckout = () => {
//     setShowCheckout(true);
//   };

//   const handleConfirmOrder = async () => {
//     if (!form.street || !form.city || !form.country) {
//       toast.error("Please fill all required address fields");
//       return;
//     }

//     const orderPayload = {
//       items: cart.items.map((item: any) => ({
//         product: item.product._id,
//         name: item.product.name, 
//         quantity: item.quantity,
//         price: item.product.price,
//         image: item.product.image
//       })),

//       shippingAddress: {
//         street: form.street,
//         city: form.city,
//         state: form.state,
//         pinCode: form.pinCode,
//         country: form.country,
//       },

//       totalAmount: cart.subTotal,
//       paymentMethod: "DUMMY_PAY",
//     };

//     console.log(orderPayload.items)

//     try {
//       // create order on backend
//       const createdOrder = await createOrder(orderPayload);

//       // optional: dummy mark as paid if order returned & markAsPaid supports it
//       if (createdOrder?._id) {
//         // await markAsPaid(createdOrder._id);
//         // if you later change markAsPaid to accept body:
//         await markAsPaid(createdOrder._id, {
//           id: "dummy_txn",
//           status: "PAID",
//           update_time: new Date().toISOString(),
//         });
//       }

//       clearCart();
//       navigate("/orders");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="container mx-auto px-6 py-10 space-y-8">
//       <h1 className="text-3xl font-bold tracking-tight">Your Cart</h1>

//       <div className="grid lg:grid-cols-3 gap-8">
//         {/* Cart Items */}
//         <div className="lg:col-span-2 space-y-4">
//           {cart.items.map((item: any) => (
//             <Card
//               key={item.product._id}
//               className="flex items-center justify-between p-4"
//             >
//               <div className="flex items-center gap-4">
//                 <img
//                   src={item.product?.image.url || "/placeholder.svg"}
//                   alt={item.product.name}
//                   className="w-20 h-20 object-cover rounded-md"
//                 />
//                 <div>
//                   <CardTitle className="text-lg">
//                     {item.product.name}
//                   </CardTitle>
//                   <p className="text-muted-foreground text-sm">
//                     {item.product.category}
//                   </p>
//                   <p className="font-medium">
//                     ₹{item.product.price.toLocaleString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <Input
//                   type="number"
//                   min={1}
//                   value={item.quantity}
//                   onChange={(e) =>
//                     handleQuantityChange(item.product._id, e.target.value)
//                   }
//                   className="w-16 text-center"
//                 />
//                 <Button
//                   size="icon"
//                   variant="ghost"
//                   onClick={() => removeFromCart(item.product._id)}
//                 >
//                   <Trash2 className="w-4 h-4 text-red-500" />
//                 </Button>
//               </div>
//             </Card>
//           ))}
//         </div>

//         {/* Summary + Checkout */}
//         <Card className="p-6 space-y-4">
//           <CardHeader className="p-0">
//             <CardTitle>Order Summary</CardTitle>
//           </CardHeader>

//           <CardContent className="p-0 space-y-4">
//             <div className="flex justify-between text-sm">
//               <span>Subtotal</span>
//               <span className="font-medium">
//                 ₹{cart.subTotal.toLocaleString()}
//               </span>
//             </div>
//             <div className="flex justify-between text-sm">
//               <span>Shipping</span>
//               <span className="font-medium text-muted-foreground">Free</span>
//             </div>
//             <div className="border-t pt-2 flex justify-between font-semibold text-base">
//               <span>Total</span>
//               <span>₹{cart.subTotal.toLocaleString()}</span>
//             </div>

//             {!showCheckout && (
//               <Button
//                 className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2 mt-4"
//                 onClick={handleProceedCheckout}
//               >
//                 Proceed to Checkout <ArrowRight className="h-4 w-4" />
//               </Button>
//             )}

//             {showCheckout && (
//               <div className="space-y-3 mt-4">
//                 <h3 className="font-semibold">Delivery Address</h3>

//                 <Input
//                   name="street"
//                   placeholder="Street address"
//                   value={form.street}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="city"
//                   placeholder="City"
//                   value={form.city}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="state"
//                   placeholder="State"
//                   value={form.state}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="zipCode"
//                   placeholder="Pincode"
//                   value={form.pinCode}
//                   onChange={handleChange}
//                 />
//                 <Input
//                   name="country"
//                   placeholder="Country"
//                   value={form.country}
//                   onChange={handleChange}
//                 />

//                 <Button
//                   className="w-full bg-green-600 hover:bg-green-700 mt-2"
//                   onClick={handleConfirmOrder}
//                   disabled={isOrderLoading}
//                 >
//                   {isOrderLoading ? "Processing..." : "Confirm & Dummy Pay"}
//                 </Button>
//               </div>
//             )}

//             <Button variant="outline" onClick={clearCart} className="w-full mt-2">
//               Clear Cart
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState, type ChangeEvent } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/store/useOrderStore";
import { useUserStore } from "@/store/useUserStore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart, ArrowRight, ArrowLeft } from "lucide-react"; 
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function CartPage() {
  const { cart, fetchCart, removeFromCart, addToCart, clearCart, isLoading } =
    useCartStore();
  const { createOrder, createRazorpayOrder, verifyRazorpayPayment, isLoading: isOrderLoading } = useOrderStore() as any;
  const { userProfile, fetchUserProfile } = useUserStore();

  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);

  const [form, setForm] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
  });

  useEffect(() => {
    fetchCart();
    fetchUserProfile();
  }, [fetchCart, fetchUserProfile]);

  useEffect(() => {
    if (userProfile?.address) {
      setForm({
        street: userProfile.address.street || "",
        city: userProfile.address.city || "",
        state: userProfile.address.state || "",
        pinCode: userProfile.address.pincode || "",
        country: userProfile.address.country || "",
      });
    }
  }, [userProfile]);

  if (isLoading)
    return (
      <div className="text-center py-20 text-muted-foreground animate-pulse">
        Loading your cart...
      </div>
    );

  if (!cart || cart.items.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center space-y-6">
        <div className="p-6 bg-muted/30 rounded-full">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/50" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-muted-foreground max-w-xs">
            Start exploring our authentic crafts and add items to your cart!
          </p>
        </div>
        <Button 
          onClick={() => navigate("/heritagebazzar")} 
          className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8"
        >
          Back to Bazaar
        </Button>
      </div>
    );

  const handleQuantityChange = async (productId: string, value: string) => {
    const qty = parseInt(value, 10);
    if (isNaN(qty) || qty < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    await addToCart(productId, qty);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedCheckout = () => {
    setShowCheckout(true);
  };

  const handleConfirmOrder = async () => {
    if (!form.street || !form.city || !form.country) {
      toast.error("Please fill all required address fields");
      return;
    }

    try {
      // First create the order with PENDING status
      const orderPayload = {
        items: cart.items.map((item: any) => ({
          product: item.product._id,
          name: item.product.name, 
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          street: form.street,
          city: form.city,
          state: form.state,
          pinCode: form.pinCode,
          country: form.country,
        },
        totalAmount: cart.subTotal,
        paymentMethod: "RAZORPAY",
      };

      console.log("Creating order with payload:", orderPayload);
      console.log("Razorpay Key from env:", import.meta.env.VITE_RAZORPAY_KEY_ID);
      const createdOrder = await createOrder(orderPayload);
      
      if (!createdOrder?._id) {
        throw new Error("Failed to create order");
      }

      console.log("Order created, creating Razorpay order...");
      const razorpayResponse = await createRazorpayOrder(cart.subTotal);
      
      if (!razorpayResponse?.success || !razorpayResponse?.razorpayOrder) {
        throw new Error("Failed to initialize payment");
      }

      console.log("Razorpay order created:", razorpayResponse.razorpayOrder.id);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_S6DOSFRx15B7a1", // Replace with your actual key temporarily
        // TEMPORARY TEST: Uncomment and replace with your real key
        // key: "rzp_test_YOUR_ACTUAL_KEY_HERE", 
        amount: razorpayResponse.razorpayOrder.amount,
        currency: "INR",
        name: "HeritageBazzar",
        description: "Payment for authentic crafts",
        order_id: razorpayResponse.razorpayOrder.id,
        handler: async function (response: any) {
          try {
            console.log("Payment successful:", response);
            const verificationData = {
              orderId: createdOrder._id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            await verifyRazorpayPayment(verificationData);
            clearCart();
            navigate("/heritagebazzar/orders");
          } catch (error) {
            console.error("Payment verification failed:", error);
            throw new Error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: function() {
            toast.info("Payment cancelled");
          }
        },
        prefill: {
          name: userProfile?.firstName || "",
          email: userProfile?.email || "",
        },
        theme: {
          color: "#10b981", // emerald color to match theme
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();

    } catch (err) {
      console.error("Payment process failed:", err);
      toast.error("Payment process failed. Please try again.");
    }
  };

  return (
    // Horizontal padding: px-8 md:px-12 lg:px-16
    <div className="container mx-auto px-8 md:px-12 lg:px-16 py-10 space-y-8">
      
      {/* --- Updated Go Back Button --- */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/heritagebazzar")} 
          className="gap-2 text-muted-foreground hover:text-emerald-700 hover:bg-emerald-50 -ml-4 rounded-full"
        >
          <ArrowLeft size={18} />
          Back to Bazaar
        </Button>
      </div>

      <h1 className="text-3xl font-extrabold tracking-tight">Your Cart</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item: any) => (
            <Card
              key={item.product._id}
              className="flex items-center justify-between p-5 border-muted/60 shadow-sm transition-all hover:shadow-md rounded-xl"
            >
              <div className="flex items-center gap-5">
                <img
                  src={item.product?.image.url || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-24 h-24 object-cover rounded-lg border"
                />
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold">
                    {item.product.name}
                  </CardTitle>
                  <p className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">
                    {item.product.category}
                  </p>
                  <p className="font-black text-lg">
                    ₹{item.product.price.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center gap-1">
                   <label className="text-[10px] uppercase font-bold text-muted-foreground">Qty</label>
                   <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.product._id, e.target.value)
                    }
                    className="w-16 h-9 text-center rounded-lg border-muted-foreground/20"
                  />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-red-50 group mt-4"
                  onClick={() => removeFromCart(item.product._id)}
                >
                  <Trash2 className="w-5 h-5 text-muted-foreground group-hover:text-red-500 transition-colors" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Summary + Checkout */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6 sticky top-24 border-2 border-emerald-50 shadow-lg rounded-2xl">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>

            <CardContent className="p-0 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">
                    ₹{cart.subTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-bold text-emerald-600 uppercase text-[10px] bg-emerald-50 px-2 py-0.5 rounded">Free</span>
                </div>
              </div>

              <div className="border-t border-dashed pt-4 flex justify-between font-black text-xl text-emerald-800">
                <span>Total</span>
                <span>₹{cart.subTotal.toLocaleString()}</span>
              </div>

              {!showCheckout ? (
                <Button
                  className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 mt-4 rounded-xl shadow-md transition-all active:scale-95"
                  onClick={handleProceedCheckout}
                >
                  Proceed to Checkout <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <div className="space-y-4 mt-6 pt-6 border-t animate-in fade-in slide-in-from-top-2">
                  <h3 className="font-bold text-sm uppercase text-muted-foreground tracking-widest">Delivery Address</h3>

                  <div className="grid gap-3">
                    <Input
                      name="street"
                      placeholder="Street address"
                      value={form.street}
                      onChange={handleChange}
                      className="rounded-lg focus-visible:ring-emerald-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        name="city"
                        placeholder="City"
                        value={form.city}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                      <Input
                        name="state"
                        placeholder="State"
                        value={form.state}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        name="pinCode"
                        placeholder="Pincode"
                        value={form.pinCode}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                      <Input
                        name="country"
                        placeholder="Country"
                        value={form.country}
                        onChange={handleChange}
                        className="rounded-lg"
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 mt-2 rounded-xl font-bold"
                    onClick={handleConfirmOrder}
                    disabled={isOrderLoading}
                  >
                    {isOrderLoading ? "Processing..." : "Pay with Razorpay"}
                  </Button>
                  
                  <Button 
                    variant="link" 
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => setShowCheckout(false)}
                  >
                    Back to Summary
                  </Button>
                </div>
              )}

              <Button 
                variant="ghost" 
                onClick={clearCart} 
                className="w-full mt-2 text-red-400 hover:text-red-600 hover:bg-red-50 text-xs"
              >
                Clear Entire Cart
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}