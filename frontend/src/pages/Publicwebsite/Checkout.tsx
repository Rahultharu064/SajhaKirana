import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, MapPin, Truck, CreditCard, Package } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import AddressForm from "../../components/checkout/AddressForm.tsx";
import DeliveryOptions from "../../components/checkout/DeliveryOptions.tsx";
import PaymentMethod from "../../components/checkout/PaymentMethod.tsx";
import OrderConfirmation from "../../components/checkout/OrderConfirmation.tsx";
import OrderSummary from "../../components/checkout/OrderSummary.tsx";
import { clearCart } from "../../Redux/slices/cartSlice";
import { orderService } from "../../services/orderService";
import type { AddressData, DeliveryOption, PaymentMethodData } from "../../types/common";

const steps = [
  { id: 1, name: "Address", icon: MapPin },
  { id: 2, name: "Delivery", icon: Truck },
  { id: 3, name: "Payment", icon: CreditCard },
  { id: 4, name: "Confirm", icon: Package },
];

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [delivery, setDelivery] = useState<DeliveryOption | null>(null);
  const [payment, setPayment] = useState<PaymentMethodData | null>(null);
  const [loading, setLoading] = useState(false);

  // Redux hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const { items: cartItems } = useSelector((state: any) => state.cart);

  const handleAddressSubmit = (data: AddressData) => {
    setAddress(data);
    setCurrentStep(2);
  };

  const handleDeliverySubmit = (option: DeliveryOption) => {
    setDelivery(option);
    setCurrentStep(3);
  };

  const handlePaymentSubmit = (method: PaymentMethodData) => {
    setPayment(method);
    setCurrentStep(4);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePlaceOrder = async () => {
    // Check authentication
    if (!isAuthenticated || !user?.userId) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }

    // Check if all data is present
    if (!address || !delivery || !payment || cartItems.length === 0) {
      toast.error("Please complete all checkout steps");
      return;
    }

    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        userId: Number(user.userId),
        shippingAddress: address,
        paymentMethod: payment.type === "card" ? "cod" : payment.type, // Map card to cod for now
        items: cartItems.map((item: any) => ({
          sku: item.sku,
          qty: Number(item.quantity),
          price: Number(item.price),
        })),
      };

      console.log("Placing order... Payload:", JSON.stringify(orderData, null, 2));

      // Submit order
      const response = await orderService.createOrder({
        ...orderData,
        paymentMethod: orderData.paymentMethod as "cod" | "esewa" | "khalti"
      });

      if (response.data.success) {
        const orderId = response.data.data.orderId;

        console.log("🔍 Full response structure:", JSON.stringify(response.data, null, 2));
        console.log("📋 Payment type selected:", payment.type);

        // Clear cart
        dispatch(clearCart());

        // Handle payment methods
        if (payment.type === "cod") {
          toast.success("Order placed successfully!");
          navigate(`/order/confirmation/${orderId}`);
        } else if (payment.type === "esewa") {
          // Redirect to eSewa payment page
          alert(`DEBUG: eSewa URL=${response.data.data?.esewaURL}`);
          if (response.data.data?.esewaURL && response.data.data.esewaURL.trim() !== '') {
            alert(`Redirecting to eSewa: ${response.data.data.esewaURL}`);
            window.location.href = response.data.data.esewaURL;
          } else {
            alert("eSewa URL not found, falling back to order confirmation");
            toast.success("Order placed! Payment will be initiated manually.");
            navigate(`/order/confirmation/${orderId}`);
          }
        } else if (payment.type === "khalti") {
          // Redirect to Khalti payment page
          alert(`DEBUG: Khalti URL=${response.data.data?.paymentUrl}`);
          if (response.data.data?.paymentUrl && response.data.data.paymentUrl.trim() !== '') {
            alert(`Redirecting to Khalti: ${response.data.data.paymentUrl}`);
            window.location.href = response.data.data.paymentUrl;
          } else {
            alert("Khalti URL not found, falling back to order confirmation");
            toast.success("Order placed! Payment will be initiated manually.");
            navigate(`/order/confirmation/${orderId}`);
          }
        } else {
          // For card, treat as COD for now
          toast.success("Order placed successfully!");
          navigate(`/order/confirmation/${orderId}`);
        }
      } else {
        throw new Error(response.data.error?.message || "Failed to place order");
      }
    } catch (error: any) {
      console.error("Order placement failed:", error);

      const errorMessage = error.response?.data?.message || error.message || "Failed to place order";
      const validationErrors = error.response?.data?.errors;

      if (validationErrors && Array.isArray(validationErrors) && validationErrors.length > 0) {
        // Construct a more detailed error message from validation errors
        const details = validationErrors.map((err: any) => `${err.field}: ${err.message}`).join("\n");
        console.error("Validation Errors:", details);
        toast.error(`${errorMessage}\n${details}`, { duration: 6000 });
      } else {
        console.error("Full Error Response:", JSON.stringify(error.response?.data, null, 2));
        toast.error(
          error.response?.data?.error?.message ||
          error.response?.data?.message ||
          errorMessage
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background py-8">
        <div className="container max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your order in a few simple steps
            </p>
          </motion.div>

          {/* Stepper */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-center gap-2 md:gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center
                        transition-all duration-300 font-medium text-sm
                        ${currentStep > step.id
                          ? "bg-primary text-primary-foreground shadow-glow"
                          : currentStep === step.id
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {currentStep > step.id ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`
                        hidden md:block mt-2 text-sm font-medium
                        ${currentStep >= step.id ? "text-foreground" : "text-muted-foreground"}
                      `}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`
                        w-8 md:w-16 h-0.5 mx-2 transition-colors duration-300
                        ${currentStep > step.id ? "bg-primary" : "bg-border"}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Forms */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div
                    key="address"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <AddressForm
                      initialData={address}
                      onSubmit={handleAddressSubmit}
                    />
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DeliveryOptions
                      selectedOption={delivery}
                      onSubmit={handleDeliverySubmit}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaymentMethod
                      selectedMethod={payment}
                      onSubmit={handlePaymentSubmit}
                      onBack={handleBack}
                    />
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    key="confirmation"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <OrderConfirmation
                      address={address!}
                      delivery={delivery!}
                      payment={payment!}
                      onPlaceOrder={handlePlaceOrder}
                      onBack={handleBack}
                      loading={loading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary deliveryPrice={delivery?.price || 0} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
