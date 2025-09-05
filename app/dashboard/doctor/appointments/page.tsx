"use client";

import { useState } from "react";
import { Table, Tag, Select, DatePicker, Spin, Modal, Empty } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useGetAllPatientAppointmentListsQuery,
  PatientAppointment,
  useUpdateAppointmentStatusMutation,
} from "@/lib/services/doctor/patients.appointment.lists";
import { toast } from "react-toastify";

const { Option } = Select;


export default function AppointmentList() {
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useGetAllPatientAppointmentListsQuery({
    status,
    date,
    page
  });
  //console.log(data?.data)


  const [updateStatus, { isLoading: isUpdating }] = useUpdateAppointmentStatusMutation();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    id: string;
    newStatus: "COMPLETED" | "CANCELLED";
  } | null>(null);

  // Open modal and set selected appointment
  const handleStatusChange = (appointmentId: string, newStatus: "COMPLETED" | "CANCELLED") => {
    setSelectedAppointment({ id: appointmentId, newStatus });
    setModalOpen(true);
  };

  // Confirm modal action
  const handleModalOk = async () => {
    if (!selectedAppointment) return;
    try {
      await updateStatus({
        appointment_id: selectedAppointment.id,
        status: selectedAppointment.newStatus,
      }).unwrap();
      toast.success(`Appointment Status Updated!`);
    } catch (err) {
      toast.error("Failed to update status");
    }
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  // Cancel modal action
  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedAppointment(null);
  };

  const columns: ColumnsType<PatientAppointment> = [
    {
      title: "Patient Name",
      dataIndex: ["patient", "name"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: ["patient", "email"],
      key: "email",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color =
          status === "PENDING"
            ? "orange"
            : status === "COMPLETED"
              ? "green"
              : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => {
        let color =
          record.status === "PENDING"
            ? "orange"
            : record.status === "COMPLETED"
              ? "green"
              : "red";
        return (
          <Select
            defaultValue={record.status}
            style={{ width: 150, border: `1px solid ${color}` }}
            onChange={(value: string) => {
            if (value !== record.status) {
              handleStatusChange(record.id, value as "COMPLETED" | "CANCELLED");
            }
          }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>
      )},
    },
  ];

  if (isLoading) return <div className="flex justify-center"><Spin size="large" /></div>;
  if (isError) return <p className="text-center flex flex-col justify-center gap-4"><Empty/> Failed to load appointments</p>;

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold mb-4">Appointments</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={(value) => {
            setStatus(value || "");
            setPage(1);
          }}
          style={{ width: 200 }}
        >
          <Option value="PENDING">Pending</Option>
          <Option value="COMPLETED">Completed</Option>
          <Option value="CANCELLED">Cancelled</Option>
        </Select>

        <DatePicker
          onChange={(dateObj) => {
            setDate(dateObj ? dateObj.format("YYYY-MM-DD") : "");
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        pagination={{
          current: data?.page,
          total: data?.total,
          pageSize: data?.limit,
          onChange: (p) => setPage(p),
        }}
        loading={isUpdating}
        className="w-full overflow-x-auto"
      />
      {/* Modal for confirmation */}
      <Modal
        open={modalOpen}
        title="Are you sure?"
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Yes"
        cancelText="No"
        confirmLoading={isUpdating}
      >
        <p>
          {selectedAppointment
            ? `Mark this appointment as ${selectedAppointment.newStatus}?`
            : ""}
        </p>
      </Modal>
    </div>
  );
}
