"use client"
import { RootState } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { Stethoscope } from 'lucide-react';
import { Button } from "antd";
import { logout } from "@/lib/features/login/authSlice";


export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role !== "DOCTOR") {
        router.push("/");
        //setUserLoading(false);
      }
      if (user.role === "DOCTOR") {
        setUserLoading(false);
      }
    } else {
      router.push("/login");
      //setUserLoading(false);
    }
  }, [isAuthenticated, user, router]);

  if (userLoading) return <div className="text-center pt-50">Loading...</div>;

  return (
    <div className="w-11/12 mx-auto">
      {/* Navigation */}
      <nav className="w-full mx-auto py-4">
        <div className="w-full mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 ">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-xl font-bold ">DocTime</h1>
              <p className="text-xs ">Healthcare Management</p>
            </div>
          </div>
          
          
          <div className="flex items-center gap-3 ">
            <Button type="primary" onClick={() => dispatch(logout())}>Log Out</Button>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-center text-green-700 bg-green-600/10 mt-4 py-2 border-y border-green-600">Doctor Dashboard</h1>
      </nav>
      <div className="w-full ">
        {children}
      </div>
      
    </div>
  );
}