"use client"
import { Form, Input, Button} from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PictureOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { toast } from "react-toastify";

interface PatientFormValues {
    name: string;
    email: string;
    password: string;
    photo_url?: string;
}

export default function PatientRegister() {
    const [form] = Form.useForm<PatientFormValues>();
    //register the patient
    const onFinish = async (values: PatientFormValues) => {
        //console.log("Patient Registered:", values);
        try{
            const response =await axios.post(`${API_BASE_URL}/auth/register/patient`, values);
            if(response.status === 201){
                toast.success("Patient registered successfully!");
                form.resetFields();
            }
        }catch(error: any ){
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        }
    };
    return (
        <div className="space-y-40">
            <h2 className="text-2xl font-semibold mb-6 text-center">Patient Registration</h2>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={{ specialization: "" }}
            >
                {/* Name */}
                <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter your name" }]}
                >
                    <Input prefix={<UserOutlined />} placeholder="Enter full name" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please enter your email" },
                        { type: "email", message: "Enter a valid email" },
                    ]}
                >
                    <Input prefix={<MailOutlined />} placeholder="Enter email" />
                </Form.Item>

                {/* Password */}
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please enter your password" },
                        { min: 6, message: "Password must be at least 6 characters" },
                    ]}
                >
                    <Input.Password prefix={<LockOutlined />} placeholder="Enter password" />
                </Form.Item>

                {/* Photo URL (Optional) */}
                <Form.Item label="Photo URL" name="photo_url">
                    <Input prefix={<PictureOutlined />} placeholder="Enter photo URL (optional)" />
                </Form.Item>

                {/* Submit Button */}
                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Register
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
