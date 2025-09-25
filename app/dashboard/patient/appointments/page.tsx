"use client";

import { useState } from "react";
import {
  useGetAllDoctorAppointmentListsQuery,
  useUpdateAppointmentStatusMutation,
} from "@/lib/services/patient/doctors.appointment.lists";
import { Table, Tag, Button, Popconfirm, Select, Spin, Empty } from "antd";
import { toast } from "react-toastify";

const { Option } = Select;

export default function AppointmentList() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useGetAllDoctorAppointmentListsQuery({
    status: statusFilter,
    page,
  },
   { refetchOnMountOrArgChange: true }
);
  
  const [updateAppointmentStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  const handleCancel = async (id: string) => {
    try {
      await updateAppointmentStatus({
        appointment_id: id,
        status: "CANCELLED",
      }).unwrap();
      refetch();
      toast.success("Appointment cancelled successfully!");
    } catch  {
      toast.error("Failed to cancel appointment!");
    }
  };

  const columns = [
    {
      title: "Doctor",
      dataIndex: ["doctor", "name"],
      key: "doctor",
    },
    {
      title: "Specialization",
      dataIndex: ["doctor", "specialization"],
      key: "specialization",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "PENDING"
            ? "blue"
            : status === "COMPLETED"
              ? "green"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (record: any) =>
        record.status === "PENDING" ? (
          <Popconfirm
            title="Cancel appointment"
            description="Are you sure you want to cancel this appointment?"
            onConfirm={() => handleCancel(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={isUpdating}>
              Cancel
            </Button>
          </Popconfirm>
        ) : (
          <Tag color="default">No Action</Tag>
        ),
    },
  ];
  if (isLoading) return <div className="flex justify-center"><Spin size="large" /></div>;
  if (isError) return <p className="text-center flex flex-col justify-center gap-4"><Empty /> Failed to load appointments</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">My Appointments</h1>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <Select
          placeholder="Filter by Status"
          allowClear
          onChange={(value) => {
            setStatusFilter(value);
            setPage(1);
          }}
          style={{ width: 200 }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>
      </div>


      {/* Appointments Table */}

      <Table
        className="overflow-x-auto"
        rowKey="id"
        columns={columns}
        dataSource={data?.data || []}
        pagination={{
          current: page,
          pageSize: data?.limit,
          total: data?.total,
          onChange: (p) => setPage(p),
        }}
      />
    </div>
  );
}
