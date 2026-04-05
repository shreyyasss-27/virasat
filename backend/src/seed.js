import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.model.js";
import Seller from "./models/seller.model.js";
import Admin from "./models/admin.model.js";
import Product from "./models/product.model.js";
import Cart from "./models/cart.model.js";
import Order from "./models/order.model.js";
import Review from "./models/review.model.js";

// --------------------
// Connect to MongoDB
// --------------------
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Virasat");
    console.log("MongoDB connected");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

// --------------------
// Sample users
// --------------------
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "password123",
    roles: ["ADMIN"],
    iSOnboarded: true,
  },
  {
    firstName: "Rajesh",
    lastName: "Kumar",
    email: "rajesh@example.com",
    password: "password123",
    roles: ["SELLER"],
    iSOnboarded: true,
  },
  {
    firstName: "Sita",
    lastName: "Devi",
    email: "sita@example.com",
    password: "password123",
    roles: ["USER"],
    iSOnboarded: true,
  },
];

// --------------------
// Sample products
// --------------------
const products = [
  {
    name: "Handwoven Banarasi Silk Saree",
    description: "Beautiful traditional Banarasi silk saree from Varanasi.",
    sellerEmail: "rajesh@example.com",
    images: [{ url: "/banarasi-silk-saree.png", altText: "Banarasi Silk Saree" }],
    category: "Textiles",
    price: 15000,
    stock: 5,
    isApproved: true,
  },
  {
    name: "Madhubani Painting - Ganesha",
    description: "Original Madhubani painting depicting Lord Ganesha.",
    sellerEmail: "rajesh@example.com",
    images: [{ url: "/madhubani-ganesha.png", altText: "Madhubani Ganesha" }],
    category: "Paintings",
    price: 2500,
    stock: 10,
    isApproved: true,
  },
  {
    name: "Bhagavad Gita (Sanskrit-Hindi)",
    description: "Sanskrit-Hindi edition of the holy Bhagavad Gita.",
    sellerEmail: "rajesh@example.com",
    images: [{ url: "/bhagavad-gita-sanskrit-hindi.png", altText: "Bhagavad Gita" }],
    category: "Books",
    price: 800,
    stock: 20,
    isApproved: true,
  },
];

