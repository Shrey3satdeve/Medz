// Admin Controller - Dashboard Analytics and Data Management

// Mock database - In production, replace with actual Supabase queries
let mockCustomers = [
    {
        id: 1,
        name: 'Rahul Kumar',
        email: 'rahul@example.com',
        phone: '+91 9876543210',
        totalOrders: 5,
        totalSpent: 12500,
        createdAt: '2025-01-15T10:30:00Z'
    },
    {
        id: 2,
        name: 'Priya Sharma',
        email: 'priya@example.com',
        phone: '+91 9876543211',
        totalOrders: 3,
        totalSpent: 8900,
        createdAt: '2025-02-20T14:20:00Z'
    },
    {
        id: 3,
        name: 'Amit Patel',
        email: 'amit@example.com',
        phone: '+91 9876543212',
        totalOrders: 7,
        totalSpent: 15600,
        createdAt: '2024-12-10T09:15:00Z'
    }
];

let mockOrders = [
    {
        id: 'ORD001',
        customerId: 1,
        customerName: 'Rahul Kumar',
        type: 'Lab Test',
        items: 2,
        amount: 2500,
        status: 'completed',
        date: '2025-12-14T10:30:00Z'
    },
    {
        id: 'ORD002',
        customerId: 2,
        customerName: 'Priya Sharma',
        type: 'Pharma',
        items: 5,
        amount: 1200,
        status: 'pending',
        date: '2025-12-15T08:15:00Z'
    },
    {
        id: 'ORD003',
        customerId: 3,
        customerName: 'Amit Patel',
        type: 'Pet Products',
        items: 3,
        amount: 3500,
        status: 'completed',
        date: '2025-12-13T16:45:00Z'
    }
];

let mockLabTests = [
    {
        name: 'Complete Blood Count (CBC)',
        category: 'Blood Test',
        ordersCount: 45,
        revenue: 22500,
        price: 500
    },
    {
        name: 'Thyroid Profile',
        category: 'Blood Test',
        ordersCount: 32,
        revenue: 28800,
        price: 900
    },
    {
        name: 'Full Body Checkup',
        category: 'Health Checkup',
        ordersCount: 28,
        revenue: 56000,
        price: 2000
    },
    {
        name: 'Lipid Profile',
        category: 'Blood Test',
        ordersCount: 38,
        revenue: 19000,
        price: 500
    },
    {
        name: 'Vitamin D Test',
        category: 'Blood Test',
        ordersCount: 25,
        revenue: 20000,
        price: 800
    }
];

let mockPharmaProducts = [
    {
        name: 'Paracetamol 500mg',
        category: 'Pain Relief',
        unitsSold: 150,
        revenue: 1500,
        stock: 500
    },
    {
        name: 'Vitamin C Tablets',
        category: 'Supplements',
        unitsSold: 85,
        revenue: 4250,
        stock: 200
    },
    {
        name: 'Cetrizine 10mg',
        category: 'Allergy',
        unitsSold: 120,
        revenue: 1800,
        stock: 150
    },
    {
        name: 'Amoxicillin 500mg',
        category: 'Antibiotics',
        unitsSold: 65,
        revenue: 3250,
        stock: 8
    },
    {
        name: 'Omeprazole 20mg',
        category: 'Digestive',
        unitsSold: 95,
        revenue: 2850,
        stock: 180
    }
];

let mockPetProducts = [
    {
        name: 'Royal Canin Dog Food 10kg',
        category: 'Dog Food',
        unitsSold: 45,
        revenue: 90000,
        stock: 25
    },
    {
        name: 'Pedigree Puppy Food 3kg',
        category: 'Dog Food',
        unitsSold: 68,
        revenue: 40800,
        stock: 50
    },
    {
        name: 'Dog Chew Toys Set',
        category: 'Dog Toys',
        unitsSold: 92,
        revenue: 23000,
        stock: 120
    },
    {
        name: 'Pet Shampoo & Conditioner',
        category: 'Grooming',
        unitsSold: 55,
        revenue: 16500,
        stock: 80
    },
    {
        name: 'Dog Calcium Supplements',
        category: 'Supplements',
        unitsSold: 38,
        revenue: 19000,
        stock: 5
    }
];

