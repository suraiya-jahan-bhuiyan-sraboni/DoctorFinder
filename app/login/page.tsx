"use client";

import { Card, Form, Input, Button, Radio, Typography, message, Divider } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { loginStart, loginSuccess, loginFailure } from "@/lib/features/login/authSlice";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import Link from "next/link";


const { Title, Text } = Typography;


interface LoginFormValues {
  email: string;
  password: string;
  role: string;
}

export default function Login() {
  const router = useRouter();
  const dispatch = useDispatch()
  const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [userLoading, setUserLoading] = useState(true);
  //console.log(isAuthenticated, user);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "PATIENT") router.push("/dashboard/patient/doctors");
      else router.push("/dashboard/doctor/appointments");
    } else {
      setUserLoading(false)
    }
  }, [isAuthenticated, user, router]);

  const [form] = Form.useForm<LoginFormValues>();
  const onFinish = async (values: LoginFormValues) => {
    dispatch(loginStart());
    //console.log("Login Form Values:", values);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, values);
      // console.log(response.data)
      dispatch(loginSuccess({ user: response.data.data.user, token: response.data.data.token }));
      if (response.data.data.user.role === "PATIENT") {
        router.push("/dashboard/patient/doctors");
      } else {
        router.push("/dashboard/doctor/appointments");
      }
    } catch (error: any) {
     // console.error("Login error:", error);
      toast.error("Login failed!");
      dispatch(loginFailure(error.response.data.message));
    }

  };
  return (
    <div className="w-11/12 mx-auto py-20 min-h-screen my-auto flex justify-center items-center">
      {userLoading ?
        (<p>Loading...</p>)
        :
        (<Card className="w-full max-w-md">
          <div className="text-center mb-6">
            <Title level={3}>Login</Title>
            <Text type="secondary">Use your credentials</Text>
          </div>


          <Form form={form} layout="vertical" initialValues={{ role: "DOCTOR" }} onFinish={onFinish}>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: "Enter email" }, { type: "email" }]}>
              <Input prefix={<MailOutlined />} />
            </Form.Item>


            <Form.Item name="password" label="Password" rules={[{ required: true, message: "Enter password" }]}>
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <div className="text-end"><Link href="/forgot-password" className="text-end">Forgot Password?</Link></div>



            <Form.Item name="role" label="Login as">
              <Radio.Group>
                <Radio.Button value="DOCTOR">Doctor</Radio.Button>
                <Radio.Button value="PATIENT">Patient</Radio.Button>
              </Radio.Group>
            </Form.Item>


            <Button type="primary" htmlType="submit" block size="large" disabled={loading} >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </Form>
          {error && <p className="text-red-500">{error}</p>}
          <div className="text-center mt-4 flex flex-col">
            <Link href="/register">Don't have an account? Sign Up</Link>
            or
            <Divider/>

            <Link href="/">Back To Home</Link>
          </div>
        </Card>)}
    </div>
  );
}
