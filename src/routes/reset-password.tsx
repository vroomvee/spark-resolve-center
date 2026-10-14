import { createFileRoute } from '@tanstack/react-router';
import { AuthScreen } from '@/components/thump/auth-screen';
import { pageHead } from '@/lib/thump/data';
export const Route=createFileRoute('/reset-password')({head:()=>pageHead('Reset password','THUMP client account access and maintenance support.'),component:()=> <AuthScreen mode="reset"/>});