// Get Dashboard Overview
exports.getDashboard = async (req, res) => {
    try {
        // Calculate statistics
        const totalCustomers = mockCustomers.length;
        const totalOrders = mockOrders.length;
        const totalLabTests = mockLabTests.reduce((sum, test) => sum + test.ordersCount, 0);
        const totalRevenue = mockOrders.reduce((sum, order) => sum + order.amount, 0) +
                           mockLabTests.reduce((sum, test) => sum + test.revenue, 0) +
                           mockPharmaProducts.reduce((sum, prod) => sum + prod.revenue, 0) +
                           mockPetProducts.reduce((sum, prod) => sum + prod.revenue, 0);

        // Get recent orders (last 10)
        const recentOrders = mockOrders.slice(-10).reverse();

        res.json({
            success: true,
            data: {
                totalCustomers,
                totalOrders,
                totalLabTests,
                totalRevenue,
                recentOrders
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard data'
        });
    }
};

// Get All Customers
exports.getCustomers = async (req, res) => {
    try {
        res.json({
            success: true,
            customers: mockCustomers
        });
    } catch (error) {
        console.error('Customers error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch customers'
        });
    }
};

// Get All Orders
exports.getOrders = async (req, res) => {
    try {
        res.json({
            success: true,
            orders: mockOrders
        });
    } catch (error) {
        console.error('Orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders'
        });
    }
};

// Get Lab Tests Analytics
exports.getLabTests = async (req, res) => {
    try {
        // Calculate category-wise statistics
        const stats = {
            bloodTests: mockLabTests.filter(t => t.category === 'Blood Test')
                .reduce((sum, t) => sum + t.ordersCount, 0),
            healthCheckups: mockLabTests.filter(t => t.category === 'Health Checkup')
                .reduce((sum, t) => sum + t.ordersCount, 0),
            geneticTests: mockLabTests.filter(t => t.category === 'Genetic Test')
                .reduce((sum, t) => sum + t.ordersCount, 0),
            imagingTests: mockLabTests.filter(t => t.category === 'Imaging')
                .reduce((sum, t) => sum + t.ordersCount, 0)
        };

        res.json({
            success: true,
            stats,
            tests: mockLabTests
        });
    } catch (error) {
        console.error('Lab tests error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch lab tests'
        });
    }
};

// Get Pharma Products Analytics
exports.getPharmaProducts = async (req, res) => {
    try {
        res.json({
            success: true,
            products: mockPharmaProducts
        });
    } catch (error) {
        console.error('Pharma products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pharma products'
        });
    }
};

// Get Pet Products Analytics
exports.getPetProducts = async (req, res) => {
    try {
        res.json({
            success: true,
            products: mockPetProducts
        });
    } catch (error) {
        console.error('Pet products error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pet products'
        });
    }
};

// Add New Order (for testing)
exports.addOrder = async (req, res) => {
    try {
        const { customerId, customerName, type, items, amount } = req.body;
        
        const newOrder = {
            id: `ORD${String(mockOrders.length + 1).padStart(3, '0')}`,
            customerId,
            customerName,
            type,
            items,
            amount,
            status: 'pending',
            date: new Date().toISOString()
        };

        mockOrders.push(newOrder);

        res.json({
            success: true,
            message: 'Order added successfully',
            order: newOrder
        });
    } catch (error) {
        console.error('Add order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add order'
        });
    }
};

// Update Order Status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const orderIndex = mockOrders.findIndex(o => o.id === orderId);
        
        if (orderIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        mockOrders[orderIndex].status = status;

        res.json({
            success: true,
            message: 'Order status updated',
            order: mockOrders[orderIndex]
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
};
