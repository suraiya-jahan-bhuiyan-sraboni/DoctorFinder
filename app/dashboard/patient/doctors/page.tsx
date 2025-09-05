"use client";

import { useState } from "react";
import { Card, Input, Select, Button, Pagination, Modal, DatePicker, Spin, Avatar, Tag, Empty } from "antd";
import { useGetDoctorsQuery } from "@/lib/services/patient/doctor.api";
import { UserOutlined, MailOutlined, } from "@ant-design/icons";
import { useCreateAppointmentMutation } from "@/lib/services/patient/book.appointment.api";
import { toast } from "react-toastify";
import { StethoscopeIcon } from "lucide-react";

const { Option } = Select;

export default function DoctorList() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [date, setDate] = useState<string>("");
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

  const { data, isLoading, isError } = useGetDoctorsQuery({ page, limit: pageSize, search, specialization });
  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();

  const handleBook = async () => {
    if (!selectedDoctor || !date) {
      return toast.warning("Please select a date before booking");
    }
    try {
      await createAppointment({ doctorId: selectedDoctor.id, date }).unwrap();
      toast.success("Appointment created successfully!");
      setSelectedDoctor(null);
      setDate("");
    } catch (error: any) {
     // console.log(error)
      toast.error(error.data.message || "Failed to create appointment");
    }
  };

  if (isLoading) return <div className="text-center pt-50"><Spin size="large" /></div>;
  if (isError) return <p className="text-center flex flex-col justify-center gap-4"><Empty /> Failed to load doctors</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Find a Doctor</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search by doctor name"
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          style={{ width: 200 }}
        />

        <Select
          placeholder="Filter by specialization"
          allowClear
          onChange={(value) => {
            setSpecialization(value || "");
            setPage(1);
          }}
          style={{ width: 200 }}
        >
          {specializations.map((spec) => (
            <Option key={spec} value={spec}>
              {spec}
            </Option>
          ))}
        </Select>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr gap-6">
        {data?.data?.map((doctor: any) => (
          <Card
            key={doctor.id}
            className="shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-xl "
            cover={
              <div className="w-full h-40 flex flex-col justify-center items-center pt-6 text-center">
                <Avatar
                  size={96}
                  src={
                    typeof doctor?.photo_url === "string" &&
                      doctor.photo_url.trim() !== "" &&
                      /^(https?:\/\/|\/)/.test(doctor.photo_url)
                      ? doctor.photo_url
                      : undefined
                  }
                  icon={<UserOutlined />}
                />
              </div>
            }
            actions={[
              <Button
                type="primary"
                block
                size="large"
                onClick={() => setSelectedDoctor(doctor)}
                key="book"
              >
                Book Appointment
              </Button>
            ]}
          >
            <div className="flex flex-col items-center text-center">
              <h2 className="text-lg font-semibold mb-1 flex items-center justify-center gap-2 flex-nowrap">
                <StethoscopeIcon /> {doctor.name}
              </h2>
              <Tag color="blue" className="mb-2">{doctor.specialization}</Tag>
              <div className="flex items-center justify-center gap-2 mt-3 text-gray-600 flex-wrap">
                <MailOutlined /> <span>{doctor.email}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center">
        <Pagination
          current={page}
          total={data?.total}
          pageSize={pageSize}
          onChange={(p) => setPage(p)}
          showQuickJumper
          showSizeChanger
          onShowSizeChange={(current, size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>

      {/* Booking Modal */}
      <Modal
        open={!!selectedDoctor}
        title={`Book Appointment with ${selectedDoctor?.name}`}
        onCancel={() => setSelectedDoctor(null)}
        onOk={handleBook}
        confirmLoading={isBooking}
      >
        <DatePicker
          style={{ width: "100%" }}
          onChange={(dateObj) => setDate(dateObj?.format("YYYY-MM-DD") || "")}
        />
      </Modal>
    </div>
  );
}

