import { createFileRoute } from '@tanstack/react-router';
import { AuthScreen } from '@/components/thump/auth-screen';
import { pageHead } from '@/lib/thump/data';
export const Route=createFileRoute('/forgot-password')({head:()=>pageHead('Forgot password','THUMP client account access and maintenance support.'),component:()=> <AuthScreen mode="forgot"/>});