// --------------------
// Seed function
// --------------------
const seedDB = async () => {
  try {
    // Clear old data
    await User.deleteMany();
    await Seller.deleteMany();
    await Admin.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Review.deleteMany();
    console.log("Old data cleared");

    // --------------------
    // Insert users
    // --------------------
    const createdUsers = await Promise.all(
      users.map(async (u) => {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        return User.create({ ...u, password: hashedPassword });
      })
    );
    console.log("Users created");

    // Map sellers
    const sellers = {};
    createdUsers.forEach((u) => {
      if (u.roles.includes("SELLER")) sellers[u.email] = u._id;
    });

    // --------------------
    // Insert seller profiles
    // --------------------
    for (let email in sellers) {
      await Seller.create({
        userId: sellers[email],
        shopName: "Shop of " + email.split("@")[0],
        description: "Quality handmade products",
        verified: true,
      });
    }
    console.log("Sellers created");

    // --------------------
    // Insert products
    // --------------------
    const productDocs = [];
    for (let p of products) {
      const sellerId = sellers[p.sellerEmail];
      if (!sellerId) continue;
      const product = await Product.create({
        ...p,
        seller: sellerId,
      });
      productDocs.push(product);

      // Add product to seller
      await Seller.updateOne({ userId: sellerId }, { $push: { products: product._id } });
    }
    console.log("Products created");

    // --------------------
    // Insert carts for buyers
    // --------------------
    const buyers = createdUsers.filter((u) => u.roles.includes("USER"));
    for (let buyer of buyers) {
      await Cart.create({
        user: buyer._id,
        items: productDocs.slice(0, 2).map((p, i) => ({ product: p._id, quantity: i + 1 })),
        subTotal: productDocs.slice(0, 2).reduce((sum, p, i) => sum + p.price * (i + 1), 0),
      });
    }
    console.log("Carts created");

    // --------------------
    // Insert sample reviews
    // --------------------
    for (let buyer of buyers) {
      for (let product of productDocs.slice(0, 2)) {
        const review = await Review.create({
          user: buyer._id,
          product: product._id,
          rating: Math.floor(Math.random() * 5) + 1,
          comment: "Amazing product!",
        });
        await Product.updateOne(
          { _id: product._id },
          { $push: { reviews: review._id }, $inc: { totalRatings: 1, averageRating: review.rating } }
        );
      }
    }
    console.log("Reviews created");

    // --------------------
    // Insert sample orders
    // --------------------
    for (let buyer of buyers) {
      await Order.create({
        user: buyer._id,
        items: productDocs.slice(0, 2).map((p, i) => ({
          product: p._id,
          name: p.name,
          quantity: i + 1,
          price: p.price,
        })),
        shippingAddress: {
          street: "123 Main St",
          city: "Mumbai",
          state: "Maharashtra",
          zipCode: "400001",
          country: "India",
        },
        totalAmount: productDocs.slice(0, 2).reduce((sum, p, i) => sum + p.price * (i + 1), 0),
        orderStatus: "PENDING",
        paymentMethod: "COD",
        isPaid: false,
        isDelivered: false,
      });
    }
    console.log("Orders created");

    // --------------------
    // Insert Admin profile
    // --------------------
    const adminUser = createdUsers.find((u) => u.roles.includes("ADMIN"));
    if (adminUser) {
      await Admin.create({
        userId: adminUser._id,
        accessLevel: "SUPER_ADMIN",
        assignedModules: ["HeritageBazaar", "DharoharTV", "Sangam", "Bhartiyam"],
      });
      console.log("Admin profile created");
    }

    console.log("✅ Database seeding completed!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

// --------------------
// Run Seeder
// --------------------
connectDB().then(seedDB);

// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";
// import User from "./models/user.model.js";
// import Seller from "./models/seller.model.js";
// import Admin from "./models/admin.model.js";
// import Product from "./models/product.model.js";
// import Cart from "./models/cart.model.js";
// import Order from "./models/order.model.js";
// import Review from "./models/review.model.js";

// // --------------------
// // Connect to MongoDB
// // --------------------
// const connectDB = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/Virasat");
//     console.log("MongoDB connected");
//   } catch (err) {
//     console.error(err);
//     process.exit(1);
//   }
// };

// // --------------------
// // Sample users
// // --------------------
// const users = [
//   {
//     firstName: "Admin",
//     lastName: "User",
//     email: "admin@example.com",
//     password: "password123",
//     roles: ["ADMIN"],
//     iSOnboarded: true,
//   },
//   {
//     firstName: "Rajesh",
//     lastName: "Kumar",
//     email: "rajesh@example.com",
//     password: "password123",
//     roles: ["SELLER"],
//     iSOnboarded: true,
//   },
//   {
//     firstName: "Sita",
//     lastName: "Devi",
//     email: "sita@example.com",
//     password: "password123",
//     roles: ["USER"],
//     iSOnboarded: true,
//   },
// ];

// // --------------------
// // Sample products
// // --------------------
// const products = [
//   {
//     name: "Handwoven Banarasi Silk Saree",
//     description: "Beautiful traditional Banarasi silk saree from Varanasi.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Banarasi_Saree.jpg/320px-Banarasi_Saree.jpg",
//         altText: "Banarasi Silk Saree",
//       },
//     ],
//     category: "Textiles",
//     price: 15000,
//     stock: 5,
//     isApproved: true,
//   },
//   {
//     name: "Madhubani Painting - Ganesha",
//     description: "Original Madhubani painting depicting Lord Ganesha.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Madhubani_Painting_Ganesha.jpg/320px-Madhubani_Painting_Ganesha.jpg",
//         altText: "Madhubani Ganesha",
//       },
//     ],
//     category: "Paintings",
//     price: 2500,
//     stock: 10,
//     isApproved: true,
//   },
//   {
//     name: "Bhagavad Gita (Sanskrit-Hindi)",
//     description: "Sanskrit-Hindi edition of the holy Bhagavad Gita.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Bhagavad_Gita.jpg/320px-Bhagavad_Gita.jpg",
//         altText: "Bhagavad Gita",
//       },
//     ],
//     category: "Books",
//     price: 800,
//     stock: 20,
//     isApproved: true,
//   },
//   {
//     name: "Kutch Embroidery Cushion Cover",
//     description: "Handmade cushion cover with traditional Kutch embroidery.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Kutch_embroidery_cushion.jpg/320px-Kutch_embroidery_cushion.jpg",
//         altText: "Kutch Embroidery Cushion",
//       },
//     ],
//     category: "Handicrafts",
//     price: 1200,
//     stock: 15,
//     isApproved: true,
//   },
//   {
//     name: "Terracotta Elephant Sculpture",
//     description: "Beautiful handcrafted terracotta elephant sculpture for home décor.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Terracotta_elephant.jpg/320px-Terracotta_elephant.jpg",
//         altText: "Terracotta Elephant",
//       },
//     ],
//     category: "Sculptures",
//     price: 1800,
//     stock: 8,
//     isApproved: true,
//   },
//   {
//     name: "Meenakari Necklace Set",
//     description: "Traditional Meenakari jewelry necklace set with earrings.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Meenakari_Necklace_Set.jpg/320px-Meenakari_Necklace_Set.jpg",
//         altText: "Meenakari Necklace",
//       },
//     ],
//     category: "Jewelry",
//     price: 5000,
//     stock: 12,
//     isApproved: true,
//   },
//   {
//     name: "Rajasthani Puppet Set",
//     description: "Handcrafted Rajasthani puppets, perfect for decoration and gifting.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Rajasthani_Puppets.jpg/320px-Rajasthani_Puppets.jpg",
//         altText: "Rajasthani Puppets",
//       },
//     ],
//     category: "Handicrafts",
//     price: 900,
//     stock: 25,
//     isApproved: true,
//   },
//   {
//     name: "Warli Painting - Tribal Art",
//     description: "Original Warli painting showcasing tribal life in Maharashtra.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Warli_Painting.jpg/320px-Warli_Painting.jpg",
//         altText: "Warli Painting",
//       },
//     ],
//     category: "Paintings",
//     price: 3000,
//     stock: 7,
//     isApproved: true,
//   },
//   {
//     name: "Yoga Handbook (English)",
//     description: "Guidebook for beginners and practitioners of Yoga.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Yoga_Handbook.jpg/320px-Yoga_Handbook.jpg",
//         altText: "Yoga Handbook",
//       },
//     ],
//     category: "Books",
//     price: 600,
//     stock: 30,
//     isApproved: true,
//   },
//   {
//     name: "Blue Pottery Vase",
//     description: "Traditional Jaipur blue pottery vase handcrafted by artisans.",
//     sellerEmail: "rajesh@example.com",
//     images: [
//       {
//         url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Blue_Pottery_Vase.jpg/320px-Blue_Pottery_Vase.jpg",
//         altText: "Blue Pottery Vase",
//       },
//     ],
//     category: "Handicrafts",
//     price: 2200,
//     stock: 10,
//     isApproved: true,
//   },
// ];

// // --------------------
// // Seed function
// // --------------------
// const seedDB = async () => {
//   try {
//     // Clear old data
//     await User.deleteMany();
//     await Seller.deleteMany();
//     await Admin.deleteMany();
//     await Product.deleteMany();
//     await Cart.deleteMany();
//     await Order.deleteMany();
//     await Review.deleteMany();
//     console.log("Old data cleared");

//     // --------------------
//     // Insert users
//     // --------------------
//     const createdUsers = await Promise.all(
//       users.map(async (u) => {
//         const hashedPassword = await bcrypt.hash(u.password, 10);
//         return User.create({ ...u, password: hashedPassword });
//       })
//     );
//     console.log("Users created");

//     // Map sellers
//     const sellers = {};
//     createdUsers.forEach((u) => {
//       if (u.roles.includes("SELLER")) sellers[u.email] = u._id;
//     });

//     // --------------------
//     // Insert seller profiles
//     // --------------------
//     for (let email in sellers) {
//       await Seller.create({
//         userId: sellers[email],
//         shopName: "Shop of " + email.split("@")[0],
//         description: "Quality handmade products",
//         verified: true,
//       });
//     }
//     console.log("Sellers created");

//     // --------------------
//     // Insert products
//     // --------------------
//     const productDocs = [];
//     for (let p of products) {
//       const sellerId = sellers[p.sellerEmail];
//       if (!sellerId) continue;
//       const product = await Product.create({
//         ...p,
//         seller: sellerId,
//       });
//       productDocs.push(product);

//       // Add product to seller
//       await Seller.updateOne({ userId: sellerId }, { $push: { products: product._id } });
//     }
//     console.log("Products created");

//     // --------------------
//     // Insert carts for buyers
//     // --------------------
//     const buyers = createdUsers.filter((u) => u.roles.includes("USER"));
//     for (let buyer of buyers) {
//       await Cart.create({
//         user: buyer._id,
//         items: productDocs.slice(0, 3).map((p, i) => ({ product: p._id, quantity: i + 1 })),
//         subTotal: productDocs
//           .slice(0, 3)
//           .reduce((sum, p, i) => sum + p.price * (i + 1), 0),
//       });
//     }
//     console.log("Carts created");

//     // --------------------
//     // Insert sample reviews
//     // --------------------
//     for (let buyer of buyers) {
//       for (let product of productDocs.slice(0, 3)) {
//         const rating = Math.floor(Math.random() * 5) + 1;
//         const review = await Review.create({
//           user: buyer._id,
//           product: product._id,
//           rating,
//           comment: "Amazing product!",
//         });
//         await Product.updateOne(
//           { _id: product._id },
//           {
//             $push: { reviews: review._id },
//             $inc: { totalRatings: 1, averageRating: rating },
//           }
//         );
//       }
//     }
//     console.log("Reviews created");

//     // --------------------
//     // Insert sample orders
//     // --------------------
//     for (let buyer of buyers) {
//       await Order.create({
//         user: buyer._id,
//         items: productDocs.slice(0, 3).map((p, i) => ({
//           product: p._id,
//           name: p.name,
//           quantity: i + 1,
//           price: p.price,
//         })),
//         shippingAddress: {
//           street: "123 Main St",
//           city: "Mumbai",
//           state: "Maharashtra",
//           zipCode: "400001",
//           country: "India",
//         },
//         totalAmount: productDocs
//           .slice(0, 3)
//           .reduce((sum, p, i) => sum + p.price * (i + 1), 0),
//         orderStatus: "PENDING",
//         paymentMethod: "COD",
//         isPaid: false,
//         isDelivered: false,
//       });
//     }
//     console.log("Orders created");

//     // --------------------
//     // Insert Admin profile
//     // --------------------
//     const adminUser = createdUsers.find((u) => u.roles.includes("ADMIN"));
//     if (adminUser) {
//       await Admin.create({
//         userId: adminUser._id,
//         accessLevel: "SUPER_ADMIN",
//         assignedModules: ["HeritageBazaar", "DharoharTV", "Sangam", "Bhartiyam"],
//       });
//       console.log("Admin profile created");
//     }

//     console.log("✅ Database seeding completed!");
//     process.exit();
//   } catch (error) {
//     console.error("Seeding error:", error);
//     process.exit(1);
//   }
// };

// // --------------------
// // Run Seeder
// // --------------------
// connectDB().then(seedDB);
