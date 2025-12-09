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
