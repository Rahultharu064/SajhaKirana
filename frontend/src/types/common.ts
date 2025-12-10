export interface User{
    id:number;
    name:string;
    email:string;
    role:'customer' | 'admin' | "courier";
    phone?:string;
    address?:string;
    profileImage?:string;
    lastLogin?:Date;
    createdAt:Date;
    updatedAt:Date;
    isActive:boolean;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface AddressData {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    district: string;
    landmark: string;
}

export interface DeliveryOption {
    id: string;
    name: string;
    description: string;
    price: number;
    estimatedDays: string;
}

export interface PaymentMethodData {
    type: "cod" | "esewa" | "khalti" | "card";
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
}
