import { createFileRoute } from '@tanstack/react-router';
import { AuthScreen } from '@/components/thump/auth-screen';
import { pageHead } from '@/lib/thump/data';
export const Route=createFileRoute('/login')({head:()=>pageHead('Client login','THUMP client account access and maintenance support.'),component:()=> <AuthScreen mode="login"/>});
