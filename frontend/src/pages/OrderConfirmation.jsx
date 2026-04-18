import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/api';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await API.get(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Order Confirmed</h1>
        <p className="text-lg">Your order #{order._id} has been placed successfully!</p>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-4">
              <div>
                <p className="font-medium">{item.productId.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} × ₹{item.price}
                  {item.size && ` • Size: ${item.size}`}
                  {item.color && ` • Color: ${item.color}`}
                </p>
              </div>
              <p>₹{item.quantity * item.price}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>₹{order.total}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>GST (18%)</span>
            <span>₹{(order.total * 0.18).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
            <span>Total</span>
            <span>₹{(order.total * 1.18).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <p>{order.shippingAddress.name}</p>
          <p>{order.shippingAddress.address}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
          </p>
          <p className="mt-2">{order.shippingAddress.email}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <p className="capitalize">
            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 
             order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI Payment'}
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Order Status: <span className="capitalize">{order.status}</span>
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <a 
          href="/orders"
          className="inline-block bg-black text-white py-3 px-6 rounded hover:bg-gray-800 transition"
        >
          View My Orders
        </a>
      </div>
    </div>
  );
}