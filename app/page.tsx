"use client"
import { increment, decrement, incrementByAmount } from "@/lib/features/counter/counterSlice";
import { RootState } from "@/lib/store";
import { Button, Card } from "antd";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "@/lib/features/login/authSlice";
import Link from "next/link";
import { ArrowRight, Calendar, Shield, Star, Stethoscope, Users } from 'lucide-react';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch();
  const count = useSelector((state: RootState) => state.counter.value);
  const [userLoading, setUserLoading] = useState(true);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "PATIENT") {
       // console.log("user role patient, redirecting to patient dashboard");
        router.push("/dashboard/patient/doctors");
      } else {
       // console.log("user role doctor, redirecting to doctor dashboard");
        router.push("/dashboard/doctor/appointments");
      }
    } else {
      setUserLoading(false)
    }
  }, [isAuthenticated, user, router]);
  return (
    <div className="min-h-screen">
      {userLoading ?
        (<p className="text-center py-50">Loading...</p>)
        : (
          <div>
            {/* Navigation */}
            <nav className="w-11/12 mx-auto px-6 py-4">
              <div className="max-w-7xl mx-auto flex items-end justify-between flex-wrap gap-4">
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
                  <Link href="/login">
                    <Button >Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button>Get Started</Button>
                  </Link>
                </div>
              </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6">
              {/* Hero Section */}
              <div className="text-center py-20">
                <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center mb-8">
                  <Stethoscope className="h-20 w-20" />
                </div>
                <h1 className="text-5xl font-bold  mb-6 leading-tight">
                  Modern Healthcare
                  <br />
                  <span className="">
                    Appointment Management
                  </span>
                </h1>
                <p className="text-xl  mb-8 max-w-2xl mx-auto leading-relaxed">
                  Connect patients with healthcare providers through our intuitive appointment booking system.
                  Streamline your medical practice with our comprehensive management platform.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/register">
                    <Button className="gap-2 h-12 px-8">
                      Book Your First Appointment
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button className="h-12 px-8">
                      Sign In to Your Account
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Features Section */}
              <div className="py-20">
                <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold  mb-4">
                    Everything You Need for Healthcare Management
                  </h2>
                  <p className="text-lg  max-w-2xl mx-auto">
                    Our platform provides comprehensive tools for both patients and healthcare providers
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Patient Features */}
                  <Card className="">
                    <div className="flex flex-col justify-center items-center text-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Calendar className="h-6 w-6" />
                      </div>
                      <div className="font-semibold text-xl">Easy Appointment Booking</div>
                      <div className="text-sm  ">
                        Find and book appointments with qualified doctors in just a few clicks
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center pt-5 text-center">
                      <ul className="space-y-2 text-sm  text-center">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Search doctors by name or specialization
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Real-time appointment scheduling
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Manage your appointment history
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="">
                    <div className="flex flex-col justify-center items-center text-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Users className="h-6 w-6 " />
                      </div>
                      <div className="font-semibold text-xl">Doctor Management</div>
                      <div className="text-sm  ">
                        Comprehensive tools for healthcare providers to manage their practice
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center pt-5 text-center">
                      <ul className="space-y-2 text-sm ">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          View and manage all appointments
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Update appointment statuses
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Filter by date and status
                        </li>
                      </ul>
                    </div>
                  </Card>

                  <Card className="">
                    <div className="flex flex-col justify-center items-center text-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                        <Shield className="h-6 w-6 " />
                      </div>
                      <div className="font-semibold text-xl">Secure & Reliable</div>
                      <div className="text-sm  ">
                        Your health data is protected with enterprise-grade security
                      </div>
                    </div>
                    <div className="flex flex-col justify-center items-center pt-5 text-center">
                      <ul className="space-y-2 text-sm ">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          HIPAA compliant platform
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Encrypted data transmission
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-600 rounded-full"></div>
                          Role-based access control
                        </li>
                      </ul>
                    </div>
                  </Card>
                </div>
              </div>

              {/* CTA Section */}
              <div className="py-20 text-center">
                <div className="rounded-3xl p-12 ">
                  <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
                  <p className="text-xl mb-8 max-w-2xl mx-auto">
                    Join thousands of patients and healthcare providers using DocTime to manage their healthcare needs
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button className="gap-2 h-12 px-8">
                        Create Account
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button className="h-12 px-8">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="border-t py-8">
              <div className="max-w-7xl mx-auto px-6 text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <span className="font-semibold ">DocTime</span>
                </div>
                <p className="text-sm ">
                  © 2024 DocTime. Modern healthcare appointment management system.
                </p>
              </div>
            </footer></div>)}
    </div>
  );
}
