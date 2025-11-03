"use client";

import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchStudents = async () => {
    const res = await fetch("/api/students");
    const data = await res.json();
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const res = await fetch("/api/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        message.success("Student added successfully!"); // ✅ DI SINI MUNCUL
        form.resetFields();
        setIsModalOpen(false);
        fetchStudents();
      } else {
        message.error("Failed to add student");
      }
    } catch (error) {
      message.error("Error submitting form");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Name", dataIndex: "name" },
    { title: "Grade", dataIndex: "grade" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1>Students</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Add Student
      </Button>

      <Table dataSource={students} columns={columns} rowKey="id" style={{ marginTop: 20 }} />

      <Modal
        title="Add New Student"
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="Name" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Grade" name="grade" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
