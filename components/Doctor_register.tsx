"use client"
import { Form, Input, Button, Select } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PictureOutlined } from "@ant-design/icons";
import axios from "axios";
import { API_BASE_URL } from "@/utils/api";
import { toast } from "react-toastify";


const { Option } = Select;

interface DoctorFormValues {
    name: string;
    email: string;
    password: string;
    specialization: string;
    photo_url?: string;
}

const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology"
];

export default function DoctorRegister() {

    const [form] = Form.useForm<DoctorFormValues>();
    //register the doctor
    const onFinish = async (values: DoctorFormValues) => {
        // console.log("Doctor Registered:", values);
        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/register/doctor`,
                values
            );
            if (response.status === 201) {
                toast.success("Doctor registered successfully!");
                console.log("Registration Response:", response.data);
                form.resetFields();
            }
        } catch (error: any) {
            // console.error("Registration Error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Registration failed. Please try again.");
            }
        }
    };
    return (
        <div>

            <h2 className="text-2xl font-semibold mb-6 text-center">Doctor Registration</h2>
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

                {/* Specialization */}
                <Form.Item
                    label="Specialization"
                    name="specialization"
                    rules={[{ required: true, message: "Please select specialization" }]}
                >
                    <Select placeholder="Select specialization">
                        {specializations.map((spec) => (
                            <Option key={spec} value={spec}>
                                {spec}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                {/* Photo URL  */}
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
