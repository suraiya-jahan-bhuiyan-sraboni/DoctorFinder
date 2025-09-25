"use client"
import { RootState } from "@/lib/store";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipboardClock, Stethoscope, UserSearch } from 'lucide-react';
import { Button } from "antd";
import { logout } from "@/lib/features/login/authSlice";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role !== "PATIENT") {
       // console.log("user role not patient, redirecting to home");
        router.push("/");
      }
      if (user.role === "PATIENT") {
        setUserLoading(false);
      }
    } else {
      router.push("/login");
      //setUserLoading(false);
    }
  }, [isAuthenticated, user]);

  if (userLoading) return <div className="text-center pt-50">Loading...</div>;
  return (
    <div className="w-11/12 mx-auto">
      {/* Navigation */}
      <nav className="w-full mx-auto py-4">
        <div className="w-full mx-auto flex items-center justify-between  gap-4">
          <div className="flex items-center gap-3 ">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h1 className="sm:text-xl font-bold ">DocTime</h1>
              <p className="text-xs ">Healthcare Management</p>
            </div>
          </div>
          <div className="flex items-center gap-6  font-medium">
            <UserSearch className="w-4 sm:w-16" onClick={()=>router.push("/dashboard/patient/doctors")}/>
            <ClipboardClock className="w-4 sm:w-16" onClick={()=>router.push("/dashboard/patient/appointments")}/>
          </div>

          <div className="flex items-center gap-3 ">
            <Button type="primary" onClick={() => dispatch(logout())}>Log Out</Button>
          </div>
        </div>
      </nav>
      <div className="w-full ">
        {children}
      </div>

    </div>
  );
}